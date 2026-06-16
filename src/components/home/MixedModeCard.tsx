import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'

const COUNTS = [10, 20, 40] as const

interface Props {
  onStart: (count: number) => void
}

export function MixedModeCard({ onStart }: Props) {
  const { t } = useTranslation()
  const [count, setCount] = useState<number>(10)

  return (
    <Card className="flex flex-col gap-4 p-5 transition-shadow duration-150 hover:shadow-raised sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-15 font-semibold tracking-tight">{t('mixed.title')}</div>
        <p className="mt-1 text-sm text-muted-foreground">{t('mixed.sub')}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="inline-flex rounded-full border border-border bg-card/50 p-0.5">
          {COUNTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCount(c)}
              className={cn(
                'rounded-full px-3.5 py-1 text-sm tabular-nums outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                count === c
                  ? 'bg-accent font-semibold text-accent-foreground shadow-card'
                  : 'font-medium text-muted-foreground hover:text-foreground',
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <Button onClick={() => onStart(count)}>{t('mixed.start')}</Button>
      </div>
    </Card>
  )
}
