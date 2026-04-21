import { useCallback, useEffect, useRef, useState } from 'react'

import {
  TIMER_SECONDS,
  type ActiveSession,
  type AnswerKey,
  type AnswerMode,
  type Question,
  type SessionMode,
} from '@/data/schema'
import { storage } from '@/lib/storage'

export interface StartOptions {
  answerMode: AnswerMode
  timerEnabled: boolean
}

/*
  Owns the quiz session lifecycle, timer, and ccaf_session persistence. When the last question
  advances, it clears storage and calls onFinish(session) with the completed session so the
  caller can render results.
*/
export function useQuiz(onFinish: (session: ActiveSession) => void) {
  const [session, setSession] = useState<ActiveSession | null>(null)
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish

  const start = useCallback((mode: SessionMode, questions: Question[], opts: StartOptions) => {
    const s: ActiveSession = {
      mode,
      questions,
      currentIndex: 0,
      answers: {},
      timeSpent: {},
      answerMode: opts.answerMode,
      timerEnabled: opts.timerEnabled,
      timeLimitSeconds: opts.timerEnabled ? TIMER_SECONDS : null,
      timeRemainingSeconds: opts.timerEnabled ? TIMER_SECONDS : null,
      startedAt: new Date().toISOString(),
    }
    storage.setSession(s)
    setSession(s)
  }, [])

  const resume = useCallback((): boolean => {
    const s = storage.getSession()
    if (s) {
      setSession(s)
      return true
    }
    return false
  }, [])

  // Leave to home but keep the saved session for the resume banner.
  const leave = useCallback(() => setSession(null), [])

  // Permanently discard the saved session.
  const discard = useCallback(() => {
    storage.clearSession()
    setSession(null)
  }, [])

  const advance = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev
      const nextIndex = prev.currentIndex + 1
      if (nextIndex >= prev.questions.length) {
        storage.clearSession()
        onFinishRef.current(prev)
        return null
      }
      const next: ActiveSession = {
        ...prev,
        currentIndex: nextIndex,
        timeRemainingSeconds: prev.timerEnabled ? TIMER_SECONDS : null,
      }
      storage.setSession(next)
      return next
    })
  }, [])

  const answer = useCallback((key: AnswerKey) => {
    setSession((prev) => {
      if (!prev) return prev
      const q = prev.questions[prev.currentIndex]
      if (q.id in prev.answers) return prev // locked after first selection
      const spent =
        prev.timerEnabled && prev.timeRemainingSeconds != null
          ? TIMER_SECONDS - prev.timeRemainingSeconds
          : 0
      const next: ActiveSession = {
        ...prev,
        answers: { ...prev.answers, [q.id]: key },
        timeSpent: { ...prev.timeSpent, [q.id]: spent },
      }
      storage.setSession(next)
      return next
    })
  }, [])

  const current = session ? session.questions[session.currentIndex] : null
  const isAnswered = !!session && !!current && current.id in session.answers
  const selectedKey = session && current ? (session.answers[current.id] ?? null) : null
  const isSkipped = isAnswered && selectedKey === null
  const revealed = isAnswered && !!session && session.answerMode === 'immediate'

  // Per-question countdown. Ticks only while the current question is unanswered.
  useEffect(() => {
    if (!session || !session.timerEnabled || isAnswered) return
    const id = setInterval(() => {
      setSession((prev) => {
        if (!prev || !prev.timerEnabled) return prev
        const cur = prev.questions[prev.currentIndex]
        if (cur.id in prev.answers) return prev
        const remaining = (prev.timeRemainingSeconds ?? TIMER_SECONDS) - 1
        if (remaining <= 0) {
          // expiry → mark skipped (null), full time spent
          const skipped: ActiveSession = {
            ...prev,
            answers: { ...prev.answers, [cur.id]: null },
            timeSpent: { ...prev.timeSpent, [cur.id]: TIMER_SECONDS },
            timeRemainingSeconds: 0,
          }
          storage.setSession(skipped)
          return skipped
        }
        const next: ActiveSession = { ...prev, timeRemainingSeconds: remaining }
        storage.setSession(next)
        return next
      })
    }, 1000)
    return () => clearInterval(id)
  }, [session, isAnswered])

  return {
    session,
    current,
    index: session ? session.currentIndex : 0,
    total: session ? session.questions.length : 0,
    isAnswered,
    isSkipped,
    selectedKey,
    revealed,
    timerEnabled: !!session?.timerEnabled,
    timeRemaining: session?.timeRemainingSeconds ?? null,
    answerMode: session?.answerMode ?? 'immediate',
    start,
    resume,
    leave,
    discard,
    answer,
    advance,
  }
}
