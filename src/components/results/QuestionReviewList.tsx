import { Check, Minus, X } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { AnswerKey, Question } from '@/data/schema'
import { useTranslation } from '@/i18n/useTranslation'
import { localizeQuestion } from '@/lib/localizeQuestion'
import { formatMMSS } from '@/lib/time'
import { cn } from '@/lib/utils'

interface Props {
  questions: Question[]
  answers: Record<string, AnswerKey | null>
  timeSpent: Record<string, number>
  timerWasOn: boolean
}

export function QuestionReviewList({ questions, answers, timeSpent, timerWasOn }: Props) {
  const { t, lang } = useTranslation()

  return (
    <Accordion type="multiple" className="w-full">
      {questions.map((src, i) => {
        const q = localizeQuestion(src, lang)
        const given = answers[q.id] ?? null
        const correct = given === q.correctKey
        const skipped = given === null

        return (
          <AccordionItem key={q.id} value={q.id}>
            <AccordionTrigger>
              <span className="flex min-w-0 flex-1 items-center gap-3">
                {skipped ? (
                  <Minus className="size-4 shrink-0 text-muted-foreground" />
                ) : correct ? (
                  <Check className="size-4 shrink-0 text-success" />
                ) : (
                  <X className="size-4 shrink-0 text-destructive" />
                )}
                <span className="truncate text-muted-foreground">
                  {i + 1}. {q.text}
                </span>
              </span>
              <span className="ml-2 hidden shrink-0 text-xs text-muted-foreground sm:inline">
                {t('results.your')}: {given ?? '—'} · {t('results.correct')}: {q.correctKey}
                {timerWasOn && q.id in timeSpent ? ` · ${formatMMSS(timeSpent[q.id])}` : ''}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="mb-3 text-sm">{q.text}</p>
              <div className="space-y-1.5">
                {q.options.map((o) => {
                  const isCorrect = o.key === q.correctKey
                  const isGiven = o.key === given
                  return (
                    <div
                      key={o.key}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm',
                        isCorrect && 'border-success/60 bg-success/10 text-success',
                        isGiven && !isCorrect && 'border-destructive/60 bg-destructive/10 text-destructive',
                        !isCorrect && !isGiven && 'border-border bg-card',
                      )}
                    >
                      <span className="font-mono text-xs font-bold">{o.key}</span>
                      <span className="flex-1 font-medium">{o.text}</span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 border-l-2 border-accent/70 py-1 pl-5">
                <div className="text-eyebrow font-medium uppercase tracking-[0.14em] text-accent">
                  {t('explanation.label')}
                </div>
                <p className="mt-2 text-15 leading-relaxed text-foreground/80">
                  {q.explanation}
                </p>
                {q.classifiedBy === 'auto' && (
                  <p className="mt-2 text-xs text-muted-foreground/80">{t('explanation.autoclass')}</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
