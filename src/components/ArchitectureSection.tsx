import { useState } from 'react'
import { ArrowIcon, CodeIcon, PeerIcon, ServerIcon } from './Icons'
import { useI18n } from '../i18n/useI18n'

export function ArchitectureSection() {
  const { t } = useI18n()
  const [codeTab, setCodeTab] = useState<'disk' | 'sync' | 'cicd'>('disk')

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
              <span className="flow-badge flow-badge--pools">{t('architecture.badge.pools')}</span>
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
                <button
                  type="button"
                  role="tab"
                  aria-selected={codeTab === 'cicd'}
                  className={`code-tab${codeTab === 'cicd' ? ' code-tab--active' : ''}`}
                  onClick={() => setCodeTab('cicd')}
                >
                  {t('integration.tab.cicd')}
                </button>
              </div>
              <span className="code-panel__lang">
                {codeTab === 'cicd' ? 'GitHub Actions (YAML)' : 'Rust (crates.io)'}
              </span>
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
            ) : codeTab === 'sync' ? (
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
            ) : (
              <pre><code><span className="syntax-comment"># .github/workflows/release.yml</span><br />
                <span className="syntax-keyword">name</span>: Release<br />
                <span className="syntax-keyword">jobs</span>:<br />
                {'  '}<span className="syntax-keyword">build-and-release</span>:<br />
                {'    '}<span className="syntax-keyword">runs-on</span>: windows-latest<br />
                {'    '}<span className="syntax-keyword">timeout-minutes</span>: 30 <span className="syntax-comment"># timeout guard</span><br />
                {'    '}<span className="syntax-keyword">steps</span>:<br />
                {'      '}- <span className="syntax-keyword">uses</span>: actions/checkout@v4<br />
                {'      '}- <span className="syntax-keyword">name</span>: Build Application<br />
                {'        '}<span className="syntax-keyword">run</span>: npm run build<br />
                {'      '}- <span className="syntax-keyword">name</span>: Publish to Ponte Mesh<br />
                {'        '}<span className="syntax-keyword">timeout-minutes</span>: 10<br />
                {'        '}<span className="syntax-keyword">env</span>:<br />
                {'          '}<span className="syntax-keyword">PONTEMESH_ORIGIN_URL</span>: <span className="syntax-string">&quot;${'{'}{'{'} secrets.PONTEMESH_ORIGIN_URL {'}'}{'}'}&quot;</span><br />
                {'          '}<span className="syntax-keyword">PONTEMESH_MCP_TOKEN</span>: <span className="syntax-string">&quot;${'{'}{'{'} secrets.PONTEMESH_MCP_TOKEN {'}'}{'}'}&quot;</span><br />
                {'          '}<span className="syntax-keyword">PONTEMESH_APPLICATION_TOKEN</span>: <span className="syntax-string">&quot;${'{'}{'{'} secrets.PONTEMESH_APPLICATION_TOKEN {'}'}{'}'}&quot;</span><br />
                {'          '}<span className="syntax-keyword">PONTEMESH_UPDATE_BUCKET</span>: <span className="syntax-string">&quot;app-updates&quot;</span><br />
                {'        '}<span className="syntax-keyword">run</span>: node scripts/publish-pontemesh-release.cjs<br />
                {'      '}- <span className="syntax-keyword">name</span>: GitHub Release (0 bytes storage)<br />
                {'        '}<span className="syntax-keyword">uses</span>: softprops/action-gh-release@v2<br />
                {'        '}<span className="syntax-keyword">with</span>:<br />
                {'          '}<span className="syntax-keyword">generate_release_notes</span>: true</code></pre>
            )}
          </div>
        </div>

        <details className="cicd-expandable motion-reveal">
          <summary className="cicd-expandable__summary">
            <div className="cicd-expandable__title">
              <span className="flow-badge flow-badge--pools">CI/CD &amp; Release</span>
              <strong>{t('cicd.summary.title')}</strong>
            </div>
            <span className="cicd-expandable__hint">{t('cicd.summary.hint')}</span>
          </summary>
          <div className="cicd-expandable__content">
            <p>{t('cicd.description')}</p>
            <table className="cicd-table">
              <thead>
                <tr>
                  <th>Secret</th>
                  <th>{t('cicd.table.description')}</th>
                  <th>{t('cicd.table.example')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>PONTEMESH_ORIGIN_URL</code></td>
                  <td>{t('cicd.secrets.originUrl')}</td>
                  <td><code>https://origin.example.com</code></td>
                </tr>
                <tr>
                  <td><code>PONTEMESH_MCP_TOKEN</code></td>
                  <td>{t('cicd.secrets.mcpToken')}</td>
                  <td><code>pm_mcp_...</code></td>
                </tr>
                <tr>
                  <td><code>PONTEMESH_APPLICATION_TOKEN</code></td>
                  <td>{t('cicd.secrets.appToken')}</td>
                  <td><code>pm_app_...</code></td>
                </tr>
                <tr>
                  <td><code>PONTEMESH_UPDATE_BUCKET</code></td>
                  <td>{t('cicd.secrets.updateBucket')}</td>
                  <td><code>app-updates</code></td>
                </tr>
              </tbody>
            </table>
            <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--muted)' }}>
              {t('cicd.note')}
            </p>
          </div>
        </details>
      </div>
    </section>
  )
}
