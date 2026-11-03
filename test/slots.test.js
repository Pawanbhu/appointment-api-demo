// Unit tests for booking logic (Node's built-in test runner — no extra deps).
const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore, overlaps, toMinutes } = require('../src/slots');

const base = { doctorId: 'dr-1', date: '2026-11-10', patientName: 'Test Patient' };

test('books a free slot and returns end time', () => {
  const store = createStore();
  const b = store.book({ ...base, start: '10:00' });
  assert.equal(b.id, 1);
  assert.equal(b.end, '10:30');
});

test('rejects a double booking for the same doctor', () => {
  const store = createStore();
  store.book({ ...base, start: '10:00' });
  assert.throws(() => store.book({ ...base, start: '10:15' }), { code: 'CONFLICT' });
});

// This is the test that caught the AI's off-by-one bug (`<=` instead of `<`).
test('allows back-to-back bookings (edge case)', () => {
  const store = createStore();
  store.book({ ...base, start: '10:00' });
  assert.doesNotThrow(() => store.book({ ...base, start: '10:30' }));
});

test('same time is fine for a different doctor or date', () => {
  const store = createStore();
  store.book({ ...base, start: '10:00' });
  assert.doesNotThrow(() => store.book({ ...base, doctorId: 'dr-2', start: '10:00' }));
  assert.doesNotThrow(() => store.book({ ...base, date: '2026-11-11', start: '10:00' }));
});

test('validates input', () => {
  const store = createStore();
  assert.throws(() => store.book({ ...base }), /required/);
  assert.throws(() => store.book({ ...base, start: '9:00' }), /Invalid time format/);
  assert.throws(() => store.book({ ...base, start: '25:00' }), /Invalid time/);
  assert.throws(() => store.book({ ...base, date: '10/11/2026', start: '10:00' }), /Invalid date/);
  assert.throws(() => store.book({ ...base, start: '23:45' }), /before midnight/);
});

test('lists bookings sorted by time and supports cancel', () => {
  const store = createStore();
  store.book({ ...base, start: '14:00' });
  const early = store.book({ ...base, start: '09:00' });
  assert.deepEqual(store.list('dr-1').map((b) => b.start), ['09:00', '14:00']);
  assert.equal(store.cancel(early.id), true);
  assert.equal(store.cancel(999), false);
  assert.equal(store.list('dr-1').length, 1);
});

test('overlaps() and toMinutes() helpers', () => {
  assert.equal(overlaps(600, 630, 615, 645), true);
  assert.equal(overlaps(600, 630, 630, 660), false);
  assert.equal(toMinutes('01:30'), 90);
});
