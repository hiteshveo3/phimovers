// Authenticator-app 2FA for the staff dashboard (as on Alpha Movers), server side only.
//
// It is mandatory for every staff and owner account. A staff member without an authenticator is sent to the
// enrol screen straight after the Firebase sign-in (the 2FA route lets them in without a pass for that);
// from then on the dashboard asks for a six-digit code (or one backup code, or recognises a browser trusted
// for 30 days). A right code puts `mfa: true` and `officeUntil` (a time, 12 hours on) on the staff member's
// Firebase token. firestore.rules, storage.rules and requireStaff() only accept a staff token while
// `officeUntil` is still running, so a stolen password alone no longer opens the data.
//
// Recovery, so nobody is locked out: a backup code signs in once (then add the new phone and remove the old
// one); an owner can reset another staff member in Settings > Staff (resetFor), who then enrols again; and
// the owner's own last resort is `node scripts/reset-staff-2fa.mjs <email>` with the service account.
//
// The record lives in Firestore staff_security/{uid} (Admin SDK only, never readable from the browser).

import { createHash } from "node:crypto";
import QRCode from "qrcode";
import { env } from "../assistant/env";
import { getAdminAuth, getAdminDb } from "../firebase/admin";
import { isMailConfigured, sendMail } from "../email/send";
import { BRAND } from "../../kit/site-facts";
import { OWNER_EMAIL } from "./claims";
import {
  AUTHENTICATOR_MAX,
  addTrustedDevice,
  authenticatorLabel,
  backupCodesLeft,
  findTrustedDevice,
  makeBackupCodes,
  matchAny,
  newAuthenticatorId,
  newTrustToken,
  spendBackupCode,
  touchTrustedDevice,
  useAuthenticator,
  withBackupCodes,
  type OfficeRecord,
} from "./staff-2fa-record";
import { matchCode, newSecret, otpauthUrl, seal, unseal } from "./totp";

const COL = "staff_security";
export const PASS_HOURS = 12;
const PENDING_MS = 15 * 60_000;
const WRONG_MAX = 5;
/** Five wrong codes pause sign-in for an hour and email the office (Alpha's wrongTry / alertLocked). */
const LOCK_MS = 60 * 60_000;

type Stored = OfficeRecord & {
  /** An authenticator being added: sealed secret, waiting for its first code. */
  pending?: { sealed: string; label: string; at: number };
  wrong?: { n: number; until: number };
};

export type Who = { uid: string; email: string | null };
/** Where a request came from, for the sign-in alert. */
export type Seen = { ip?: string; ua?: string };

const uidHash = (uid: string) => createHash("sha256").update(`staff|${uid}`).digest("hex");
const ref = (uid: string) => getAdminDb().collection(COL).doc(uid);

async function load(uid: string): Promise<Stored> {
  return ((await ref(uid).get()).data() as Stored | undefined) ?? {};
}

async function save(uid: string, rec: Stored) {
  // Firestore rejects undefined values, so drop them.
  await ref(uid).set(JSON.parse(JSON.stringify(rec)) as Stored);
}

export const enrolled = (rec: OfficeRecord) => (rec.authenticators ?? []).length > 0;

/** Sets (or clears) the pass on the Firebase token, keeping every other claim. */
async function setPass(uid: string, on: boolean) {
  const auth = getAdminAuth();
  const claims = { ...((await auth.getUser(uid)).customClaims ?? {}) } as Record<string, unknown>;
  if (on) {
    claims.mfa = true;
    claims.officeUntil = Date.now() + PASS_HOURS * 3_600_000;
  } else {
    delete claims.mfa;
    delete claims.officeUntil;
  }
  await auth.setCustomUserClaims(uid, claims);
}

const londonNow = () => new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });
const esc = (v: string) =>
  v.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);

/** The office mailbox for lock-outs: OFFICE_EMAIL, else the owner. */
const officeEmail = () => process.env.OFFICE_EMAIL?.trim() || OWNER_EMAIL;

/**
 * Every security change emails the staff member and the owner (Alpha's alertChange); `office` also tells
 * the office mailbox. Never throws: a failed email never blocks the sign-in.
 */
