import { ArrowIcon } from './Icons'
import { MeshDiagram } from './MeshDiagram'
import { useI18n } from '../i18n/useI18n'

export function Hero() {
  const { t } = useI18n()
  return (
    <main id="overview">
      <section className="hero page-shell" aria-labelledby="hero-title">
        <div className="hero__content">
          <h1 className="motion-hero-item" id="hero-title">{t('hero.title.1')}<br />{t('hero.title.2')}</h1>
          <p className="motion-hero-item">{t('hero.description')}</p>
          <div className="hero__actions motion-hero-item">
            <a className="button button--primary" href="#download">{t('hero.download')} <ArrowIcon /></a>
            <a className="button button--secondary" href="#architecture">{t('hero.architecture')} <ArrowIcon /></a>
          </div>
          <div className="hero__status motion-hero-item"><span aria-hidden="true">&gt;_</span> {t('hero.status')}</div>
        </div>
        <div className="hero__visual">
          <MeshDiagram />
        </div>
      </section>
      <div className="route-divider page-shell" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
    </main>
  )
}
