import { Clock } from 'lucide-react'

import { formatMMSS } from '@/lib/time'
import { cn } from '@/lib/utils'

export function QuizTimer({ seconds }: { seconds: number }) {
  const cls =
    seconds > 60
      ? 'text-muted-foreground'
      : seconds > 30
        ? 'text-amber-400'
        : 'text-destructive animate-pulse'
  return (
    <span className={cn('flex shrink-0 items-center gap-1 text-xs tabular-nums', cls)}>
      <Clock className="size-3.5" />
      {formatMMSS(seconds)}
    </span>
  )
}
