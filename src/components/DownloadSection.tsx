import { useEffect, useState } from 'react'
import { platformLabels, products, type PlatformId, type ProductId } from '../config'
import { formatBytes, getLatestRelease, type ReleaseResult } from '../services/githubReleases'
import { CodeIcon, DownloadIcon, ExternalIcon, ServerIcon } from './Icons'
import { ReleaseDownloadVisual } from './ReleaseDownloadVisual'
import { useI18n } from '../i18n/useI18n'

type LoadState = ReleaseResult | { status: 'loading' }

const platforms: PlatformId[] = ['windows', 'linux', 'macos']

export function DownloadSection() {
  const { t } = useI18n()
  const [productId, setProductId] = useState<ProductId>('sdk')
  const [platform, setPlatform] = useState<PlatformId>('windows')
  const [release, setRelease] = useState<LoadState>({ status: 'loading' })
  const product = products[productId]
  const [statusTitle, statusDescription] = release.status === 'loading'
    ? [t('download.loading.title'), t('download.loading.description')]
    : release.status === 'empty'
      ? [t('download.empty.title'), t('download.empty.description')]
      : release.status === 'unavailable'
        ? [t('download.unavailable.title'), t('download.unavailable.description')]
        : [release.release.tag_name, `${release.asset.name} · ${formatBytes(release.asset.size)}`]

  useEffect(() => {
    const controller = new AbortController()
    setRelease({ status: 'loading' })
    getLatestRelease(product, platform, controller.signal)
      .then(setRelease)
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setRelease({ status: 'unavailable' })
      })
    return () => controller.abort()
  }, [platform, product])

  function selectProduct(nextProduct: ProductId) {
    setProductId(nextProduct)
    if (!products[nextProduct].platforms.includes(platform)) setPlatform('windows')
  }

  const isAvailable = release.status === 'available'
  const actionUrl = isAvailable ? release.asset.browser_download_url : product.releasesUrl
  const actionLabel = isAvailable
    ? `${t('download.action.direct')} ${release.release.tag_name}`
    : t(productId === 'sdk' ? 'download.action.sdk' : 'download.action.server')
  const productLabel = t(productId === 'sdk' ? 'download.sdk' : 'download.server')

  return (
    <section className="download-section" id="download" aria-labelledby="download-title">
      <div className="page-shell">
        <div className="download-heading motion-reveal">
          <div>
            <h2 id="download-title">{t('download.title')}</h2>
            <p>{t('download.description')}</p>
          </div>
          <ReleaseDownloadVisual />
        </div>

        <div className="download-selectors motion-reveal">
          <fieldset>
            <legend>{t('download.product')}</legend>
            <div className="selector-group selector-group--product">
              <button type="button" aria-pressed={productId === 'sdk'} onClick={() => selectProduct('sdk')}><CodeIcon /> {t('download.sdk')}</button>
              <button type="button" aria-pressed={productId === 'server'} onClick={() => selectProduct('server')}><ServerIcon /> {t('download.server')}</button>
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('download.platform')}</legend>
            <div className="selector-group selector-group--platform">
              {platforms.map((platformId) => {
                const enabled = product.platforms.includes(platformId)
                return <button key={platformId} type="button" disabled={!enabled} aria-pressed={platform === platformId} onClick={() => setPlatform(platformId)}>{platformLabels[platformId]}</button>
              })}
            </div>
          </fieldset>
        </div>

        <p className="platform-note motion-reveal"><span aria-hidden="true">→</span> {t('download.note')}</p>

        <div className="download-panel motion-reveal" aria-live="polite">
          <div className="download-panel__package">
            <span>{t('download.selected')}</span>
            <strong>{productLabel}<br />{platformLabels[platform]} x64</strong>
          </div>
          <div className="download-panel__status">
            <span>{t('download.status')}</span>
            <strong>{statusTitle}</strong>
            <p>{statusDescription}</p>
          </div>
          <div className="download-panel__action">
            <a className="button button--secondary" href={actionUrl} target={isAvailable ? undefined : '_blank'} rel={isAvailable ? undefined : 'noreferrer'}>
              {isAvailable ? <DownloadIcon /> : <ExternalIcon />} {actionLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
