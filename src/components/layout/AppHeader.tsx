import { useLang } from '@/hooks/useLang'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'

export type NavTarget = 'home' | 'dictionary'

interface Props {
  active: NavTarget
  onNavigate: (target: NavTarget) => void
}

export function AppHeader({ active, onNavigate }: Props) {
  const { lang, toggle } = useLang()
  const { t } = useTranslation()

  const navItems: { key: NavTarget; label: string }[] = [
    { key: 'home', label: t('nav.home') },
    { key: 'dictionary', label: t('nav.dictionary') },
  ]

  return (
    <header className="flex items-center justify-between gap-4 py-5">
      <div className="flex items-baseline gap-5">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="font-display text-xl font-semibold leading-none tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t('app.title')}
        </button>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              aria-current={active === item.key ? 'page' : undefined}
              className={cn(
                'rounded-md px-2.5 py-1 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                active === item.key
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <button
        type="button"
        onClick={toggle}
        className="shrink-0 rounded-md border border-border px-2.5 py-1 text-xs font-medium tracking-wide outline-none transition-colors hover:border-accent/60 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Toggle language"
      >
        <span className={cn(lang === 'pt' ? 'text-foreground' : 'text-muted-foreground')}>PT</span>
        <span className="text-muted-foreground"> | </span>
        <span className={cn(lang === 'en' ? 'text-foreground' : 'text-muted-foreground')}>EN</span>
      </button>
    </header>
  )
}
