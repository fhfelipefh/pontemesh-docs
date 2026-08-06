import { createContext } from 'react'
import type { TranslationKey } from './I18nContext'
import type { Locale } from './languages'

export interface I18nValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

export const I18nContext = createContext<I18nValue | null>(null)
