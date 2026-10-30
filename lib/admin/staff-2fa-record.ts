// A staff member's security record, the same shape as Alpha Movers' office 2FA: many authenticator
// apps, ten one-time backup codes, and browsers trusted for 30 days. Kept in Firestore
// staff_security/{uid}, which only the server (Admin SDK) can read (firestore.rules).
// Pure functions only (node:crypto, no store or env); lib/admin/staff-2fa.ts does the storing.

import { createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';

export type Authenticator = { id: string; label: string; sealed: string; step: number; addedAt: number; lastUsedAt?: number };
export type BackupCode = { hash: string; usedAt?: number };
export type TrustedDevice = { id: string; tokenHash: string; label: string; addedAt: number; lastUsedAt: number; expiresAt: number };

export type OfficeRecord = {
  // The dashboard's own password, only while Firebase does not keep it.
  salt?: string; hash?: string; setAt?: number;
  // Legacy single authenticator, read for migration only.
  totp?: string; totpStep?: number; totpSetAt?: number;
  authenticators?: Authenticator[];
  backupCodes?: BackupCode[];
  backupCodesAt?: number;
  trustedDevices?: TrustedDevice[];
};

export const BACKUP_COUNT = 10;
export const TRUST_DAYS = 30;
export const TRUST_MAX = 10;
const DAY_MS = 86_400_000;
/** No 0/O, 1/I/L: easy to read back from paper. */
export const BACKUP_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
export const AUTHENTICATOR_MAX = 10;
/** Trust tokens accepted before hashing: 40 to 64 base64url characters (ours are 43). */
export const TRUST_TOKEN_RE = /^[A-Za-z0-9_-]{40,64}$/;

/** A new authenticator id: 12 hex characters. The migrated one is 'main'. */
export const newAuthenticatorId = () => randomBytes(6).toString('hex');

/**
 * Moves a legacy single `totp` into `authenticators[0]` and drops the `totp*` fields. `changed` says the
 * record should be written back.
 */
export function migrateRecord(raw: OfficeRecord | null | undefined, now = Date.now()): { record: OfficeRecord; changed: boolean } {
  const record: OfficeRecord = { ...(raw ?? {}) };
  const legacy = 'totp' in record || 'totpStep' in record || 'totpSetAt' in record;
  if (!legacy) return { record, changed: false };
  const { totp, totpStep, totpSetAt } = record;
  delete record.totp;
  delete record.totpStep;
  delete record.totpSetAt;
  const list = [...(record.authenticators ?? [])];
  if (totp && !list.some((a) => a.sealed === totp)) {
    list.unshift({ id: 'main', label: 'First phone', sealed: totp, step: totpStep ?? 0, addedAt: totpSetAt ?? now });
  }
  if (list.length) record.authenticators = list;
  return { record, changed: true };
}

/** Does the record hold anything besides the legacy password? (When not, the document can go.) */
export const holdsSecurity = (r: OfficeRecord) =>
  Boolean(r.totp || r.authenticators?.length || r.backupCodes?.length || r.trustedDevices?.length);

/** A label for a new authenticator: what the person typed, else "Phone 1", "Phone 2"… (the first free number). */
export function authenticatorLabel(record: OfficeRecord, typed?: string | null): string {
  const clean = String(typed ?? '').replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, 40);
  if (clean) return clean;
  const taken = new Set((record.authenticators ?? []).map((a) => a.label.toLowerCase()));
  let n = (record.authenticators ?? []).length + 1;
  while (taken.has(`phone ${n}`)) n += 1;
  return `Phone ${n}`;
}

/* ---------- authenticator codes ---------- */

/**
 * The authenticator a six-digit code belongs to: every one is tried (window and one-time use are the
 * matcher's job: totp.ts matchCode with the authenticator's last step). Returns its index and step, or null.
 */
export function matchAny(
  record: OfficeRecord,
  code: string,
  unseal: (sealed: string) => string | null,
  match: (secret: string, code: string, lastStep: number) => number | null,
): { index: number; step: number } | null {
  let found: { index: number; step: number } | null = null;
  (record.authenticators ?? []).forEach((a, index) => {
    const secret = unseal(a.sealed);
    const step = secret ? match(secret, code, a.step ?? 0) : null;
    if (step !== null && !found) found = { index, step };
  });
  return found;
}

/** Records a matched code: the step (so it cannot be used again) and when. */
export function useAuthenticator(record: OfficeRecord, index: number, step: number, now = Date.now()): OfficeRecord {
  const list = (record.authenticators ?? []).map((a, i) => (i === index ? { ...a, step, lastUsedAt: now } : a));
  return { ...record, authenticators: list };
}

