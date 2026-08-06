import { useI18n } from '../i18n/useI18n'

export function MeshDiagram() {
  const { t } = useI18n()
  return (
    <svg className="mesh-diagram" viewBox="0 0 720 540" role="img" aria-labelledby="mesh-title mesh-description">
      <title id="mesh-title">{t('diagram.title')}</title>
      <desc id="mesh-description">{t('diagram.description')}</desc>
      <defs>
        <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000" floodOpacity=".32" />
        </filter>
        <marker id="arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
        </marker>
        <marker id="arrow-mint" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#2dd4bf" />
        </marker>
      </defs>
      <g className="mesh-diagram__rings" fill="none" stroke="#60a5fa">
        <circle cx="360" cy="270" r="106" />
        <circle cx="360" cy="270" r="124" />
        <circle cx="360" cy="270" r="142" />
      </g>
      <g className="mesh-diagram__control" fill="none" stroke="#60a5fa" strokeWidth="2.2" markerEnd="url(#arrow-amber)">
        <path d="M135 116C226 110 226 194 284 219" />
        <path d="M135 424C226 430 226 346 284 321" />
        <path d="M586 99C495 100 498 192 437 221" />
        <path d="M612 270C520 270 500 270 452 270" />
        <path d="M586 441C495 440 498 348 437 319" />
      </g>
      <g className="mesh-diagram__data" fill="none" stroke="#2dd4bf" strokeWidth="1.6" strokeDasharray="7 8" markerEnd="url(#arrow-mint)">
        <path d="M139 143C242 149 225 233 289 248" />
        <path d="M139 397C242 391 225 307 289 292" />
        <path d="M580 126C489 139 500 226 437 248" />
        <path d="M607 293C526 306 501 298 452 289" />
        <path d="M580 414C489 401 500 314 437 292" />
      </g>
      <g className="mesh-diagram__fragments" aria-hidden="true">
        <rect x="210" y="148" width="12" height="12" rx="1" />
        <rect x="231" y="164" width="12" height="12" rx="1" />
        <rect x="251" y="182" width="12" height="12" rx="1" />
        <rect x="493" y="157" width="12" height="12" rx="1" />
        <rect x="515" y="143" width="12" height="12" rx="1" />
        <rect x="510" y="373" width="12" height="12" rx="1" />
        <rect x="486" y="360" width="12" height="12" rx="1" />
      </g>
      <g className="mesh-node mesh-node--origin" filter="url(#soft-shadow)">
        <circle cx="360" cy="270" r="86" />
        <path d="M333 219h54v22h-54zm0 31h54v22h-54zm0 31h54v22h-54z" />
        <path d="M344 230h1m0 31h1m0 31h1" strokeWidth="3" strokeLinecap="round" />
        <text x="360" y="332" textAnchor="middle">Origin</text>
        <text className="mesh-node__meta" x="360" y="345" textAnchor="middle">{t('diagram.origin.meta')}</text>
      </g>
      <g className="mesh-node mesh-node--replica" transform="translate(71 70)">
        <circle cx="0" cy="0" r="69" />
        <path d="M-22-18h44v17h-44zm0 26h44v17h-44z" />
        <text x="0" y="39" textAnchor="middle"><tspan x="0">Replica /</tspan><tspan x="0" dy="15">Edge</tspan></text>
      </g>
      <g className="mesh-node mesh-node--replica" transform="translate(71 470)">
        <circle cx="0" cy="0" r="69" />
        <path d="M-22-18h44v17h-44zm0 26h44v17h-44z" />
        <text x="0" y="39" textAnchor="middle"><tspan x="0">Replica /</tspan><tspan x="0" dy="15">Edge</tspan></text>
      </g>
      <g className="mesh-node mesh-node--peer" transform="translate(648 69)">
        <circle cx="0" cy="0" r="62" />
        <circle cx="0" cy="-13" r="11" />
        <path d="M-19 24v-7A19 19 0 0 1 0-2a19 19 0 0 1 19 19v7" />
        <text x="0" y="34" textAnchor="middle"><tspan x="0">{t('diagram.peer.1')}</tspan><tspan x="0" dy="14">{t('diagram.peer.2')}</tspan></text>
      </g>
      <g className="mesh-node mesh-node--peer" transform="translate(656 270)">
        <circle cx="0" cy="0" r="62" />
        <circle cx="0" cy="-13" r="11" />
        <path d="M-19 24v-7A19 19 0 0 1 0-2a19 19 0 0 1 19 19v7" />
        <text x="0" y="34" textAnchor="middle"><tspan x="0">{t('diagram.peer.1')}</tspan><tspan x="0" dy="14">{t('diagram.peer.2')}</tspan></text>
      </g>
      <g className="mesh-node mesh-node--replica" transform="translate(648 470)">
        <circle cx="0" cy="0" r="69" />
        <path d="M-22-18h44v17h-44zm0 26h44v17h-44z" />
        <text x="0" y="39" textAnchor="middle"><tspan x="0">Replica /</tspan><tspan x="0" dy="15">Edge</tspan></text>
      </g>
    </svg>
  )
}
