# Tasks: Bold Visual Redesign

**Feature**: `002-design-polish` | **Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md)

**Inputs**: plan.md, spec.md, research.md, data-model.md, contracts/visual-contract.md, quickstart.md

**Nature**: Presentation-only redesign (no data entities, no behavior/i18n changes). Token-first:
all visual values live in `src/index.css` `@theme`/CSS layer (Principle V, v1.1.0). Tests = build
gate (`tsc -b` + `vite build`) + Playwright MCP visual validation. No new automated test framework.

**Screens**: `src/screens/HomeScreen.tsx`, `QuizScreen.tsx`, `ResultsScreen.tsx` + `src/components/**`.

---

## Phase 1: Setup

- [X] T001 Ensure dev server is running via `bun run dev` and note the active port (5173 or next free, e.g. 5174); confirm app loads.
- [X] T002 [P] Capture **before** screenshots via Playwright MCP — Home (PT+EN), Quiz (PT+EN), Results (PT+EN) → save as `before-{screen}-{lang}.png`; also record a11y snapshots.
- [X] T003 [P] Enable Inter **600/700** weights wherever Inter is loaded (font import in `index.html`/`src/index.css`) so heavier display weights are available.

## Phase 2: Foundational (blocking — token layer)

**These define the shared design vocabulary every story consumes. MUST complete before Phase 3+.**

- [X] T004 Run a **frontend/design subagent** with the brief (before-screenshots + Principle V v1.1.0 + `data-model.md` token groups + `contracts/visual-contract.md`); capture its critique + concrete, code-ready proposals (token values, type/elevation usage, per-domain colors, interaction states).
- [X] T005 In `src/index.css` `@theme`/CSS layer, add the **typography weight scale** tokens (body 400/500, heading 600, display/score 700) per `data-model.md` §3.
- [X] T006 In `src/index.css`, add the **tokenized elevation scale** (`--elevation-surface/raised/overlay`, soft OKLCH-tinted) per `data-model.md` §4 — no inline shadows anywhere.
- [X] T007 In `src/index.css`, (re)tune **base surface tokens** (background/foreground/card/muted/primary/accent) toward the bolder direction, keeping every pair WCAG AA in dark theme.

**Checkpoint**: token layer compiles; `bun run build` still green before applying to screens.

## Phase 3: User Story 1 — Cohesive bold visual identity (P1) 🎯 MVP

**Goal**: All three screens render from one deliberate, bolder, shared visual language.
**Independent test**: Screenshot Home/Quiz/Results; the after set shares color, type scale, spacing
rhythm, component shapes, and elevation language and reads clearly bolder than before (C1).

- [X] T008 [US1] Redesign `src/screens/HomeScreen.tsx` to consume the shared tokens — stat cards, domain grid, weighted-sim section, mixed-mode, domain-history — with cohesive card shape + elevation.
- [X] T009 [US1] Redesign `src/screens/QuizScreen.tsx` shell (header, progress, question card, option list, nav) to the same shared language.
- [X] T010 [US1] Redesign `src/screens/ResultsScreen.tsx` shell to the same shared language (score block, per-domain breakdown, actions).
- [X] T011 [P] [US1] Align shared `src/components/**` (shadcn wrappers: button, card, badge, progress, separator) to the redesigned tokens so all screens inherit consistent shapes/elevation.

**Checkpoint**: `bun run build` green; Home/Quiz/Results visibly share one language (C1).

## Phase 4: User Story 2 — Stronger hierarchy & readability (P1)

**Goal**: Most important info (score, domain identity, current question, correct/incorrect) is the
clear focal point through size/weight/color/spacing.
**Independent test**: Results score + pass/fail is the focal point; quiz question/options have clear
reading hierarchy and comfortable line length (C5 + US2 scenarios).

- [X] T012 [US2] In `ResultsScreen.tsx`, make the **score + pass/fail outcome** the dominant focal point (display 700 weight, scale, accent), with secondary stats clearly subordinate.
- [X] T013 [US2] In `QuizScreen.tsx`, set the **question** as primary (heading weight, comfortable measure ~60–75ch) and options as a clear, readable secondary hierarchy.
- [X] T014 [P] [US2] Apply heading weights (600) to section titles across all three screens; keep body/option text at 400/500 (no heavier body — Principle V).

**Checkpoint**: hierarchy reads correctly; body text remains 400/500.

## Phase 5: User Story 3 — Richer interaction states & motion (P2)

