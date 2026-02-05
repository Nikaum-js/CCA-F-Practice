# Feature Specification: CCA-F Exam Prep App

**Feature Branch**: `001-ccaf-exam-prep`

**Created**: 2026-06-15

**Status**: Draft

**Input**: User description: "CCA-F Exam Prep App — personal client-side study tool for the Claude Certified Architect – Foundations certification."

> **Provenance note (read first):** The certification *Claude Certified Architect – Foundations*
> is real (announced by Anthropic via the Claude Partner Network, 2026-03-12:
> https://www.anthropic.com/news/claude-partner-network). However, the **five domains, their
> weights (27/18/20/20/15), the 100–1000 score scale, and the 720 pass cutoff are community
> consensus and are NOT published by Anthropic.** Every surface that displays them MUST label
> them as unofficial. See Principle VI in the project constitution.

## Clarifications

### Session 2026-06-15

- Q: When a domain has fewer questions than a weighted sample requires, what should happen?
  → A: **Reduce and redistribute** — use all available questions from the short domain and reflow the
  remainder to the other domains by weight, keeping the total exact (15/30/60) with **no repeats**.
  Scoring still uses the real domain weights.
- Q: Which modes update per-domain statistics (`ccaf_domain_stats`)?
  → A: **All modes** — every answered question counts toward its domain in domain, mixed, quick
  (15/30), and exam (60) sessions.
- Q: What about the `difficulty` field (normal/hard) that no screen uses?
  → A: **Keep it in the data** (classified at build time, stored in the generated JSON) as metadata
  for future use; **no UI/filter** is added now.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Train a single domain (Priority: P1)

The learner opens the app, sees a card per domain with their running accuracy, and clicks one to
start a focused session containing only that domain's questions. They answer each question and, at
the end, see how many they got right plus the explanations.

**Why this priority**: Identifying and drilling weak domains is the app's core purpose. A single
working domain session already delivers standalone study value.

**Independent Test**: Click a domain card → answer the questions → reach a results screen showing
correct/total and per-question explanations. No other feature required.

**Acceptance Scenarios**:

1. **Given** the question bank is loaded, **When** the learner clicks the "D1 · AGENTIC" card,
   **Then** a session starts containing only D1 questions.
2. **Given** a domain session is in progress, **When** the learner answers a question in immediate
   mode, **Then** the correct answer and explanation are revealed before advancing.
3. **Given** the learner finishes a domain session, **When** the results screen loads, **Then** it
   shows raw `X/N correct (Y%)` and a per-question review list — and **no** 100–1000 score.

---

### User Story 2 - Weighted 60-question exam simulation (Priority: P1)

The learner starts a full 60-question simulation. Questions are drawn proportionally to the
(community) domain weights. At the end they get a score on the 100–1000 scale, a pass/fail verdict
against the 720 cutoff, and the result is saved to their exam history.

**Why this priority**: The exam simulation is the headline "practice under exam-like conditions"
capability and the only mode that produces a tracked score over time.

**Independent Test**: Start the 60-question exam → answer all → see a 100–1000 score, a pass/fail
badge, and confirm the run appears in history with best/last score updated.

**Acceptance Scenarios**:

1. **Given** the 60-question exam starts, **When** the sample is built, **Then** the distribution is
   D1:16, D2:11, D3:12, D4:12, D5:9 (sums to 60).
2. **Given** the learner completes the exam with known answers, **When** the score is computed,
   **Then** it equals `round(100 + Σ(domain_accuracy × domain_weight) × 900)` and pass = score ≥ 720.
3. **Given** an exam is completed, **When** the results screen mounts, **Then** the run is appended
   to history and the home StatsBar reflects updated best/last/count.
4. **Given** any screen showing the score scale or weights, **When** it renders, **Then** an
   "unofficial / community-sourced" label is visible.

---

### User Story 3 - Choose feedback timing before starting (Priority: P1)

Before the first question of any session, the learner picks how feedback works: see the answer
immediately (with explanation) or see everything only at the end.

**Why this priority**: This shapes the entire session experience and is needed for both study
(immediate) and exam-realistic (end) practice.

**Independent Test**: Open the mode picker → choose "immediate" → verify explanations appear after
each answer; restart → choose "at end" → verify no feedback until results.

**Acceptance Scenarios**:

1. **Given** the mode picker, **When** the learner selects immediate feedback, **Then** after each
   answer the options lock and the explanation block appears with a "Next" button.
2. **Given** the mode picker, **When** the learner selects "see at end", **Then** answering
   auto-advances after ~300ms with no feedback until the results screen.

---

### User Story 4 - Quick samples & mixed mode (Priority: P2)

The learner runs a quick 15- or 30-question weighted sample, or a "mixed mode" session of all
domains shuffled with a chosen count (10/20/40). These are practice only.

**Why this priority**: Lighter practice formats encourage frequent short sessions, but they are
secondary to the core domain/exam flows.

**Independent Test**: Start a 15-question sample → finish → see only `X/N (%)`, no 100–1000 score,
and confirm nothing is written to exam history.

**Acceptance Scenarios**:

1. **Given** a 15- or 30-question sample, **When** it completes, **Then** the result shows raw
   `X/N (%)` and is **not** saved to exam history and shows no 100–1000 score.
2. **Given** mixed mode with count 20, **When** it starts, **Then** 20 questions from all domains
   appear in shuffled order.

---

### User Story 5 - Per-domain history & weakest-domain insight (Priority: P2)

On the home screen the learner sees a table of attempts, correct, accuracy rate, and last-practiced
per domain, with the weakest domain visibly flagged.

**Why this priority**: Tracking improvement over time and surfacing the weakest domain is a key part
of the value proposition, but depends on sessions having been played first.

**Independent Test**: Play sessions across domains → open home → verify the table shows correct
counts, color-coded rates, and the worst domain is highlighted.

**Acceptance Scenarios**:

1. **Given** recorded stats, **When** the history table renders, **Then** each rate is colored green
   (≥70%), amber (40–69%), or red (<40%).
2. **Given** recorded stats, **When** the table renders, **Then** the worst-accuracy domain has a
   distinct highlight and a "weakest domain" label.
3. **Given** a domain never practiced, **When** the table renders, **Then** its rate shows `—`.

---

### User Story 6 - Optional per-question timer (Priority: P2)

The learner can enable a per-question countdown (120s) to simulate time pressure. It is OFF by
default. Running low changes color; running out skips the question.

**Why this priority**: Adds exam realism but is explicitly optional and off by default, so it is
secondary.

**Independent Test**: Toggle the timer ON in the mode picker → start → observe a 120s countdown that
turns amber then red, and on expiry the question is skipped and the session advances.

**Acceptance Scenarios**:

1. **Given** the mode picker, **When** it opens, **Then** the timer toggle defaults to OFF.
2. **Given** the timer is ON, **When** a question is shown, **Then** a 120s countdown displays:
   neutral >60s, amber 30–60s, red + pulse <30s.
3. **Given** the timer reaches 0, **When** it expires, **Then** the question is recorded as skipped
   (answer = none) and the session advances; the results review shows `—` for that answer.
4. **Given** the learner answers before expiry, **When** they select an option, **Then** the timer
   stops immediately and resets to 120s on the next question.

---

### User Story 7 - Resume an in-progress session (Priority: P3)

If the learner refreshes or returns, an in-progress session is preserved and offered for resume from
the home screen.

**Why this priority**: A convenience/robustness feature; valuable but not required for core study.

**Independent Test**: Start a session, answer 2 questions, refresh → see a "Resume session" banner →
resume into the same question with prior answers intact.

**Acceptance Scenarios**:

1. **Given** an in-progress session, **When** the app reloads, **Then** a resume banner appears on
   the home screen.
2. **Given** the timer was ON, **When** the learner resumes, **Then** the countdown continues from
   the stored remaining time (it does not decrement while the app is closed — it is per-question,
   not wall-clock).
3. **Given** the learner clicks "Exit" during a session, **When** the confirmation dialog is
   accepted, **Then** the session is preserved and the learner returns home.

---

### User Story 8 - Bilingual UI, English questions (Priority: P3)

All UI chrome follows the active language (PT default, EN toggle), while questions and options always
stay in their original English.

**Why this priority**: Important for usability but the app is functional in a single language; layered
on after core flows.

**Independent Test**: Toggle PT↔EN → verify every label/button/section title switches, while question
and option text remain unchanged English.

**Acceptance Scenarios**:

1. **Given** any screen, **When** the language toggle is clicked, **Then** all UI chrome switches and
   the choice persists across reloads.
2. **Given** either language is active, **When** a question renders, **Then** its body and options are
   the original English, never translated.

---

### User Story 9 - Keyboard shortcuts (Priority: P3)

The learner can answer with A/B/C/D keys and advance with Enter.

**Why this priority**: A speed/accessibility nicety, fully optional.

**Acceptance Scenarios**:

1. **Given** a question is shown, **When** the learner presses `B`, **Then** option B is selected.
2. **Given** an answered question in immediate mode, **When** the learner presses `Enter`, **Then**
   the session advances to the next question.

---

### Edge Cases

- **Empty/failed data**: If the pre-compiled bank is missing or empty at runtime, the app loads the
  10-question seed (2 per domain) so no screen is ever blank.
- **Insufficient questions for a quota**: A domain may have fewer questions than a weighted exam
  requires. The system uses all available questions from that domain and redistributes the shortfall
  to other domains by weight, keeping the total exact and avoiding repeats (see Clarifications).
- **Duplicate questions across the two sources**: Near-identical items are deduplicated; the version
  with the longer explanation is kept and tagged `source: merged`.
- **Timer expiry on the last question**: Skips and goes directly to results.
- **All answers skipped by timer**: Score computes with 0 correct; results still render.
- **Single domain with no recorded history**: History row shows `—` rather than 0%.
- **Resume after long absence**: Timer resumes from stored remaining seconds (no real-time decay).

## Requirements *(mandatory)*

### Functional Requirements

**Data & domains**
- **FR-001**: The system MUST ship a pre-compiled question bank embedded in the app and MUST function
  fully offline without any runtime network fetch.
- **FR-002**: The system MUST assign every question to exactly one of five domains (D1–D5) and MUST
  record how each was classified (curated).
- **FR-003**: The system MUST deduplicate questions sourced from the two repositories, keeping the
  longer explanation and marking merged items.
- **FR-004**: The system MUST display a visible "unofficial / community-sourced" label wherever the
  domain weights, score scale, or pass cutoff appear.
- **FR-005**: The system MUST fall back to a 10-question seed (2 per domain) if the embedded bank is
  unavailable, so the UI is never empty.

**Sessions & modes**
- **FR-006**: Users MUST be able to start a domain-only session by selecting a domain.
- **FR-007**: Users MUST be able to start weighted exams of size 15, 30, and 60.
- **FR-008**: Users MUST be able to start a mixed session (all domains shuffled) with count 10, 20,
  or 40 (default 10).
- **FR-009**: Before the first question, users MUST choose immediate feedback or feedback-at-end.
- **FR-010**: In immediate mode, after answering, the system MUST lock options, reveal the correct
  answer and explanation, and require a "Next" action to advance.
- **FR-011**: In feedback-at-end mode, the system MUST auto-advance shortly after an answer with no
  feedback until the results screen.
- **FR-012**: Once an option is selected, the system MUST lock all options (no re-answering).
- **FR-013**: Users MUST be able to enable an optional per-question timer (default OFF) of 120s; the
  timer state MUST NOT persist between sessions (always OFF on the mode picker).
- **FR-014**: When the timer is ON, the system MUST show a countdown that changes appearance at the
  60s and 30s thresholds and, on expiry, MUST record the question as skipped and advance.
- **FR-015**: The system MUST support answering via A/B/C/D keys and advancing via Enter.

**Scoring & stats**
- **FR-016**: For the 60-question exam only, the system MUST compute a 100–1000 score as
  `round(100 + Σ(domain_accuracy × domain_weight) × 900)` and mark pass when score ≥ 720.
- **FR-017**: The system MUST build weighted samples whose per-domain counts sum exactly to the
  requested size (15/30/60), using a largest-remainder distribution. When a domain has fewer
  questions than its quota, the system MUST use all available questions from that domain and
  redistribute the shortfall to the remaining domains by weight, keeping the total exact and using
  no repeated questions within a session.
- **FR-018**: The system MUST persist exam runs to history ONLY for the 60-question exam, and MUST
  update per-domain statistics after EVERY session — domain, mixed, quick (15/30), and exam — with
  each answered question counting toward its own domain.
- **FR-019**: The home StatsBar MUST show best score, last score, and exam count derived from history.
- **FR-020**: The per-domain history MUST show attempts, correct, color-coded accuracy rate, and
  last-practiced, and MUST highlight the weakest domain.

**Persistence & i18n**
- **FR-021**: The system MUST persist an in-progress session and offer resume on the home screen.
- **FR-022**: Exiting a session MUST prompt for confirmation and preserve the session.
- **FR-023**: All UI strings MUST come from a translations source (PT/EN); no UI text may be
  hardcoded. Language persists (default PT) and a toggle is visible on every screen.
- **FR-024**: Question and option text MUST always render in the original English regardless of UI
  language.

**Results**
- **FR-025**: The results screen MUST show a 100–1000 score hero with pass/fail for the 60-question
  exam, and a raw `X/N (%)` hero otherwise.
- **FR-026**: Results MUST include a per-domain breakdown with color-coded bars and a flagged weakest
  domain, and an expandable per-question review showing the user's answer vs the correct answer plus
  explanation (and a note when a question was domain-reclassified).
- **FR-027**: Results MUST offer CTAs to train the weakest domain, start a new exam, and return home.

### Key Entities *(include if feature involves data)*

- **Question**: A single item — English text, four options (A–D), one correct key, an explanation, a
  domain (D1–D5), a `difficulty` (normal/hard — stored as metadata, no UI yet), a source tag, and
  classification metadata.
- **Domain**: One of five knowledge areas (D1–D5) with an id, short slug, display names (PT/EN),
  badge color, and an (unofficial) weight summing to 100% across all five.
- **DomainStats**: Per-domain cumulative attempts, correct, and last-practiced date.
- **ExamResult**: A completed 60-question run — date, 100–1000 score, pass flag, and per-domain
  attempted/correct.
- **ActiveSession**: An in-progress session — mode, ordered questions, current index, recorded
  answers, feedback mode, timer state, and remaining time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From the home screen, a learner can start any practice mode in a single click/selection
  (no intermediate setup screen for domain sessions).
- **SC-002**: A completed 60-question exam always yields a score in [100, 1000] and a pass/fail
  verdict consistent with the 720 cutoff.
- **SC-003**: Weighted samples always contain exactly the requested number of questions (15/30/60),
  with per-domain counts matching the published distribution.
- **SC-004**: After playing sessions across all five domains, the learner can identify their weakest
  domain from the home screen within 5 seconds (it is visually flagged).
- **SC-005**: The app renders a usable study experience with zero network connectivity after first
  load.
- **SC-006**: Switching language updates 100% of visible UI chrome while leaving question/option text
  unchanged.
- **SC-007**: An interrupted session (refresh/return) can be resumed to the same question with prior
  answers intact in 100% of cases.
- **SC-008**: Every surface displaying weights/score-scale/cutoff carries an unofficial-source label.

## Assumptions

- **Stack (decided)**: Bun (runtime + package manager) + Vite (bundler) + React 19 + TypeScript
  strict + Tailwind CSS v4 (tokens via `@theme`, OKLCH, dark, zinc base) + shadcn/ui. Components in
  use: button, card, badge, progress, separator, switch, alert-dialog, accordion (tabs/tooltip
  dropped unless a concrete use appears). Typography Inter 400/500 only; no font-weight 600/700 in
  the quiz flow; no box-shadow; no emojis in production UI; colors only from tokens. *(Technical
  detail; full design lives in the future plan.md.)*
- **Data pipeline (decided)**: A build-time script (`scripts/build-questions.ts`) fetches the two
  source READMEs, runs a bespoke parser per repository (their markdown formats differ from each other
  and carry no structured domain field), deduplicates, applies **curated** domain classification, and
  writes `src/data/questions.generated.json`, which the app imports. There is no required runtime
  GitHub fetch. *(Technical detail; parser regexes and file structure live in the future plan.md.)*
- **Sources**: `github.com/mrKindly/claude-certified-architect` (60 questions in one README) and
  `github.com/avidevelops/claude-architect-exam-prep` (33 questions in one README); combined,
  deduplicated bank is on the order of ~85–90 questions.
- **localStorage keys**: `ccaf_questions` (cached/seeded bank), `ccaf_lang`, `ccaf_domain_stats`,
  `ccaf_exam_history` (60q only), `ccaf_session`.
- **Domain weights**: D1 27% / D2 18% / D3 20% / D4 20% / D5 15% — community consensus, labeled
  unofficial throughout.
- **Scope boundaries**: No auth, no backend, no router, no external state library, no multi-user, no
  mobile-native build (responsive web only).
- **Classification authority**: Domain assignment is curated at build time (reviewable in the
  generated JSON), not a runtime keyword heuristic — chosen for accuracy since the bank is a small,
  fixed set.

_All open clarifications were resolved in the 2026-06-15 session — see the **Clarifications**
section above._
