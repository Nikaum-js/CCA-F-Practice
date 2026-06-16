import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useTranslation } from '@/i18n/useTranslation'

interface Props {
  onResume: () => void
  onDiscard: () => void
}

export function ResumeSessionBanner({ onResume, onDiscard }: Props) {
  const { t } = useTranslation()
  return (
    <Card className="flex flex-col gap-3 border-l-2 border-l-accent bg-accent/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="relative flex size-2 shrink-0" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-accent" />
        </span>
        <div>
          <div className="text-sm font-semibold tracking-tight">{t('resume.title')}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">{t('resume.sub')}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onDiscard}>
          {t('resume.discard')}
        </Button>
        <Button size="sm" onClick={onResume}>
          {t('resume.button')}
        </Button>
      </div>
    </Card>
  )
}
