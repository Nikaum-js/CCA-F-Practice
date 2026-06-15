import type { DictionaryTerm } from '@/data/dictionary'

interface Props {
  term: DictionaryTerm
  categoryLabel: string
}

export function TermCard({ term, categoryLabel }: Props) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-card">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
          {term.term}
        </h3>
        <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-eyebrow uppercase tracking-[0.12em] text-muted-foreground">
          {categoryLabel}
        </span>
      </div>
      <p className="mt-0.5 text-15 font-medium text-accent">{term.pt}</p>
      <p className="mt-2 text-15 leading-relaxed text-foreground/80">{term.context}</p>
    </div>
  )
}
