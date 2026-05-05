import { OptionButton, type OptionState } from '@/components/quiz/OptionButton'
import type { AnswerKey, Question } from '@/data/schema'
import { useTranslation } from '@/i18n/useTranslation'
import { localizeQuestion } from '@/lib/localizeQuestion'

interface Props {
  question: Question
  selectedKey: AnswerKey | null
  pendingKey: AnswerKey | null
  revealed: boolean
  locked: boolean
  onSelect: (key: AnswerKey) => void
}

export function QuestionCard({
  question,
  selectedKey,
  pendingKey,
  revealed,
  locked,
  onSelect,
}: Props) {
  const { lang } = useTranslation()
  const q = localizeQuestion(question, lang)
  return (
    <div className="mx-auto max-w-2xl">
      <p className="max-w-[62ch] text-lg font-medium leading-relaxed tracking-tight text-foreground">
        {q.text}
      </p>
      <div className="mt-7 space-y-2.5">
        {q.options.map((o) => {
          let state: OptionState = 'default'
          if (revealed) {
            if (o.key === question.correctKey) {
              state = o.key === selectedKey ? 'correct' : 'unselected-correct'
            } else if (o.key === selectedKey) {
              state = 'wrong'
            }
          } else if (o.key === pendingKey) {
            // pre-confirm highlight: a click only marks the choice as pending
            state = 'selected'
          }
          return (
            <OptionButton
              key={o.key}
              letter={o.key}
              text={o.text}
              state={state}
              disabled={locked}
              onClick={() => onSelect(o.key)}
            />
          )
        })}
      </div>
    </div>
  )
}
