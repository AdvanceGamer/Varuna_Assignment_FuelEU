#### AI Agent Workflow Log

This document explains how I used AI tools to help build the FuelEU Maritime Compliance project.  
I didn’t use them to just generate code — I used them to save time on setup, learn faster, and focus on the logic.


#### Tools & Agents I Used

**ChatGPT (GPT-5)** :- for planning the architecture, generating code structure, and debugging TypeScript issues.  
**VS Code IntelliSense** :- for quick inline type fixes and suggestions.  


## How I Used Them

### 1. Project Structure & Setup
I started by asking the AI how to design a **Hexagonal Architecture** for a full-stack app (backend in Fastify + Prisma + PostgreSQL, frontend in React + TypeScript + Tailwind).  
The AI suggested a folder layout with separate `core`, `adapters`, and `infrastructure` layers, which helped me keep things clean and organized.

I used its suggestions to:
- Set up `RouteRepo`, `ComplianceRepo`, `BankingRepo`, and `PoolRepo` ports.
- Create Prisma schema and seed data for the five sample routes.
- Configure the backend with TypeScript strict mode and Prisma client.

### 2. Implementing Core Logic
I used the AI mainly for guidance while writing:
- The **Compliance Balance (CB)** formula: `(Target − Actual) × Energy`.
- The **Banking logic** for saving surplus and applying it to deficits.
- The **Pooling logic** to distribute surplus between ships fairly.

It helped me translate the FuelEU rules into small, testable TypeScript functions.  
I still reviewed and rewrote parts of it to make sure the math and rules matched the brief.

### 3. Debugging & Refactoring
AI was especially helpful for debugging TypeScript and configuration issues:
- It explained why I needed `.js` extensions when using ESM with `verbatimModuleSyntax`.
- It fixed PostCSS and Tailwind v4 setup issues.
- It helped me convert `any` types into proper interfaces for strong typing.

I also asked it to simplify some frontend logic, like React Query cache invalidation and consistent error handling.

## Validation & Corrections

I didn’t just copy code — I verified every change by:
- Running `npx tsc --noEmit` for strict type checks.
- Using `Prisma Studio` to confirm DB updates after baseline or banking actions.
- Watching browser **Network tab** to verify requests (like `/routes/:id/baseline`).
- Testing edge cases with PowerShell’s `Invoke-RestMethod` commands.

## What Worked / What Didn’t

✅ **Saved time:** creating structure, Prisma schema, and repetitive boilerplate.  
✅ **Worked great:** as a debugging partner for TypeScript and Tailwind setup.  
❌ **Needed manual fixes:** for ESM import paths, PowerShell request formats, and CORS.

---

## Best Practices I Followed

- Always reviewed and rewrote AI-generated code to match assignment requirements.  
- Maintained **clean separation of layers** (core ↔ adapters ↔ infrastructure).  
- Used **type-only imports** and **no-any** rules to keep TS strict.  
- Documented every AI step in this file for transparency.
