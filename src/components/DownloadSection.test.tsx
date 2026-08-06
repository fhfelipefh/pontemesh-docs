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

  it('limits the server selection to Windows', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })))
    render(<I18nProvider><DownloadSection /></I18nProvider>)

    fireEvent.click(screen.getByRole('button', { name: 'Server' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Linux' })).toBeDisabled())
    expect(screen.getByRole('button', { name: 'macOS' })).toBeDisabled()
    expect(screen.getByRole('link', { name: 'View server releases' })).toHaveAttribute('href', 'https://github.com/fhfelipefh/pontemesh-server/releases')
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
