import { AlertTriangle } from 'lucide-react'

import { DOMAIN_META, DOMAIN_ORDER, type DomainKey } from '@/data/schema'
import { useTranslation } from '@/i18n/useTranslation'
import { rateTextClass } from '@/lib/accuracy'
import { cn } from '@/lib/utils'

interface Props {
  perDomain: Record<DomainKey, { attempted: number; correct: number }>
  weakest: DomainKey | null
}

export function DomainBreakdown({ perDomain, weakest }: Props) {
  const { t } = useTranslation()
  const rows = DOMAIN_ORDER.filter((d) => perDomain[d].attempted > 0)

  return (
    <div className="space-y-3">
      {rows.map((d) => {
        const { attempted, correct } = perDomain[d]
        const rate = correct / attempted
        const meta = DOMAIN_META[d]
        return (
          <div key={d} className="flex items-center gap-3">
            <span className="flex w-28 shrink-0 items-center gap-1.5 font-mono text-xs font-semibold text-muted-foreground">
              <span className={cn('inline-block size-2 shrink-0 rounded-full', meta.color)} />
              {meta.id} {meta.slug}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full', meta.color)}
                style={{ width: `${Math.round(rate * 100)}%` }}
              />
            </div>
            <span
              className={cn(
                'w-12 shrink-0 text-right text-xs font-semibold tabular-nums',
                rateTextClass(rate),
              )}
            >
              {correct}/{attempted}
            </span>
            {d === weakest && (
              <AlertTriangle className="size-4 shrink-0 text-destructive" aria-label={t('results.weakest')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
