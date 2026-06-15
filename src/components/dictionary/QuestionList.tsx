import { useMemo, useState } from 'react'
import { Languages } from 'lucide-react'

import { DictionarySearch } from '@/components/dictionary/DictionarySearch'
import { QuestionEntry } from '@/components/dictionary/QuestionEntry'
import { loadQuestionBank } from '@/data/questions'
import { DOMAIN_META, DOMAIN_ORDER, type DomainKey } from '@/data/schema'
import { useTranslation } from '@/i18n/useTranslation'
import { localizeQuestion } from '@/lib/localizeQuestion'
import { cn } from '@/lib/utils'

const QUESTIONS = loadQuestionBank()

type DomainFilter = DomainKey | 'all'

export function QuestionList() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState<DomainFilter>('all')
  const [translatedIds, setTranslatedIds] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return QUESTIONS.filter((item) => {
      if (domain !== 'all' && item.domain !== domain) return false
      if (!q) return true
      const pt = localizeQuestion(item, 'pt')
      const hay = `${item.text} ${item.options.map((o) => o.text).join(' ')} ${pt.text} ${pt.options
        .map((o) => o.text)
        .join(' ')}`.toLowerCase()
      return hay.includes(q)
    })
  }, [query, domain])

  const allTranslated = filtered.length > 0 && filtered.every((qn) => translatedIds.has(qn.id))

  const toggleOne = (id: string) =>
    setTranslatedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const toggleAll = () =>
    setTranslatedIds((prev) => {
      const next = new Set(prev)
      if (allTranslated) filtered.forEach((qn) => next.delete(qn.id))
      else filtered.forEach((qn) => next.add(qn.id))
      return next
    })

  const chips: { key: DomainFilter; label: string; dot?: string }[] = [
    { key: 'all', label: t('dict.q.allDomains') },
    ...DOMAIN_ORDER.map((d) => ({ key: d as DomainFilter, label: DOMAIN_META[d].id, dot: DOMAIN_META[d].color })),
  ]

  return (
    <div className="space-y-4">
      <DictionarySearch value={query} onChange={setQuery} placeholder={t('dict.q.search')} />

      <div className="flex flex-wrap items-center gap-2">
        {chips.map((chip) => {
          const isActive = chip.key === domain
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => setDomain(chip.key)}
              aria-pressed={isActive}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'border-accent bg-accent/10 text-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {chip.dot && <span className={cn('size-2 rounded-full', chip.dot)} aria-hidden />}
              {chip.label}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-muted-foreground">
          {t('dict.q.count', { n: filtered.length })}
        </p>
        {filtered.length > 0 && (
          <button
            type="button"
            onClick={toggleAll}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Languages className="size-3.5" />
            {allTranslated ? t('dict.q.hideAll') : t('dict.q.translateAll')}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('dict.q.empty')}</p>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((qn, i) => (
            <QuestionEntry
              key={qn.id}
              question={qn}
              index={i}
              translated={translatedIds.has(qn.id)}
              onToggle={() => toggleOne(qn.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
