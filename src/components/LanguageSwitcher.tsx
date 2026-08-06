import { useEffect, useRef, useState } from 'react'
import { supportedLanguages } from '../i18n/languages'
import { useI18n } from '../i18n/useI18n'
import { CheckIcon, ChevronDownIcon, GlobeIcon } from './Icons'

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const activeLanguage = supportedLanguages.find((language) => language.code === locale) ?? supportedLanguages[0]

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  return (
    <div className="language-switcher" ref={rootRef}>
      <button className="language-switcher__button" type="button" aria-label={t('language.label')} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <GlobeIcon />
        <span>{activeLanguage.shortLabel}</span>
        <ChevronDownIcon />
      </button>
      {open && (
        <div className="language-switcher__menu" role="menu">
          {supportedLanguages.map((language) => (
            <button key={language.code} className="language-switcher__item" type="button" role="menuitemradio" aria-checked={language.code === locale} onClick={() => { setLocale(language.code); setOpen(false) }}>
              <span><strong>{language.shortLabel}</strong><small>{language.label}</small></span>
              {language.code === locale && <CheckIcon />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
