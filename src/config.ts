export type ProductId = 'sdk' | 'server'
export type PlatformId = 'windows' | 'linux' | 'macos-intel' | 'macos-arm'

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
    platforms: ['windows', 'linux', 'macos-intel', 'macos-arm'],
  },
  server: {
    id: 'server',
    repository: 'fhfelipefh/pontemesh-server',
    repositoryUrl: 'https://github.com/fhfelipefh/pontemesh-server',
    releasesUrl: 'https://github.com/fhfelipefh/pontemesh-server/releases',
    platforms: ['windows', 'linux', 'macos-intel', 'macos-arm'],
  },
}

export const platformLabels: Record<PlatformId, string> = {
  windows: 'Windows',
  linux: 'Linux',
  'macos-intel': 'macOS Intel',
  'macos-arm': 'macOS ARM',
}

export const platformPackageLabels: Record<PlatformId, string> = {
  windows: 'Windows x64',
  linux: 'Linux x64',
  'macos-intel': 'macOS Intel x64',
  'macos-arm': 'macOS ARM64',
}

export const platformAssetKeys: Record<PlatformId, string> = {
  windows: 'windows-x64',
  linux: 'linux-x64',
  'macos-intel': 'macos-x64',
  'macos-arm': 'macos-arm64',
}
