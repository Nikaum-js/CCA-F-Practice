import type { Question } from '@/data/schema'
import { useTranslation } from '@/i18n/useTranslation'
import { localizeQuestion } from '@/lib/localizeQuestion'

export function ExplanationBlock({ question }: { question: Question }) {
  const { t, lang } = useTranslation()
  const q = localizeQuestion(question, lang)
  return (
    <div className="mx-auto mt-6 max-w-2xl border-l-2 border-accent/70 py-1 pl-5">
      <div className="text-eyebrow font-medium uppercase tracking-[0.14em] text-accent">
        {t('explanation.label')}
      </div>
      <p className="mt-2 max-w-[64ch] text-15 leading-relaxed text-foreground/80">
        {q.explanation}
      </p>
      {question.classifiedBy === 'auto' && (
        <p className="mt-2 text-xs text-muted-foreground/80">{t('explanation.autoclass')}</p>
      )}
    </div>
  )
}
