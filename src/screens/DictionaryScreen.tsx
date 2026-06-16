import { useMemo, useState } from 'react'

import { CategoryFilter, type CategoryFilterValue } from '@/components/dictionary/CategoryFilter'
import { DictionarySearch } from '@/components/dictionary/DictionarySearch'
import { QuestionList } from '@/components/dictionary/QuestionList'
import { TermCard } from '@/components/dictionary/TermCard'
import {
  DICTIONARY_CATEGORIES,
  DICTIONARY_TERMS,
  type DictionaryCategoryKey,
} from '@/data/dictionary'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'

type DictTab = 'terms' | 'questions'

export function DictionaryScreen() {
  const { t, lang } = useTranslation()
  const [tab, setTab] = useState<DictTab>('terms')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilterValue>('all')

  const categoryLabel = useMemo(() => {
    const m = {} as Record<DictionaryCategoryKey, string>
    for (const c of DICTIONARY_CATEGORIES) m[c.key] = lang === 'pt' ? c.pt : c.en
    return m
  }, [lang])

  const counts = useMemo(() => {
    const m = {} as Record<DictionaryCategoryKey, number>
    for (const c of DICTIONARY_CATEGORIES) m[c.key] = 0
    for (const term of DICTIONARY_TERMS) m[term.category] += 1
    return m
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return DICTIONARY_TERMS.filter((term) => {
      if (category !== 'all' && term.category !== category) return false
      if (!q) return true
      return (
        term.term.toLowerCase().includes(q) ||
        term.pt.toLowerCase().includes(q) ||
        term.context.toLowerCase().includes(q)
      )
    })
  }, [query, category])

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 pb-16 pt-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          {t('dict.title')}
        </h1>
        <p className="mt-1 max-w-[62ch] text-15 text-muted-foreground">{t('dict.subtitle')}</p>
      </div>

      <div className="flex gap-1 border-b border-border">
        {(['terms', 'questions'] as DictTab[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            aria-current={tab === key ? 'page' : undefined}
            className={cn(
              '-mb-px border-b-2 px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
              tab === key
                ? 'border-accent text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {key === 'terms' ? t('dict.tab.terms') : t('dict.tab.questions')}
          </button>
        ))}
      </div>

      {tab === 'terms' ? (
        <>
          <div className="space-y-3">
            <DictionarySearch value={query} onChange={setQuery} />
            <CategoryFilter
              active={category}
              counts={counts}
              total={DICTIONARY_TERMS.length}
              onChange={setCategory}
            />
          </div>

          <p className="text-eyebrow uppercase tracking-[0.14em] text-muted-foreground">
            {t('dict.count', { n: filtered.length })}
          </p>

          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('dict.empty')}</p>
          ) : (
            <div className="grid items-start gap-2.5 sm:grid-cols-2">
              {filtered.map((term) => (
                <TermCard
                  key={term.term}
                  term={term}
                  categoryLabel={categoryLabel[term.category]}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <QuestionList />
      )}
    </main>
  )
}
