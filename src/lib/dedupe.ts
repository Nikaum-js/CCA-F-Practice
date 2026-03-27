import type { RawQuestion } from './sourceTypes'

export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/*
  Deduplicate by normalized question text. When two questions collide, keep the one with the
  longer explanation; if they came from different sources, mark the survivor `source: 'merged'`.
*/
export function dedupe(raws: RawQuestion[]): RawQuestion[] {
  const byKey = new Map<string, RawQuestion>()
  for (const q of raws) {
    const key = normalizeText(q.text)
    const existing = byKey.get(key)
    if (!existing) {
      byKey.set(key, q)
      continue
    }
    const survivor = q.explanation.length > existing.explanation.length ? q : existing
    const merged: RawQuestion = {
      ...survivor,
      source: existing.source !== q.source ? 'merged' : survivor.source,
    }
    byKey.set(key, merged)
  }
  return [...byKey.values()]
}
