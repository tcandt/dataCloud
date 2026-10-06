# Release 0.1.3 Verification / Kiểm tra bản phát hành

Date / Ngày: 2026-10-06.

This receipt distinguishes checks of this release from earlier runtime evidence.
Connector availability is documented in [English](README.md) and
[Vietnamese](README.vi.md). It does not establish compatibility with every engine
or Docker host.

## 0.1.3 current checks / Kiểm tra hiện tại

Status: **PREVIEW VERIFIED WITH LIMITS**. Executable images use private tag
`v0.1.3`, revision `fc0a5f6eb63fe2843731df746c3eb38e2dcaef81`.
The final private image workflow passed. Later deployment-only revision
`4280ac5` adds the Synology overlay and optional SMTP sender fix without changing
the executable image tag. See [image digests](image-digests.json) and release
asset checksums. Historical receipts below are not evidence for these images.

| Check / Kiểm tra | Result / Kết quả |
| --- | --- |
| Full unit, integration and security suite | 226 passed locally |
| TypeScript | Passed locally |
| Client/application builds | Passed locally during implementation |
| NAS integration configuration | Nine focused tests passed, including Google-only bootstrap, private secret files, SMTP validation and public export |
| Exported external + integrations + tunnel Compose | Validation passed; absent/configured SMTP sender and Synology CPU quota regression passed |
| Public deployment export | Explicit deployment/docs allowlist; private-identifier scan passed over 25 files, including the deployment workflow |
| Responsive browser review | Checked 320, 375, 767 and 1440 CSS-pixel widths; no page horizontal overflow on checked views; collapsed query options preserved projection/sort drafts |
| Final AMD64/ARM64 images and archives | Anonymous manifests verified for both images; AMD64 and emulated ARM64 runtime smoke passed; metadata/decompressed-layer privacy scan passed over 52 extracted files |
| Native NAS deployment and public testing tunnel | Synology DS920+ AMD64 / DSM 7.3.1: fresh certificate initialization, PostgreSQL health, application startup, ingress, healthy tunnel and public HTTPS landing/login passed |
| Live Google callback/session/logout | Verified Google identity linked to the existing Owner workspace; reload preserved the session; logout denied protected-page access; subsequent sign-in and session persistence across container restart passed |
| SMTP provider and delivered message | Private mounted Gmail app credential; configured website status passed; one self-addressed test through the application's SMTP transport inside the NAS container was accepted (1 recipient, 0 rejected) and confirmed in the Gmail inbox |
| Encrypted private source backup | Authenticated restore matched source archive hash; decryption key remains private |

Google-only implementation tests cover blocked password/demo/recovery paths,
refusal of legacy password sessions, exact bootstrap-owner binding, isolated
Google user onboarding and invitation handling. Google provides email verification;
no duplicate local password or verification flow is required. The additive
`identity_google_sessions` table marks Google sessions. Owner email mismatch now
refuses bootstrap, so changing a config file is not an owner migration procedure.

Đã đạt 226 bài kiểm tra và kiểm tra kiểu dữ liệu cục bộ; build ứng dụng đạt.
Giao diện đã thử ở các chiều rộng nêu trên, không thấy tràn ngang toàn trang trên
các trang đã kiểm tra. Image cuối đạt kiểm tra AMD64 và ARM64 giả lập; NAS Synology
AMD64, tunnel và HTTPS thật đã hoạt động. Google đã đạt callback, quyền Owner,
duy trì phiên và đăng xuất. Một thư thử qua SMTP của container NAS đã đến hộp thư
Gmail. Bằng chứng 0.1.2 dưới đây chỉ là lịch
sử. Thay email owner trong file không tự chuyển quyền tài khoản.

Follow-up operational evidence was added after the original 0.1.3 release assets.
The executable images, release tag and ZIP checksums are unchanged; archived
receipts inside the original ZIP describe the publication-time state. The SMTP
check used the existing application's transport directly. It does not establish
end-to-end invitation, billing, alert or scheduled-report delivery, nor automatic
generation of those notifications.

Bằng chứng vận hành bổ sung không thay đổi image, tag hoặc checksum ZIP 0.1.3.
Tài liệu trong ZIP gốc ghi trạng thái tại thời điểm công bố. Thư thử dùng transport
của ứng dụng trực tiếp; chưa kiểm tra toàn bộ luồng lời mời, thanh toán, cảnh báo,
báo cáo hoặc việc tự động sinh các thông báo đó.

## Historical 0.1.2 release checks / Kiểm tra bản trước

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
| Public application and certificate images | Anonymous manifests verified; each contains Linux AMD64 and ARM64; see the [archived 0.1.2 digests](https://github.com/tcandt/dataCloud/blob/v0.1.2/image-digests.json) |
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

- Native Synology AMD64 startup and public HTTPS passed. Native ARM64 NAS,
  macOS/Ubuntu hardware and real DocumentDB gateway remain unverified. Không coi
  ARM64 giả lập là kiểm tra NAS ARM64 thật.
- PostgreSQL is the metadata store, not an external PostgreSQL connector.
- Legal policies remain `DRAFT_AI`. Google callback/session/logout and one NAS
  SMTP delivery were verified on the operator installation. Google OAuth remains
  in testing mode with explicitly configured test users; this is not production
  OAuth publication or evidence for other operators' provider accounts.
- Public images contain inspectable executable code under a proprietary license.
- The retired release, public Git history and old image versions are withdrawn
  from active distribution. Already downloaded copies and third-party caches
  cannot be recalled. Bản đã tải và bộ nhớ đệm bên khác không thể thu hồi.
- Deployment configuration and operator credentials must remain local and private.

The source repository remains private. Public deployment files use MIT; the
application uses its separate proprietary license. On publication, matching
image digests and release-asset SHA256 checksums must identify the final artifacts.
