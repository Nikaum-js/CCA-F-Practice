import { Card } from '@/components/ui/card'
import type { ExamResult } from '@/data/schema'
import { useTranslation } from '@/i18n/useTranslation'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-eyebrow font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <span className="font-display text-3xl font-semibold leading-none tabular-nums">{value}</span>
    </div>
  )
}

export function StatsBar({ examHistory, bankSize }: { examHistory: ExamResult[]; bankSize: number }) {
  const { t } = useTranslation()
  const best = examHistory.length ? Math.max(...examHistory.map((e) => e.score)) : null
  const last = examHistory.length ? examHistory[examHistory.length - 1].score : null

  return (
    <div className="space-y-3">
      <Card className="grid grid-cols-3 divide-x divide-border p-0">
        <div className="px-5 py-5">
          <Stat label={t('home.stats.best')} value={best != null ? String(best) : '—'} />
        </div>
        <div className="px-5 py-5">
          <Stat label={t('home.stats.last')} value={last != null ? String(last) : '—'} />
        </div>
        <div className="px-5 py-5">
          <Stat label={t('home.stats.exams')} value={String(examHistory.length)} />
        </div>
      </Card>
      <p className="text-xs text-muted-foreground">{t('home.stats.meta', { n: bankSize })}</p>
    </div>
  )
}
