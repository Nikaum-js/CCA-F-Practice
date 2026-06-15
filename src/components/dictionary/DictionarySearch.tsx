import { Search, X } from 'lucide-react'

import { useTranslation } from '@/i18n/useTranslation'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function DictionarySearch({ value, onChange, placeholder }: Props) {
  const { t } = useTranslation()
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? t('dict.search.placeholder')}
        className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-9 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-accent/60 focus-visible:ring-2 focus-visible:ring-ring"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={t('dict.search.clear')}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
