export function ReleaseDownloadVisual() {
  return (
    <svg className="release-visual" viewBox="0 0 420 160" fill="none" aria-hidden="true">
      <g className="release-visual__routes">
        <path d="M30 31C94 31 126 50 165 73" />
        <path d="M30 68C92 68 128 74 165 84" />
        <path d="M30 105C94 105 127 99 165 91" />
      </g>
      <g className="release-visual__fragments">
        <rect x="36" y="24" width="14" height="14" rx="2" />
        <rect x="73" y="61" width="14" height="14" rx="2" />
        <rect x="111" y="96" width="14" height="14" rx="2" />
      </g>
      <g className="release-visual__download">
        <path d="M210 22V91" />
        <path d="M183 67L210 94L237 67" />
        <path d="M153 107H267V137H153V107Z" />
        <path d="M153 107L174 90H190" />
        <path d="M267 107L246 90H230" />
        <circle cx="247" cy="122" r="3" />
      </g>
      <g className="release-visual__outgoing">
        <path d="M283 74H390" />
        <path d="M283 89H365" />
        <path d="M283 104H341" />
      </g>
    </svg>
  )
}
