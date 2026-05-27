# Phase 0 Research: Bold Visual Redesign

All open questions from the spec were resolved in its Clarifications session (2026-06-15). This
document records the technical decisions that drive the redesign. No `NEEDS CLARIFICATION` remain.

## Decision 1 — Token strategy: extend `src/index.css` `@theme`, don't restructure

- **Decision**: Express the entire bolder language as additions to the existing OKLCH token set in
  `src/index.css` (color accents, per-domain vivid colors, elevation/shadow tokens, font-weight
  scale). Components/screens consume tokens only.
- **Rationale**: Principle V (v1.1.0) requires every visual value to be a curated token. The file
  already holds the dark zinc + orange OKLCH palette; extending it keeps one source of truth and
  makes review objective. Avoids scattered hardcoded colors (FR-008).
- **Alternatives considered**: Per-component inline styles (rejected — violates Principle V, causes
  drift); a second CSS file (rejected — fragments the token system).

## Decision 2 — Typography: Inter 600/700 for display/score/headings only

- **Decision**: Introduce Inter 600 (Semibold) and 700 (Bold) for display, score, and headings;
  body and long-form text stay 400/500. Weights exposed as tokens.
- **Rationale**: Exactly the relaxation the constitution amendment permits; heavier weight is an
  emphasis-hierarchy tool, not for paragraphs (serves SC-003 readability + US2 hierarchy).
- **Alternatives considered**: Heavier body text (rejected — hurts long-form readability and the
  amendment forbids it); a different display typeface (rejected — adds a dependency and breaks the
  Inter-based system for no clear gain).

## Decision 3 — Elevation: tokenized soft shadows + layered surfaces

- **Decision**: Add a small, tokenized elevation scale (e.g. surface / raised / overlay) using soft
  OKLCH-tinted shadows; keep `border` as a valid depth tool. No inline one-off shadows.
- **Rationale**: The amendment allows tokenized soft elevation as a deliberate depth cue; a small
  fixed scale prevents shadow sprawl and keeps cohesion (US1).
- **Alternatives considered**: Heavy/dramatic shadows (rejected — reads as noise on a dark theme,
  risks AA legibility); borders only (rejected — too flat for the "bolder" goal).

## Decision 4 — Domain color family: 5 vivid, AA-legible accents

- **Decision**: Define a tokenized vivid color per domain (D1–D5), applied consistently to badges,
  cards, bars, and accents. Each is contrast-checked against its background and any overlaid text.
- **Rationale**: US4 wants the five domains to read as a coherent vivid family; tokenizing them
  keeps usage consistent and legible (FR-005). The current build already color-codes domains
  (observed: D1 violet, D2 blue, D3 green, D4 orange, D5 zinc) — this formalizes and intensifies it.
- **Alternatives considered**: One accent for all domains (rejected — loses domain identity, US4);
  arbitrary per-component colors (rejected — violates Principle V).

## Decision 5 — Interaction states & motion via tokens + tw-animate-css

- **Decision**: Define distinct hover / focus-visible / selected / correct / wrong / disabled states
  for interactive elements (esp. quiz option buttons), with tasteful transitions. Reuse the existing
  `tw-animate-css` dependency; no new motion library.
- **Rationale**: US3 + FR-006 require polished, accessible states with a visible focus ring; keyboard
  operability must be preserved. Reusing the installed animation utility avoids new deps.
- **Alternatives considered**: Framer Motion / new animation lib (rejected — new dependency for a
  presentational polish, against the "no new deps" assumption).

## Decision 6 — Design authored by a frontend/design subagent

- **Decision**: A frontend/design subagent receives a design brief (current screenshots + token
  constraints) and returns the critique + concrete, code-ready proposals; the main agent applies
  them to the React/Tailwind code.
- **Rationale**: Matches the spec's chosen workflow (clarification answer) and concentrates the
  creative pass while keeping application/diff review with the orchestrator.
- **Alternatives considered**: Ad-hoc inline tweaks with no critique pass (rejected — the spec
  explicitly chose a subagent-driven critique for a cohesive result).

## Decision 7 — Validation: Playwright MCP before/after, PT + EN

- **Decision**: Capture before/after screenshots of Home, Quiz, Results in **both** PT and EN via the
  Playwright MCP (already installed and verified working this session). `tsc -b` + `vite build` are
  the hard regression gate.
- **Rationale**: FR-010 / SC-005 require before/after screenshots in both languages; FR-002 / SC-002
  require zero build regressions. MCP was smoke-tested against the running dev server.
- **Alternatives considered**: Manual eyeballing only (rejected — no before/after evidence for
  review); adding a screenshot-diff test harness (rejected — out of scope, no new tooling).