export async function alert(who: Who, what: string, opts: { seen?: Seen; office?: boolean } = {}) {
  if (!isMailConfigured()) return;
  const to = new Set(
    [who.email, OWNER_EMAIL, opts.office ? officeEmail() : null]
      .filter((e): e is string => Boolean(e))
      .map((e) => e.toLowerCase()),
  );
  const where = opts.seen
    ? `<p>Device: ${esc((opts.seen.ua || "unknown").slice(0, 200))}<br>IP address: ${esc(opts.seen.ip || "unknown")}</p>`
    : "";
  for (const address of to) {
    const self = address === who.email?.toLowerCase();
    await sendMail({
      to: address,
      subject: `${BRAND} staff security: ${what}`,
      html: `<p>${esc(what)} on ${self ? "your" : `${esc(who.email ?? who.uid)}'s`} ${BRAND} staff account (${londonNow()}).</p>${where}<p>If this was not expected, sign in, remove the app or browser in Settings, and change the password.</p>`,
    }).catch((err) => console.error("2fa alert email failed", err));
  }
}

/** What Settings shows. Never includes secrets or hashes. */
export function statusOf(rec: Stored) {
  const now = Date.now();
  return {
    enrolled: enrolled(rec),
    /** Two-step sign-in is mandatory: the dashboard asks for enrolment while `enrolled` is false. */
    required: true,
    authenticators: (rec.authenticators ?? []).map((a) => ({ id: a.id, label: a.label, addedAt: a.addedAt, lastUsedAt: a.lastUsedAt ?? null })),
    backupCodesLeft: backupCodesLeft(rec),
    devices: (rec.trustedDevices ?? [])
      .filter((d) => d.expiresAt > now)
      .map((d) => ({ id: d.id, label: d.label, addedAt: d.addedAt, lastUsedAt: d.lastUsedAt, expiresAt: d.expiresAt })),
    locked: Boolean(rec.wrong && rec.wrong.until > now),
  };
}

export async function status(who: Who) {
  return statusOf(await load(who.uid));
}

/** Only the enrolled flag (requireStaff callers that must know whether a pass can be asked for). */
export async function isEnrolled(uid: string) {
  return enrolled(await load(uid));
}

export type Result = { ok: true; [k: string]: unknown } | { ok: false; error: string; status?: number };

/** A code from any authenticator, or one backup code. On success the pass is granted. */
export async function verify(
  who: Who,
  input: { code?: string; backup?: string; trust?: boolean; label?: string },
  seen?: Seen,
): Promise<Result> {
  const rec = await load(who.uid);
  if (!enrolled(rec)) return { ok: false, error: "notEnrolled" };
  const now = Date.now();
  if (rec.wrong && rec.wrong.until > now && rec.wrong.n >= WRONG_MAX) return { ok: false, error: "locked", status: 429 };

  let next: Stored | null = null;
  let used = "an authenticator app";
  if (input.backup) {
    next = spendBackupCode(rec, env.secret, uidHash(who.uid), input.backup, now);
    used = "a backup code";
  } else {
    const m = matchAny(rec, (input.code ?? "").replace(/\s/g, ""), unseal, matchCode);
    if (m) next = useAuthenticator(rec, m.index, m.step, now);
  }
  if (!next) {
    const n = (rec.wrong && rec.wrong.until > now ? rec.wrong.n : 0) + 1;
    await save(who.uid, { ...rec, wrong: { n, until: now + LOCK_MS } });
    if (n === WRONG_MAX) await alert(who, "Too many wrong codes; sign-in is paused for an hour", { seen, office: true });
    return { ok: false, error: n >= WRONG_MAX ? "locked" : "wrongCode", status: n >= WRONG_MAX ? 429 : 400 };
  }
  delete next.wrong;

  let token: string | undefined;
  if (input.trust) {
    token = newTrustToken();
    next = addTrustedDevice(next, env.secret, token, (input.label ?? "").slice(0, 80) || "A browser", now).record;
  }
  await save(who.uid, next);
  await setPass(who.uid, true);
  // The sign-in alert (time, device, IP): one email per sign-in, saying what was used.
  const how = input.backup ? `a backup code (${backupCodesLeft(next)} left)` : "an authenticator code";
  await alert(who, `Signed in with ${how}${input.trust ? "; this browser is now trusted for 30 days" : ""}`, { seen });
  return { ok: true, used, backupCodesLeft: backupCodesLeft(next), ...(token ? { trustToken: token } : {}) };
}

/** A browser trusted earlier: renews the pass without a code. */
export async function trusted(who: Who, token: string, seen?: Seen): Promise<Result> {
  const rec = await load(who.uid);
  if (!enrolled(rec)) return { ok: false, error: "notEnrolled" };
  const i = findTrustedDevice(rec, env.secret, token);
  if (i < 0) return { ok: false, error: "notTrusted", status: 401 };
  await save(who.uid, touchTrustedDevice(rec, i));
  await setPass(who.uid, true);
  await alert(who, `Signed in on a trusted browser (${rec.trustedDevices?.[i]?.label ?? "a browser"})`, { seen });
  return { ok: true };
}

