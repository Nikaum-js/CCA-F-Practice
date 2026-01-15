<!--
Sync Impact Report
- Version change: 1.1.0 → 2.0.0
- Bump rationale: MAJOR — Principle III REDEFINED. The previous absolute prohibition
  ("Questions … MUST NEVER be translated") is replaced by an additive translation model:
  English stays canonical/never-overwritten, but an optional, id-keyed PT translation layer
  with English fallback is now permitted. Redefining a principle is a backward-incompatible
  governance change per the versioning policy → MAJOR. Enables feature 003-translate-questions.
- Principles (7), changes this version:
  I. Client-Side Only — unchanged
  II. Internationalization Is Mandatory — unchanged
  III. Questions Are Always in English → "English Source Is Canonical; Translation Is Optional &
     Additive" — RENAMED + REDEFINED (additive optional PT layer, English canonical + fallback,
     technical identifiers preserved verbatim).
  IV. Offline-First, Pre-Compiled Data — unchanged (PT translations ship as a pre-built data file).
  V. Tokenized Design System — unchanged (from 1.1.0).
  VI. Exam Weights Are Unofficial — unchanged
  VII. Spec-Driven Development — unchanged
- Added sections: none. Removed sections: none.
- Templates reviewed for alignment:
  ✅ .specify/templates/plan-template.md — Constitution Check gate still compatible.
  ✅ .specify/templates/spec-template.md — behavior-focused; unaffected.
  ✅ .specify/templates/tasks-template.md — no principle-driven task types added/removed.
  ⚠ CLAUDE.md — "Questões sempre em inglês" convention now superseded; update to reflect the
     additive PT translation layer (handled with this change).
  ⚠ docs/SPEC-KIT.md — generic Spec Kit manual (board game); annotation handled outside.
- Deferred TODOs: none.
-->

# CCA-F Exam Prep App Constitution

The CCA-F Exam Prep App is a personal, client-side study tool for the **Claude Certified
Architect – Foundations (CCA-F)** certification. These principles are non-negotiable and
supersede any other practice, habit, or convenience.

## Core Principles

### I. Client-Side Only

Everything runs in the browser. There is **no backend, no authentication, and no server**.
All persisted state lives in `localStorage` under `ccaf_*` keys. External state-management
libraries (Zustand, Redux, MobX, etc.) MUST NOT be added — state is React state plus
`localStorage`, nothing more.

**Rationale:** A single-user study tool gains nothing from a server and everything from being
trivially portable, private, and runnable offline. Forbidding state libraries keeps the data
flow auditable and the bundle small.

### II. Internationalization Is Mandatory

Every user-facing UI string MUST come from a `translations` object covering **PT and EN**.
Hardcoding PT or EN text in JSX is forbidden. The active language is persisted in `ccaf_lang`
(default **PT**), and a language toggle MUST be visible on every screen.

**Rationale:** Bilingual support is a product requirement, not an afterthought. Centralizing
strings is the only way to guarantee no untranslated chrome leaks into either language.

### III. English Source Is Canonical; Translation Is Optional & Additive

The **original English text** of every question, answer option, and explanation is the **canonical
source of truth**: it is the value stored in the question bank, the basis for the `id` hash and
deduplication, and the text shown when no translation exists. On top of that, an **optional PT
translation MAY be provided** per question (stored separately, keyed by question `id`, never
overwriting the English source). When the active language is PT and a translation exists, the UI
MAY display the translated text; it MUST fall back to the canonical English whenever a translation
is missing. Translations MUST preserve technical terms and identifiers verbatim (e.g. `isError`,
`user_id`, JSON Schema, MCP) — these are not localized.

**Rationale (amended 2.0.0 for feature 003-translate-questions):** The real exam is in English, so
the English text remains canonical and is never destroyed — dedup, ids, and exam-fidelity are
preserved. But a solo learner studying in PT benefits from an *additive* translation layer; making
it optional, id-keyed, and English-falling-back keeps the original intact while removing the hard
prohibition. The earlier "MUST NEVER be translated" stance is superseded by this additive model.

### IV. Offline-First, Pre-Compiled Data

The question bank MUST be **pre-compiled at build time**: `scripts/build-questions.ts` fetches
the source repositories' READMEs, parses them, deduplicates, classifies domains, and writes
`src/data/questions.generated.json`. The app imports that JSON and works fully offline; runtime
network fetching MUST NOT be a requirement for the app to function. A hardcoded **seed of 10
questions** guarantees the app never shows an empty state.

