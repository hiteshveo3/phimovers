// Authenticator-app codes for the staff sign-in (RFC 6238: six digits, 30 seconds, SHA-1), so they
// work with Google Authenticator, Microsoft Authenticator, 1Password and the rest. Same as Alpha Movers.
// The secret is kept sealed (AES-256-GCM, key from ASSISTANT_SECRET, see lib/assistant/env.ts), never as
// plain text. Changing that secret means setting the apps up again: delete the staff_security document.

import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import QRCode from 'qrcode';
import { env } from '../assistant/env';

const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const PERIOD = 30;
// Every phone shows the dashboard under this name.
const ISSUER = 'Phi Movers';

function base32(buf: Buffer) {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  return bits > 0 ? out + B32[(value << (5 - bits)) & 31] : out;
}

function unbase32(text: string) {
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of text.replace(/[\s=]/g, '').toUpperCase()) {
    const i = B32.indexOf(ch);
    if (i < 0) continue;
    value = (value << 5) | i;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

/** A new 160-bit secret, in the base32 form authenticator apps take. */
export const newSecret = () => base32(randomBytes(20));

export const currentStep = (now = Date.now()) => Math.floor(now / 1000 / PERIOD);

export function codeAt(secret: string, step: number) {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const mac = createHmac('sha1', unbase32(secret)).update(counter).digest();
  const at = mac[mac.length - 1] & 15;
  return String((mac.readUInt32BE(at) & 0x7fffffff) % 1_000_000).padStart(6, '0');
}

/**
 * The time step the code belongs to, or null. Allows one step either side for a phone clock that is
 * a little out, and refuses any step at or before `lastStep`, so a code can only be used once.
 */
export function matchCode(secret: string, code: string, lastStep = 0): number | null {
  if (!/^\d{6}$/.test(code)) return null;
  const now = currentStep();
  for (const step of [now - 1, now, now + 1]) {
    if (step <= lastStep) continue;
    if (timingSafeEqual(Buffer.from(codeAt(secret, step)), Buffer.from(code))) return step;
  }
  return null;
}

export const otpauthUrl = (secret: string, email: string) =>
  `otpauth://totp/${encodeURIComponent(`${ISSUER}:${email}`)}?secret=${secret}&issuer=${encodeURIComponent(ISSUER)}&algorithm=SHA1&digits=6&period=${PERIOD}`;

/** The setup QR code as SVG text, made on the server so the page needs no QR library. */
export const qrSvg = (url: string) => QRCode.toString(url, { type: 'svg', margin: 1, errorCorrectionLevel: 'M' });

/* ---------- sealing ---------- */

const key = () => createHash('sha256').update(`admin-totp|${env.secret}`).digest();

export function seal(secret: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const data = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((b) => b.toString('base64url')).join('.');
}

export function unseal(sealed: string): string | null {
  try {
    const [iv, tag, data] = sealed.split('.').map((s) => Buffer.from(s, 'base64url'));
    const decipher = createDecipheriv('aes-256-gcm', key(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}
