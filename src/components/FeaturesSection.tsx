import { ActivityIcon, BrainIcon, DatabaseIcon, LayersIcon, NetworkIcon, ShieldCheckIcon } from './Icons'
import { useI18n } from '../i18n/useI18n'

export function FeaturesSection() {
  const { t } = useI18n()

  const features = [
    {
      id: 's3',
      icon: <DatabaseIcon />,
      tag: t('features.s3.tag'),
      title: t('features.s3.title'),
      description: t('features.s3.description'),
    },
    {
      id: 'mcp',
      icon: <BrainIcon />,
      tag: t('features.mcp.tag'),
      title: t('features.mcp.title'),
      description: t('features.mcp.description'),
    },
    {
      id: 'p2p',
      icon: <NetworkIcon />,
      tag: t('features.p2p.tag'),
      title: t('features.p2p.title'),
      description: t('features.p2p.description'),
    },
    {
      id: 'sdk',
      icon: <LayersIcon />,
      tag: t('features.sdk.tag'),
      title: t('features.sdk.title'),
      description: t('features.sdk.description'),
    },
    {
      id: 'metrics',
      icon: <ActivityIcon />,
      tag: t('features.metrics.tag'),
      title: t('features.metrics.title'),
      description: t('features.metrics.description'),
    },
    {
      id: 'fallback',
      icon: <ShieldCheckIcon />,
      tag: t('features.fallback.tag'),
      title: t('features.fallback.title'),
      description: t('features.fallback.description'),
    },
  ] as const

  return (
    <section className="features-section" id="features" aria-labelledby="features-title">
      <div className="page-shell">
        <div className="section-intro motion-reveal">
          <span className="section-eyebrow">{t('features.heading')}</span>
          <h2 id="features-title">{t('features.title.1')}<br />{t('features.title.2')}</h2>
          <p>{t('features.description')}</p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <article key={feature.id} className="feature-card motion-reveal">
              <div className="feature-card__header">
                <div className="feature-card__icon" aria-hidden="true">
                  {feature.icon}
                </div>
                <span className="feature-card__tag">{feature.tag}</span>
              </div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__description">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
