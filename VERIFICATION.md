# Release 0.1.1 Verification / Kiểm tra bản phát hành

Date / Ngày: 2026-10-06.

This receipt distinguishes checks of this release from earlier runtime evidence.
Connector availability is documented in [English](README.md) and
[Vietnamese](README.vi.md). It does not establish compatibility with every engine
or Docker host. Final publication results are recorded below after release gates.

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
