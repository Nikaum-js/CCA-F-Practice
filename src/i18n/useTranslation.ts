import { useCallback } from 'react'

import { useLang } from '@/hooks/useLang'
import { translations, type Lang, type TranslationKey } from '@/i18n/translations'

type Params = Record<string, string | number>

export function useTranslation() {
  const { lang } = useLang()

  const t = useCallback(
    (key: TranslationKey, params?: Params): string => {
      let s: string = translations[lang][key] ?? key
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          s = s.replaceAll(`{${k}}`, String(v))
        }
      }
      return s
    },
    [lang],
  )

  return { t, lang: lang as Lang }
}
