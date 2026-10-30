// Two-step sign-in self-test (Alpha's scripts/admin-2fa-selftest.mjs): RFC 6238 test vectors for the
// authenticator codes, and the pure record functions behind backup codes and trusted browsers.
// Run: node --import ./tests/register.mjs --test "tests/*.test.mjs"
import test from 'node:test';
import assert from 'node:assert/strict';
import { codeAt, matchCode, currentStep } from '../lib/admin/totp.ts';
import {
  BACKUP_COUNT,
  addTrustedDevice,
  backupCodesLeft,
  findTrustedDevice,
  makeBackupCodes,
  matchAny,
  migrateRecord,
  newTrustToken,
  normaliseBackupCode,
  spendBackupCode,
  touchTrustedDevice,
  withBackupCodes,
} from '../lib/admin/staff-2fa-record.ts';

// RFC 6238 appendix B, SHA-1, secret "12345678901234567890" (base32 below); the last six digits.
const RFC_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
const VECTORS = [
  [59, '287082'],
  [1111111109, '081804'],
  [1111111111, '050471'],
  [1234567890, '005924'],
  [2000000000, '279037'],
  [20000000000, '353130'],
];

test('TOTP matches the RFC 6238 vectors', () => {
  for (const [t, code] of VECTORS) assert.equal(codeAt(RFC_SECRET, Math.floor(t / 30)), code, `T=${t}`);
});

test('a code is accepted once, within one step either side', () => {
  const now = currentStep();
  const code = codeAt(RFC_SECRET, now);
  assert.equal(matchCode(RFC_SECRET, code, 0), now);
  assert.equal(matchCode(RFC_SECRET, code, now), null, 'replay refused');
  assert.equal(matchCode(RFC_SECRET, codeAt(RFC_SECRET, now - 5), 0), null, 'old code refused');
  assert.equal(matchCode(RFC_SECRET, 'abcdef', 0), null);
});

const SECRET = 'test-secret';
const UID_HASH = 'uidhash';

test('backup codes: ten, readable, each works once, any spacing or case', () => {
  const codes = makeBackupCodes();
  assert.equal(codes.length, BACKUP_COUNT);
  for (const c of codes) assert.match(c, /^[2-9A-HJKMNP-Z]{4}-[2-9A-HJKMNP-Z]{4}$/);
  let rec = withBackupCodes({}, SECRET, UID_HASH, codes);
  assert.equal(backupCodesLeft(rec), 10);
  const typed = codes[3].toLowerCase().replace('-', ' ');
  assert.equal(normaliseBackupCode(typed), codes[3].replace('-', ''));
  rec = spendBackupCode(rec, SECRET, UID_HASH, typed);
  assert.ok(rec);
  assert.equal(backupCodesLeft(rec), 9);
  assert.equal(spendBackupCode(rec, SECRET, UID_HASH, codes[3]), null, 'second use refused');
  assert.equal(spendBackupCode(rec, 'other-secret', UID_HASH, codes[4]), null, 'other key refused');
  assert.equal(spendBackupCode(rec, SECRET, UID_HASH, 'ZZZZ'), null);
});

test('trusted browsers: found by token, expire, newest ten kept', () => {
  const now = Date.UTC(2026, 9, 21);
  const token = newTrustToken();
  let { record } = addTrustedDevice({}, SECRET, token, 'Chrome on Windows', now);
  assert.equal(findTrustedDevice(record, SECRET, token, now), 0);
  assert.equal(findTrustedDevice(record, SECRET, newTrustToken(), now), -1);
  assert.equal(findTrustedDevice(record, SECRET, token, now + 31 * 86_400_000), -1, 'expired after 30 days');
  record = touchTrustedDevice(record, 0, now + 1000);
  assert.equal(record.trustedDevices[0].lastUsedAt, now + 1000);
  for (let i = 0; i < 12; i += 1) record = addTrustedDevice(record, SECRET, newTrustToken(), `B${i}`, now + i).record;
  assert.equal(record.trustedDevices.length, 10);
});

test('legacy single authenticator migrates, and every app is tried', () => {
  const { record, changed } = migrateRecord({ totp: 'sealed-a', totpStep: 7, totpSetAt: 1 });
  assert.ok(changed);
  assert.equal(record.authenticators[0].id, 'main');
  assert.equal(record.totp, undefined);
  const rec = { authenticators: [...record.authenticators, { id: 'b', label: 'B', sealed: 'sealed-b', step: 0, addedAt: 2 }] };
  const hit = matchAny(rec, '123456', (s) => s, (secret) => (secret === 'sealed-b' ? 99 : null));
  assert.deepEqual(hit, { index: 1, step: 99 });
});
