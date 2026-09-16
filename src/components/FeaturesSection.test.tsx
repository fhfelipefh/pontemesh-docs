import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FeaturesSection } from './FeaturesSection'
import { I18nProvider } from '../i18n/I18nContext'

describe('FeaturesSection', () => {
  it('renders all core server and SDK capabilities', () => {
    render(
      <I18nProvider>
        <FeaturesSection />
      </I18nProvider>
    )

    expect(screen.getByText('S3-Compatible Object Storage')).toBeInTheDocument()
    expect(screen.getByText('Model Context Protocol (MCP)')).toBeInTheDocument()
    expect(screen.getByText('libp2p + Noise + Yamux P2P Stack')).toBeInTheDocument()
    expect(screen.getByText('Native Embeddable SDK Core')).toBeInTheDocument()
    expect(screen.getByText('Observability & Metrics')).toBeInTheDocument()
    expect(screen.getByText('Integrity & Zero-Loss Fallback')).toBeInTheDocument()
  })
})
