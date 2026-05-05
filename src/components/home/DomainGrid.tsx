import { DomainCard } from '@/components/home/DomainCard'
import { DOMAIN_ORDER, type DomainKey, type DomainStats } from '@/data/schema'
import { cn } from '@/lib/utils'

interface Props {
  counts: Record<DomainKey, number>
  stats: DomainStats
  onPick: (domain: DomainKey) => void
}

export function DomainGrid({ counts, stats, onPick }: Props) {
  const odd = DOMAIN_ORDER.length % 2 === 1
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {DOMAIN_ORDER.map((d, i) => (
        <div
          key={d}
          className={cn(odd && i === DOMAIN_ORDER.length - 1 && 'sm:col-span-2')}
        >
          <DomainCard
            domain={d}
            count={counts[d]}
            attempted={stats[d].attempted}
            correct={stats[d].correct}
            onClick={() => onPick(d)}
          />
        </div>
      ))}
    </div>
  )
}
