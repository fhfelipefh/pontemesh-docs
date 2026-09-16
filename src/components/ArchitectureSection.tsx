import { useState } from 'react'
import { ArrowIcon, CodeIcon, PeerIcon, ServerIcon } from './Icons'
import { useI18n } from '../i18n/useI18n'

export function ArchitectureSection() {
  const { t } = useI18n()
  const [codeTab, setCodeTab] = useState<'disk' | 'sync'>('disk')

  return (
    <section className="architecture" id="architecture" aria-labelledby="architecture-title">
      <div className="page-shell">
        <div className="section-intro motion-reveal">
          <h2 id="architecture-title">{t('architecture.title.1')}<br />{t('architecture.title.2')}</h2>
          <p>{t('architecture.description')}</p>
        </div>

        <div className="architecture-flow motion-reveal">
          <article className="flow-endpoint flow-endpoint--origin">
            <div className="flow-endpoint__badges">
              <span className="flow-badge flow-badge--s3">{t('architecture.badge.s3')}</span>
              <span className="flow-badge flow-badge--mcp">{t('architecture.badge.mcp')}</span>
            </div>
            <ServerIcon />
            <h3>{t('architecture.origin')}</h3>
            <p>{t('architecture.origin.description')}</p>
          </article>
          <div className="flow-paths">
            <article className="flow-path flow-path--control">
              <span className="flow-path__icon"><ServerIcon /></span>
              <div>
                <h3>{t('architecture.replica')}</h3>
                <p>{t('architecture.replica.description')}</p>
              </div>
            </article>
            <article className="flow-path flow-path--data">
              <span className="flow-path__icon"><PeerIcon /></span>
              <div>
                <span className="flow-badge flow-badge--p2p">{t('architecture.badge.p2p')}</span>
                <h3>{t('architecture.peers')}</h3>
                <p>{t('architecture.peers.description')}</p>
              </div>
            </article>
          </div>
          <article className="flow-endpoint flow-endpoint--sdk">
            <CodeIcon />
            <h3>{t('architecture.sdk')}</h3>
            <p>{t('architecture.sdk.description')}</p>
          </article>
        </div>

        <div className="flow-legend motion-reveal" aria-label="Architecture legend">
          <span><i className="flow-legend__control" /> {t('architecture.control')}</span>
          <span><i className="flow-legend__data" /> {t('architecture.data')}</span>
        </div>

        <div className="integration motion-reveal">
          <div className="integration__copy">
            <h2>{t('integration.title.1')}<br />{t('integration.title.2')}</h2>
            <p>{t('integration.description')}</p>
            <a className="button button--secondary" href="https://github.com/fhfelipefh/pontemesh-sdk" target="_blank" rel="noreferrer">
              {t('integration.action')} <ArrowIcon />
            </a>
          </div>
          <div className="code-panel" aria-label={t('integration.code')}>
            <div className="code-panel__header">
              <div className="code-panel__tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={codeTab === 'disk'}
                  className={`code-tab${codeTab === 'disk' ? ' code-tab--active' : ''}`}
                  onClick={() => setCodeTab('disk')}
                >
                  {t('integration.tab.disk')}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={codeTab === 'sync'}
                  className={`code-tab${codeTab === 'sync' ? ' code-tab--active' : ''}`}
                  onClick={() => setCodeTab('sync')}
                >
                  {t('integration.tab.sync')}
                </button>
              </div>
              <span className="code-panel__lang">Rust (crates.io)</span>
            </div>
            {codeTab === 'disk' ? (
              <pre><code><span className="syntax-keyword">use</span> pontemesh_sdk_core::&#123;<br />
                {'    '}p2p::P2pConfig, CancellationToken,<br />
                {'    '}PontemeshClient, PontemeshClientConfig, SyncObjectRequest,<br />
                &#125;;<br /><br />
                <span className="syntax-keyword">let</span> client = PontemeshClient::new(PontemeshClientConfig &#123;<br />
                {'    '}origin_url: <span className="syntax-string">&quot;https://origin.example.com&quot;</span>.into(),<br />
                {'    '}application_token: <span className="syntax-string">&quot;pm_app_token&quot;</span>.into(),<br />
                {'    '}p2p: P2pConfig::default(),<br />
                &#125;)?;<br /><br />
                <span className="syntax-keyword">let</span> cancellation = CancellationToken::default();<br />
                <span className="syntax-keyword">let</span> summary = client.<span className="syntax-call">sync_object_to_disk_with_options</span>(<br />
                {'    '}SyncObjectRequest &#123;<br />
                {'        '}bucket: <span className="syntax-string">&quot;game-assets&quot;</span>.into(),<br />
                {'        '}key: <span className="syntax-string">&quot;maps/desert-v3.pak&quot;</span>.into(),<br />
                {'        '}destination: <span className="syntax-string">&quot;./maps/desert-v3.pak&quot;</span>.into(),<br />
                {'    '}&#125;,<br />
                {'    '}None, <span className="syntax-comment">// progress callback</span><br />
                {'    '}cancellation,<br />
                )?;</code></pre>
            ) : (
              <pre><code><span className="syntax-keyword">use</span> pontemesh_sdk_core::&#123;<br />
                {'    '}p2p::P2pConfig, PontemeshClient,<br />
                {'    '}PontemeshClientConfig, SyncObjectRequest,<br />
                &#125;;<br /><br />
                <span className="syntax-keyword">let</span> client = PontemeshClient::new(PontemeshClientConfig &#123;<br />
                {'    '}origin_url: <span className="syntax-string">&quot;https://origin.example.com&quot;</span>.into(),<br />
                {'    '}application_token: <span className="syntax-string">&quot;pm_app_token&quot;</span>.into(),<br />
                {'    '}p2p: P2pConfig::default(),<br />
                &#125;)?;<br /><br />
                <span className="syntax-keyword">let</span> result = client.<span className="syntax-call">sync_object_with_summary</span>(SyncObjectRequest &#123;<br />
                {'    '}bucket: <span className="syntax-string">&quot;game-assets&quot;</span>.into(),<br />
                {'    '}key: <span className="syntax-string">&quot;config/patch.json&quot;</span>.into(),<br />
                {'    '}destination: <span className="syntax-string">&quot;./config/patch.json&quot;</span>.into(),<br />
                &#125;)?;</code></pre>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
