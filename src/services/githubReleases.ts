import { platformAssetKeys, type PlatformId, type ProductConfig } from '../config'

export interface ReleaseAsset {
  name: string
  browser_download_url: string
  size: number
}

interface GitHubRelease {
  tag_name: string
  html_url: string
  published_at: string
  assets: ReleaseAsset[]
}

export type ReleaseResult =
  | { status: 'available'; release: GitHubRelease; asset: ReleaseAsset }
  | { status: 'empty' }
  | { status: 'unavailable' }

export function findPlatformAsset(assets: ReleaseAsset[], platform: PlatformId) {
  const key = platformAssetKeys[platform]
  return assets.find((asset) => {
    const name = asset.name.toLowerCase()
    return name.includes(key) && !name.endsWith('.sha256') && !name.endsWith('.json')
  })
}

export async function getLatestRelease(
  product: ProductConfig,
  platform: PlatformId,
  signal?: AbortSignal,
): Promise<ReleaseResult> {
  try {
    const response = await fetch(`https://api.github.com/repos/${product.repository}/releases?per_page=1`, {
      signal,
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })

    if (response.status === 404) return { status: 'empty' }
    if (!response.ok) return { status: 'unavailable' }

    const releases = (await response.json()) as GitHubRelease[]
    const release = releases[0]
    if (!release) return { status: 'empty' }
    const asset = findPlatformAsset(release.assets, platform)
    return asset ? { status: 'available', release, asset } : { status: 'empty' }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    return { status: 'unavailable' }
  }
}

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
