import { cn } from '@/lib/utils'

// App brand mark — the Claude logomark, same asset as the favicon (/favicon.svg)
// so the browser tab and the header share one identity.

export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src="/favicon.svg"
      alt="CCA-F Practice"
      width={28}
      height={28}
      className={cn('h-7 w-7 shrink-0 select-none', className)}
      draggable={false}
    />
  )
}
