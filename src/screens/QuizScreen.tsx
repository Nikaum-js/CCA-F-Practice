import { useEffect, useState } from 'react'

import { ExplanationBlock } from '@/components/quiz/ExplanationBlock'
import { QuestionCard } from '@/components/quiz/QuestionCard'
import { QuizHeader } from '@/components/quiz/QuizHeader'
import { Button } from '@/components/ui/button'
import type { AnswerKey } from '@/data/schema'
import type { useQuiz } from '@/hooks/useQuiz'
import { useTranslation } from '@/i18n/useTranslation'

interface Props {
  quiz: ReturnType<typeof useQuiz>
  onExit: () => void
}

export function QuizScreen({ quiz, onExit }: Props) {
  const { t } = useTranslation()
  const { current, session, isAnswered, isSkipped, answerMode, index, total } = quiz

  // Pending selection: a click only highlights the option; the answer is committed solely on
  // "Confirmar", so a misclick never submits. Reset whenever the question changes.
  const [pendingKey, setPendingKey] = useState<AnswerKey | null>(null)
  useEffect(() => {
    setPendingKey(null)
  }, [index])

  const select = (k: AnswerKey) => {
    if (!isAnswered) setPendingKey(k)
  }
  const confirm = () => {
    if (pendingKey && !isAnswered) quiz.answer(pendingKey)
  }

  // Auto-advance: skipped → after 1s (show "time's up"); end mode answered → after 300ms.
  useEffect(() => {
    if (!isAnswered) return
    let delay: number | null = null
    if (isSkipped) delay = 1000
    else if (answerMode === 'end') delay = 300
    if (delay == null) return
    const id = setTimeout(() => quiz.advance(), delay)
    return () => clearTimeout(id)
  }, [isAnswered, isSkipped, answerMode, index, quiz])

  // Keyboard: A/B/C/D mark a pending choice; Enter confirms the pending answer, or (once answered in
  // immediate mode) advances to the next question.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!current) return
      const k = e.key.toUpperCase()
      if (['A', 'B', 'C', 'D'].includes(k) && !isAnswered) {
        setPendingKey(k as AnswerKey)
      } else if (e.key === 'Enter') {
        if (!isAnswered) {
          if (pendingKey) quiz.answer(pendingKey)
        } else if (!isSkipped && answerMode === 'immediate') {
          quiz.advance()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, isAnswered, isSkipped, answerMode, pendingKey, quiz])

  if (!current || !session) return null

  const isLast = index === total - 1
  const showConfirm = !isAnswered && !isSkipped && pendingKey != null
  const showNext = answerMode === 'immediate' && isAnswered && !isSkipped

  return (
    <div>
      <QuizHeader
        index={index}
        total={total}
        domain={current.domain}
        timerEnabled={quiz.timerEnabled}
        timeRemaining={quiz.timeRemaining}
        onExit={onExit}
      />
      <main className="px-4 py-8">
        <QuestionCard
          question={current}
          selectedKey={quiz.selectedKey}
          pendingKey={pendingKey}
          revealed={quiz.revealed}
          locked={isAnswered}
          onSelect={select}
        />

        {quiz.revealed && !isSkipped && <ExplanationBlock question={current} />}

        {isSkipped && (
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-destructive">
            {t('quiz.timeup')}
          </p>
        )}

        {showConfirm && (
          <div className="mx-auto mt-8 flex max-w-2xl justify-end">
            <Button size="lg" onClick={confirm}>
              {t('quiz.confirm')}
            </Button>
          </div>
        )}

        {showNext && (
          <div className="mx-auto mt-8 flex max-w-2xl justify-end">
            <Button size="lg" onClick={() => quiz.advance()}>
              {isLast ? t('quiz.finish') : t('quiz.next')}
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
