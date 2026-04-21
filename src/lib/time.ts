import type { Lang } from '@/lib/storage'

// MM:SS from a seconds count.
export function formatMMSS(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, '0')}`
}

// Relative date label (today / N days ago) in the active language, or '—' when null.
export function relativeDate(iso: string | null, lang: Lang): string {
  if (!iso) return '—'
  const then = new Date(iso)
  if (Number.isNaN(then.getTime())) return '—'
  const now = new Date()
  const startThen = new Date(then.getFullYear(), then.getMonth(), then.getDate())
  const startNow = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const days = Math.round((startNow.getTime() - startThen.getTime()) / 86_400_000)

  if (days <= 0) return lang === 'pt' ? 'hoje' : 'today'
  if (days === 1) return lang === 'pt' ? 'ontem' : 'yesterday'
  if (days < 30) return lang === 'pt' ? `${days} dias atrás` : `${days} days ago`
  const months = Math.floor(days / 30)
  if (months === 1) return lang === 'pt' ? '1 mês atrás' : '1 month ago'
  return lang === 'pt' ? `${months} meses atrás` : `${months} months ago`
}
