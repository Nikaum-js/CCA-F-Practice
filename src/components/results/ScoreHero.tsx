import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'

interface Props {
  isExam60: boolean
  score: number
  passed: boolean
  correct: number
  total: number
}

export function ScoreHero({ isExam60, score, passed, correct, total }: Props) {
  const { t } = useTranslation()

  if (isExam60) {
    return (
      <div className="flex flex-col items-start gap-4 py-4">
        <div className="text-eyebrow font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t('results.scoreLabel')}
        </div>
        <div className="flex items-end gap-5">
          <div
            className={cn(
              'font-display text-7xl font-semibold leading-none tracking-tight tabular-nums sm:text-8xl',
              passed ? 'text-success' : 'text-destructive',
            )}
          >
            {score}
          </div>
          <span
            className={cn(
              'mb-2 inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wide',
              passed
                ? 'bg-success text-success-foreground'
                : 'bg-destructive text-destructive-foreground',
            )}
          >
            {passed ? t('results.passed') : t('results.failed')}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">{t('results.cut', { correct, total })}</div>
      </div>
    )
  }

  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  return (
    <div className="flex items-end gap-5 py-4">
      <div className="font-display text-7xl font-semibold leading-none tracking-tight tabular-nums">
        {correct}
        <span className="text-muted-foreground">/{total}</span>
      </div>
      <div className="mb-2 text-lg font-semibold tabular-nums text-muted-foreground">{pct}%</div>
    </div>
  )
}
