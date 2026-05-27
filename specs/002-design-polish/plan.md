# Implementation Plan: Bold Visual Redesign

**Branch**: `002-design-polish` | **Date**: 2026-06-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-design-polish/spec.md`

## Summary

A presentation-only redesign of all three screens (Home, Quiz, Results) into one cohesive,
**bolder** visual language: stronger typographic hierarchy (Inter 600/700 for display/score/
headings), tokenized soft elevation, and an expanded per-domain vivid color family — all driven
through the Tailwind v4 `@theme`/CSS token layer, never ad-hoc values. No behavior, data, or i18n
changes. A frontend/design subagent produces the critique + concrete proposals; changes are
applied to the existing React 19 + Tailwind v4 code and validated with before/after Playwright MCP
screenshots (Home, Quiz, Results × PT/EN). Principle V is already amended (constitution v1.1.0) to
permit this direction, so no further governance change is required.

## Technical Context

**Language/Version**: TypeScript (strict), React 19

**Primary Dependencies**: Bun (runtime/pkg mgr), Vite (bundler/dev), Tailwind CSS v4 (`@theme`,
OKLCH), shadcn/ui (button, card, badge, progress, separator, switch, alert-dialog, accordion),
tw-animate-css. No new runtime deps expected (may enable Inter 600/700 weights).

**Storage**: `localStorage` (`ccaf_*`) — unchanged by this feature.

**Testing**: `tsc -b` + `vite build` as the regression gate; visual validation via Playwright MCP
(browser_navigate / browser_snapshot / browser_take_screenshot). No new automated test framework.

**Target Platform**: Modern evergreen browsers, dark theme only, responsive ~360px → desktop.

**Project Type**: Single-project client-side web app (no backend).

**Performance Goals**: No bundle regressions of note; smooth (~60fps) transitions; no layout
jank on hover/focus/selected state changes.

**Constraints**: WCAG AA contrast in dark theme; keyboard-operable with visible focus-visible;
all visual values tokenized in the `@theme`/CSS layer; no behavior/i18n/data regressions.

**Scale/Scope**: 3 screens, shared component layer (`src/components/**` if present, `src/screens/**`),
single token file (`src/index.css`). 5 domain color families.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Client-Side Only | ✅ PASS | Presentational only; no backend/state-lib introduced. |
| II. i18n Mandatory | ✅ PASS | FR-003 keeps all strings in `translations.ts`; toggle stays on every screen. |
| III. Questions in English | ✅ PASS | No question/option text touched. |
| IV. Offline-First Data | ✅ PASS | FR-004 — data pipeline untouched. |
| V. Tokenized Design System | ✅ PASS | Already amended (v1.1.0). All new weights/elevation/colors go through `@theme` tokens; no ad-hoc values; AA contrast required (FR-005, FR-008). |
| VI. Unofficial Weights | ✅ PASS | Existing unofficial labels preserved; redesign must not drop them. |
| VII. Spec-Driven Development | ✅ PASS | This is the planned `plan` step after spec+clarify; explicit go-ahead given to cross discovery→construction. |

**Gate result: PASS** — no violations; Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/002-design-polish/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (token model — no data entities)
├── quickstart.md        # Phase 1 output (redesign + validation runbook)
├── contracts/           # Phase 1 output (visual/UI contracts)
│   └── visual-contract.md
├── checklists/
│   └── requirements.md  # existing spec-quality checklist
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
src/
├── index.css                 # PRIMARY surface — @theme tokens (OKLCH): color, weight,
│                             #   spacing, elevation. All new design language declared here.
├── screens/
│   ├── HomeScreen.tsx        # redesign: stat cards, domain grid, sim/mixed sections
│   ├── QuizScreen.tsx        # redesign: question hierarchy, option states, progress
│   └── ResultsScreen.tsx     # redesign: score as focal point, pass/fail outcome, per-domain
├── components/               # shadcn/ui wrappers + shared presentational pieces (token-driven)
├── i18n/translations.ts      # UNCHANGED (strings only; no new keys unless a label is added)
└── hooks/, lib/, data/       # UNCHANGED (no behavior/data changes)
```

**Structure Decision**: Single-project client-side app. The redesign is centralized in
`src/index.css` (token layer) and applied across `src/screens/**` and `src/components/**`. No new
directories, no new modules, no data-layer changes.

## Complexity Tracking

> Not applicable — Constitution Check passed with no violations.
