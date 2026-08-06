import { useState } from 'react'
import { BrandMark } from './BrandMark'
import { MenuIcon } from './Icons'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useI18n } from '../i18n/useI18n'

export function Header() {
  const [open, setOpen] = useState(false)
  const { t } = useI18n()
  const navItems = [
    [t('nav.overview'), '#overview'],
    [t('nav.architecture'), '#architecture'],
    [t('nav.download'), '#download'],
  ] as const

  return (
    <header className="site-header">
      <div className="site-header__inner page-shell">
        <a href="#overview" className="site-header__brand" onClick={() => setOpen(false)}>
          <BrandMark />
        </a>
        <div className="site-header__controls">
          <nav className={`site-nav${open ? ' site-nav--open' : ''}`} aria-label={t('nav.main')}>
            {navItems.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
            ))}
            <a href="https://github.com/fhfelipefh" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>GitHub</a>
          </nav>
          <LanguageSwitcher />
          <button className="menu-button" type="button" aria-label={t('nav.toggle')} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  )
}
