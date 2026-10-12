import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.TEST_BASE_URL || 'https://cabs.kishorlab.dev';
const ADMIN_SECRET = process.env.PAYLOAD_SECRET || 'f9a84e27c191a27e0c4b7d1e892f3a4b6c8d0e1f2a3b4c5d6e7f8a9b0c1d2e3f';

test('Security: GET /api/bookings is protected against unauthorized access', async () => {
  const res = await fetch(`${BASE_URL}/api/bookings`);
  assert.equal(res.status, 401, 'Unauthenticated request must return 401');
  const data = await res.json();
  assert.equal(data.success, false);
  assert.equal(data.error, 'Unauthorized');
});

test('Security: GET /api/bookings/export is protected against unauthorized access', async () => {
  const res = await fetch(`${BASE_URL}/api/bookings/export`);
  assert.equal(res.status, 401, 'Unauthenticated export request must return 401');
  const data = await res.json();
  assert.equal(data.error, 'Unauthorized');
});

test('Security: Admin with secret key can access /api/bookings', async () => {
  const res = await fetch(`${BASE_URL}/api/bookings?limit=1`, {
    headers: { 'x-admin-key': ADMIN_SECRET },
  });
  assert.equal(res.status, 200, 'Admin request with secret key must return 200');
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.bookings) || Array.isArray(data.docs));
});

test('Public API: GET /api/globals/site-settings returns valid business details', async () => {
  const res = await fetch(`${BASE_URL}/api/globals/site-settings`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.phone, 'Settings must contain phone number');
  assert.equal(data.globalType, 'site-settings');
});

test('Public API: POST /api/chat returns prompt response or fallback within reasonable time', async () => {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'What are Mumbai Darshan rates?' }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.reply && data.reply.length > 10, 'Must return a helpful reply');
});

test('Security: POST /api/media rejects unauthenticated file uploads', async () => {
  const res = await fetch(`${BASE_URL}/api/media`, {
    method: 'POST',
    body: JSON.stringify({ alt: 'Test exploit' }),
    headers: { 'Content-Type': 'application/json' },
  });
  assert.ok(res.status === 401 || res.status === 403, `Must return 401/403, got ${res.status}`);
});

