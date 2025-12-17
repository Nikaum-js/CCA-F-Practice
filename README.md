# CCA-F Practice

Personal, client-side exam-prep app for the **Claude Certified Architect – Foundations (CCA-F)**
certification. Study alone, identify weak domains, practice under exam-like conditions, and track
improvement over time. No backend, no auth — all state in `localStorage`.

> ⚠️ The certification is real, but the **5 domains, weights (27/18/20/20/15), 100–1000 score scale,
> and 720 cutoff are community consensus — not published by Anthropic.** The UI labels them as
> unofficial. Only the [Claude Partner Network announcement](https://www.anthropic.com/news/claude-partner-network)
> is an official source for the certification's existence.

## Stack

Bun (runtime/package manager) · Vite (bundler) · React 19 · TypeScript (strict) · Tailwind CSS v4
(`@theme`, OKLCH, dark zinc) · shadcn/ui. No router, no external state library.

## Run

```bash
bun install
bun run build:questions   # fetch sources → src/data/questions.generated.json (network needed ONCE)
bun run dev               # Vite dev server
```

After `build:questions` has produced the JSON, the app runs fully offline. If the fetch fails, the
app falls back to a 10-question seed (`src/data/seed.ts`) so it is never empty.

Other scripts: `bun run build` (tsc + vite build), `bun run preview`, `bun run lint`.

## Data

The question bank is **pre-compiled at build time** from two community repos
(`mrKindly/claude-certified-architect`, `avidevelops/claude-architect-exam-prep`), each a single
README with a different markdown format. `scripts/build-questions.ts` parses both, deduplicates,
classifies into the 5 domains, and writes `src/data/questions.generated.json` (committed). Domain
classification is auto (keyword + source-scenario hint); to curate, review the JSON and add entries
to `DOMAIN_OVERRIDES` in `scripts/build-questions.ts`, then re-run `build:questions`.

## Project docs (Spec Kit)

- `CLAUDE.md` — agent guide and conventions.
- `.specify/memory/constitution.md` — non-negotiable principles.
- `specs/001-ccaf-exam-prep/` — `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`,
  `tasks.md`.
