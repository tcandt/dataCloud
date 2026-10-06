# DataCloud

[English](README.md) | [Tiếng Việt](README.vi.md)

**DataCloud is an independent third-party platform for managing databases through
a website.** Connect existing databases to one web console to browse collections,
run bounded queries, manage connections and perform authorized data changes.
The workflow is in the same category as [DbGate](https://dbgate.org): a management
interface above database engines. DataCloud is an independent project with no
affiliation to DbGate.

The application is proprietary. This public repository contains Docker deployment
files, setup scripts, version history and operating instructions. Application
source is stored privately; public images contain compiled executable code.

## How It Works

```text
Browser -> DataCloud website/API -> database adapter -> your database
                         |
                         +-> PostgreSQL (DataCloud accounts and metadata)
```

Data stays in the connected database; DataCloud stores account, project,
connection and audit metadata in its own PostgreSQL database. Connection
credentials are encrypted in the server-side vault. Browsers communicate with
the DataCloud API; database credentials are not returned to the browser.
DataCloud is a management layer, not a new database engine or a fork of MongoDB
or the upstream DocumentDB project.

### Connectors in This Preview

| Connector / component | Status in 0.1.2 |
| --- | --- |
| MongoDB adapter | Implemented; local MongoDB 4.4.29 TLS and synthetic CRUD verified |
| DocumentDB adapter | Uses the MongoDB-compatible gateway; live upstream endpoint verification pending |
| Demo adapter | Synthetic data only; cannot connect to real database targets |
| PostgreSQL container | DataCloud metadata storage; not a user database connector |
| Other database engines | Future integrations; not implemented or verified in this release |

Available actions depend on the endpoint, credentials and provider capabilities.
An unsupported capability is shown as unavailable. The DbGate comparison
describes the intended workflow, not equivalent connector coverage or features.

## Version

Current release: **0.1.2**. Each release has a Git tag, a versioned image,
release notes and a [changelog](CHANGELOG.md). See [version.json](version.json).

```text
ghcr.io/tcandt/datacloud:0.1.2
ghcr.io/tcandt/datacloud-certificates:0.1.2
```

Both images publish `linux/amd64` and `linux/arm64` under the same version tag.
Docker chooses the image matching the host CPU. No application source build
is required. The runtime includes minified compiled code and third-party notices.

## Supported Deployment Targets

| Host | Docker mode | CPU |
| --- | --- | --- |
| Windows Docker Desktop | Linux containers, WSL2 | AMD64 / ARM64 where supported by Docker Desktop |
| Ubuntu, Debian and other Linux | Docker Engine with Compose v2 | AMD64 / ARM64 |
| macOS Intel | Docker Desktop Linux VM | AMD64 |
| macOS Apple Silicon | Docker Desktop Linux VM | ARM64 |
| NAS | Docker Engine with Compose v2 | AMD64 / ARM64 |

The platform targets are image architectures, not claims of testing on every
host listed. AMD64 Docker Desktop and ARM64 application emulation have been
tested locally. Native NAS and macOS hardware have not been tested.
ARM32, native Windows containers and other CPU architectures are not supported
by this release. Requirements: Docker with Compose v2, persistent storage and
at least 4 GB available RAM for the full stack.

## Install

Clone this repository or extract the deployment ZIP from GitHub Releases.
Setup defaults to `https://localhost:8443`. Enter your own HTTPS website origin,
administrator email and password during setup. There is no default administrator
email. No SMTP or Google account is required for the first owner.

Choose **E (external)** to run DataCloud against databases you already operate.
This is the default for new interactive setups: website/API, metadata PostgreSQL
and nginx run together, without a starter MongoDB. Enter the approved database
hostnames/IPs during setup, then add credentials privately through Connections.
Choose **l (local)** to include a starter MongoDB. Existing configurations retain
their current mode. `COMPOSE_FILE` in the private `.env` selects the matching stack.

Linux, Ubuntu, macOS and NAS:

```sh
docker run --rm -it --user "$(id -u):$(id -g)" \
  -v "$PWD:/workspace" -w /workspace \
  node:24.15.0-bookworm-slim node scripts/nas-configure.mjs
sh deploy/nas/start.sh
```

Windows PowerShell, from the repository directory:

```powershell
docker run --rm -it --mount "type=bind,source=$($PWD.Path),target=/workspace" `
  -w /workspace node:24.15.0-bookworm-slim node scripts/nas-configure.mjs
powershell -ExecutionPolicy Bypass -File deploy/nas/start.ps1
```

In local mode, answer `n` to reuse existing MongoDB data for a new database. To reuse existing
data, back it up, stop the old MongoDB container and enter its absolute host
path and current password. Windows paths use forward slashes, e.g. `D:/mongo/data`.
The stack uses MongoDB 4.4.29 to preserve the supplied database version. It is
not the PostgreSQL-based upstream DocumentDB engine. No automatic data upgrade
or migration is performed.

Setup creates `deploy/nas/.env` and `deploy/nas/secrets/` once. Preserve these
files, especially vault keys. Keep the secrets directory restricted to your
host account; Compose secrets are host files, not an encrypted secret store.
On Windows, review directory permissions so other local accounts cannot read it.

The local stack starts the website/API, PostgreSQL metadata store, MongoDB and nginx.
Services restart with Docker unless explicitly stopped. Enable Docker startup
at boot; Docker Desktop may start only after you sign in.

### Install From Image Archives

GitHub Releases also supply application and certificate images in TAR archives
for each CPU architecture. Use the `linux-amd64` archive on Intel/AMD hosts or
`linux-arm64` on Apple Silicon and ARM64 NAS. Check SHA256SUMS.txt, load the
matching archive, then use your configured deployment directory:

```sh
docker load -i datacloud-images-v0.1.2-linux-amd64.tar
DATACLOUD_NO_PULL=1 sh deploy/nas/start.sh
```

On PowerShell, set `$env:DATACLOUD_NO_PULL='1'` before running `start.ps1`.
This skips registry downloads of installed images. PostgreSQL, MongoDB, nginx
and optional cloudflared still need to be installed from their official registries
unless already present locally. Archive installation requires no GHCR login.

## Website and Tunnel

For Cloudflare Tunnel, enter a fresh token during setup, then configure:

| Field | Value |
| --- | --- |
| Public hostname | Your own website hostname, configured privately |
| Service type | HTTP |
| Service URL | `ingress:8080` |

Open your configured website origin followed by `/login`. Supplying no token
leaves the public tunnel disabled. Local HTTPS defaults to
`https://localhost:8443`, using a private CA; import your local CA before using it.
Your real hostname, administrator identity, credentials and tunnel token belong
only in the ignored local `.env` and `secrets/` files. Do not commit them or
include them in shared archives, screenshots, issues or release notes.

Databases have no published host ports by default. For an explicit local MongoDB
port, use `deploy/nas/compose.mongo-port.yaml`. Export the CA from the stack:

```sh
cd deploy/nas
docker compose cp app:/run/tls/ca.pem ./nas-public-ca.pem
```

## Connect Your Existing Database

Local mode includes a starter MongoDB container; external mode does not. Add
an approved external MongoDB or DocumentDB gateway in the website's Connections
view. Add its hostname to `DATABASE_ALLOWED_HOSTS` in your private
`deploy/nas/.env`, preserving `documentdb` if using the starter connection, then
restart the application. Example with a reserved documentation hostname:

```dotenv
DATABASE_ALLOWED_HOSTS=documentdb,mongo.example.invalid
DATABASE_ALLOW_PRIVATE=true
```

Ensure the application container can reach the host and trusts its TLS CA.
For a private CA, expand **Private certificate authority** in the connection
dialog and paste only the PEM CA certificate bundle. It is encrypted alongside
the URI and is never returned by read APIs. Credential rotation keeps the current
CA by default; you can explicitly replace it or select system trust.
Plaintext database endpoints must enable TLS before DataCloud can connect.
Enter the URI privately in Connections with authentication, `tls=true` and
`directConnection=true`. Use a least-privilege database account. This preview
accepts one direct seed and default/SCRAM authentication; SRV, multiple seeds
and topology discovery are unavailable. A hostname allowlist does not establish
network reachability or prove endpoint compatibility. Validate the actual target
before relying on it for operations.

To select external mode on an existing installation, back up the private
configuration and data, set `COMPOSE_FILE=compose.external.yaml`, and configure
the approved hostnames. Existing starter connection records are preserved;
remove those records in the website if no longer needed. Switching Compose
files does not stop a previously running starter MongoDB automatically. Stop
that service explicitly using the old local Compose file when appropriate;
do not delete its data. No external database URI is bootstrapped automatically.

## Update and Recovery

Read the target release notes, back up MongoDB data, PostgreSQL data, secrets
and certificate volumes, then download that release's deployment files.
Keep your populated `.env`, secrets and volumes. Set `APP_TAG` in `.env` to the
target version and run the start script. It pulls and starts that exact version.
Do not use `docker compose down -v`; it deletes persistent volumes.
Automatic major database upgrades are not part of an application update.
Database schema changes may prevent downgrades; follow the notes for each release.
Version 0.1.2 writes a versioned encrypted connection envelope when creating or
rotating connections. Old raw-URI records remain readable in 0.1.2. Versions
0.1.1 and earlier cannot read new envelopes; do not downgrade after these changes
without restoring the matching pre-upgrade metadata backup and vault keys.

Legal content remains draft. SMTP/Google live verification is deferred.
Public images contain executable code that can be inspected; private source
storage and encrypted backups do not make distributed code impossible to recover.

## License

Deployment files: [MIT](LICENSE). Application: [proprietary](APPLICATION-LICENSE.txt).
Third-party software retains its original licenses. AI assistance was used
substantially in implementation and release preparation.
