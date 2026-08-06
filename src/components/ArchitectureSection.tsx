import { ArrowIcon, CodeIcon, PeerIcon, ServerIcon } from './Icons'
import { useI18n } from '../i18n/useI18n'

export function ArchitectureSection() {
  const { t } = useI18n()
  return (
    <section className="architecture" id="architecture" aria-labelledby="architecture-title">
      <div className="page-shell">
        <div className="section-intro">
          <h2 id="architecture-title">{t('architecture.title.1')}<br />{t('architecture.title.2')}</h2>
          <p>{t('architecture.description')}</p>
        </div>

        <div className="architecture-flow">
          <article className="flow-endpoint flow-endpoint--origin">
            <ServerIcon />
            <h3>{t('architecture.origin')}</h3>
            <p>{t('architecture.origin.description')}</p>
          </article>
          <div className="flow-paths">
            <article className="flow-path flow-path--control">
              <span className="flow-path__icon"><ServerIcon /></span>
              <div><h3>{t('architecture.replica')}</h3><p>{t('architecture.replica.description')}</p></div>
            </article>
            <article className="flow-path flow-path--data">
              <span className="flow-path__icon"><PeerIcon /></span>
              <div><h3>{t('architecture.peers')}</h3><p>{t('architecture.peers.description')}</p></div>
            </article>
          </div>
          <article className="flow-endpoint flow-endpoint--sdk">
            <CodeIcon />
            <h3>{t('architecture.sdk')}</h3>
            <p>{t('architecture.sdk.description')}</p>
          </article>
        </div>

        <div className="flow-legend" aria-label="Architecture legend">
          <span><i className="flow-legend__control" /> {t('architecture.control')}</span>
          <span><i className="flow-legend__data" /> {t('architecture.data')}</span>
        </div>

        <div className="integration">
          <div className="integration__copy">
            <h2>{t('integration.title.1')}<br />{t('integration.title.2')}</h2>
            <p>{t('integration.description')}</p>
            <a className="button button--secondary" href="https://github.com/fhfelipefh/pontemesh-sdk" target="_blank" rel="noreferrer">{t('integration.action')} <ArrowIcon /></a>
          </div>
          <div className="code-panel" aria-label={t('integration.code')}>
            <div className="code-panel__header"><span>Rust</span></div>
            <pre><code><span className="syntax-keyword">use</span> pontemesh_sdk_core::&#123;<br />
              {'    '}p2p::P2pConfig, PontemeshClient,<br />
              {'    '}PontemeshClientConfig, SyncObjectRequest,<br />
              &#125;;<br /><br />
              <span className="syntax-keyword">let</span> client = PontemeshClient::new(PontemeshClientConfig &#123;<br />
              {'    '}origin_url: <span className="syntax-string">&quot;https://origin.example.com&quot;</span>.into(),<br />
              {'    '}application_token: <span className="syntax-string">&quot;application-token&quot;</span>.into(),<br />
              {'    '}p2p: P2pConfig::default(),<br />
              &#125;)?;<br /><br />
              <span className="syntax-keyword">let</span> result = client.<span className="syntax-call">sync_object_with_summary</span>(request)?;</code></pre>
          </div>
        </div>
      </div>
    </section>
  )
}
