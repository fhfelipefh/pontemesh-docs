export type ProductId = 'sdk' | 'server'
export type PlatformId = 'windows' | 'linux' | 'macos'

export interface ProductConfig {
  id: ProductId
  repository: string
  repositoryUrl: string
  releasesUrl: string
  platforms: PlatformId[]
}

export const products: Record<ProductId, ProductConfig> = {
  sdk: {
    id: 'sdk',
    repository: 'fhfelipefh/pontemesh-sdk',
    repositoryUrl: 'https://github.com/fhfelipefh/pontemesh-sdk',
    releasesUrl: 'https://github.com/fhfelipefh/pontemesh-sdk/releases',
    platforms: ['windows', 'linux', 'macos'],
  },
  server: {
    id: 'server',
    repository: 'fhfelipefh/pontemesh-server',
    repositoryUrl: 'https://github.com/fhfelipefh/pontemesh-server',
    releasesUrl: 'https://github.com/fhfelipefh/pontemesh-server/releases',
    platforms: ['windows'],
  },
}

export const platformLabels: Record<PlatformId, string> = {
  windows: 'Windows',
  linux: 'Linux',
  macos: 'macOS',
}

export const platformAssetKeys: Record<PlatformId, string> = {
  windows: 'windows-x64',
  linux: 'linux-x64',
  macos: 'macos-x64',
}
