---
description: "Task list for CCA-F Exam Prep App implementation"
---

# Tasks: CCA-F Exam Prep App

**Input**: Design documents from `specs/001-ccaf-exam-prep/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/
**Tests**: Not requested → no test tasks (gate = `tsc --noEmit`).

Format: `[ID] [P?] [Story] Description` · **[P]** = parallelizable (different files, no dep).

---

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Reconcile package manager to Bun; `bun install`; ensure `bun.lock` consistent and remove the stray pnpm install side-effect (restore `node_modules/.ignored` packages).
- [ ] T002 Add deps: `tailwindcss @tailwindcss/vite`, shadcn peers (`class-variance-authority clsx tailwind-merge lucide-react tw-animate-css`); add `@types/bun` for the build script.
- [ ] T003 Wire Tailwind v4 into `vite.config.ts` (`@tailwindcss/vite` plugin) and add `@/*` path alias in `vite.config.ts` + `tsconfig.app.json`.
- [ ] T004 `bunx --bun shadcn@latest init` (dark, CSS variables, zinc) → `components.json` + `src/lib/utils.ts`.
- [ ] T005 [P] Add scripts to `package.json`: `build:questions`, keep `dev`/`build`/`preview`/`lint`.
- [ ] T006 [P] Load Inter 400/500 (Google Fonts) in `index.html`; clean default title/meta.

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ No screen work until this is done.**

- [ ] T007 `src/index.css`: `@import "tailwindcss"`, `@custom-variant dark`, `:root`/`.dark` OKLCH tokens (background/foreground/card/muted/border/primary=accent-orange/ring), `--success`/`--destructive`, and `@theme inline` mapping; Inter body type (1.75 lh, -0.01em). Per research R2 + spec §11.
- [ ] T008 [P] `src/data/schema.ts`: `DomainKey`, `DomainMeta`, `DOMAIN_META`, `DOMAIN_ORDER`, `Question`, `DomainStats`, `ExamResult`, `SessionMode`, `AnswerMode`, `ActiveSession` (per data-model.md).
- [ ] T009 [P] `src/lib/utils.ts` (cn), `src/lib/storage.ts` (typed `ccaf_*` get/set with defaults, per contracts/storage.md), `src/lib/time.ts` (relative date PT/EN, `MM:SS`).
- [ ] T010 [P] `src/lib/scoring.ts`: `calculateExamScore`, `domainDistribution(n)` (largest-remainder), `buildWeightedSample(bank,n)` with shortfall redistribution + no repeats (per plan Key algorithms).
- [ ] T011 [P] `src/lib/classify.ts`: keyword table + `classifyDomain(text)`; `DOMAIN_OVERRIDES` map.
- [ ] T012 [P] `src/lib/parseRepoA.ts` + `src/lib/parseRepoB.ts` (pure, per contracts/parsers.md).
- [ ] T013 [P] `src/lib/dedupe.ts`: normalize + merge (keep longer explanation, `source:'merged'`).
- [ ] T014 `scripts/build-questions.ts`: fetch both READMEs → parse → dedupe → sha1 id → classify → write `src/data/questions.generated.json`; print summary. (depends T010–T013)
- [ ] T015 [P] `src/data/seed.ts`: 10 hardcoded questions (2 per domain), valid `Question` shape.
- [ ] T016 `src/data/questions.ts`: `loadQuestionBank()` → generated JSON else seed; optional LS cache. (depends T008,T014,T015)
- [ ] T017 Run `bun run build:questions` to generate the committed JSON (network once). If it fails, proceed on seed and log. (depends T014)
- [ ] T018 [P] `src/i18n/translations.ts` (full PT+EN key catalog: header, home sections, domains via DOMAIN_META, exam cards, mixed, history, mode picker, quiz, timer, results, CTAs, disclaimers) + `src/i18n/useTranslation.ts`.
- [ ] T019 [P] `src/hooks/useLang.ts` (`ccaf_lang`), `src/hooks/useQuestionBank.ts`, `src/hooks/useStats.ts` (`ccaf_domain_stats` + `ccaf_exam_history`).
- [ ] T020 Add shadcn UI primitives in `src/components/ui/`: `button card badge progress separator switch alert-dialog accordion`. (depends T004,T007)
- [ ] T021 `src/App.tsx` view-state router (home | quiz | results) + `AppHeader` (title + lang toggle) in `src/components/layout/AppHeader.tsx`; clean `main.tsx`/remove boilerplate (`App.css`, demo assets). (depends T019,T020)

**Checkpoint**: Foundation ready — data, tokens, i18n, scoring, shell all in place.

---

## Phase 3: User Story 1 — Domain training + immediate/end feedback (P1) 🎯 MVP

**Goal**: Click a domain → answer → results with explanations; choose feedback timing.

- [ ] T022 [US1] `src/hooks/useQuiz.ts`: session state machine (start/answer/advance/exit), `ccaf_session` persistence, immediate vs end (300ms) flow, results computation. (depends T010,T016,T019)
- [ ] T023 [P] [US1] `src/components/quiz/OptionButton.tsx` (states: default/hover/selected/correct/wrong/unselected-correct; locked after answer) + `QuestionCard.tsx`.
- [ ] T024 [P] [US1] `src/components/quiz/ModePicker.tsx` (immediate/end cards + timer Switch default OFF) + `ExplanationBlock.tsx` (immediate only; `classifiedBy` note).
- [ ] T025 [US1] `src/components/quiz/QuizHeader.tsx` (exit + AlertDialog confirm, progress, counter, domain badge) + `src/screens/QuizScreen.tsx` wiring useQuiz. (depends T022–T024)
- [ ] T026 [P] [US1] `src/components/home/DomainCard.tsx` + `DomainGrid.tsx` (2-col, badges, accuracy pill, click → start domain session).
- [ ] T027 [P] [US1] `src/components/results/ScoreHero.tsx` (raw X/N % for non-60q), `QuestionReviewList.tsx` (accordion, your vs correct + explanation), `ResultsCTAs.tsx`; `src/screens/ResultsScreen.tsx`. (depends T019)
- [ ] T028 [US1] Keyboard shortcuts (A/B/C/D select, Enter next) in QuizScreen/useQuiz. (US9 folded in)

**Checkpoint**: A domain session runs end-to-end with results.

---

## Phase 4: User Story 2 — Weighted exams + scoring/history (P1)

**Goal**: 15/30/60 weighted exams; 60q → 100–1000 score, pass/fail, history.

- [ ] T029 [P] [US2] `src/components/home/ExamSizeCards.tsx` (15/30/60) + `MixedModeCard.tsx` (10/20/40, default 10).
- [ ] T030 [US2] Wire exam/mixed modes through `useQuiz` + `buildWeightedSample`; exam60 score path + `ccaf_exam_history` append in ResultsScreen mount. (depends T022,T010)
- [ ] T031 [P] [US2] `src/components/results/ScoreHero.tsx` 60q variant (100–1000 + PassFail badge + "corte 720 · X/60") and `DomainBreakdown.tsx` (colored bars, weakest flagged). (extends T027)
- [ ] T032 [P] [US2] `src/components/home/StatsBar.tsx` (best/last/exams-done from history) + unofficial-weights disclaimer line.

**Checkpoint**: Full exam simulation with tracked score.

---

## Phase 5: User Story 5 — Per-domain history & weakest insight (P2)

- [ ] T033 [P] [US5] `src/components/home/DomainHistoryTable.tsx` (attempts/correct/rate color/last-practiced; worst & best row accents). (depends T019)

---

## Phase 6: User Story 6 — Optional per-question timer (P2)

- [ ] T034 [US6] Timer in `useQuiz`: 120s/question, tick→`ccaf_session` (≤1/s), color thresholds, expiry=skip+advance, stop on answer, reset on advance, resume from stored remaining. (depends T022)
- [ ] T035 [P] [US6] `src/components/quiz/QuizTimer.tsx` (MM:SS, neutral/amber/red+pulse) in QuizHeader; results "time spent" column when timer was on. (depends T034)

---

## Phase 7: User Story 7 — Resume session (P3)

- [ ] T036 [US7] `src/components/home/ResumeSessionBanner.tsx` + Home wiring to detect `ccaf_session` and resume into QuizScreen. (depends T022)

---

## Phase 8: Polish & Cross-Cutting

- [ ] T037 `src/screens/HomeScreen.tsx` assembling all home sections (header, StatsBar, domain grid, exam cards, mixed, history, resume banner). (depends T026,T029,T032,T033,T036)
- [ ] T038 [P] Verify Principle V/VI in review: no font 600/700, no shadow, tokens only, no emoji in UI; disclaimers present on StatsBar + ScoreHero(60q) + history.
- [ ] T039 `tsc --noEmit` clean; `bun run build` (vite) succeeds; run quickstart.md smoke steps 3–9.
- [ ] T040 [P] Replace empty root `README.md` with a short app README (what it is, run, link to specs + CLAUDE.md).

---

## Dependencies & Execution Order

- **Phase 1 → Phase 2** (blocking) → **Phase 3 (MVP)** → Phases 4–7 (each independently testable) → **Phase 8**.
- Within Phase 2, T008–T013/T015/T018/T019 are `[P]` (distinct files); T014/T016/T017/T020/T021 have the noted deps.
- US2/US5/US6/US7 all build on the US1 `useQuiz` core (T022) but touch distinct files → parallelizable after T022.

## Parallel Example (Phase 2 foundation)

```text
T008 schema.ts · T009 utils/storage/time · T010 scoring.ts · T011 classify.ts
T012 parseRepoA/B · T013 dedupe.ts · T015 seed.ts · T018 i18n · T019 hooks
```

## Implementation Strategy

MVP = Phase 1 + 2 + 3 (domain session runnable). Then layer exams (P1 US2), history/timer/resume,
then polish + build verification.
