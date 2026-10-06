# Changelog

[English](README.md) | [Tiếng Việt](README.vi.md)

Every published version has a matching Git tag, release notes and Docker tags.
Version format: MAJOR.MINOR.PATCH. Preview versions may require migration review.

## 0.1.1 - 2026-10-06

### English

- Clarified DataCloud as an independent third-party web database management
  platform, with a DbGate-style workflow and an explicit current connector matrix.
- Added Vietnamese installation and operating documentation.
- Replaced operator-specific hostname and administrator defaults with localhost
  examples and a required administrator email prompt.
- Made the database hostname allowlist configurable for approved external targets.
- Rebuilt both AMD64/ARM64 images, including neutral certificate defaults.
- Withdrew the initial public release and its image versions; replaced public Git
  history to remove operator identifiers. Existing downloads and third-party
  caches cannot be recalled by this update.
- No application metadata schema or database engine version change. Existing
  deployments preserve private settings, secrets and data volumes during updates.

### Tiếng Việt

- Làm rõ DataCloud là nền tảng bên thứ ba độc lập để quản lý database qua website,
  với cách sử dụng cùng nhóm công cụ như DbGate; công bố đúng phạm vi connector.
- Bổ sung tài liệu cài đặt và vận hành bằng tiếng Việt.
- Thay tên miền và tài khoản mặc định riêng bằng ví dụ localhost; yêu cầu người
  cài đặt nhập email quản trị của mình.
- Cho phép cấu hình danh sách hostname database bên ngoài được phép kết nối.
- Build lại hai image cho AMD64/ARM64, gồm cấu hình chứng chỉ trung lập.
- Thu hồi bản phát hành và image cũ; thay lịch sử Git công khai để gỡ thông tin
  riêng. Không thể thu hồi các bản đã tải hoặc bộ nhớ đệm của bên khác.
- Không đổi schema metadata hay phiên bản database engine. Khi cập nhật, giữ
  cấu hình riêng, secrets và volume dữ liệu của hệ thống đang chạy.

## 0.1.0 - 2026-10-06

### Added

- First public Docker distribution of the proprietary DataCloud console.
- One version tag with AMD64 and ARM64 variants for Linux containers.
- Setup and startup instructions for Docker Desktop, Linux, Ubuntu, macOS and NAS.
- PostgreSQL metadata, MongoDB 4.4.29, website/API, nginx and optional Cloudflare Tunnel.
- Verified TLS for internal database connections and persistent certificate volumes.
- First administrator bootstrap without live SMTP/Google.
- Encrypted database credentials, tenant authorization, query bounds and confirmed mutations.
- Owner identity, projects and database connections persist across application restarts.
- Version manifest and explicit separation of public deployment files and private source.
- Minified runtime application modules without source maps and bundled dependency notices.

### Fixed

- Startup member quotas count unique members and unexpired pending invitations.
- Read-only nginx temporary paths are placed in its temporary filesystem.
- Host HTTP ingress remains loopback-only; forwarded client addresses require trusted peers.

### Verification and Limits

- 193 passing application unit, integration and security tests; TypeScript and compiled runtime checks.
- Local HTTPS owner login, PostgreSQL/MongoDB TLS and synthetic CRUD checks.
- Docker Desktop AMD64 and emulated ARM64 runtime checks.
- Desktop and mobile browser checks of the production console.
- Native NAS/macOS hardware and the public website route remain unverified.
- Legal policies remain drafts; live SMTP/Google verification is deferred by the owner.
- MongoDB 4.4.29 is retained for existing-data compatibility; upstream DocumentDB is external.
- No automatic engine upgrade, data migration or guarantee of source non-recoverability.
