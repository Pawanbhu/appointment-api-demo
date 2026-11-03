# Demo Guide: Interview with Jay (Neo Doc)

Total demo time: **about 3 minutes**. The call is only 15 minutes, so keep it short.

## Before the call (10 minutes)
- [ ] Unzip the project, run `npm install`, then `npm test` and check that all 11 pass.
- [ ] Optional: push it to your GitHub as a public repo so you can share the link.
- [ ] Open VS Code with `src/slots.js` and `test/slots.test.js` in tabs.
- [ ] Open a terminal in the project folder. Make the font bigger so it reads well on screen share.
- [ ] Close WhatsApp, email and other personal tabs. Check your mic and camera on Upwork.
- [ ] Practice the script below 2–3 times out loud.

## Demo script (what to say and do)

**1. Intro (20 sec)**
> "This is a small appointment booking API in Node.js and Express. I built it with an AI coding
> assistant. I'll show how I use the AI, and more importantly, how I test what it gives me."

**2. Workflow (30 sec)**: scroll to "My AI workflow" in the README.
> "I write a short spec first, then prompt for one small piece at a time. I review every line like
> a code review, then I write edge-case tests myself, because that's where AI usually makes mistakes."

**3. Code (30 sec)**: show `src/slots.js`.
> "I keep the business logic separate from Express, so I can unit test it without a server."

**4. The bug story (60 sec). This is the most important part.**
Show `overlaps()`, then say:
> "The AI wrote `<=` here. It looks fine, but it blocks back-to-back appointments, 10:00 and 10:30.
> I wrote this edge-case test and it caught the bug."

Live proof: change `<` to `<=` in `overlaps()`, then run:
```bash
npm test
```
It shows **2 failing tests**. Change it back to `<`, run `npm test` again, and all 11 pass.

**5. Coverage (20 sec)**
```bash
npm run coverage
```
> "I also have API tests that start the real server and check the status codes: 201, 400, 409, 404.
> Line coverage is 100%."

**6. Close (10 sec)**
> "So my rule is: AI makes me faster, but I never ship code I haven't read and tested."

## Questions Jay may ask, with short answers

**Which AI tools do you use?**
Say the tools you really use, for example Claude Code, ChatGPT, Cursor or Copilot. Don't name a tool you haven't used.

**How do you know AI code is correct?**
"I read it line by line, write tests for edge cases and errors, run them, and check coverage.
If I don't understand a line, I don't use it."

**What if the AI gives wrong answers repeatedly?**
"I break the problem into smaller parts, give it more context or the error message, or write that part myself."

**Do you do the work yourself?**
"Yes. I do all the work personally. No outsourcing."

**Availability / hours?**
Have a clear answer ready: hours per week and your working hours in IST.

## Tips
- Speak slowly and clearly. It's fine to say "let me check" if you're unsure.
- Be honest. If you didn't write something, don't claim you did.
- At the end, ask one question: "What would my first task be?"
- Keep everything on Upwork: messages, calls and payment.
