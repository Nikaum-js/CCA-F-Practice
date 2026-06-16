import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'

type ExamSize = 15 | 30 | 60

interface Props {
  onPick: (size: ExamSize) => void
}

export function ExamSizeCards({ onPick }: Props) {
  const { t } = useTranslation()

  const cards: { size: ExamSize; title: string; sub: string; full?: boolean }[] = [
    { size: 15, title: t('exam.quick.title'), sub: t('exam.quick.sub') },
    { size: 30, title: t('exam.medium.title'), sub: t('exam.medium.sub') },
    { size: 60, title: t('exam.full.title'), sub: t('exam.full.sub'), full: true },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((c) => (
        <button
          key={c.size}
          type="button"
          onClick={() => onPick(c.size)}
          className="w-full rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Card
            className={cn(
              'h-full p-5 transition-[colors,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-raised',
              c.full ? 'border-accent/50 hover:border-accent' : 'hover:border-border',
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className={cn(
                  'font-display text-4xl font-semibold leading-none tabular-nums',
                  c.full && 'text-accent',
                )}
              >
                {c.size}
              </span>
              {c.full ? (
                <Badge>{t('exam.full.badge')}</Badge>
              ) : (
                <span className="text-eyebrow uppercase tracking-wider text-muted-foreground">
                  {t('exam.unit')}
                </span>
              )}
            </div>
            <div className="mt-4 text-15 font-semibold tracking-tight">{c.title}</div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.sub}</p>
          </Card>
        </button>
      ))}
    </div>
  )
}
