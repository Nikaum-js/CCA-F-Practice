import { useState } from 'react'
import { Clock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import type { AnswerMode } from '@/data/schema'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'

interface Props {
  onStart: (opts: { answerMode: AnswerMode; timerEnabled: boolean }) => void
}

function ModeCard({
  active,
  title,
  sub,
  onClick,
}: {
  active: boolean
  title: string
  sub: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card
        className={cn(
          'h-full p-5 transition-[colors,box-shadow,transform] duration-150',
          active
            ? 'border-accent bg-accent/5'
            : 'hover:-translate-y-0.5 hover:border-border hover:shadow-raised',
        )}
      >
        <div className="text-15 font-semibold tracking-tight">{title}</div>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{sub}</p>
      </Card>
    </button>
  )
}

export function ModePicker({ onStart }: Props) {
  const { t } = useTranslation()
  const [answerMode, setAnswerMode] = useState<AnswerMode>('immediate')
  const [timerEnabled, setTimerEnabled] = useState(false)

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight">
        {t('modepicker.title')}
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ModeCard
          active={answerMode === 'immediate'}
          title={t('modepicker.immediate.title')}
          sub={t('modepicker.immediate.sub')}
          onClick={() => setAnswerMode('immediate')}
        />
        <ModeCard
          active={answerMode === 'end'}
          title={t('modepicker.end.title')}
          sub={t('modepicker.end.sub')}
          onClick={() => setAnswerMode('end')}
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock className="size-5 text-muted-foreground" />
          <div>
            <div className="text-sm">{t('modepicker.timer.title')}</div>
            <div className="text-xs text-muted-foreground">{t('modepicker.timer.sub')}</div>
          </div>
        </div>
        <Switch checked={timerEnabled} onCheckedChange={setTimerEnabled} />
      </div>

      <Button className="w-full" onClick={() => onStart({ answerMode, timerEnabled })}>
        {t('modepicker.start')}
      </Button>
    </div>
  )
}
