# Implementation Plan: CCA-F Exam Prep App

**Branch**: `001-ccaf-exam-prep` | **Date**: 2026-06-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-ccaf-exam-prep/spec.md`

## Summary

A single-page, offline-first React 19 + TypeScript app for CCA-F exam prep. State lives entirely in
`localStorage`; there is no backend. The question bank is **pre-compiled at build time** by a Bun
script that fetches two source READMEs, parses each with a bespoke parser, deduplicates, classifies
each question into one of five domains, and emits `src/data/questions.generated.json`, which the app
imports. UI is bilingual (PT/EN) with all chrome strings centralized; questions stay English. Styling
is Tailwind v4 (`@theme`, OKLCH, dark zinc) + shadcn/ui.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 19, Node-compatible Bun runtime for build scripts.

**Primary Dependencies**: React 19, Vite (bundler, run via Bun), Tailwind CSS v4 (`@tailwindcss/vite`),
shadcn/ui (Radix + lucide-react + class-variance-authority + clsx + tailwind-merge), `tw-animate-css`.

**Storage**: Browser `localStorage` only (keys `ccaf_*`). No DB, no network at runtime.

**Testing**: `tsc --noEmit` as the primary gate; Vitest optional for `scoring.ts`/parsers (P3).

**Target Platform**: Modern evergreen browsers (responsive web). Desktop-first, mobile-friendly.

**Project Type**: Client-side single-page application (no router; view via React state).

**Performance Goals**: Instant interactions (<16ms render budget); cold load usable offline.

**Constraints**: Offline-capable after first load; no runtime network requirement; Inter 400/500 only;
no font-weight 600/700 in quiz flow; no box-shadow; colors only from tokens; no emojis in production UI.

**Scale/Scope**: 1 user; ~85–90 questions; 3 screens; ~15 components; 5 hooks; 5 domains.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|---|---|---|
| I. Client-Side Only | No backend/auth; state only in `localStorage`; no Zustand/Redux | ✅ React state + `localStorage` hooks only |
| II. i18n Mandatory | All UI strings from `translations`; no hardcoded PT/EN in JSX | ✅ `useTranslation()` + `translations.ts` |
| III. Questions English | Question/option text never translated | ✅ Rendered raw from data; only chrome translated |
| IV. Offline-First Data | Pre-compiled bank; seed fallback; no required runtime fetch | ✅ `build-questions.ts` → `questions.generated.json` + `seed.ts` |
| V. Locked Tokens | Inter 400/500; no 600/700; no shadow; tokens only; no emoji | ✅ `@theme` OKLCH tokens; lint rule in review |
| VI. Unofficial Weights | Unofficial label wherever weights/scale/cutoff shown | ✅ Disclaimer in StatsBar + Results + ScoreHero |
| VII. Spec-Driven | This plan derives from the approved spec | ✅ |

**Result: PASS.** No violations → Complexity Tracking left empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-ccaf-exam-prep/
├── plan.md              # This file
├── spec.md              # Approved spec
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   ├── parsers.md       # Source markdown → Question contract (per repo)
│   └── storage.md       # localStorage schema contract
├── checklists/requirements.md
└── tasks.md             # Created by /speckit-tasks
```

### Source Code (repository root)

```text
scripts/
  build-questions.ts        # Bun: fetch → parse → dedupe → classify → write generated JSON
src/
  i18n/
    translations.ts         # PT + EN strings; TranslationMap type; key catalog
    useTranslation.ts       # t(key) bound to active language
  data/
    schema.ts               # DomainKey, DOMAIN_META, Question, Stats, Session, Result types
    seed.ts                 # 10 fallback questions (2 per domain)
    questions.generated.json# Build output (committed)
    questions.ts            # loadQuestionBank(): import generated, else seed; LS cache
  lib/
    utils.ts                # cn() (shadcn)
    scoring.ts              # calculateExamScore, buildWeightedSample, distribution
    classify.ts             # keyword scorer + curation overrides (shared by build + tests)
    parseRepoA.ts           # bespoke parser (mrKindly)
    parseRepoB.ts           # bespoke parser (avidevelops)
    dedupe.ts               # normalize + merge
    storage.ts              # typed localStorage get/set helpers (ccaf_* keys)
    time.ts                 # relative date, MM:SS formatting
  hooks/
    useLang.ts              # ccaf_lang
    useQuestionBank.ts      # load + memo the bank
    useStats.ts             # ccaf_domain_stats + ccaf_exam_history
    useQuiz.ts              # session state machine + ccaf_session persistence + timer
  components/
    ui/                     # shadcn primitives (button card badge progress separator switch alert-dialog accordion)
    layout/AppHeader.tsx
    home/{StatsBar,DomainGrid,DomainCard,ExamSizeCards,MixedModeCard,DomainHistoryTable,ResumeSessionBanner}.tsx
    quiz/{QuizHeader,QuestionCard,OptionButton,ExplanationBlock,ModePicker,QuizTimer}.tsx
    results/{ScoreHero,DomainBreakdown,QuestionReviewList,ResultsCTAs}.tsx
  screens/{HomeScreen,QuizScreen,ResultsScreen}.tsx
  App.tsx                   # view router via React state
  main.tsx
  index.css                 # @import tailwindcss; @theme tokens; Inter
```

**Structure Decision**: Single client-side project. `scripts/` holds the build-time data pipeline;
`src/lib/` holds pure, testable logic (scoring, parsers, classify) reused by both the build script and
the app. No `tests/` tree required for MVP (tsc is the gate); pure modules are structured to allow
adding Vitest later.

## Phase notes

- **Phase 0 (research.md)**: stack feasibility + source formats already resolved via investigation;
  consolidated as decisions.
- **Phase 1 (data-model.md, contracts/, quickstart.md)**: entities, parser contracts, storage schema,
  and a run/verify guide.
- **Phase 2 (tasks.md)**: produced by `/speckit-tasks`.

## Key algorithms

### Weighted sampling — `buildWeightedSample(bank, n)`
1. Ideal per-domain count = `weight * n`; take floor; distribute leftover seats by **largest
   remainder** (ties broken by domain order D1→D5).
2. For each domain, draw `min(quota, available)` unique questions (shuffled).
3. **Shortfall redistribution**: sum unmet seats; redistribute to domains with spare questions in
   weight order, one pass, until total = `n` or no spare remains. No repeats within a session.
4. Shuffle the final list (mixed/exam) or keep domain order as needed.

### Exam score — `calculateExamScore(perDomain)`
`round(100 + Σ(domain_accuracy × DOMAIN_META[d].weight) × 900)`; pass = score ≥ 720. 60q only.

### Classification — `classifyDomain(text)` + overrides
Keyword scoring over question+options (per the spec's keyword table) yields a best domain; ties and
zero-score fall back to domain order then source grouping. A `DOMAIN_OVERRIDES: Record<questionId,
DomainKey>` map lets Nikolas curate; overridden questions get `classifiedBy: 'curated'`, others
`'auto'`. The generated JSON is the reviewable artifact (Principle IV/Clarification: curation is the
authority).

## Complexity Tracking

*No constitution violations — section intentionally empty.*
