# Feature Specification: Bold Visual Redesign

**Feature Branch**: `002-design-polish`

**Created**: 2026-06-15

**Status**: Draft

**Input**: User description: "Use Playwright (MCP) to improve the app's design — a bolder visual
direction across all screens, driven by a frontend/design subagent."

> **Constitution impact (read first):** The current design language is locked by **Principle V
> (Locked Design Tokens)** — Inter 400/500 only, no font-weight ≥600, no `box-shadow`, colors only
> from a minimal token set. The user has chosen a **bolder** direction that intentionally relaxes
> these. This feature therefore REQUIRES a constitution amendment to Principle V before/with
> implementation. See "Constitution Amendment" below.

## Clarifications

### Session 2026-06-15

- Q: How are the screens captured for design work? → A: Via the **Playwright MCP** (user installs
  it: `claude mcp add playwright -- npx -y @playwright/mcp@latest`). Claude drives the browser to
  screenshot each screen (PT + EN) for before/after comparison.
- Q: Who drives the design proposals? → A: A **frontend/design subagent** given a design brief
  produces the critique + concrete proposals, applied to the existing React/Tailwind v4 code.
- Q: Aesthetic direction? → A: **Bolder** — more color, contrast, and personality; locked
  principles MAY be revised (constitution amendment).
- Q: Scope? → A: **All screens** — Home, Quiz, Results (a cohesive redesign).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cohesive bold visual identity across all screens (Priority: P1)

The learner opens the app and immediately perceives a distinct, confident visual identity —
expressive use of the domain colors, strong typographic hierarchy, and a consistent design
language carried cohesively from Home through Quiz to Results.

**Why this priority**: The redesign's core goal is a stronger, more memorable look across the whole
app; cohesion is what separates a redesign from scattered tweaks.

**Independent Test**: Screenshot Home, Quiz, and Results before and after; the after set shares one
deliberate visual language (color, type scale, spacing rhythm, component shapes) and reads as
clearly bolder than before.

**Acceptance Scenarios**:

1. **Given** the redesigned app, **When** any screen renders, **Then** it uses the shared redesigned
   token set, type scale, and spacing rhythm consistently.
2. **Given** Home/Quiz/Results, **When** compared side by side, **Then** they are visually cohesive
   (same component shapes, accent usage, elevation language).

---

### User Story 2 - Stronger hierarchy & readability (Priority: P1)

Key information (scores, domain identity, the current question, the correct/incorrect outcome)
stands out clearly through size, weight, color, and spacing.

**Why this priority**: A bolder look must still serve the study purpose — the most important
elements must be the most prominent.

**Acceptance Scenarios**:

1. **Given** Results, **When** it renders, **Then** the score and pass/fail outcome are the clear
   focal point.
2. **Given** a quiz question, **When** it renders, **Then** the question and options have a clear
   reading hierarchy and comfortable line length.

---

### User Story 3 - Richer interaction states & motion (Priority: P2)

Interactive elements have distinct, polished states (hover, focus-visible, selected, correct,
wrong, disabled) and tasteful transitions that reinforce feedback without distraction.

**Acceptance Scenarios**:

1. **Given** an option button, **When** hovered/selected/revealed, **Then** each state is visually
   distinct and animated smoothly.
2. **Given** keyboard navigation, **When** an element is focused, **Then** a clear focus-visible
   ring is shown (accessibility preserved).

---

### User Story 4 - More expressive domain color system (Priority: P2)

The five domains read as a coherent, vivid color family used consistently in badges, cards, bars,
and accents.

**Acceptance Scenarios**:

1. **Given** domain badges/cards/bars, **When** rendered, **Then** each domain's color is applied
   consistently and legibly (sufficient contrast).

---

### User Story 5 - Visual validation via Playwright (Priority: P3)

The redesign is validated by capturing before/after screenshots of every screen in both languages.

**Acceptance Scenarios**:

1. **Given** the Playwright MCP, **When** the redesign is done, **Then** before/after screenshots of
   Home, Quiz, Results (PT + EN) exist and are reviewed.

### Edge Cases

- Long question text / long option text must not break the new layout.
- Small viewports (mobile width) must remain usable (responsive).
- Color choices must keep text legible (contrast) in the dark theme.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The redesign MUST cover Home, Quiz, and Results cohesively (shared design language).
- **FR-002**: The redesign MUST preserve all existing functionality — no behavior regressions;
  `tsc -b` and `vite build` MUST still pass.
- **FR-003**: i18n MUST be preserved — all strings stay in `translations.ts`; questions/options stay
  English (Constitution II/III unchanged).
- **FR-004**: Offline-first data behavior MUST be unaffected (Constitution IV unchanged).
- **FR-005**: Text/!UI MUST meet WCAG AA contrast in the dark theme despite bolder colors.
- **FR-006**: Interactive elements MUST keep a visible focus-visible state and remain keyboard
  operable.
- **FR-007**: The design MUST stay responsive (usable from ~360px to desktop).
- **FR-008**: The visual design tokens MUST be defined in the Tailwind v4 `@theme`/CSS layer (no
  scattered hardcoded colors), so the new language is centralized.
- **FR-009**: Constitution **Principle V MUST be amended** to permit the new design language; the
  amendment MUST enumerate exactly what is now allowed (e.g., heavier weights, elevation/shadow,
  expanded palette) and what remains forbidden.
- **FR-010**: Before/after screenshots of all screens (PT + EN) MUST be produced via the Playwright
  MCP for review.

### Key Entities

- *(No new data entities — this is a presentational change. Touches `src/index.css` tokens and the
  `src/components/**`, `src/screens/**` presentation layer only.)*

## Success Criteria *(mandatory)*

- **SC-001**: All three screens are redesigned in one cohesive, bolder visual language.
- **SC-002**: `tsc -b` and `vite build` pass after the redesign (zero regressions).
- **SC-003**: Body and key UI text meet WCAG AA contrast against their backgrounds.
- **SC-004**: Every interactive element has distinct hover/focus/selected/disabled states.
- **SC-005**: Before/after screenshots exist for Home, Quiz, Results in PT and EN.
- **SC-006**: The app remains usable at ~360px width.

## Constitution Amendment (required by FR-009)

Principle V (Locked Design Tokens) will be amended (MINOR bump) to support a bolder identity.
Proposed relaxations (to be finalized at implementation):

- **Allow** font-weight up to 600/700 for display/score/headings (Inter Semibold/Bold), while body
  text stays 400.
- **Allow** subtle elevation (soft shadows / layered surfaces) as a deliberate, tokenized choice.
- **Expand** the color palette with tokenized accents and per-domain vivid colors.
- **Keep forbidden**: ad-hoc colors outside the token system; emojis in production UI; illegible
  (sub-AA) contrast.

## Assumptions

- **Tooling**: The Playwright MCP is installed by the user; a frontend/design subagent produces the
  design critique and proposals; changes are applied to the existing React 19 + Tailwind v4 code.
- **No new dependencies** expected beyond what shadcn/Tailwind already provide (fonts may add Inter
  600/700 weights).
- **Stack unchanged**: Bun + Vite + React 19 + Tailwind v4 + shadcn.
