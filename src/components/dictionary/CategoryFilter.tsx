import {
  DICTIONARY_CATEGORIES,
  type DictionaryCategoryKey,
} from '@/data/dictionary'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'

export type CategoryFilterValue = DictionaryCategoryKey | 'all'

interface Props {
  active: CategoryFilterValue
  counts: Record<DictionaryCategoryKey, number>
  total: number
  onChange: (value: CategoryFilterValue) => void
}

export function CategoryFilter({ active, counts, total, onChange }: Props) {
  const { t, lang } = useTranslation()

  const chips: { key: CategoryFilterValue; label: string; count: number }[] = [
    { key: 'all', label: t('dict.filter.all'), count: total },
    ...DICTIONARY_CATEGORIES.map((c) => ({
      key: c.key as CategoryFilterValue,
      label: lang === 'pt' ? c.pt : c.en,
      count: counts[c.key],
    })),
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => {
        const isActive = chip.key === active
        return (
          <button
            key={chip.key}
            type="button"
            onClick={() => onChange(chip.key)}
            aria-pressed={isActive}
            className={cn(
              'rounded-full border px-3 py-1 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
              isActive
                ? 'border-accent bg-accent/10 text-foreground'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {chip.label}
            <span className="ml-1.5 text-xs tabular-nums text-muted-foreground">{chip.count}</span>
          </button>
        )
      })}
    </div>
  )
}