**Rationale:** The sources are single README files behind GitHub's unauthenticated rate limit;
compiling once at build time removes rate-limit/CORS fragility and makes the app deterministic
and offline-capable.

### V. Tokenized Design System

The visual language is a **deliberate, centralized token system**, not a fixed minimal one.
Every color, weight, spacing step, and elevation MUST be declared as a token in the Tailwind v4
`@theme`/CSS layer (OKLCH for color); the UI MUST consume those tokens, never ad-hoc values.
Within that system the following are now PERMITTED (amended 1.1.0 for feature 002-design-polish):

- **Typography:** Inter up to **600/700** for display, score, and heading elements. Body and
  long-form reading text stays **400/500** (a heavier weight is for emphasis hierarchy, not
  paragraphs).
- **Elevation:** subtle, **tokenized** soft shadows / layered surfaces are allowed as a
  deliberate depth cue. `border` remains a valid depth tool; elevation MUST come from tokens,
  not inline one-off shadow values.
- **Color:** the palette MAY be expanded with **tokenized** accents and per-domain vivid colors,
  used consistently across badges, cards, bars, and accents.

The following remain **FORBIDDEN**: colors or shadows outside the token system (no ad-hoc/inline
values); emojis in production UI; and any text/UI that fails **WCAG AA** contrast in the dark
theme. New tokens MUST keep the system coherent — additions are curated, not scattered.

**Rationale:** A bolder, more memorable identity serves engagement, but only a centralized token
system keeps "looks right" objective and reviewable. Relaxing the *range* (weights, elevation,
palette) while keeping the *discipline* (everything tokenized, AA-legible, no ad-hoc values)
gives expressive freedom without reintroducing visual drift.

### VI. Exam Weights Are Unofficial

The five domains, their weights (27/18/20/20/15), the 100–1000 score scale, and the 720 pass
cutoff are **community consensus and are NOT published by Anthropic**. Any surface that shows
them MUST label them as unofficial. The only officially citable fact is the certification's
existence, per the Claude Partner Network announcement
(https://www.anthropic.com/news/claude-partner-network).

**Rationale:** Presenting community numbers as official would be inaccurate and could mislead
the user's study strategy. Honesty about provenance protects trust and study validity.

### VII. Spec-Driven Development

The spec is the contract. **Behavior changes** the user can see, feel, or do MUST go through a
spec before code (`/speckit-specify` → `/speckit-clarify` → … ). Operational work — setup,
tooling, dependency, refactor, bug fix, docs — goes directly without a spec. When code and spec
disagree, the spec wins (or the spec is amended first).

**Rationale:** Writing the "what" before the "how" prevents rework and records the "why" for a
solo developer returning months later.

## Locked Technology Stack

The following stack is fixed; changing any element is an amendment (see Governance):

- **Runtime / package manager:** Bun.
- **Bundler / dev server:** Vite (run via Bun). The earlier "no Vite" intent is superseded —
  Bun is the runtime and package manager; Vite is the bundler.
- **UI:** React 19 + TypeScript (strict).
- **Styling:** Tailwind CSS v4 (CSS-first, `@theme`) + shadcn/ui initialized with dark mode,
  CSS variables, and a **zinc** base.
- **Routing / state:** none — view state is React state; persistence is `localStorage` only.

## Development Workflow

Work follows the Spec Kit flow: **constitution → specify → clarify → plan → tasks → implement**.
The boundary between discovery (`specify`/`clarify`) and construction (`plan`/`tasks`/`implement`)
MUST NOT be crossed without an explicit decision to leave design. Specs may sit in discovery
indefinitely. Each step is reviewed before the next; no step is automatic.

## Governance

This constitution supersedes other practices. Amendments require: (1) a written rationale,
(2) a version bump per the policy below, and (3) propagation to any affected spec, plan, or
template. All specs and plans are checked against these principles before implementation;
unjustified complexity is rejected.

**Versioning policy (semantic):**
- **MAJOR** — backward-incompatible governance/principle removal or redefinition.
- **MINOR** — a new principle/section or materially expanded guidance.
- **PATCH** — clarifications, wording, or non-semantic refinements.

Runtime development guidance for agents lives in `CLAUDE.md`, which MUST reference this file.

**Version**: 2.0.0 | **Ratified**: 2026-06-15 | **Last Amended**: 2026-06-15
