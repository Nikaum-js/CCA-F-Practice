// Accuracy → color class. green ≥70%, amber 40–69%, red <40% (spec §8.6/§10.2).
export function rateTextClass(rate: number): string {
  if (rate >= 0.7) return 'text-success'
  if (rate >= 0.4) return 'text-amber-400'
  return 'text-destructive'
}

export function rateBarClass(rate: number): string {
  if (rate >= 0.7) return 'bg-success'
  if (rate >= 0.4) return 'bg-amber-400'
  return 'bg-destructive'
}
