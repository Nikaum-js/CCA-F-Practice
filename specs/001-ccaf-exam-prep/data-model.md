# Phase 1 — Data Model

All types live in `src/data/schema.ts`. No runtime DB — these are TS types plus `localStorage` shapes.

## DomainKey & DOMAIN_META

```ts
export type DomainKey =
  | 'agentic_architecture'   // D1 · weight 0.27
  | 'tools_mcp'              // D2 · weight 0.18
  | 'claude_code'            // D3 · weight 0.20
  | 'prompt_engineering'     // D4 · weight 0.20
  | 'context_management'     // D5 · weight 0.15

export interface DomainMeta {
  id: string        // 'D1'..'D5'
  slug: string      // 'AGENTIC' | 'TOOLS/MCP' | 'CLAUDE CODE' | 'PROMPTING' | 'CONTEXT'
  weight: number    // sums to 1.0 (UNOFFICIAL — community)
  color: string     // tailwind bg utility for the badge
  pt: string        // display name PT
  en: string        // display name EN
}
export const DOMAIN_META: Record<DomainKey, DomainMeta>
export const DOMAIN_ORDER: DomainKey[]  // D1..D5, used for tie-breaks
```

Badge colors: D1 `bg-violet-500`, D2 `bg-blue-400`, D3 `bg-emerald-400`, D4 `bg-orange-400`,
D5 `bg-zinc-400`.

## Question

```ts
export interface Question {
  id: string                       // sha1(normalizedText).slice(0,10)
  text: string                     // English, never translated
  options: { key: 'A'|'B'|'C'|'D'; text: string }[]
  correctKey: 'A'|'B'|'C'|'D'
  explanation: string
  domain: DomainKey
  classifiedBy: 'curated' | 'auto' // replaces the old domainCorrected flag
  difficulty: 'normal' | 'hard'    // metadata only, no UI
  source: 'mrKindly' | 'avidevelops' | 'merged'
}
```

**Validation**: exactly 4 options with distinct keys A–D; `correctKey` present in options; non-empty
`text` and `explanation`; `domain` ∈ DomainKey.

## Stats & results (localStorage)

```ts
export type DomainStats = Record<DomainKey, {
  attempted: number
  correct: number
  lastPracticed: string | null     // ISO date
}>

export interface ExamResult {
  id: string                       // uuid (crypto.randomUUID)
  date: string                     // ISO
  score: number                    // 100..1000
  passed: boolean                  // score >= 720
  perDomain: Record<DomainKey, { attempted: number; correct: number }>
}
```

## Session

```ts
export type SessionMode =
  | { type: 'domain'; domain: DomainKey }
  | { type: 'mixed' }
  | { type: 'exam'; size: 15 | 30 | 60 }

export type AnswerMode = 'immediate' | 'end'
export type AnswerKey = 'A'|'B'|'C'|'D'

export interface ActiveSession {
  mode: SessionMode
  questions: Question[]
  currentIndex: number
  answers: Record<string, AnswerKey | null>   // null = skipped (timer)
  timeSpent: Record<string, number>           // questionId → seconds spent (for results)
  answerMode: AnswerMode
  timerEnabled: boolean
  timeLimitSeconds: number | null             // 120 when enabled
  timeRemainingSeconds: number | null
  startedAt: string                           // ISO
}
```

## Derived: per-session result

Computed at results time from `ActiveSession`:
- `perDomain`: tally attempted/correct by each question's `domain`.
- `isExam60`: `mode.type === 'exam' && mode.size === 60`.
- score/pass only when `isExam60`.

## State transitions (session)

```
HOME ──pick mode──▶ MODE_PICKER ──start──▶ QUIZ(q0)
QUIZ(qi) ──answer/timeout──▶ (immediate: reveal → Next) | (end: 300ms) ──▶ QUIZ(qi+1)
QUIZ(last) ──advance──▶ RESULTS  (persist stats; persist exam history if exam60; clear ccaf_session)
QUIZ(any) ──exit(confirm)──▶ HOME (keep ccaf_session → resume banner)
```
