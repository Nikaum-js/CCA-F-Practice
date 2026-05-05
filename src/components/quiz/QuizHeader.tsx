import { ArrowLeft } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { QuizTimer } from '@/components/quiz/QuizTimer'
import { DOMAIN_META, type DomainKey } from '@/data/schema'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'

interface Props {
  index: number
  total: number
  domain: DomainKey
  timerEnabled: boolean
  timeRemaining: number | null
  onExit: () => void
}

export function QuizHeader({ index, total, domain, timerEnabled, timeRemaining, onExit }: Props) {
  const { t } = useTranslation()
  const meta = DOMAIN_META[domain]
  const progress = total > 0 ? Math.round((index / total) * 100) : 0

  return (
    <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="shrink-0">
              <ArrowLeft className="size-4" />
              {t('quiz.exit')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('quiz.exit.title')}</AlertDialogTitle>
              <AlertDialogDescription>{t('quiz.exit.desc')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('quiz.exit.keep')}</AlertDialogCancel>
              <AlertDialogAction onClick={onExit}>{t('quiz.exit.confirm')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Progress value={progress} className="flex-1" />

        <span className="whitespace-nowrap text-xs font-medium tabular-nums text-muted-foreground">
          {t('quiz.counter', { i: index + 1, n: total })}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-muted-foreground">
          <span className={cn('size-1.5 shrink-0 rounded-full', meta.color)} />
          {meta.id}
        </span>
        {timerEnabled && timeRemaining != null && <QuizTimer seconds={timeRemaining} />}
      </div>
    </div>
  )
}
