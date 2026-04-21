import {
  DOMAIN_META,
  DOMAIN_ORDER,
  PASS_SCORE,
  type DomainKey,
  type Question,
} from '@/data/schema'

export interface PerDomainTally {
  attempted: number
  correct: number
}

// 100–1000 weighted score (60-question exam only). UNOFFICIAL scale.
export function calculateExamScore(
  perDomain: Record<DomainKey, PerDomainTally>,
): number {
  let weightedAccuracy = 0
  for (const d of DOMAIN_ORDER) {
    const stats = perDomain[d]
    const accuracy = stats && stats.attempted > 0 ? stats.correct / stats.attempted : 0
    weightedAccuracy += accuracy * DOMAIN_META[d].weight
  }
  return Math.round(100 + weightedAccuracy * 900)
}

export function isPassing(score: number): boolean {
  return score >= PASS_SCORE
}

// Largest-remainder distribution of n seats across the 5 weighted domains (sums to n exactly).
export function domainDistribution(n: number): Record<DomainKey, number> {
  const ideal = DOMAIN_ORDER.map((d) => ({ d, raw: DOMAIN_META[d].weight * n }))
  const floors = ideal.map((x) => ({ ...x, floor: Math.floor(x.raw), rem: x.raw - Math.floor(x.raw) }))
  let used = floors.reduce((sum, x) => sum + x.floor, 0)
  let leftover = n - used
  // hand out leftover seats by largest remainder, ties broken by domain order
  const byRemainder = [...floors].sort(
    (a, b) => b.rem - a.rem || DOMAIN_ORDER.indexOf(a.d) - DOMAIN_ORDER.indexOf(b.d),
  )
  const counts = {} as Record<DomainKey, number>
  for (const x of floors) counts[x.d] = x.floor
  let i = 0
  while (leftover > 0 && byRemainder.length > 0) {
    counts[byRemainder[i % byRemainder.length].d] += 1
    leftover -= 1
    i += 1
  }
  void used
  return counts
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/*
  Build a weighted sample of size n from the bank, with no repeats.
  When a domain has fewer questions than its quota, use all it has and redistribute the
  shortfall to domains with spare questions (in domain order). Final total == min(n, bank size).
*/
export function buildWeightedSample(bank: Question[], n: number): Question[] {
  const byDomain = {} as Record<DomainKey, Question[]>
  for (const d of DOMAIN_ORDER) byDomain[d] = []
  for (const q of bank) if (byDomain[q.domain]) byDomain[q.domain].push(q)
  for (const d of DOMAIN_ORDER) byDomain[d] = shuffle(byDomain[d])

  const target = Math.min(n, bank.length)
  const quota = domainDistribution(target)

  const picked: Question[] = []
  const takenIds = new Set<string>()

  // first pass: take up to quota from each domain
  for (const d of DOMAIN_ORDER) {
    const take = Math.min(quota[d], byDomain[d].length)
    for (let i = 0; i < take; i++) {
      const q = byDomain[d][i]
      picked.push(q)
      takenIds.add(q.id)
    }
  }

  // redistribute shortfall: fill remaining seats from any domain with leftover questions
  let remaining = target - picked.length
  if (remaining > 0) {
    for (const d of DOMAIN_ORDER) {
      if (remaining <= 0) break
      for (const q of byDomain[d]) {
        if (remaining <= 0) break
        if (!takenIds.has(q.id)) {
          picked.push(q)
          takenIds.add(q.id)
          remaining -= 1
        }
      }
    }
  }

  return shuffle(picked)
}

/*
  Tally attempted/correct per domain. Every question shown in a finished session counts as
  attempted; a skipped (timed-out, null) answer counts as attempted-and-incorrect so that
  skipping never inflates accuracy. Questions the user never reached (not in `answers`) are
  ignored — relevant only if a session is scored before completion.
*/
export function tallyPerDomain(
  questions: Question[],
  answers: Record<string, string | null>,
): Record<DomainKey, PerDomainTally> {
  const per = {} as Record<DomainKey, PerDomainTally>
  for (const d of DOMAIN_ORDER) per[d] = { attempted: 0, correct: 0 }
  for (const q of questions) {
    if (!(q.id in answers)) continue // not reached
    per[q.domain].attempted += 1
    if (answers[q.id] === q.correctKey) per[q.domain].correct += 1
  }
  return per
}