**Goal**: Interactive elements have distinct hover/focus-visible/selected/correct/wrong/disabled
states with tasteful transitions; keyboard accessibility preserved.
**Independent test**: Each option-button state is visually distinct + animated; a visible
focus-visible ring shows on keyboard nav (C6 + US3 scenarios).

- [X] T015 [US3] Implement the quiz **option-button state machine** (idle/hover/focus-visible/selected/correct/wrong/disabled) in `QuizScreen.tsx`/its option component using tokenized colors + `tw-animate-css` transitions, per `data-model.md` §5.
- [X] T016 [P] [US3] Add distinct hover/focus-visible/active/disabled states to all other interactive controls (domain cards, sim buttons, mixed-mode buttons, language toggle) — visible focus ring on every control (FR-006).

**Checkpoint**: keyboard-only navigation shows focus rings on every control; states are distinct.

## Phase 6: User Story 4 — Expressive domain color system (P2)

**Goal**: The five domains read as a coherent vivid color family, applied consistently and legibly.
**Independent test**: Domain badges/cards/bars use each domain's color consistently with sufficient
contrast (C5 + US4 scenario).

- [X] T017 [US4] Add **per-domain vivid color tokens** (`--domain-d1..d5` + `*-foreground`) to `src/index.css` per `data-model.md` §2; verify each against its background + overlaid text for AA.
- [X] T018 [US4] Apply domain tokens consistently across badges, cards, and progress bars in `HomeScreen.tsx`, `QuizScreen.tsx`, `ResultsScreen.tsx` (and any shared badge/bar component).

**Checkpoint**: all five domains render as a consistent vivid family across every surface.

## Phase 7: User Story 5 — Visual validation via Playwright (P3)

**Goal**: Redesign validated with before/after screenshots of every screen in both languages.
**Independent test**: before/after screenshots of Home/Quiz/Results (PT+EN) exist and are reviewed
(C10 + US5 scenario).

- [X] T019 [US5] Capture **after** screenshots via Playwright MCP — Home/Quiz/Results × PT/EN → `after-{screen}-{lang}.png`.
- [X] T020 [US5] Review before/after side by side against `contracts/visual-contract.md` C1–C10; record any gaps and fix before sign-off.

## Phase 8: Polish & Cross-Cutting

- [X] T021 Run `bun run build` (`tsc -b` + `vite build`) — MUST be green (C2, SC-002); fix any type/build error.
- [X] T022 [P] Audit WCAG **AA contrast** for all text/UI incl. text on domain colors + accent surfaces (C5, SC-003).
- [X] T023 [P] Verify **responsiveness** at ~360px width with long question/option text — no broken layout (C8, SC-006).
- [X] T024 [P] Confirm **unofficial labels** (weights / 100–1000 scale / 720 cutoff) survive the redesign (C9, Principle VI); confirm no emojis and no ad-hoc colors/shadows in components (C7).
- [X] T025 Update `CLAUDE.md` "Convenções não-negociáveis" to mirror amended Principle V (heavier display weights, tokenized elevation, expanded palette) — resolves the ⚠ follow-up noted in constitution v1.1.0.

---

## Dependencies & Execution Order

- **Setup (P1)** → **Foundational (P2)** must finish before any user-story phase.
- **US1 (P3)** is the MVP — the cohesive shell; later stories layer onto it.
- **US2/US3/US4** depend on US1's redesigned screens (same files) → run after US1; among themselves
  they touch overlapping screen files, so sequence US2 → US3 → US4 (or coordinate edits).
- **US5 (P7)** validation runs after the visual work; **Polish (P8)** closes the build/contrast/
  responsive/labels gates.
- `[P]` marks tasks on different files with no incomplete dependency.

## Parallel Opportunities

- T002 + T003 (Setup) in parallel.
- T005/T006/T007 are sequential edits to the same `src/index.css` — do NOT parallelize.
- Within US1: T011 (`components/**`) can run alongside the screen edits if not touching same files.
- Polish: T022 + T023 + T024 in parallel (independent audits).

## Implementation Strategy

- **MVP = Setup + Foundational + US1** → a cohesive bolder app, build-green, before/after captured.
- Then layer US2 (hierarchy), US3 (states), US4 (domain colors), US5 (validation), Polish.
- Hard gate at every checkpoint: `bun run build` green + no Principle V / i18n regressions.

## Totals

- **25 tasks** across 8 phases.
- Per story: US1=4, US2=3, US3=2, US4=2, US5=2; Setup=3, Foundational=4, Polish=5.
- MVP scope: T001–T011 (through US1).
