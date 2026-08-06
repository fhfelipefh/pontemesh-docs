export const LANGUAGE_STORAGE_KEY = 'pontemesh.language'

export const supportedLanguages = [
  { code: 'pt-BR', shortLabel: 'PT-BR', label: 'Português (Brasil)' },
  { code: 'en', shortLabel: 'EN', label: 'English' },
  { code: 'es', shortLabel: 'ES', label: 'Español' },
] as const

export type Locale = (typeof supportedLanguages)[number]['code']
