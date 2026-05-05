import { Button } from '@/components/ui/button'
import type { DomainKey } from '@/data/schema'
import { useTranslation } from '@/i18n/useTranslation'

interface Props {
  weakest: DomainKey | null
  onTrainWeakest: () => void
  onNewExam: () => void
  onHome: () => void
}

export function ResultsCTAs({ weakest, onTrainWeakest, onNewExam, onHome }: Props) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <Button size="lg" onClick={onTrainWeakest} disabled={!weakest}>
        {t('results.cta.weakest')}
      </Button>
      <Button size="lg" variant="outline" onClick={onNewExam}>
        {t('results.cta.newExam')}
      </Button>
      <Button size="lg" variant="ghost" onClick={onHome}>
        {t('results.cta.home')}
      </Button>
    </div>
  )
}
