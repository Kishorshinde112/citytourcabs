import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeGclid } from '../src/lib/gclid.mjs';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

let isServerAvailable = false;
try {
  await fetch(BASE_URL, { signal: AbortSignal.timeout(800) });
  isServerAvailable = true;
} catch {
  isServerAvailable = false;
}

test('sanitizeGclid accepts valid Google Click IDs and trims whitespace', () => {
  assert.equal(
    sanitizeGclid('  Cj0KCQjw123_abc-DEF.456=  '),
    'Cj0KCQjw123_abc-DEF.456='
  );
  assert.equal(sanitizeGclid('EAIaIQobChMI1234567890'), 'EAIaIQobChMI1234567890');
});

test('sanitizeGclid rejects empty, non-string, oversized, or unsafe values', () => {
  assert.equal(sanitizeGclid(''), '');
  assert.equal(sanitizeGclid(null), '');
  assert.equal(sanitizeGclid(12345), '');
  assert.equal(sanitizeGclid('a'.repeat(257)), '');
  assert.equal(sanitizeGclid('<script>alert(1)</script>'), '');
  assert.equal(sanitizeGclid('abc def'), '');
});

test(
  'POST /api/conversion rejects missing or invalid gclid and accepts valid click conversion',
  { skip: !isServerAvailable ? `Server not running at ${BASE_URL}` : false },
  async () => {
    const nonJson = await fetch(`${BASE_URL}/api/conversion`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'gclid=test123',
    });
    assert.equal(nonJson.status, 415);

    const missing = await fetch(`${BASE_URL}/api/conversion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversionName: 'Phone Click' }),
    });
    assert.equal(missing.status, 400);

    const unsafe = await fetch(`${BASE_URL}/api/conversion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gclid: '<script>', conversionName: 'Phone Click' }),
    });
    assert.equal(unsafe.status, 400);

    const ok = await fetch(`${BASE_URL}/api/conversion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gclid: 'Cj0KCQjwTestClick123',
        conversionName: 'Phone Click',
        value: 1.0,
        currency: 'INR',
        time: new Date().toISOString(),
        page: '/',
      }),
    });
    assert.equal(ok.status, 200);
    const data = await ok.json();
    assert.equal(data.success, true);
  }
);
