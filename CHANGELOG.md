# Changelog

[English](README.md) | [Tiếng Việt](README.vi.md)

Every published version has a matching Git tag, release notes and Docker tags.
Version format: MAJOR.MINOR.PATCH. Preview versions may require migration review.

## 0.1.3 - 2026-10-06

### English

- Added deployment-level Google-only browser authentication. Password sign-in,
  registration, reset/verification and demo routes are disabled in this mode.
  Verified Google users can create their own isolated workspace. An existing
  bootstrap owner is linked only by its explicitly configured verified email.
- Old password sessions cannot authenticate in Google-only mode; scoped API keys
  remain available for machine integrations. Fixed OAuth callback cookie handling.
- Added private OAuth/SMTP secret-file configuration and a Docker integrations
  overlay. New interactive installations default to Google-only; existing
  installations preserve their chosen mode and secrets.
- Refreshed light/dark console and public pages, responsive cards/forms/navigation,
  local scrolling for data tables/JSON, compact mobile query options and 44px tree
  rows. Draft projection/sort values survive collapsing the mobile panel.
- Google confirms the signed-in email. SMTP notifications require independently
  configured provider credentials; being signed into Gmail is not SMTP setup.
- Added a Synology overlay for kernels without CPU CFS quotas. Disabled SMTP
  omits its optional sender instead of passing an invalid empty address.

### Tiếng Việt

- Thêm chế độ chỉ đăng nhập Google ở phía máy chủ; tắt đăng nhập mật khẩu, đăng ký
  thường, khôi phục/xác minh mật khẩu và demo trong chế độ này. Người dùng Google
  đã xác minh có workspace riêng; owner chỉ được liên kết theo email đã cấu hình.
- Phiên mật khẩu cũ không dùng được trong Google-only. API key có phạm vi quyền
  vẫn phục vụ tích hợp máy; sửa xử lý cookie trong callback OAuth.
- Thêm cấu hình Google/SMTP qua file bí mật và Compose overlay. Cài mới mặc định
  Google-only; cấu hình và khóa của hệ thống hiện có được giữ lại.
- Làm mới giao diện sáng/tối, bố cục điện thoại/tablet/desktop; bảng/JSON cuộn trong
  vùng riêng, tùy chọn truy vấn mobile thu gọn và hàng cây dữ liệu cao 44px.
- Google xác minh email đăng nhập; gửi thông báo SMTP cần thông tin xác thực riêng.
- Thêm overlay Synology cho kernel không hỗ trợ giới hạn CPU CFS. Khi tắt SMTP,
  cấu hình bỏ địa chỉ gửi tùy chọn thay vì truyền chuỗi rỗng không hợp lệ.

## 0.1.2 - 2026-10-06

### English

- Added external-only installation: the website/API and metadata store start
  together without a starter MongoDB. Default for new interactive setups.
- Added private CA entry and rotation with encrypted, request-only storage.
  Verified TLS remains required; legacy encrypted URI records remain readable.
- Independently verify concurrent credential candidates, preserve working settings
  on failed verification, and reject stale health/capability updates after rotation.
- Prevent a slow database connection attempt from blocking other connection pools.
- Corrected denied/unsupported capability evidence, BSON metric validation,
  DocumentDB operation identifiers and driver timeout classification.
- Aligned visible console branding with DataCloud and improved connection form layout.
- Added opt-in compatibility checks with private fixture configuration and sanitized
  reports. This does not certify a live upstream DocumentDB deployment.
- No engine upgrade or metadata table migration. New connection secret envelopes
  require 0.1.2; rollback after creating/rotating a connection requires restoring
  the matching earlier metadata backup and vault keys.

### Tiếng Việt

- Thêm chế độ chỉ quản lý database có sẵn: website/API và kho metadata khởi động
  cùng nhau, không kèm MongoDB khởi tạo. Mặc định khi cài mới qua trình cấu hình.
- Thêm nhập và thay CA riêng, lưu mã hóa và không trả lại qua API đọc.
  Vẫn bắt buộc TLS; đọc được thông tin URI mã hóa của phiên bản cũ.
- Kiểm tra độc lập các lần đổi kết nối đồng thời; giữ cấu hình cũ nếu kiểm tra
  thất bại và từ chối kết quả trạng thái cũ ghi đè sau khi đổi thông tin kết nối.
- Một database kết nối chậm không còn chặn các kết nối khác.
- Sửa nhận diện tính năng bị từ chối/chưa hỗ trợ, dữ liệu metric BSON, mã thao tác
  DocumentDB và phân loại lỗi hết thời gian chờ.
- Đồng bộ tên hiển thị DataCloud và cải thiện bố cục form kết nối.
- Thêm bộ kiểm tra tương thích chỉ chạy khi được bật, dùng cấu hình riêng và báo
  cáo đã lọc thông tin. Chưa chứng nhận triển khai DocumentDB upstream thực tế.
- Không nâng cấp engine hoặc đổi bảng metadata. Sau khi tạo/thay kết nối bằng
  0.1.2, muốn hạ phiên bản phải khôi phục backup metadata cũ cùng khóa vault.

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
