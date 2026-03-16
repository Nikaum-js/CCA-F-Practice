import type { AnswerKey, Question } from '../data/schema'

// A parsed-but-not-yet-finalized question (no id/domain/difficulty assigned).
export interface RawQuestion {
  text: string
  options: { key: AnswerKey; text: string }[]
  correctKey: AnswerKey
  explanation: string
  source: Question['source']
  hint?: string // source scenario/section title — a domain prior for classification
}
