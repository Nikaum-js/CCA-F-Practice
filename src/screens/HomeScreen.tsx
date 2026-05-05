import type { ReactNode } from 'react'

import { DomainGrid } from '@/components/home/DomainGrid'
import { DomainHistoryTable } from '@/components/home/DomainHistoryTable'
import { ExamSizeCards } from '@/components/home/ExamSizeCards'
import { MixedModeCard } from '@/components/home/MixedModeCard'
import { ResumeSessionBanner } from '@/components/home/ResumeSessionBanner'
import { StatsBar } from '@/components/home/StatsBar'
import type { ActiveSession, DomainKey, DomainStats, ExamResult } from '@/data/schema'
import { useTranslation } from '@/i18n/useTranslation'

interface Props {
  bankSize: number
  counts: Record<DomainKey, number>
  domainStats: DomainStats
  examHistory: ExamResult[]
  savedSession: ActiveSession | null
  onPickDomain: (domain: DomainKey) => void
  onPickExam: (size: 15 | 30 | 60) => void
  onStartMixed: (count: number) => void
  onResume: () => void
  onDiscardSaved: () => void
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-eyebrow font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function HomeScreen({
  bankSize,
  counts,
  domainStats,
  examHistory,
  savedSession,
  onPickDomain,
  onPickExam,
  onStartMixed,
  onResume,
  onDiscardSaved,
}: Props) {
  const { t } = useTranslation()

  return (
    <main className="mx-auto max-w-4xl space-y-12 px-4 pb-16">
      {savedSession && <ResumeSessionBanner onResume={onResume} onDiscard={onDiscardSaved} />}

      <StatsBar examHistory={examHistory} bankSize={bankSize} />

      <Section title={t('home.section.domains')}>
        <DomainGrid counts={counts} stats={domainStats} onPick={onPickDomain} />
      </Section>

      <Section title={t('home.section.exam')}>
        <ExamSizeCards onPick={onPickExam} />
      </Section>

      <Section title={t('home.section.mixed')}>
        <MixedModeCard onStart={onStartMixed} />
      </Section>

      <Section title={t('home.section.history')}>
        <DomainHistoryTable stats={domainStats} />
        <p className="text-xs text-muted-foreground">{t('disclaimer.unofficial')}</p>
      </Section>
    </main>
  )
}
