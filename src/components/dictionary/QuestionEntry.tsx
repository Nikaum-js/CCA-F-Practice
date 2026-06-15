import { useState } from 'react'
import { Check, Eye, EyeOff, Languages } from 'lucide-react'

import { DOMAIN_META, type Question } from '@/data/schema'
import { useTranslation } from '@/i18n/useTranslation'
import { localizeQuestion } from '@/lib/localizeQuestion'
import { cn } from '@/lib/utils'

interface Props {
  question: Question
  index: number
  translated: boolean
  onToggle: () => void
}

export function QuestionEntry({ question, index, translated, onToggle }: Props) {
  const { t } = useTranslation()
  const meta = DOMAIN_META[question.domain]
  const pt = localizeQuestion(question, 'pt')

  const [revealed, setRevealed] = useState(false)

  // PT shown inline, directly under each English line, so translating is visible right where you read.
  const ptOption = (key: string) => pt.options.find((o) => o.key === key)?.text ?? ''

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-eyebrow uppercase tracking-[0.12em] text-muted-foreground">
          <span className={cn('size-2 rounded-full', meta.color)} aria-hidden />
          {index + 1}. {meta.id} · {meta.slug}
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            aria-pressed={revealed}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
              revealed
                ? 'border-accent bg-accent/10 text-foreground'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {revealed ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            {revealed ? t('dict.q.hideAnswer') : t('dict.q.showAnswer')}
          </button>
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={translated}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
              translated
                ? 'border-accent bg-accent/10 text-foreground'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            <Languages className="size-3.5" />
            {translated ? t('dict.q.hide') : t('dict.q.translate')}
          </button>
        </div>
      </div>

      {/* Stem: English (canonical) + PT directly beneath when translated */}
      <p className="mt-2.5 text-15 font-medium leading-relaxed text-foreground">{question.text}</p>
      {translated && (
        <p className="mt-1 text-15 italic leading-relaxed text-accent/90">{pt.text}</p>
      )}

      <ul className="mt-3 space-y-2">
        {question.options.map((o) => {
          const correct = revealed && o.key === question.correctKey
          return (
            <li key={o.key} className="flex items-start gap-2 text-sm leading-relaxed">
              <span
                className={cn('font-mono text-xs font-semibold', correct && 'text-success')}
              >
                {o.key}
              </span>
              <span className="flex-1">
                <span className={cn(correct ? 'text-success' : 'text-foreground/80')}>
                  {o.text}
                </span>
                {translated && (
                  <span className="mt-0.5 block italic text-accent/90">{ptOption(o.key)}</span>
                )}
              </span>
              {correct && (
                <Check className="mt-0.5 size-3.5 shrink-0 text-success" aria-label={t('dict.q.answer')} />
              )}
            </li>
          )
        })}
      </ul>

      {/* Answer + explanation, only when revealed; PT beneath when translated */}
      {revealed && (
        <div className="mt-3.5 border-l-2 border-accent/70 pl-4">
          <div className="text-eyebrow uppercase tracking-[0.14em] text-accent">
            {t('dict.q.answer')}: {question.correctKey} · {t('explanation.label')}
          </div>
          <p className="mt-1.5 text-15 leading-relaxed text-foreground/90">{question.explanation}</p>
          {translated && (
            <p className="mt-2 text-15 italic leading-relaxed text-accent/90">
              {pt.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
