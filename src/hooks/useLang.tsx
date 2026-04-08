import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

import { storage, type Lang } from '@/lib/storage'

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => storage.getLang())

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    storage.setLang(l)
  }, [])

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === 'pt' ? 'en' : 'pt'
      storage.setLang(next)
      return next
    })
  }, [])

  return <LangContext.Provider value={{ lang, setLang, toggle }}>{children}</LangContext.Provider>
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within a LangProvider')
  return ctx
}
