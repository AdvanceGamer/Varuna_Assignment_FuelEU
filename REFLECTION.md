# Reflection — Building the FuelEU Maritime Compliance Platform

This project was one of the most complete full-stack builds I’ve done — from designing the backend architecture to connecting the frontend and verifying real data flow.  
It wasn’t just about coding.It was about learning how to structure a real product, use AI tools effectively, and debug like an engineer.

## What I Learned

- **Clean Architecture in practice:**  
  I understood how separating code into layers (core → ports → adapters → infrastructure) makes everything easier to maintain.  
  It also helped me clearly see where each piece of logic belongs — e.g., CB formulas in the domain layer, database logic in adapters.

- **How to connect everything end-to-end:**  
  I learned how React, TypeScript, Fastify, Prisma, and PostgreSQL all fit together.  
  The frontend talked to the backend through clean APIs, and React Query made the UI reactive and stable.

- **TypeScript discipline:**  
  Working with `strict` mode and `verbatimModuleSyntax` forced me to pay attention to details — using type-only imports, adding `.js` extensions, and removing `any`.  
  These small steps really improved my confidence in strong typing.

- **Debugging the real world:**  
  Things like `CORS`, PowerShell’s `Content-Type` errors, Tailwind’s PostCSS plugin issues — these are the kinds of problems tutorials skip.  
  Solving them taught me more about real deployment and compatibility issues than any online guide could.

---

## Using AI Agents

AI was like a smart teammate sitting beside me.  
I didn’t use it to “write the whole project,” but to:
- Generate boilerplate (file structure, Prisma schema, Fastify routes).
- Explain TypeScript errors in plain English.
- Refactor logic into smaller, testable functions.
- Quickly check math or validation rules for compliance formulas.

It saved time on setup and refactoring, but I always verified outputs myself — by testing routes, checking Prisma Studio, or reading the final code.  
The key lesson was: **AI is powerful, but it only gives good results if your prompts are specific and your understanding is solid.**

##  Efficiency Gains

Without AI, the setup (especially Prisma + Fastify + Tailwind v4) would have taken hours of documentation reading.  
With AI help, I got a working skeleton in less than an hour and could focus on **business logic** instead of setup.  
I also learned to refine prompts like:
> “Show me just the Fastify POST handler and the Prisma logic — don’t include the imports.”

That made the responses smaller, cleaner, and easier to verify.

---

## Improvements for the Future

If I had more time, I’d like to:
- Add **unit tests** for the core use-cases (CB calculation, banking, pooling).
- Add **toast notifications** in the frontend for success/error feedback.
- Add **Docker Compose** to launch Postgres + backend in one command.
- Set up **GitHub Actions** for type checks and linting on every push.
- Make the dashboard more visual — charts for CB trends and emissions over years.


## Final Thoughts

This project showed me how to combine **AI assistance** with real engineering judgment.  
AI helped me move faster, but understanding the problem, verifying results, and designing clean architecture — that part was all me.  
It felt like working with a helpful junior dev: it can write code, but I’m still responsible for the direction and correctness.

In the end, I learned more than just how to build a compliance system — I learned how to build smarter, cleaner, and faster with confidence.
