import { useMemo } from 'react'

import { DomainBreakdown } from '@/components/results/DomainBreakdown'
import { QuestionReviewList } from '@/components/results/QuestionReviewList'
import { ResultsCTAs } from '@/components/results/ResultsCTAs'
import { ScoreHero } from '@/components/results/ScoreHero'
import { DOMAIN_ORDER, type ActiveSession, type DomainKey } from '@/data/schema'
import { useTranslation } from '@/i18n/useTranslation'
import { calculateExamScore, isPassing, tallyPerDomain } from '@/lib/scoring'

interface Props {
  session: ActiveSession
  onTrainWeakest: (domain: DomainKey) => void
  onNewExam: () => void
  onHome: () => void
}

export function ResultsScreen({ session, onTrainWeakest, onNewExam, onHome }: Props) {
  const { t } = useTranslation()

  const per = useMemo(() => tallyPerDomain(session.questions, session.answers), [session])
  const isExam60 = session.mode.type === 'exam' && session.mode.size === 60
  const score = useMemo(() => calculateExamScore(per), [per])

  const correct = DOMAIN_ORDER.reduce((sum, d) => sum + per[d].correct, 0)
  const total = session.questions.length

  const weakest = useMemo(() => {
    let w: DomainKey | null = null
    for (const d of DOMAIN_ORDER) {
      if (per[d].attempted === 0) continue
      const r = per[d].correct / per[d].attempted
      if (w === null || r < per[w].correct / per[w].attempted) w = d
    }
    return w
  }, [per])

  return (
    <main className="mx-auto max-w-2xl space-y-10 px-4 py-8">
      <ScoreHero
        isExam60={isExam60}
        score={score}
        passed={isPassing(score)}
        correct={correct}
        total={total}
      />

      <section className="space-y-4 border-t border-border pt-8">
        <h3 className="text-eyebrow font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t('results.breakdown')}
        </h3>
        <DomainBreakdown perDomain={per} weakest={weakest} />
      </section>

      <ResultsCTAs
        weakest={weakest}
        onTrainWeakest={() => weakest && onTrainWeakest(weakest)}
        onNewExam={onNewExam}
        onHome={onHome}
      />

      <section className="space-y-3">
        <h3 className="text-eyebrow font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t('results.review')}
        </h3>
        <QuestionReviewList
          questions={session.questions}
          answers={session.answers}
          timeSpent={session.timeSpent}
          timerWasOn={session.timerEnabled}
        />
      </section>
    </main>
  )
}
