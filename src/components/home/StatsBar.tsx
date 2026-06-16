import { Card } from '@/components/ui/card'
import { PASS_SCORE, type ExamResult } from '@/data/schema'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'

const FLOOR = 100
const CEIL = 1000

// Position on the 100–1000 scale as a 0–100% width.
function pct(score: number): number {
  return Math.max(0, Math.min(100, ((score - FLOOR) / (CEIL - FLOOR)) * 100))
}

function ScoreStat({
  label,
  score,
  showBar,
}: {
  label: string
  score: number | null
  showBar?: boolean
}) {
  const passing = score != null && score >= PASS_SCORE
  return (
    <div className="flex flex-col gap-1.5 p-5">
      <span className="text-eyebrow font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span
          className={cn(
            'font-display text-4xl font-semibold leading-none tabular-nums',
            score == null
              ? 'text-muted-foreground'
              : passing
                ? 'text-success'
                : 'text-foreground',
          )}
        >
          {score != null ? score : '—'}
        </span>
        {score != null && <span className="text-sm text-muted-foreground">/ {CEIL}</span>}
      </div>
      {showBar && (
        <div className="relative mt-2.5">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                passing ? 'bg-success' : 'bg-accent',
              )}
              style={{ width: score != null ? `${pct(score)}%` : '0%' }}
            />
          </div>
          {/* cutoff marker (720) */}
          <div
            className="absolute -top-0.5 h-2.5 w-0.5 rounded-full bg-foreground/55"
            style={{ left: `${pct(PASS_SCORE)}%` }}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  )
}

function CountStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1.5 p-5">
      <span className="text-eyebrow font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <span className="font-display text-4xl font-semibold leading-none tabular-nums">{value}</span>
    </div>
  )
}

export function StatsBar({ examHistory, bankSize }: { examHistory: ExamResult[]; bankSize: number }) {
  const { t } = useTranslation()
  const best = examHistory.length ? Math.max(...examHistory.map((e) => e.score)) : null
  const last = examHistory.length ? examHistory[examHistory.length - 1].score : null

  return (
    <div className="space-y-3">
      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-[1.5fr_1fr_1fr] sm:divide-x sm:divide-y-0">
          <ScoreStat label={t('home.stats.best')} score={best} showBar />
          <ScoreStat label={t('home.stats.last')} score={last} />
          <CountStat label={t('home.stats.exams')} value={examHistory.length} />
        </div>
      </Card>
      <p className="text-xs text-muted-foreground">{t('home.stats.meta', { n: bankSize })}</p>
    </div>
  )
}
