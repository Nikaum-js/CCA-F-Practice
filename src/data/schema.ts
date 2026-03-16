// Core data model for the CCA-F Exam Prep App.
// NOTE: domain weights / score scale / cutoff are COMMUNITY-SOURCED and NOT official Anthropic data.

export type DomainKey =
  | 'agentic_architecture' // D1 · Agentic Architecture & Orchestration — weight 27%
  | 'tools_mcp' // D2 · Tool Design & MCP Integration — weight 18%
  | 'claude_code' // D3 · Claude Code Configuration & Workflows — weight 20%
  | 'prompt_engineering' // D4 · Prompt Engineering & Structured Output — weight 20%
  | 'context_management' // D5 · Context Management & Reliability — weight 15%

export interface DomainMeta {
  id: string // 'D1'..'D5'
  slug: string // short tag for the badge, e.g. 'AGENTIC'
  weight: number // 0–1, sums to 1.0 (UNOFFICIAL)
  color: string // tailwind bg utility for the badge
  pt: string // full PT display name
  en: string // full EN display name
}

export const DOMAIN_META: Record<DomainKey, DomainMeta> = {
  agentic_architecture: {
    id: 'D1',
    slug: 'AGENTIC',
    weight: 0.27,
    color: 'bg-d1',
    pt: 'Arquitetura Agêntica & Orquestração',
    en: 'Agentic Architecture & Orchestration',
  },
  tools_mcp: {
    id: 'D2',
    slug: 'TOOLS/MCP',
    weight: 0.18,
    color: 'bg-d2',
    pt: 'Design de Tools & Integração MCP',
    en: 'Tool Design & MCP Integration',
  },
  claude_code: {
    id: 'D3',
    slug: 'CLAUDE CODE',
    weight: 0.2,
    color: 'bg-d3',
    pt: 'Claude Code · Config & Workflows',
    en: 'Claude Code Configuration & Workflows',
  },
  prompt_engineering: {
    id: 'D4',
    slug: 'PROMPTING',
    weight: 0.2,
    color: 'bg-d4',
    pt: 'Engenharia de Prompts & Output Estruturado',
    en: 'Prompt Engineering & Structured Output',
  },
  context_management: {
    id: 'D5',
    slug: 'CONTEXT',
    weight: 0.15,
    color: 'bg-d5',
    pt: 'Gestão de Contexto & Confiabilidade',
    en: 'Context Management & Reliability',
  },
}

// Stable iteration / tie-break order D1..D5.
export const DOMAIN_ORDER: DomainKey[] = [
  'agentic_architecture',
  'tools_mcp',
  'claude_code',
  'prompt_engineering',
  'context_management',
]

export type AnswerKey = 'A' | 'B' | 'C' | 'D'

export interface QuestionOption {
  key: AnswerKey
  text: string
}

export interface Question {
  id: string // sha1(normalizedText).slice(0,10)
  text: string // English, never translated
  options: QuestionOption[]
  correctKey: AnswerKey
  explanation: string
  domain: DomainKey
  classifiedBy: 'curated' | 'auto'
  difficulty: 'normal' | 'hard' // metadata only, no UI
  source: 'mrKindly' | 'avidevelops' | 'merged'
}

export type DomainStats = Record<
  DomainKey,
  {
    attempted: number
    correct: number
    lastPracticed: string | null // ISO date
  }
>

export interface ExamResult {
  id: string
  date: string // ISO
  score: number // 100..1000
  passed: boolean // score >= 720
  perDomain: Record<DomainKey, { attempted: number; correct: number }>
}

export type SessionMode =
  | { type: 'domain'; domain: DomainKey }
  | { type: 'mixed' }
  | { type: 'exam'; size: 15 | 30 | 60 }

export type AnswerMode = 'immediate' | 'end'

export interface ActiveSession {
  mode: SessionMode
  questions: Question[]
  currentIndex: number
  answers: Record<string, AnswerKey | null> // null = skipped (timer)
  timeSpent: Record<string, number> // questionId → seconds spent
  answerMode: AnswerMode
  timerEnabled: boolean
  timeLimitSeconds: number | null // 120 when enabled
  timeRemainingSeconds: number | null
  startedAt: string // ISO
}

export const TIMER_SECONDS = 120
export const PASS_SCORE = 720

export function emptyDomainStats(): DomainStats {
  return DOMAIN_ORDER.reduce((acc, d) => {
    acc[d] = { attempted: 0, correct: 0, lastPracticed: null }
    return acc
  }, {} as DomainStats)
}

export function emptyPerDomain(): Record<DomainKey, { attempted: number; correct: number }> {
  return DOMAIN_ORDER.reduce(
    (acc, d) => {
      acc[d] = { attempted: 0, correct: 0 }
      return acc
    },
    {} as Record<DomainKey, { attempted: number; correct: number }>,
  )
}
