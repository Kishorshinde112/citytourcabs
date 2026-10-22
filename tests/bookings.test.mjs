import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

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

test('Security: passing PAYLOAD_SECRET as admin header does not grant access', async () => {
  const res = await fetch(`${BASE_URL}/api/bookings`, { headers: { 'x-admin-key': 'old-master-secret' } });
  assert.equal(res.status, 401);
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
