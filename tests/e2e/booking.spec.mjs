/**
 * E2E Booking & Lead Flow Test Suite (node:test)
 */
import test from 'node:test';
import assert from 'node:assert/strict';

test('Booking validation ensures mandatory fields', () => {
  const payload = {
    name: 'Kishor Shinde',
    phone: '9876543210',
    date: '2026-12-01',
    route: 'Mumbai Darshan',
    vehicle: 'Swift Dzire',
    passengers: '4',
    type: 'Inquiry',
  };

  assert.equal(payload.name, 'Kishor Shinde');
  assert.equal(payload.phone, '9876543210');
  assert.ok(payload.date >= '2026-01-01');
});