/* ---------- backup codes ---------- */

/** Upper case, without spaces and dashes: "abcd-efgh" and "ABCD EFGH" are the same code. */
export const normaliseBackupCode = (code: string) => code.toUpperCase().replace(/[\s-]/g, '');

/** HMAC-SHA256(secret, 'backup|' + uid hash + '|' + normalisedCode), hex. */
export const backupCodeHash = (secret: string, emailHash: string, code: string) =>
  createHmac('sha256', secret).update(`backup|${emailHash}|${normaliseBackupCode(code)}`).digest('hex');

/** Ten fresh codes, XXXX-XXXX. Shown once; only their hashes are kept. */
export function makeBackupCodes(count = BACKUP_COUNT): string[] {
  const out = new Set<string>();
  while (out.size < count) {
    let s = '';
    for (let i = 0; i < 8; i += 1) s += BACKUP_ALPHABET[randomInt(BACKUP_ALPHABET.length)];
    out.add(`${s.slice(0, 4)}-${s.slice(4)}`);
  }
  return [...out];
}

/** A new set replaces the old one. */
export function withBackupCodes(record: OfficeRecord, secret: string, emailHash: string, codes: string[], now = Date.now()): OfficeRecord {
  return { ...record, backupCodes: codes.map((c) => ({ hash: backupCodeHash(secret, emailHash, c) })), backupCodesAt: now };
}

export const backupCodesLeft = (record: OfficeRecord) => (record.backupCodes ?? []).filter((c) => !c.usedAt).length;

const hexEqual = (a: string, b: string) => {
  const x = Buffer.from(a, 'hex');
  const y = Buffer.from(b, 'hex');
  return x.length === y.length && x.length > 0 && timingSafeEqual(x, y);
};

/** Spends an unused backup code. The updated record, or null when the code is not one of them (or was used). */
export function spendBackupCode(record: OfficeRecord, secret: string, emailHash: string, code: string, now = Date.now()): OfficeRecord | null {
  const clean = normaliseBackupCode(code);
  // Not eight letters of the alphabet: simply wrong (it still counts as a wrong try).
  if (clean.length !== 8 || [...clean].some((ch) => !BACKUP_ALPHABET.includes(ch))) return null;
  const want = backupCodeHash(secret, emailHash, clean);
  const index = (record.backupCodes ?? []).findIndex((c) => !c.usedAt && hexEqual(c.hash, want));
  if (index < 0) return null;
  return { ...record, backupCodes: record.backupCodes!.map((c, i) => (i === index ? { ...c, usedAt: now } : c)) };
}

/* ---------- trusted devices ---------- */

/** 32 random bytes, base64url: what the trusted browser keeps. */
export const newTrustToken = () => randomBytes(32).toString('base64url');

/** HMAC-SHA256(secret, 'trust|' + token), hex. Only this is stored. */
export const trustTokenHash = (secret: string, token: string) => createHmac('sha256', secret).update(`trust|${token}`).digest('hex');

const liveDevices = (record: OfficeRecord, now: number) => (record.trustedDevices ?? []).filter((d) => d.expiresAt > now);

/** Trusts a device for 30 days. Expired ones are dropped, then only the newest ten (by addedAt) are kept. */
export function addTrustedDevice(record: OfficeRecord, secret: string, token: string, label: string, now = Date.now()): { record: OfficeRecord; device: TrustedDevice } {
  const device: TrustedDevice = { id: randomBytes(9).toString('base64url'), tokenHash: trustTokenHash(secret, token), label: label.slice(0, 80) || 'A browser', addedAt: now, lastUsedAt: now, expiresAt: now + TRUST_DAYS * DAY_MS };
  const kept = liveDevices(record, now).sort((a, b) => b.addedAt - a.addedAt).slice(0, TRUST_MAX - 1);
  return { record: { ...record, trustedDevices: [...kept, device] }, device };
}

/** The live trusted device this token belongs to, or -1. */
export function findTrustedDevice(record: OfficeRecord, secret: string, token: string | null | undefined, now = Date.now()): number {
  if (!token || !TRUST_TOKEN_RE.test(token)) return -1;
  const want = trustTokenHash(secret, token);
  return (record.trustedDevices ?? []).findIndex((d) => d.expiresAt > now && hexEqual(d.tokenHash, want));
}

/** Using a trusted device refreshes lastUsedAt, never expiresAt. */
export function touchTrustedDevice(record: OfficeRecord, index: number, now = Date.now()): OfficeRecord {
  return { ...record, trustedDevices: (record.trustedDevices ?? []).map((d, i) => (i === index ? { ...d, lastUsedAt: now } : d)) };
}
