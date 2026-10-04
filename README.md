# Ponte Mesh

Ponte Mesh is an open-source framework for controlled hybrid distribution of digital objects. It keeps the Origin as the authoritative control plane while authorized Replica/Edge nodes and peers participate in the data plane. Every fragment is verified by cryptographic hash, and automatic fallback preserves validated progress without restarting downloads.

[Open the Ponte Mesh website](https://fhfelipefh.github.io/pontemesh-docs/)

The public website is available in English, Brazilian Portuguese, and Spanish. It introduces the architecture, explains trust boundaries, and provides the latest official Server and native SDK packages for each supported platform.

---

## Architecture & Components

Ponte Mesh combines centralized authority with decentralized delivery, providing high throughput while preventing unauthorized distribution:

- **[Ponte Mesh Server](https://github.com/fhfelipefh/pontemesh-server)**: A unified, production-grade service running as an **Origin** or **Replica/Edge** according to persisted configuration. Built in Rust with Axum and PostgreSQL.
  - **Origin Role**: Master control plane, multi-drive object catalog, access authorization, temporary access package issuance, fragment manifest generation, software release versioning, egress telemetry, audit logs, and ultimate fallback source.
  - **Replica/Edge Role**: Stable auxiliary node that replicates authorized content subsets to accelerate delivery and reduce Origin egress.
  - **Multi-Drive Storage Pools & Zero-Downtime Hot-Drain**: Dynamic storage pooling across multiple physical mount points without LVM/RAID complexity. Features independent per-drive DiskGuard telemetry, intelligent write allocation (`MOST_AVAILABLE_FREE_SPACE`, `ROUND_ROBIN`), write overflow failover, and cryptographic SHA-256 hot-drain for online drive swaps.
  - **Software Release Versioning & Launcher Security**: Dedicated low-overhead update check endpoint (`GET /pontemesh/updates/...`) supporting SemVer, Build Number, Channel, and Tag schemes, coupled with least-privilege `launcher` application credentials for desktop game clients.
  - **Consolidated Egress Offload Telemetry & Cloud Savings**: Unified telemetry calculating origin bandwidth relief across P2P and Replica paths, with automated cloud cost savings estimates ($0.08/GB benchmark), web console efficiency dashboards, and dedicated MCP streaming resources.
  - **S3-Compatible Storage API**: Dedicated listener (port 9000 by default) offering path-style object operations (`/{bucket}/{key}`), SigV4 query canonicalization, HTTP conditional requests (`ETag`, `If-None-Match`, `Cache-Control`), and S3 access key authentication.
  - **Model Context Protocol (MCP) Server**: Built-in Streamable HTTP (`/mcp`) interface with JSON-RPC for AI assistants (e.g. Gemini Spark, Claude, AI developer agents). Implements multi-auth models including **OAuth 2.0** with **RFC 9728** (Protected Resource Metadata), **RFC 8414**, **RFC 7591**, **RFC 7636 (PKCE)**, and Client Credentials Grant, as well as static Bearer tokens. Includes 27 specialized operational tools, live streaming resources, guided prompts, and the `setup-agent` CLI.
  - **Operational Metrics & Observability**: Prometheus metrics endpoint, consolidated egress offload statistics, web dashboard with time-period filters (1h, 24h, 7d, 30d, all), and structured audit trails.
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

#### Multi-Drive Storage Pools & Hot-Drain

Operators can attach multiple disks or mount points in `instance.toml` without LVM or RAID setups:

```toml
[storage.local]
path = "/var/lib/pontemesh/storage" # Primary drive (default)
extra_paths = [
    "/mnt/nvme-drive2",
    "/mnt/storage-drive3"
]
allocation_strategy = "MOST_AVAILABLE_FREE_SPACE" # Options: MOST_AVAILABLE_FREE_SPACE, ROUND_ROBIN
```

- **Per-Drive DiskGuard**: Monitors health and free space independently per mount point. If a drive becomes full, incoming writes automatically overflow to healthy drives.
- **Zero-Downtime Hot-Drain**: To replace or retire a disk, operators trigger drive evacuation via API (`POST /api/admin/storage/drives/{drive_id}/drain`), the web console, or MCP (`pontemesh_drain_storage_drive`). Objects are migrated in the background with cryptographic SHA-256 validation and atomic catalog updates before the drive is detached.

#### Software Release Versioning & Launcher Verification

Game launchers and client applications can query updates with near-zero latency and no catalog overhead:

```http
GET /pontemesh/updates/{bucket_name}/{software_id}?current={version}
```

Buckets configure an immutable `release_versioning_scheme` (`SEMVER`, `BUILD_NUMBER`, `CHANNEL`, `TAG`). Launchers connect using hyper-scoped credentials created with the `launcher` preset, which grants update checking and fragment access without write privileges or catalog exposure.

#### Consolidated Egress Offload Telemetry

Monitor origin server protection and cloud bandwidth cost reduction via `GET /api/admin/metrics/offload`:

- Reports `total_bytes_demanded`, `origin_offload_bytes`, and ratio percentages across P2P and Replica distribution.
- Computes real-time monetary ROI and estimated cloud egress savings based on industry-standard public bandwidth benchmarks ($0.08/GB).
#### CI/CD & Automated Delivery with GitHub Actions (Zero GitHub Storage)

<details>
<summary><strong>Click to expand GitHub Actions release pipeline guide</strong></summary>

Distribute desktop application installers (`.exe`, `.msi`) and software updates exclusively through Ponte Mesh S3 object storage without consuming costly GitHub Release asset storage.

##### Required GitHub Secrets (Repository Settings &rarr; Secrets and variables &rarr; Actions)
- `PONTEMESH_ORIGIN_URL`: Public HTTPS URL of your Ponte Mesh Origin server (e.g. `https://origin.example.com`).
- `PONTEMESH_MCP_TOKEN`: Bearer token for the Model Context Protocol endpoint (`pm_mcp_...`), used to request short-lived S3 access credentials dynamically during workflow execution.
- `PONTEMESH_APPLICATION_TOKEN`: Client application credential (`pm_app_...`) created with the `launcher` preset to verify update resolution endpoints.
- `PONTEMESH_UPDATE_BUCKET`: Target storage bucket configured with a release versioning scheme (e.g. `app-updates`).

##### Workflow Example (`.github/workflows/release.yml`)
```yaml
name: Release Windows
on:
  workflow_dispatch:

jobs:
  build-and-release:
    runs-on: windows-latest
    timeout-minutes: 30 # Guard against pipeline timeout leaks

    steps:
      - uses: actions/checkout@v4

      - name: Build Application
        run: npm run build

      - name: Publish to Ponte Mesh (Exclusive Distribution)
        timeout-minutes: 10
        env:
          PONTEMESH_ORIGIN_URL: ${{ secrets.PONTEMESH_ORIGIN_URL }}
          PONTEMESH_MCP_TOKEN: ${{ secrets.PONTEMESH_MCP_TOKEN }}
          PONTEMESH_APPLICATION_TOKEN: ${{ secrets.PONTEMESH_APPLICATION_TOKEN }}
          PONTEMESH_UPDATE_BUCKET: ${{ secrets.PONTEMESH_UPDATE_BUCKET || 'app-updates' }}
        run: |
          node scripts/publish-pontemesh-release.cjs

      - name: Publish GitHub Release (Tag & Notes Only - Zero GitHub Storage)
        uses: softprops/action-gh-release@v2
        with:
          generate_release_notes: true
          # Binaries are distributed exclusively via Ponte Mesh
```

##### Key Highlights
1. **Dynamic Ephemeral S3 Credentials**: Calling the MCP tool `pontemesh_create_s3_access_key` using `PONTEMESH_MCP_TOKEN` dynamically generates temporary, isolated S3 credentials during the build.
2. **SigV4 Upload**: Binaries are transferred over TLS directly to the Ponte Mesh S3 endpoint using AWS SigV4 signed requests.
3. **Atomic Catalog Verification**: The manifest (`release.json`) and executable objects are validated in the catalog (`pontemesh_list_objects`) and checked via `GET /pontemesh/updates/...`.
4. **Zero GitHub Storage**: Release notes and git tags are maintained on GitHub, while large binary installers (tens or hundreds of megabytes) are hosted on Ponte Mesh.
</details>

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
- **27 Operational Tools**:
  - *Read (15 tools)*: `pontemesh_get_instance_status`, `pontemesh_get_storage_summary`, `pontemesh_list_buckets`, `pontemesh_get_bucket`, `pontemesh_get_bucket_policy`, `pontemesh_check_software_update`, `pontemesh_list_objects`, `pontemesh_get_object_metadata`, `pontemesh_get_health`, `pontemesh_get_recent_audit_events`, `pontemesh_export_configuration`, `pontemesh_get_ai_connection_guide`, `pontemesh_speed_test`, `pontemesh_get_offload_metrics`, `pontemesh_list_storage_drives`.
  - *Write (5 tools, guarded by `writeToolsEnabled` on Origin)*: `pontemesh_create_bucket`, `pontemesh_delete_bucket`, `pontemesh_put_text_object`, `pontemesh_put_base64_object`, `pontemesh_delete_object`.
  - *Admin (7 tools, guarded by `adminToolsEnabled` on Origin)*: `pontemesh_update_bucket_policy`, `pontemesh_import_configuration`, `pontemesh_list_credentials`, `pontemesh_create_application_credential` (with `launcher` preset), `pontemesh_create_s3_access_key`, `pontemesh_add_storage_drive`, `pontemesh_drain_storage_drive`.
- **Live Streaming Resources**:
  - `pontemesh://instance/status` and `pontemesh://instance/health`: Instance operating status and system health.
  - `pontemesh://storage/summary` and `pontemesh://storage/drives`: Storage utilization and per-drive pool health.
  - `pontemesh://buckets`, `pontemesh://buckets/{bucket}`, `pontemesh://buckets/{bucket}/policy`, and `pontemesh://buckets/{bucket}/objects`: Bucket topology, policies, and object indexes.
  - `pontemesh://audit/recent`: Structured operational audit log trail.
  - `pontemesh://metrics/offload`: Real-time egress offload efficiency, breakdown, and estimated cloud savings.
- **Guided AI Prompts**:
  - `diagnose_instance`: Diagnoses operational health and recent events.
  - `summarize_storage`: Analyzes storage volume and pool disk usage.
  - `analyze_bucket_growth`: Evaluates bucket expansion and content distributions.
  - `review_recent_errors`: Audits recent failures and access anomalies.
  - `check_software_releases`: Inspects release schemes and client software updates.
  - `analyze_egress_offload`: Evaluates hybrid distribution offload rates and cloud savings.
  - `manage_storage_drives`: Guides drive pool expansion and hot-drain replacement.

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
