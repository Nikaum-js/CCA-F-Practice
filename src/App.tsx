import { useMemo, useState } from 'react'

import { AppHeader } from '@/components/layout/AppHeader'
import { ModePicker } from '@/components/quiz/ModePicker'
import { DictionaryScreen } from '@/screens/DictionaryScreen'
import { HomeScreen } from '@/screens/HomeScreen'
import { QuizScreen } from '@/screens/QuizScreen'
import { ResultsScreen } from '@/screens/ResultsScreen'
import { DOMAIN_ORDER, type ActiveSession, type DomainKey, type SessionMode } from '@/data/schema'
import { useQuestionBank } from '@/hooks/useQuestionBank'
import { useQuiz, type StartOptions } from '@/hooks/useQuiz'
import { useStats } from '@/hooks/useStats'
import { buildWeightedSample, calculateExamScore, isPassing, tallyPerDomain } from '@/lib/scoring'
import { storage } from '@/lib/storage'

type View = 'home' | 'picker' | 'quiz' | 'results' | 'dictionary'

interface Pending {
  mode: SessionMode
  count?: number
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function App() {
  const bank = useQuestionBank()
  const { domainStats, examHistory, recordSession, recordExam } = useStats()

  const [view, setView] = useState<View>('home')
  const [pending, setPending] = useState<Pending | null>(null)
  const [completed, setCompleted] = useState<ActiveSession | null>(null)
  // bumped whenever we return home so the resume banner re-reads localStorage
  const [homeKey, setHomeKey] = useState(0)

  const counts = useMemo(() => {
    const c = {} as Record<DomainKey, number>
    for (const d of DOMAIN_ORDER) c[d] = 0
    for (const q of bank) if (c[q.domain] != null) c[q.domain] += 1
    return c
  }, [bank])

  const handleFinish = (session: ActiveSession) => {
    recordSession(session.questions, session.answers)
    if (session.mode.type === 'exam' && session.mode.size === 60) {
      const per = tallyPerDomain(session.questions, session.answers)
      const score = calculateExamScore(per)
      recordExam({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        score,
        passed: isPassing(score),
        perDomain: per,
      })
    }
    setCompleted(session)
    setView('results')
  }

  const quiz = useQuiz(handleFinish)

  const buildQuestions = (p: Pending) => {
    if (p.mode.type === 'domain') {
      const domain = p.mode.domain
      return shuffle(bank.filter((q) => q.domain === domain))
    }
    if (p.mode.type === 'mixed') {
      return shuffle(bank).slice(0, p.count ?? 10)
    }
    return buildWeightedSample(bank, p.mode.size)
  }

  const goHome = () => {
    setPending(null)
    setCompleted(null)
    setHomeKey((k) => k + 1)
    setView('home')
  }

  const startPending = (p: Pending, opts: StartOptions) => {
    const questions = buildQuestions(p)
    if (questions.length === 0) {
      goHome()
      return
    }
    quiz.start(p.mode, questions, opts)
    setView('quiz')
  }

  const goToPicker = (p: Pending) => {
    setPending(p)
    setCompleted(null)
    setView('picker')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4">
        <AppHeader
          active={view === 'dictionary' ? 'dictionary' : 'home'}
          onNavigate={(target) => (target === 'dictionary' ? setView('dictionary') : goHome())}
        />
      </div>

      {view === 'dictionary' && <DictionaryScreen />}

      {view === 'home' && (
        <HomeScreen
          key={homeKey}
          bankSize={bank.length}
          counts={counts}
          domainStats={domainStats}
          examHistory={examHistory}
          savedSession={storage.getSession()}
          onPickDomain={(domain) => goToPicker({ mode: { type: 'domain', domain } })}
          onPickExam={(size) => goToPicker({ mode: { type: 'exam', size } })}
          onStartMixed={(count) => goToPicker({ mode: { type: 'mixed' }, count })}
          onResume={() => {
            if (quiz.resume()) setView('quiz')
          }}
          onDiscardSaved={() => {
            storage.clearSession()
            setHomeKey((k) => k + 1)
          }}
        />
      )}

      {view === 'picker' && pending && (
        <div>
          <ModePicker onStart={(opts) => startPending(pending, opts)} />
          <div className="mx-auto max-w-2xl px-4 pb-8">
            <button
              type="button"
              onClick={goHome}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ← Home
            </button>
          </div>
        </div>
      )}

      {view === 'quiz' && quiz.session && <QuizScreen quiz={quiz} onExit={() => {
        quiz.leave()
        goHome()
      }} />}

      {view === 'results' && completed && (
        <ResultsScreen
          session={completed}
          onTrainWeakest={(domain) => goToPicker({ mode: { type: 'domain', domain } })}
          onNewExam={() => goToPicker({ mode: { type: 'exam', size: 60 } })}
          onHome={goHome}
        />
      )}
    </div>
  )
}
