# Quickstart: Bold Visual Redesign — Runbook

A reproducible runbook for executing and validating the redesign.

## Prerequisites

- Bun installed; deps reconciled with `bun install` (stack is Bun — not pnpm/npm).
- Playwright MCP installed and verified (smoke-tested this session against the dev server).
- Dev server running: `bun run dev` (note the port — 5173, or the next free one, e.g. 5174).

## 1. Capture "before" (baseline)

For each screen × language, drive the browser via the Playwright MCP and screenshot:

- Home — PT, then toggle EN
- Quiz — start any domain/sim, screenshot a question (PT + EN)
- Results — finish a short session, screenshot the results (PT + EN)

Save as `before-{screen}-{lang}.png`. Use `browser_snapshot` to also record the a11y tree.

## 2. Design pass (subagent)

Give a frontend/design subagent a brief: the baseline screenshots + the token constraints
(Principle V v1.1.0, `data-model.md` token groups, `contracts/visual-contract.md`). It returns a
critique + concrete, code-ready proposals (token values, weight/elevation usage, per-domain colors,
interaction states).

## 3. Apply changes (token-first)

1. Extend `src/index.css` `@theme`/CSS tokens: per-domain colors, weight scale, elevation scale,
   state colors. No inline values.
2. Apply tokens across `src/screens/HomeScreen.tsx`, `QuizScreen.tsx`, `ResultsScreen.tsx` and
   shared `src/components/**`.
3. Keep all strings in `translations.ts`; do not touch question/option text or the data layer.

## 4. Regression gate (hard)

```bash
bun run build      # runs tsc -b + vite build — MUST pass (C2, SC-002)
```

Fix any type/build error before proceeding.

## 5. Capture "after" + validate

- Re-screenshot all 6 views (Home/Quiz/Results × PT/EN) as `after-{screen}-{lang}.png`.
- Check against the visual contract C1–C10:
  - cohesion, contrast (AA), interaction/focus states, responsiveness at ~360px, unofficial labels,
    i18n intact.
- Review before/after side by side — the "after" set must read as clearly bolder and cohesive.

## 6. Done criteria

- C1–C10 in `contracts/visual-contract.md` all hold.
- `bun run build` green.
- Before/after screenshots (PT + EN, all 3 screens) captured and reviewed.

## Next step

Run `/speckit-tasks` to generate the dependency-ordered `tasks.md`, then `/speckit-implement`.
