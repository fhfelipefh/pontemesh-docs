# Ponte Mesh

Ponte Mesh is an open-source framework for controlled hybrid distribution of digital objects. It keeps the Origin as the authoritative control plane while authorized Replica/Edge nodes and peers participate in the data plane. Every fragment is verified by cryptographic hash, and automatic fallback preserves validated progress without restarting downloads.

[Open the Ponte Mesh website](https://fhfelipefh.github.io/pontemesh-docs/)

The public website is available in English, Brazilian Portuguese, and Spanish. It introduces the architecture, explains trust boundaries, and provides the latest official Server and native SDK packages for each supported platform.

---

## Architecture & Components

Ponte Mesh combines centralized authority with decentralized delivery, providing high throughput while preventing unauthorized distribution:

- **[Ponte Mesh Server](https://github.com/fhfelipefh/pontemesh-server)**: A unified, production-grade service running as an **Origin** or **Replica/Edge** according to persisted configuration. Built in Rust with Axum and PostgreSQL.
  - **Origin Role**: Master control plane, object catalog, access authorization, temporary access package issuance, fragment manifest generation, metrics, audit logs, and ultimate fallback source.
  - **Replica/Edge Role**: Stable auxiliary node that replicates authorized content subsets to accelerate delivery and reduce Origin egress.
  - **S3-Compatible Storage API**: Dedicated listener (port 9000 by default) offering path-style object operations (`/{bucket}/{key}`), HTTP conditional requests (`ETag`, `If-None-Match`, `Cache-Control`), and S3 access key authentication.
  - **Model Context Protocol (MCP) Server**: Built-in Streamable HTTP (`/mcp`) interface with JSON-RPC for AI assistants (e.g. Gemini Spark, Claude, AI developer agents). Implements multi-auth models including **OAuth 2.0** with **RFC 9728** (Protected Resource Metadata), **RFC 8414**, **RFC 7591**, **RFC 7636 (PKCE)**, and Client Credentials Grant, as well as static Bearer tokens. Includes 20 specialized tools for storage management, configuration, and diagnostics.
  - **Operational Metrics & Observability**: Prometheus metrics endpoint, web dashboard with time-period filters (1h, 24h, 7d, 30d), and structured audit trails.
- **[Ponte Mesh SDK](https://github.com/fhfelipefh/pontemesh-sdk)**: Native, high-performance client library published on [crates.io as `pontemesh-sdk-core`](https://crates.io/crates/pontemesh-sdk-core).
  - **Disk-Streaming Engine**: Streams fragments directly to disk via temporary files, checks per-fragment SHA-256 integrity against the manifest, and swaps files atomically. If a transfer is interrupted, previously validated fragments remain in persistent cache and do not need to be re-downloaded.
  - **Modern P2P Transport**: Peer-to-peer data plane built on **libp2p** with **Noise** encryption, **Yamux** stream multiplexing, and **CBOR** serialization for secure, firewall-resilient fragment exchange.
  - **Multi-Platform Native Bindings**: Provides a C ABI (`pontemesh_sdk.dll`, `libpontemesh_sdk.so`, `libpontemesh_sdk.dylib`), C++ RAII wrappers, C# P/Invoke bindings, and Unity engine support.
- **[Ponte Mesh Docs](https://github.com/fhfelipefh/pontemesh-docs)**: Public documentation website, architectural guides, and official release portal.

---

## How a Download Works

```text
+-------------------+             1. Authorize              +-------------------+
|                   | ------------------------------------> |                   |
|                   | <------------------------------------ |      Origin       |
|                   |      2. Temporary Access Package      |  (Control Plane)  |
|                   |         (Manifest + Sources)          +-------------------+
|                   |                                                 |
|    Application    |             3a. Fetch Fragments (Fast Path)     | 3c. Fallback
|     with SDK      | <---------------------------------------+       |    (Preserves
|   (Data Plane)    |                                         |       |     progress)
|                   | <-----+ 3b. Verified P2P Fragments      |       |
+-------------------+       | (libp2p + Noise + Yamux)        |       |
          |                 |                                 |       |
          |       +-------------------+             +-------------------+
          |       |  Authorized Peer  |             |   Replica / Edge  |
          +-----> |   (Data Plane)    |             |   (Data Plane)    |
                  +-------------------+             +-------------------+
```

1. **Authorization Request**: The application requests an object from the SDK, which queries the authoritative Origin.
2. **Access Package Issuance**: The Origin validates application credentials and issues an ephemeral access package containing the signed fragment manifest (with SHA-256 checksums), policies, and eligible source nodes (Origin, Replicas, and authorized peers).
3. **Hybrid Fragment Retrieval**: The SDK concurrently retrieves fragments across eligible sources.
4. **Integrity Validation**: Every downloaded fragment is verified against the manifest before being committed.
5. **Zero-Loss Fallback**: If an auxiliary node or peer times out or fails hash verification, the SDK immediately falls back to the Origin for that specific fragment—without discarding already validated progress.
6. **Atomic Assembly**: Once all fragments pass verification, the SDK atomically stages the file to its final destination.

---

## Quick Start

### 1. Run Ponte Mesh Server

Download the Server package for your platform or start it via Docker Compose:

```bash
PONTEMESH_POSTGRES_PASSWORD='your-strong-password' \
docker compose -p ponte-mesh -f docker/docker-compose.yml up -d --build
```

The server opens two listeners:
- **Web Administration Panel**: `http://localhost:8080`
- **S3-Compatible Object Storage**: `http://localhost:9000`

#### Bootstrap with Local AI Setup (`setup-agent`)

To automatically configure an Origin instance and enable the Model Context Protocol (MCP) for AI assistants (like Gemini or Claude):

```bash
pontemesh setup-agent
```

This command provisions the database, creates the administrator user and S3 credentials, generates a dedicated MCP token with granular scopes (`read`, `write`, `admin`), and saves the connection profile to `$PONTEMESH_HOME/secrets/setup-agent-mcp.json`.

#### S3 API Access

Use standard S3 tools (such as the AWS CLI or SDKs) with path-style addressing:

```bash
# List buckets
aws --endpoint-url http://localhost:9000 s3api list-buckets

# Upload an object
aws --endpoint-url http://localhost:9000 s3api put-object \
  --bucket game-assets \
  --key maps/desert-v3.pak \
  --body ./desert-v3.pak
```

---

### 2. Integrate the Native SDK

Add the SDK dependency to your `Cargo.toml`:

```toml
[dependencies]
pontemesh-sdk-core = "0.2.2"
```

#### Production Disk-Streaming (Recommended)

For large assets, game files, and software updates, use disk-streaming. It stores validated chunks in a persistent cache, resumes after interruptions, and ensures atomic installation:

```rust
use std::path::PathBuf;
use pontemesh_sdk_core::{
    p2p::P2pConfig, CancellationToken, PontemeshClient,
    PontemeshClientConfig, SyncObjectRequest,
};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = PontemeshClient::new(PontemeshClientConfig {
        origin_url: "https://origin.example.com".to_string(),
        application_token: "pm_app_exampletoken123".to_string(),
        p2p: P2pConfig::default(),
    })?;

    let cancellation = CancellationToken::default();

    let summary = client.sync_object_to_disk_with_options(
        SyncObjectRequest {
            bucket: "game-assets".to_string(),
            key: "maps/desert-v3.pak".to_string(),
            destination: PathBuf::from("./Game/Content/maps/desert-v3.pak"),
        },
        None, // optional progress callback reporting validated bytes
        cancellation,
    )?;

    println!(
        "Download complete! From peers: {} bytes, replicas: {} bytes, origin: {} bytes",
        summary.bytes_from_peer,
        summary.bytes_from_replica,
        summary.bytes_from_origin
    );

    Ok(())
}
```

#### Asynchronous UI Integration

For desktop, launcher, or GUI applications, use `sync_object_to_disk_async` with real-time progress callbacks:

```rust
let (summary, stats) = client.sync_object_to_disk_async(
    request,
    Some(Box::new(|progress| {
        println!(
            "Progress: {}/{} bytes ({:.1}%)",
            progress.validated_bytes,
            progress.total_bytes,
            (progress.validated_bytes as f64 / progress.total_bytes as f64) * 100.0
        );
    })),
    cancellation,
).await?;
```

#### Native Bindings for Other Languages

The SDK distribution includes native libraries and integration wrappers:
- **C / C++**: Header files and dynamic libraries (`pontemesh_sdk.dll`, `libpontemesh_sdk.so`, `libpontemesh_sdk.dylib`) located under `bindings/c` and `bindings/cpp`.
- **C# / .NET**: P/Invoke wrapper for desktop applications under `bindings/csharp`.
- **Unity**: Ready-to-import Unity package and scripts under `bindings/unity`.

---

## Model Context Protocol (MCP) Integration

Ponte Mesh Server includes a native MCP implementation over Streamable HTTP (`POST /mcp`, SSE `GET text/event-stream`, and session teardown `DELETE /mcp`).

### Supported Features
- **Multi-Auth Models**: `hybrid` (Bearer tokens + OAuth 2.0), `oauth2` (pure OAuth 2.0 with PKCE and Client Credentials), and `token` (static pre-shared Bearer).
- **Gemini Spark & AI Agents**: Full compliance with RFC 9728 (Protected Resource Metadata at `/.well-known/oauth-protected-resource/mcp`) and RFC 8414.
- **20 Operational Tools**:
  - *Read*: `pontemesh_get_instance_status`, `pontemesh_get_storage_summary`, `pontemesh_list_buckets`, `pontemesh_get_bucket`, `pontemesh_list_objects`, `pontemesh_get_object_metadata`, `pontemesh_get_health`, `pontemesh_get_recent_audit_events`, `pontemesh_export_configuration`, `pontemesh_get_ai_connection_guide`.
  - *Write* (guarded by `writeToolsEnabled` on Origin): `pontemesh_create_bucket`, `pontemesh_delete_bucket`, `pontemesh_put_text_object`, `pontemesh_put_base64_object`, `pontemesh_delete_object`.
  - *Admin* (guarded by `adminToolsEnabled` on Origin): `pontemesh_update_bucket_policy`, `pontemesh_import_configuration`, `pontemesh_list_credentials`, `pontemesh_create_application_credential`, `pontemesh_create_s3_access_key`.
- **Resources**: `pontemesh://instance/status`, `pontemesh://storage/summary`, `pontemesh://buckets`, `pontemesh://buckets/{bucket}/objects`, etc.

---

## Official Releases

The website reads the latest GitHub Releases directly from the official Server and SDK repositories:
- Packages are automatically provided for **Windows x64**, **Linux x64**, **macOS Intel (x64)**, and **macOS ARM (Apple Silicon)**.
- Every release includes accompanying SHA-256 checksums and release manifests for verification.

---

## Documentation & Project Links

- [Official Documentation & Portal](https://fhfelipefh.github.io/pontemesh-docs/)
- [Ponte Mesh Server Repository](https://github.com/fhfelipefh/pontemesh-server)
  - [Architecture Specification](https://github.com/fhfelipefh/pontemesh-server/blob/main/docs/ARCHITECTURE.md)
  - [Security Model & Threat Matrix](https://github.com/fhfelipefh/pontemesh-server/blob/main/docs/SECURITY.md)
  - [MCP API Guide](https://github.com/fhfelipefh/pontemesh-server/blob/main/docs/api/mcp.md)
  - [Configuration Reference](https://github.com/fhfelipefh/pontemesh-server/blob/main/docs/CONFIGURATION.md)
- [Ponte Mesh SDK Repository](https://github.com/fhfelipefh/pontemesh-sdk)
  - [`pontemesh-sdk-core` on crates.io](https://crates.io/crates/pontemesh-sdk-core)
- [Example Game Launcher](https://github.com/fhfelipefh/pontemesh-game-launcher-example)
