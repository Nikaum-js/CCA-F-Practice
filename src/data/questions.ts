import type { Question } from './schema'
import generated from './questions.generated.json'
import { SEED_QUESTIONS } from './seed'

// Offline-first bank: prefer the build-time generated JSON; fall back to the embedded seed so the
// app is never empty (Constitution IV). No runtime network fetch.
const bank = generated as unknown as Question[]

export function loadQuestionBank(): Question[] {
  if (Array.isArray(bank) && bank.length > 0) return bank
  return SEED_QUESTIONS
}

export function isUsingSeed(): boolean {
  return !(Array.isArray(bank) && bank.length > 0)
}
