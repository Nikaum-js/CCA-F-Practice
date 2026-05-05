import { Check, X } from 'lucide-react'

import type { AnswerKey } from '@/data/schema'
import { cn } from '@/lib/utils'

export type OptionState = 'default' | 'selected' | 'correct' | 'wrong' | 'unselected-correct'

const STATE_CLASS: Record<OptionState, string> = {
  default: 'border-border bg-card shadow-card',
  selected: 'border-accent bg-accent/10 shadow-raised',
  correct: 'border-success bg-success/10 text-success shadow-raised',
  wrong: 'border-destructive bg-destructive/10 text-destructive shadow-raised',
  'unselected-correct': 'border-success/50 bg-success/5',
}

interface Props {
  letter: AnswerKey
  text: string
  state: OptionState
  disabled: boolean
  onClick: () => void
}

export function OptionButton({ letter, text, state, disabled, onClick }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-3.5 rounded-lg border px-4 py-3.5 text-left text-sm leading-relaxed outline-none transition-[colors,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-ring',
        STATE_CLASS[state],
      )}
    >
      <span className="mt-px flex size-6 shrink-0 items-center justify-center rounded-md border border-current text-xs font-semibold">
        {letter}
      </span>
      <span className="flex-1 pt-0.5 font-normal">{text}</span>
      {state === 'correct' && <Check className="mt-1 size-4 shrink-0" />}
      {state === 'wrong' && <X className="mt-1 size-4 shrink-0" />}
    </button>
  )
}
