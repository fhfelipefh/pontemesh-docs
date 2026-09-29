import { useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import { ArrowIcon, PeerIcon, ServerIcon } from './Icons'

export function PerformanceSection() {
  const { t } = useI18n()
  const [activeChart, setActiveChart] = useState<'summary' | 'dct' | 'volume'>('summary')

  const scenarios = [
    {
      id: 1,
      nameKey: 'performance.scenario.1.name',
      descKey: 'performance.scenario.1.desc',
      dctKey: 'performance.scenario.1.dct',
      speedKey: 'performance.scenario.1.speed',
      offloadKey: 'performance.scenario.1.offload',
      offloadPct: 0,
      dctBarPct: 100,
      isP2p: false,
    },
    {
      id: 2,
      nameKey: 'performance.scenario.2.name',
      descKey: 'performance.scenario.2.desc',
      dctKey: 'performance.scenario.2.dct',
      speedKey: 'performance.scenario.2.speed',
      offloadKey: 'performance.scenario.2.offload',
      offloadPct: 50.5,
      dctBarPct: 54,
      isP2p: true,
    },
    {
      id: 3,
      nameKey: 'performance.scenario.3.name',
      descKey: 'performance.scenario.3.desc',
      dctKey: 'performance.scenario.3.dct',
      speedKey: 'performance.scenario.3.speed',
      offloadKey: 'performance.scenario.3.offload',
      offloadPct: 100,
      dctBarPct: 3.5,
      isP2p: true,
      highlight: true,
    },
    {
      id: 4,
      nameKey: 'performance.scenario.4.name',
      descKey: 'performance.scenario.4.desc',
      dctKey: 'performance.scenario.4.dct',
      speedKey: 'performance.scenario.4.speed',
      offloadKey: 'performance.scenario.4.offload',
      offloadPct: 89.1,
      dctBarPct: 10.2,
      isP2p: true,
    },
  ] as const

  const chartImages = {
    summary: {
      src: '/benchmarks/fig_gcp_15_resumo_dashboard_executivo.png',
      alt: 'Executive summary dashboard of empirical benchmarks',
      label: 'Summary Dashboard (2x2)',
    },
    dct: {
      src: '/benchmarks/fig_gcp_01_dct_barras_comparativo.png',
      alt: 'Download Completion Time comparison chart',
      label: 'Download Completion Time (DCT)',
    },
    volume: {
      src: '/benchmarks/fig_gcp_08_volume_trafego_origem_vs_p2p_stacked.png',
      alt: 'Aggregated egress traffic vs local P2P traffic chart',
      label: 'Egress vs Local LAN Traffic',
    },
  }

  return (
    <section className="performance" id="performance" aria-labelledby="performance-title">
      <div className="page-shell">
        <div className="section-intro motion-reveal">
          <h2 id="performance-title">
            {t('performance.title.1')}<br />{t('performance.title.2')}
          </h2>
          <p>{t('performance.description')}</p>
        </div>

        {/* 4 Highlight metric cards */}
        <div className="performance-stats motion-reveal">
          <div className="stat-card stat-card--highlight">
            <span className="stat-card__value">{t('performance.metric.speedup.value')}</span>
            <h3 className="stat-card__label">{t('performance.metric.speedup.label')}</h3>
            <p className="stat-card__sub">{t('performance.metric.speedup.sub')}</p>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{t('performance.metric.offload.value')}</span>
            <h3 className="stat-card__label">{t('performance.metric.offload.label')}</h3>
            <p className="stat-card__sub">{t('performance.metric.offload.sub')}</p>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{t('performance.metric.cold.value')}</span>
            <h3 className="stat-card__label">{t('performance.metric.cold.label')}</h3>
            <p className="stat-card__sub">{t('performance.metric.cold.sub')}</p>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{t('performance.metric.integrity.value')}</span>
            <h3 className="stat-card__label">{t('performance.metric.integrity.label')}</h3>
            <p className="stat-card__sub">{t('performance.metric.integrity.sub')}</p>
          </div>
        </div>

        {/* Comparison grid between distribution models */}
        <div className="scenarios-grid motion-reveal">
          {scenarios.map((s) => (
            <article key={s.id} className={`scenario-item${'highlight' in s ? ' scenario-item--hero' : ''}`}>
              <div className="scenario-item__header">
                <span className="scenario-item__badge">
                  {s.isP2p ? <PeerIcon className="scenario-icon" /> : <ServerIcon className="scenario-icon" />}
                  {s.isP2p ? 'P2P Mesh' : 'Direct Origin'}
                </span>
                <span className="scenario-item__offload">{t(s.offloadKey)}</span>
              </div>
              <h3 className="scenario-item__name">{t(s.nameKey)}</h3>
              <p className="scenario-item__desc">{t(s.descKey)}</p>

              <div className="scenario-item__metrics">
                <div className="metric-row">
                  <span className="metric-row__label">Time (DCT):</span>
                  <span className="metric-row__val">{t(s.dctKey)}</span>
                </div>
                <div className="progress-bar-bg" aria-hidden="true">
                  <div className={`progress-bar-fill progress-bar-fill--${s.isP2p ? 'mint' : 'warn'}`} style={{ width: `${s.dctBarPct}%` }} />
                </div>

                <div className="metric-row">
                  <span className="metric-row__label">Goodput:</span>
                  <span className="metric-row__val metric-row__val--speed">{t(s.speedKey)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Visual Benchmark Charts viewer */}
        <div className="benchmark-chart-viewer motion-reveal">
          <div className="chart-viewer__header">
            <div>
              <h3>Benchmark Telemetry & Visualizations</h3>
              <p>{t('performance.chart.caption')}</p>
            </div>
            <div className="chart-tabs">
              {(['summary', 'dct', 'volume'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`chart-tab${activeChart === key ? ' chart-tab--active' : ''}`}
                  onClick={() => setActiveChart(key)}
                >
                  {chartImages[key].label}
                </button>
              ))}
            </div>
          </div>

          <div className="chart-viewer__display">
            <img
              src={chartImages[activeChart].src}
              alt={chartImages[activeChart].alt}
              className="chart-img"
              loading="lazy"
            />
          </div>
          <div className="chart-viewer__footer">
            <a
              href={chartImages[activeChart].src}
              target="_blank"
              rel="noreferrer"
              className="button button--secondary"
            >
              Open high-resolution chart (300 DPI) <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
