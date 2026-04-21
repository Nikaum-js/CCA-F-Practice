import { useCallback, useState } from 'react'

import {
  DOMAIN_ORDER,
  emptyDomainStats,
  type AnswerKey,
  type DomainStats,
  type ExamResult,
  type Question,
} from '@/data/schema'
import { storage } from '@/lib/storage'

function withAllDomains(stored: DomainStats): DomainStats {
  const base = emptyDomainStats()
  for (const d of DOMAIN_ORDER) {
    if (stored[d]) base[d] = { ...stored[d] }
  }
  return base
}

export function useStats() {
  const [domainStats, setDomainStats] = useState<DomainStats>(() =>
    withAllDomains(storage.getDomainStats()),
  )
  const [examHistory, setExamHistory] = useState<ExamResult[]>(() => storage.getExamHistory())

  // Update per-domain stats for every question reached in a finished session (all modes).
  const recordSession = useCallback(
    (questions: Question[], answers: Record<string, AnswerKey | null>) => {
      setDomainStats((prev) => {
        const next = withAllDomains(prev)
        const today = new Date().toISOString()
        for (const q of questions) {
          if (!(q.id in answers)) continue
          const s = next[q.domain]
          s.attempted += 1
          if (answers[q.id] === q.correctKey) s.correct += 1
          s.lastPracticed = today
        }
        storage.setDomainStats(next)
        return next
      })
    },
    [],
  )

  // Append an exam run (60-question mode only).
  const recordExam = useCallback((result: ExamResult) => {
    setExamHistory((prev) => {
      const next = [...prev, result]
      storage.setExamHistory(next)
      return next
    })
  }, [])

  return { domainStats, examHistory, recordSession, recordExam }
}
