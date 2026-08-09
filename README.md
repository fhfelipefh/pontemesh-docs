# Ponte Mesh

Ponte Mesh is an open-source framework for controlled hybrid distribution of digital objects. It keeps the Origin as the control plane while authorized Replica/Edge nodes and peers can participate in the data plane. Every fragment is verified, and automatic fallback preserves validated progress.

[Open the Ponte Mesh website](https://fhfelipefh.github.io/pontemesh-docs/)

The public website is available in English, Brazilian Portuguese and Spanish. It introduces the architecture, explains the trust boundaries and provides the latest official Server and native SDK packages for each supported platform.

## Components

- [Ponte Mesh Server](https://github.com/fhfelipefh/pontemesh-server): runs as an Origin or Replica/Edge according to the persisted instance configuration.
- [Ponte Mesh SDK](https://github.com/fhfelipefh/pontemesh-sdk): embeds controlled hybrid downloads into Rust, C, C++, C# and Unity applications.
- [Ponte Mesh Docs](https://github.com/fhfelipefh/pontemesh-docs): public project website, usage entry point and release download portal.

## How a download works

1. The application asks the SDK for an object.
2. The SDK consults the Origin and receives a temporary access package.
3. The Origin supplies the authorized manifest, policies and eligible sources.
4. The SDK downloads fragments from authorized peers, Replica/Edge nodes or the Origin.
5. Every fragment is verified against the authorized manifest before becoming progress.
6. If an auxiliary source fails, the SDK falls back to the Origin without discarding validated fragments.

## Start using Ponte Mesh

### 1. Run an Origin

Download the latest Server package from the website, connect the instance to PostgreSQL and open its web panel. The initial setup defines the instance as an Origin and creates the administrative and S3-compatible credentials.

The Server documentation covers deployment, persistent storage, Docker, public URLs, S3-compatible access and Replica/Edge registration:

- [Server usage and deployment](https://github.com/fhfelipefh/pontemesh-server#readme)
- [Architecture](https://github.com/fhfelipefh/pontemesh-server/blob/main/docs/ARCHITECTURE.md)
- [Security model](https://github.com/fhfelipefh/pontemesh-server/blob/main/docs/SECURITY.md)

### 2. Integrate the native SDK

Download the package for the target platform and provide the Origin URL plus an application token:

```rust
use pontemesh_sdk_core::{
    p2p::P2pConfig, PontemeshClient, PontemeshClientConfig, SyncObjectRequest,
};

let client = PontemeshClient::new(PontemeshClientConfig {
    origin_url: "https://origin.example.com".to_string(),
    application_token: "application-token".to_string(),
    p2p: P2pConfig::default(),
})?;

let result = client.sync_object_with_summary(SyncObjectRequest {
    bucket: "game-assets".to_string(),
    key: "maps/desert-v3.pak".to_string(),
    destination: "./Game/Content/maps/desert-v3.pak".into(),
})?;
```

The SDK package includes the native library and the available C, C++, C# and Unity integration files. See the [SDK documentation](https://github.com/fhfelipefh/pontemesh-sdk#readme) for platform-specific usage.

## Official releases

The website reads the latest GitHub Release directly from the official Server and SDK repositories. It selects the matching platform asset and exposes the accompanying SHA-256 checksum and release manifest. If no public release exists yet, it links to the corresponding official releases page without presenting a placeholder package.

## Project links

- [Ponte Mesh documentation](https://fhfelipefh.github.io/pontemesh-docs/)
- [Ponte Mesh Server](https://github.com/fhfelipefh/pontemesh-server)
- [Ponte Mesh SDK](https://github.com/fhfelipefh/pontemesh-sdk)
- [Game Launcher Example](https://github.com/fhfelipefh/pontemesh-game-launcher-example)
