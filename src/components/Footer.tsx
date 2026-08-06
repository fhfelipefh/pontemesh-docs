import { BrandMark } from './BrandMark'
import { ArrowIcon } from './Icons'
import { useI18n } from '../i18n/useI18n'

export function Footer() {
  const { t } = useI18n()
  const footerLinks = [
    [t('footer.architecture'), 'https://github.com/fhfelipefh/pontemesh-server/blob/main/docs/ARCHITECTURE.md'],
    [t('footer.security'), 'https://github.com/fhfelipefh/pontemesh-server/blob/main/docs/SECURITY.md'],
    [t('footer.sdk'), 'https://github.com/fhfelipefh/pontemesh-sdk'],
    [t('footer.server'), 'https://github.com/fhfelipefh/pontemesh-server'],
  ] as const
  return (
    <footer className="site-footer">
      <div className="page-shell">
        <div className="site-footer__links motion-reveal">
          <BrandMark />
          <nav aria-label={t('footer.navigation')}>
            {footerLinks.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer">{label} <ArrowIcon /></a>)}
          </nav>
        </div>
        <div className="site-footer__closing">{t('footer.closing')}</div>
      </div>
    </footer>
  )
}
