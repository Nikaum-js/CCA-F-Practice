import { Card } from '@/components/ui/card'
import { DOMAIN_META, DOMAIN_ORDER, type DomainKey, type DomainStats } from '@/data/schema'
import { useTranslation } from '@/i18n/useTranslation'
import { rateBarClass, rateTextClass } from '@/lib/accuracy'
import { relativeDate } from '@/lib/time'
import { cn } from '@/lib/utils'

export function DomainHistoryTable({ stats }: { stats: DomainStats }) {
  const { t, lang } = useTranslation()

  const rate = (d: DomainKey): number | null =>
    stats[d].attempted > 0 ? stats[d].correct / stats[d].attempted : null

  const practiced = DOMAIN_ORDER.filter((d) => stats[d].attempted > 0)
  let worst: DomainKey | null = null
  let best: DomainKey | null = null
  for (const d of practiced) {
    const r = rate(d)!
    if (worst === null || r < rate(worst)!) worst = d
    if (best === null || r > rate(best)!) best = d
  }

  if (practiced.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('history.empty')}</p>
  }

  return (
    <Card className="overflow-hidden p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-eyebrow uppercase tracking-[0.1em] text-muted-foreground">
            <th className="px-4 py-3 text-left font-medium">{t('history.col.domain')}</th>
            <th className="px-4 py-3 text-right font-medium">{t('history.col.attempts')}</th>
            <th className="px-4 py-3 text-right font-medium">{t('history.col.correct')}</th>
            <th className="px-4 py-3 text-right font-medium">{t('history.col.rate')}</th>
            <th className="px-4 py-3 text-right font-medium">{t('history.col.last')}</th>
          </tr>
        </thead>
        <tbody>
          {DOMAIN_ORDER.map((d) => {
            const r = rate(d)
            const meta = DOMAIN_META[d]
            return (
              <tr
                key={d}
                className={cn(
                  'border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40',
                  d === worst && 'border-l-2 border-l-destructive',
                  d === best && best !== worst && 'border-l-2 border-l-success',
                )}
              >
                <td className="px-4 py-2.5">
                  <span
                    className={cn(
                      'mr-2 inline-block size-2 rounded-full align-middle',
                      meta.color,
                    )}
                  />
                  <span className="font-mono text-xs font-semibold text-muted-foreground">
                    {meta.id}
                  </span>{' '}
                  {meta[lang]}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums">{stats[d].attempted}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{stats[d].correct}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-2.5">
                    <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:block">
                      {r != null && (
                        <div
                          className={cn('h-full rounded-full', rateBarClass(r))}
                          style={{ width: `${Math.round(r * 100)}%` }}
                        />
                      )}
                    </div>
                    <span
                      className={cn(
                        'w-9 text-right font-semibold tabular-nums',
                        r != null && rateTextClass(r),
                      )}
                    >
                      {r != null ? `${Math.round(r * 100)}%` : '—'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right text-muted-foreground">
                  {relativeDate(stats[d].lastPracticed, lang)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Card>
  )
}
