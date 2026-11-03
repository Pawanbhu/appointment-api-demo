// API (integration) tests: start the real Express app on a random port and call it with fetch.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/app');

let server, url;

test.before(() => new Promise((resolve) => {
  server = createApp().listen(0, () => {
    url = `http://localhost:${server.address().port}`;
    resolve();
  });
}));
test.after(() => server.close());

const post = (body) => fetch(`${url}/appointments`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const appt = { doctorId: 'dr-9', date: '2026-11-10', start: '11:00', patientName: 'A. Patient' };

test('GET /health', async () => {
  const res = await fetch(`${url}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'ok' });
});

test('POST /appointments → 201, then duplicate → 409', async () => {
  const first = await post(appt);
  assert.equal(first.status, 201);
  const second = await post(appt);
  assert.equal(second.status, 409);
});

test('POST /appointments with bad input → 400', async () => {
  const res = await post({ doctorId: 'dr-9' });
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /required/);
});

test('GET list and DELETE flow', async () => {
  const list = await (await fetch(`${url}/doctors/dr-9/appointments?date=2026-11-10`)).json();
  assert.equal(list.length, 1);
  const del = await fetch(`${url}/appointments/${list[0].id}`, { method: 'DELETE' });
  assert.equal(del.status, 204);
  const missing = await fetch(`${url}/appointments/${list[0].id}`, { method: 'DELETE' });
  assert.equal(missing.status, 404);
});
