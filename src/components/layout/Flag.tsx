import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { Lang } from '@/lib/storage'

// Small SVG flags for the language switch. Emojis are forbidden in production UI
// (Principle V), so the flags are inline vector art sized as a 3:2 chip.

function BrazilFlag() {
  return (
    <svg viewBox="0 0 28 20" className="h-full w-full" aria-hidden="true">
      <rect width="28" height="20" fill="#009b3a" />
      <path d="M14 2.6 L24.6 10 L14 17.4 L3.4 10 Z" fill="#fedf00" />
      <circle cx="14" cy="10" r="4.1" fill="#002776" />
    </svg>
  )
}

function USFlag() {
  const red = '#b22234'
  // 7 simplified stripes (h ≈ 2.857), red on even rows over a white field.
  const stripes = [0, 2, 4, 6].map((i) => (
    <rect key={i} x="0" y={i * (20 / 7)} width="28" height={20 / 7} fill={red} />
  ))
  const stars: ReactNode[] = []
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      stars.push(
        <circle key={`${row}-${col}`} cx={2.6 + col * 3} cy={3 + row * 4} r="0.75" fill="#fff" />,
      )
    }
  }
  return (
    <svg viewBox="0 0 28 20" className="h-full w-full" aria-hidden="true">
      <rect width="28" height="20" fill="#fff" />
      {stripes}
      <rect width="11.5" height={(20 / 7) * 4} fill="#3c3b6e" />
      {stars}
    </svg>
  )
}

export function Flag({ lang, className }: { lang: Lang; className?: string }) {
  return (
    <span
      className={cn(
        'inline-block h-3 w-[18px] shrink-0 overflow-hidden rounded-[2px] ring-1 ring-black/20',
        className,
      )}
    >
      {lang === 'pt' ? <BrazilFlag /> : <USFlag />}
    </span>
  )
}
