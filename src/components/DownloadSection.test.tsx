import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DownloadSection } from './DownloadSection'
import { I18nProvider } from '../i18n/I18nContext'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('DownloadSection', () => {
  it('shows the honest no-release state and official releases link', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })))
    const { container } = render(<I18nProvider><DownloadSection /></I18nProvider>)

    expect(await screen.findByText('No published release yet')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View SDK releases' })).toHaveAttribute('href', 'https://github.com/fhfelipefh/pontemesh-sdk/releases')
    expect(screen.queryByText(/SHA-256/)).not.toBeInTheDocument()
    expect(container.querySelector('.release-visual')).toBeInTheDocument()
  })

  it('offers all supported server platforms and disables unsupported ones', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })))
    render(<I18nProvider><DownloadSection /></I18nProvider>)

    fireEvent.click(screen.getByRole('button', { name: 'Server' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Linux' })).toBeEnabled())
    expect(screen.getByRole('button', { name: 'macOS Intel' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'macOS ARM' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Linux ARM' })).toBeDisabled()
    expect(screen.getByRole('link', { name: 'View server releases' })).toHaveAttribute('href', 'https://github.com/fhfelipefh/pontemesh-server/releases')
  })

  it('enables Linux ARM for SDK and uses the linux-arm64 asset when available', async () => {
    const response = {
      tag_name: 'v1.0.0',
      html_url: 'https://github.com/fhfelipefh/pontemesh-sdk/releases/tag/v1.0.0',
      published_at: '2026-08-06T12:00:00Z',
      assets: [
        { name: 'pontemesh-sdk-v1.0.0-linux-arm64.tar.gz', browser_download_url: 'https://example.test/sdk-linux-arm64.tar.gz', size: 3_500_000 },
      ],
    }
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify([response]), { status: 200 }))))
    render(<I18nProvider><DownloadSection /></I18nProvider>)

    const armButton = screen.getByRole('button', { name: 'Linux ARM' })
    expect(armButton).toBeEnabled()
    fireEvent.click(armButton)

    const download = await screen.findByRole('link', { name: 'Download v1.0.0' })
    expect(download).toHaveAttribute('href', 'https://example.test/sdk-linux-arm64.tar.gz')
    expect(screen.getByText(/pontemesh-sdk-v1.0.0-linux-arm64.tar.gz/)).toBeInTheDocument()
    expect(screen.getByText(/Linux ARM64/)).toBeInTheDocument()
  })

  it('uses the platform asset as the direct download when available', async () => {
    const response = {
      tag_name: 'v1.0.0',
      html_url: 'https://github.com/fhfelipefh/pontemesh-sdk/releases/tag/v1.0.0',
      published_at: '2026-08-06T12:00:00Z',
      assets: [{ name: 'pontemesh-sdk-v1.0.0-windows-x64.zip', browser_download_url: 'https://example.test/sdk.zip', size: 2_000_000 }],
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([response]), { status: 200 })))
    render(<I18nProvider><DownloadSection /></I18nProvider>)

    const download = await screen.findByRole('link', { name: 'Download v1.0.0' })
    expect(download).toHaveAttribute('href', 'https://example.test/sdk.zip')
    expect(screen.getByText(/pontemesh-sdk-v1.0.0-windows-x64.zip/)).toBeInTheDocument()
  })
})
