import ptData from '@/data/questions.pt.json'
import type { AnswerKey, Question } from '@/data/schema'
import type { Lang } from '@/i18n/translations'

// Additive PT translation layer (Constitution III, v2.0.0): English is canonical and stored in the
// bank; PT translations live here, keyed by question `id`, and never overwrite the source. Any
// missing field falls back to the English original, so a partial/empty map is always safe.
export interface QuestionTranslation {
  text?: string
  options?: Partial<Record<AnswerKey, string>>
  explanation?: string
}

const ptMap = ptData as Record<string, QuestionTranslation>

export function hasTranslation(id: string): boolean {
  return Boolean(ptMap[id]?.text)
}

/**
 * Returns a Question with PT text/options/explanation when lang is 'pt' and a translation exists,
 * falling back to the canonical English per field. For any other lang, returns the question as-is.
 */
export function localizeQuestion(q: Question, lang: Lang): Question {
  if (lang !== 'pt') return q
  const tr = ptMap[q.id]
  if (!tr) return q
  return {
    ...q,
    text: tr.text || q.text,
    explanation: tr.explanation || q.explanation,
    options: q.options.map((o) => ({ ...o, text: tr.options?.[o.key] || o.text })),
  }
}
