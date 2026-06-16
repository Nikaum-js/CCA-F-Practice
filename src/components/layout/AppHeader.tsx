import { useLang } from '@/hooks/useLang'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'
import type { Lang } from '@/lib/storage'
import { BrandMark } from './BrandMark'
import { Flag } from './Flag'

export type NavTarget = 'home' | 'dictionary'

interface Props {
  active: NavTarget
  onNavigate: (target: NavTarget) => void
}

const LANGS: { key: Lang; label: string }[] = [
  { key: 'pt', label: 'PT' },
  { key: 'en', label: 'EN' },
]

export function AppHeader({ active, onNavigate }: Props) {
  const { lang, setLang } = useLang()
  const { t } = useTranslation()

  const navItems: { key: NavTarget; label: string }[] = [
    { key: 'home', label: t('nav.home') },
    { key: 'dictionary', label: t('nav.dictionary') },
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BrandMark />
            <span className="font-display text-xl font-semibold leading-none tracking-tight">
              {t('app.title')}
            </span>
          </button>
          <nav className="flex items-center gap-1 rounded-full border border-border/70 bg-card/50 p-0.5">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavigate(item.key)}
                aria-current={active === item.key ? 'page' : undefined}
                className={cn(
                  'rounded-full px-3 py-1 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                  active === item.key
                    ? 'bg-muted text-foreground shadow-card'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div
          role="group"
          aria-label="Language"
          className="flex shrink-0 items-center gap-0.5 rounded-full border border-border/70 bg-card/50 p-0.5"
        >
          {LANGS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setLang(key)}
              aria-pressed={lang === key}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium tracking-wide outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                lang === key
                  ? 'bg-muted text-foreground shadow-card'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Flag lang={key} className={cn(lang === key ? 'opacity-100' : 'opacity-60')} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
