# Visual / UI Contract: Bold Visual Redesign

This feature exposes no programmatic API. Its "contract" is the set of observable visual + UX
guarantees the redesign MUST satisfy, expressed as checkable assertions. Each maps to spec FRs/SCs
and is verifiable via the Playwright MCP and/or the build.

## C1 — Cohesion (FR-001, SC-001, US1)

- Home, Quiz, Results render from the **same** token set (color, type scale, spacing, elevation,
  component shapes).
- Verify: side-by-side screenshots share accent usage, card shape, and elevation language.

## C2 — No regressions (FR-002, SC-002)

- `tsc -b` passes (zero type errors).
- `vite build` succeeds.
- All pre-existing behavior works: domain practice, weighted sims (15/30/60), mixed mode, scoring,
  history, language toggle. No removed functionality.

## C3 — i18n preserved (FR-003, Principles II/III)

- Every UI string still resolves from `translations.ts` (PT/EN); no hardcoded PT/EN in JSX.
- Language toggle visible on **every** screen.
- Question/option text remains English in both languages.
- Verify: snapshot Home/Quiz/Results in PT and EN; only chrome changes language, items stay English.

## C4 — Offline-first untouched (FR-004, Principle IV)

- No runtime fetch added; app still works from `questions.generated.json` + seed.

## C5 — Contrast (FR-005, SC-003)

- Body and key UI text meet **WCAG AA** against their backgrounds in the dark theme, including text
  overlaid on domain colors and accent surfaces.

## C6 — Interaction states (FR-006, SC-004, US3)

- Every interactive element has distinct **hover, focus-visible, selected, disabled** states; quiz
  options additionally have **correct / wrong** states.
- A visible **focus-visible** ring appears on keyboard navigation; all controls keyboard-operable.

## C7 — Tokenization (FR-008, Principle V)

- No ad-hoc/inline colors or shadows in components — all visual values come from `@theme`/CSS tokens.
- Heavier weights limited to display/score/headings (600/700); body stays 400/500.
- No emojis in production UI.

## C8 — Responsiveness (FR-007, SC-006)

- App is usable and legible from ~360px width to desktop; no broken layout with long question/option
  text.

## C9 — Unofficial labels retained (Principle VI)

- Any surface showing weights / 100–1000 scale / 720 cutoff keeps its "unofficial / community
  consensus" labeling after the redesign.

## C10 — Before/after evidence (FR-010, SC-005, US5)

- Before/after screenshots exist for Home, Quiz, Results in **both** PT and EN, captured via the
  Playwright MCP, and are reviewed.

## Acceptance gate

The feature is DONE only when C1–C10 all hold. C2/C7 are hard build/code gates; C1/C3/C5/C6/C8/C10
are validated through Playwright MCP screenshots + snapshot inspection.