/** Starts adding an authenticator: a new secret, shown once as a QR code and as text. */
export async function begin(who: Who, label?: string): Promise<Result> {
  const rec = await load(who.uid);
  if ((rec.authenticators ?? []).length >= AUTHENTICATOR_MAX) return { ok: false, error: "tooMany" };
  const secret = newSecret();
  const name = authenticatorLabel(rec, label);
  await save(who.uid, { ...rec, pending: { sealed: seal(secret), label: name, at: Date.now() } });
  const url = otpauthUrl(secret, who.email ?? who.uid);
  const qr = await QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M" });
  return { ok: true, secret, url, qr, label: name };
}

/** Finishes adding it with a code from the new app. The first one also makes the ten backup codes. */
export async function confirm(who: Who, code: string, seen?: Seen): Promise<Result> {
  const rec = await load(who.uid);
  const p = rec.pending;
  if (!p || Date.now() - p.at > PENDING_MS) return { ok: false, error: "expired" };
  const secret = unseal(p.sealed);
  const step = secret ? matchCode(secret, code.replace(/\s/g, ""), 0) : null;
  if (step === null) return { ok: false, error: "wrongCode" };
  const first = !enrolled(rec);
  let next: Stored = {
    ...rec,
    authenticators: [...(rec.authenticators ?? []), { id: newAuthenticatorId(), label: p.label, sealed: p.sealed, step, addedAt: Date.now() }],
  };
  delete next.pending;
  let codes: string[] | undefined;
  if (first) {
    codes = makeBackupCodes();
    next = withBackupCodes(next, env.secret, uidHash(who.uid), codes);
  }
  await save(who.uid, next);
  await setPass(who.uid, true);
  await alert(who, first ? "Two-step sign-in was set up" : `Authenticator app "${p.label}" was added`, { seen });
  return { ok: true, ...(codes ? { backupCodes: codes } : {}), status: statusOf(next) };
}

/**
 * Removes one authenticator. Two-step sign-in is mandatory, so the last one cannot go: add the new phone
 * first, then remove the old one (or ask an owner to reset you).
 */
export async function removeApp(who: Who, id: string): Promise<Result> {
  const rec = await load(who.uid);
  const list = (rec.authenticators ?? []).filter((a) => a.id !== id);
  if (list.length === (rec.authenticators ?? []).length) return { ok: false, error: "notFound", status: 404 };
  if (!list.length) return { ok: false, error: "lastApp", status: 400 };
  const next = { ...rec, authenticators: list };
  await save(who.uid, next);
  await alert(who, "An authenticator app was removed");
  return { ok: true, status: statusOf(next) };
}

/** A new set of ten backup codes; the old set stops working. */
export async function newCodes(who: Who): Promise<Result> {
  const rec = await load(who.uid);
  if (!enrolled(rec)) return { ok: false, error: "notEnrolled" };
  const codes = makeBackupCodes();
  const next = withBackupCodes(rec, env.secret, uidHash(who.uid), codes);
  await save(who.uid, next);
  await alert(who, "New backup codes were made (the old ones no longer work)");
  return { ok: true, backupCodes: codes, status: statusOf(next) };
}

export async function revokeDevice(who: Who, id: string): Promise<Result> {
  const rec = await load(who.uid);
  const next = { ...rec, trustedDevices: (rec.trustedDevices ?? []).filter((d) => d.id !== id) };
  await save(who.uid, next);
  await alert(who, "A trusted browser was removed");
  return { ok: true, status: statusOf(next) };
}

/**
 * Recovery: clears a staff member's two-step record and pass and signs them out everywhere. On the next
 * sign-in they are sent to the enrol screen. Used by an owner (Settings > Staff); scripts/reset-staff-2fa.mjs
 * does the same with the service account. `by` is who did it.
 */
export async function resetFor(target: Who, by: Who): Promise<Result> {
  await ref(target.uid).delete();
  await setPass(target.uid, false);
  await getAdminAuth().revokeRefreshTokens(target.uid);
  await alert(target, `Two-step sign-in was reset by ${by.email ?? "an owner"}; it is set up again at the next sign-in`);
  return { ok: true };
}

/** Deletes the two-step record, for "Remove staff" (lib/admin/staff-accounts.ts). */
export async function forget(uid: string) {
  await ref(uid).delete();
}
