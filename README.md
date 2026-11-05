# Appointment Booking API: AI-Assisted Demo

A small Node.js + Express REST API for booking doctor appointments in 30-minute slots.
I built it with AI coding tools, then reviewed it, tested it and fixed what the AI got wrong.

## Run it

```bash
npm install
npm test            # 12 tests (unit + API), Node's built-in test runner
npm run coverage    # coverage report
npm start           # http://localhost:3000
```

Interactive API docs (Swagger UI): http://localhost:3000/docs. The raw OpenAPI spec is at `/openapi.json`.

Try it by hand:

```bash
curl -X POST localhost:3000/appointments -H "Content-Type: application/json" \
  -d '{"doctorId":"dr-1","date":"2026-11-10","start":"10:00","patientName":"Ravi"}'
curl localhost:3000/doctors/dr-1/appointments
```

## Endpoints

| Method | Path | Result |
|---|---|---|
| GET | `/docs` | Swagger UI |
| GET | `/openapi.json` | OpenAPI 3 spec |
| GET | `/health` | `{status:"ok"}` |
| POST | `/appointments` | 201 created · 400 invalid input · 409 slot taken |
| GET | `/doctors/:doctorId/appointments?date=` | sorted list |
| DELETE | `/appointments/:id` | 204 · 404 |

## Structure

```
src/slots.js     business logic (no Express, so it's easy to unit test)
src/app.js       HTTP layer
src/openapi.js   OpenAPI spec for Swagger UI
src/server.js    entry point
test/slots.test.js  unit tests
test/api.test.js    integration tests against the real server
```

## My AI workflow

1. **Plan first.** I write a short spec (endpoints, rules, edge cases) before prompting.
2. **Small prompts.** One piece at a time: logic first, then routes, then tests.
3. **Review every line.** I read the AI's code like a pull request from a junior dev.
4. **Test the edge cases myself.** I add the tricky cases the AI tends to skip.
5. **Verify.** Tests and coverage must pass before I call it done.

### Example prompt I used
> "Write a Node.js module with a function that books 30-minute appointment slots per doctor per day.
> Reject overlapping bookings. Validate HH:MM time and YYYY-MM-DD date. Keep it free of Express so it can be unit tested."

### Bug the AI made, and how tests caught it
The AI wrote the overlap check as:
```js
return aStart <= bEnd && bStart <= aEnd;   // AI version: wrong
```
This blocks **back-to-back** bookings (10:00–10:30 and then 10:30–11:00), which should be allowed.
My edge-case test `allows back-to-back bookings` failed, so I fixed it:
```js
return aStart < bEnd && bStart < aEnd;     // fixed
```
I also added validation the AI skipped: a slot crossing midnight (23:45) and invalid times like 25:00.
