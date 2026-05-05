import { Card } from '@/components/ui/card'
import { DOMAIN_META, type DomainKey } from '@/data/schema'
import { useTranslation } from '@/i18n/useTranslation'
import { rateTextClass } from '@/lib/accuracy'
import { cn } from '@/lib/utils'

interface Props {
  domain: DomainKey
  count: number
  attempted: number
  correct: number
  onClick: () => void
}

export function DomainCard({ domain, count, attempted, correct, onClick }: Props) {
  const meta = DOMAIN_META[domain]
  const { t, lang } = useTranslation()
  const rate = attempted > 0 ? correct / attempted : null
  // meta.color is `bg-dN`; derive matching dot/rule accent tokens.
  const dotColor = meta.color
  const ruleColor = meta.color.replace('bg-', 'border-l-')

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
      disabled={count === 0}
    >
      <Card
        className={cn(
          'h-full border-l-2 p-5 transition-[colors,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:border-border hover:shadow-raised disabled:opacity-50',
          ruleColor,
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="flex items-center gap-2 font-mono text-eyebrow font-medium uppercase tracking-wider text-muted-foreground">
            <span className={cn('size-1.5 shrink-0 rounded-full', dotColor)} />
            {meta.id} · {meta.slug}
          </span>
          {rate !== null ? (
            <span className={cn('text-xs font-semibold tabular-nums', rateTextClass(rate))}>
              {correct}/{attempted}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
        <div className="mt-3 text-15 font-semibold leading-snug tracking-tight">
          {meta[lang]}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          {t('domain.meta', { n: count, w: Math.round(meta.weight * 100) })}
        </div>
      </Card>
    </button>
  )
}
