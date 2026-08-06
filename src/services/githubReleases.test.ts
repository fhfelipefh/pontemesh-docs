import { describe, expect, it, vi } from 'vitest'
import { products } from '../config'
import { findPlatformAsset, formatBytes, getLatestRelease, type ReleaseAsset } from './githubReleases'

const assets: ReleaseAsset[] = [
  { name: 'pontemesh-sdk-v1.2.3-linux-x64.tar.gz.sha256', browser_download_url: 'checksum', size: 64 },
  { name: 'pontemesh-sdk-v1.2.3-linux-x64.tar.gz', browser_download_url: 'linux', size: 4_200_000 },
  { name: 'pontemesh-sdk-v1.2.3-windows-x64.zip', browser_download_url: 'windows', size: 5_300_000 },
]

describe('GitHub release helpers', () => {
  it('selects the archive and ignores its checksum', () => {
    expect(findPlatformAsset(assets, 'linux')?.browser_download_url).toBe('linux')
  })

  it('formats package sizes for display', () => {
    expect(formatBytes(4_200_000)).toBe('4.0 MB')
    expect(formatBytes(2_048)).toBe('2 KB')
  })

  it('treats a repository without releases as an empty state', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })))
    await expect(getLatestRelease(products.sdk, 'windows')).resolves.toEqual({ status: 'empty' })
    vi.unstubAllGlobals()
  })

  it('returns the matching asset from the latest release', async () => {
    const response = {
      tag_name: 'v1.2.3',
      html_url: 'https://github.com/example/releases/v1.2.3',
      published_at: '2026-08-06T12:00:00Z',
      assets,
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([response]), { status: 200 })))
    const result = await getLatestRelease(products.sdk, 'windows')
    expect(result.status).toBe('available')
    if (result.status === 'available') expect(result.asset.browser_download_url).toBe('windows')
    vi.unstubAllGlobals()
  })
})
