# Release 0.1.2 Verification / Kiểm tra bản phát hành

Date / Ngày: 2026-10-06.

This receipt distinguishes checks of this release from earlier runtime evidence.
Connector availability is documented in [English](README.md) and
[Vietnamese](README.vi.md). It does not establish compatibility with every engine
or Docker host.

## 0.1.2 release checks / Kiểm tra bản phát hành

The final executable source is private tag `v0.1.2`, revision
`2fafc6787a9c20a41694d478696a0dc2b220e875`. Later receipt-only commits do not
change that image source. The combined source passed 218 unit, integration and
security tests, TypeScript, client build, minified distribution build and
compiled runtime smoke locally and in the final private image workflow.

| Check / Kiểm tra | Result / Kết quả |
| --- | --- |
| Official AMD64 application image | External-only HTTPS/CA workflow passed; process architecture x64 |
| Official ARM64 application image on AMD64 emulation | Same workflow passed; process architecture arm64 |
| Certificate initializer, both architectures | Started successfully with existing fixture trust volumes; fresh 0.1.2 certificate issuance not tested |
| Public application and certificate images | Anonymous manifests verified; each contains Linux AMD64 and ARM64; see image-digests.json |
| Final Docker archives, both architectures | Privacy scan passed over metadata and decompressed filesystem layers |
| Compiled application distribution | Privacy scan passed across 102 files |
| Public deployment export | Privacy scan passed across 22 files; local/external Compose and optional tunnel/database-port configuration validation passed |
| Desktop/mobile connection dialog | Private CA controls, URI spacing and DataCloud branding visually checked |
| Encrypted private source backup | Authenticated restore matches original ZIP SHA256; key remains private |

Đã đạt 218 bài kiểm tra cùng kiểm tra kiểu dữ liệu, build và khởi động ứng dụng.
Hai image chính thức đạt luồng HTTPS/CA bên dưới; ARM64 chạy bằng giả lập trên
máy AMD64, chưa phải kiểm tra trực tiếp trên NAS. Bản sao lưu mã nguồn mã hóa đã
được giải mã kiểm chứng; khóa không nằm trong bản phát hành.

Already exercised locally: a fresh external-only stack with HTTPS login and
PostgreSQL metadata, no starter database connection, connection failure without
the correct CA, successful CA-backed connection, CA preservation on rotation,
failed trust reset preserving the working connection, and secret redaction.
This used a local MongoDB 4.4.29 TLS fixture, not an operator endpoint.

The opt-in adapter harness returned `PASS_WITH_SKIPS` against that same local
fixture in read-only mode. TLS, health, version, catalog, bounded find/aggregate,
explain, indexes, metrics and administrative reads passed. An empty fixture had
no next page; logs are unsupported and synthetic writes were deliberately skipped.
Backup/restore checks inspect unsupported capability metadata only. This does
not verify backup execution or the full upstream DocumentDB compatibility matrix.

The adapter regression suite also covers permission/unsupported results,
malformed telemetry, DocumentDB operation IDs and timeout classification.
Connection API tests cover independent concurrent candidates, rejected/degraded
replacement settings and stale test/overview results after rotation.

Đã kiểm tra luồng Docker riêng với MongoDB TLS thử nghiệm cục bộ. Đây chưa phải
bằng chứng triển khai trên NAS hoặc endpoint DocumentDB upstream thực tế.

During preparation, an initial image set contained a private committer email in
CI-generated provenance metadata. Those index, architecture and attestation
versions were withdrawn before the GitHub Release was published; anonymous
manifest access was checked afterward. Replacement builds omit CI event payload
attestations and use neutral distribution labels. Final archive scans include
metadata blobs as well as decompressed filesystem layers. Already downloaded
copies and third-party caches cannot be recalled.

Trong quá trình chuẩn bị, image thử có email riêng trong metadata do CI tạo.
Các phiên bản đó đã bị gỡ trước khi công bố GitHub Release. Bản thay thế bỏ phần
metadata này; kiểm tra riêng tư bao gồm cả metadata và các lớp filesystem.
Không thể thu hồi các bản đã tải hoặc bộ nhớ đệm của bên khác.

## Historical 0.1.1 Release Gates

| Check | Result |
| --- | --- |
| Source snapshot | Private tag `v0.1.1`, revision `c42b0ed` |
| Unit, integration and security suite | 193 passed locally and in the private image workflow |
| TypeScript, client build and compiled runtime smoke | Passed |
| Public Compose validation, including optional tunnel/port overlays | Passed locally and in public repository CI |
| Public deployment ZIP contents and compiled app privacy scan | Passed; operator identifier values were not logged |
| Public Git history | Replaced with deployment/docs only; commits use a GitHub noreply address |
| Published image manifests | Anonymous access passed; both application and certificate images contain AMD64/ARM64 |
| Retired 0.1.0 manifests | Anonymous access fails for old tags, index digests and both architecture digests |
| Docker archive layers, both architectures | Private identifier scan passed after decompressing layers |
| Official AMD64 runtime | HTTPS login, PostgreSQL metadata, MongoDB TLS and synthetic CRUD passed |
| Official ARM64 runtime under AMD64 emulation | Same production smoke passed; process architecture confirmed as arm64 |
| Official ARM64 certificate initializer | Fresh certificates with default localhost hostname generated and verified |
| Encrypted private source backup | AES-256-GCM authenticated restore matches original ZIP hash; key retained locally |

## Earlier Runtime Evidence (0.1.0)

- 193 application unit, integration and security tests passed.
- AMD64 Docker Desktop and ARM64 emulated application: HTTPS owner login,
  PostgreSQL/MongoDB TLS and synthetic CRUD passed.
- ARM64 certificate generation under emulation passed.
- Desktop/mobile browser checks passed without runtime errors.

## Limits / Giới hạn

- Native NAS/macOS/Ubuntu hardware, real DocumentDB gateway and public tunnel
  routing have not been verified. Chưa xác minh các môi trường này.
- PostgreSQL is the metadata store, not an external PostgreSQL connector.
- Legal policies remain drafts; live SMTP/Google verification is deferred.
- Public images contain inspectable executable code under a proprietary license.
- The retired release, public Git history and old image versions are withdrawn
  from active distribution. Already downloaded copies and third-party caches
  cannot be recalled. Bản đã tải và bộ nhớ đệm bên khác không thể thu hồi.
- Deployment configuration and operator credentials must remain local and private.

The source repository remains private. Public deployment files use MIT; the
application uses its separate proprietary license. Image digests and release
asset SHA256 checksums identify the final published artifacts.
