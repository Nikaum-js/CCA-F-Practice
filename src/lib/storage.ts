// Typed, crash-safe localStorage access for ccaf_* keys. Reads never throw to the UI.

import type {
  ActiveSession,
  DomainStats,
  ExamResult,
  Question,
} from '@/data/schema'
import { emptyDomainStats } from '@/data/schema'

export type Lang = 'pt' | 'en'

const KEYS = {
  questions: 'ccaf_questions',
  lang: 'ccaf_lang',
  domainStats: 'ccaf_domain_stats',
  examHistory: 'ccaf_exam_history',
  session: 'ccaf_session',
} as const

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null || raw === '') return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full / unavailable — ignore */
  }
}

export const storage = {
  getQuestions: () => read<Question[]>(KEYS.questions, []),
  setQuestions: (q: Question[]) => write(KEYS.questions, q),

  getLang: () => read<Lang>(KEYS.lang, 'pt'),
  setLang: (l: Lang) => write(KEYS.lang, l),

  getDomainStats: () => read<DomainStats>(KEYS.domainStats, emptyDomainStats()),
  setDomainStats: (s: DomainStats) => write(KEYS.domainStats, s),

  getExamHistory: () => read<ExamResult[]>(KEYS.examHistory, []),
  setExamHistory: (h: ExamResult[]) => write(KEYS.examHistory, h),

  getSession: () => read<ActiveSession | null>(KEYS.session, null),
  setSession: (s: ActiveSession | null) => write(KEYS.session, s),
  clearSession: () => write(KEYS.session, null),
}
