# Google-only sign-in and SMTP / Đăng nhập Google và SMTP trên NAS

DataCloud is an independent website for managing connected databases. Keep your
website domain, approved owner email, OAuth credentials, SMTP settings and tunnel
token in private NAS configuration. These values never belong in public releases.

DataCloud là nền tảng web độc lập để quản lý các database được kết nối. Tên miền,
email quản trị, thông tin OAuth/SMTP và token tunnel chỉ lưu trong cấu hình riêng
trên NAS; không đưa lên Git hoặc bản phát hành công khai.

## New installation / Cài mới

Run `scripts/nas-configure.mjs` from the distribution root using Node 24 or the
Node Docker command in the installation guide. It defaults to external databases
and Google-only sign-in. It creates `.env` and secret files once; existing
configuration and vault keys are never overwritten.

Chạy `scripts/nas-configure.mjs` từ thư mục bộ cài bằng Node 24 hoặc container Node.
Mặc định là kết nối database ngoài và chỉ đăng nhập Google. Công cụ tạo `.env` và
file bí mật một lần; không ghi đè cấu hình và khóa mã hóa đang có.

For Google-only sign-in provide:

- A Google OAuth **Web application** client ID and client secret, issued under
  the operator's own project. A signed-in browser is not an OAuth client.
- The exact authorized JavaScript origin, equal to private `PUBLIC_ORIGIN`.
- The exact authorized redirect URI: `PUBLIC_ORIGIN/api/v1/auth/google/callback`.
- The approved owner's actual Google email. If the OAuth consent app is in
  testing mode, add approved users as test users in its Google project.

Cần OAuth client loại **Web application**, client ID/secret, origin HTTPS chính
xác và callback theo mẫu trên. Email owner phải là email Google thật được duyệt.
Nếu ứng dụng OAuth ở chế độ testing, thêm người được phép vào danh sách test user.

The bootstrap reserves that owner identity. Other verified Google users can
create their own isolated organization; they need an invitation to join an
existing organization. Google-only mode disables password login, ordinary
registration and password recovery. Google provides verified email identity; do not
create a second local password or ask Google users to verify a local password.

Bootstrap dành quyền owner cho danh tính đã cấu hình. Người dùng Google khác đã
xác minh có thể tạo tổ chức riêng; tham gia tổ chức đã có cần lời mời. Chế độ
Google-only tắt mật khẩu, đăng ký thường và khôi phục mật khẩu. Google xác minh
email của tài khoản.

## SMTP delivery / Gửi email

Supply an SMTP hostname, port **465 with TLS** or **587 with required STARTTLS**,
approved sender email, username and provider credential/app password. A normal
Google login session cannot be reused as an SMTP credential. The transport always
verifies the server certificate. Use `secrets/smtp_ca` for an optional private
CA bundle; leave it empty to use system trust. Keep private keys out of CA files.

Cung cấp máy chủ SMTP, cổng **465 TLS** hoặc **587 STARTTLS bắt buộc**, địa chỉ gửi
được nhà cung cấp cho phép, username và credential/app password. Đăng nhập Google
trên trình duyệt không thay thế credential SMTP. Chứng chỉ máy chủ luôn được kiểm
tra; `secrets/smtp_ca` chỉ chứa CA công khai nếu cần CA riêng.

SMTP supports the existing invitation, verification and notification queue; it
does not turn unfinished alert evaluation or backup jobs into working features.
Verify actual delivery to an operator-approved test recipient and check the
provider's sender verification/SPF/DKIM requirements. Configuration flags are not
evidence of successful delivery.

SMTP phục vụ hàng đợi lời mời, xác minh và thông báo đã có; không tự hoàn tất bộ
đánh giá cảnh báo hoặc tác vụ backup. Kiểm tra thư thật tới người nhận thử được
duyệt và cấu hình người gửi/SPF/DKIM theo nhà cung cấp. Có cấu hình chưa đồng nghĩa
với gửi thư thành công.

## Files and existing installs / File và bản cài hiện có

The opt-in overlay is `deploy/nas/compose.integrations.yaml`. Private `.env` uses:

```dotenv
COMPOSE_PATH_SEPARATOR=:
COMPOSE_FILE=compose.external.yaml:compose.integrations.yaml
AUTH_MODE=google-only
SMTP_HOST=mail.example.invalid
SMTP_PORT=465
SMTP_SECURE=true
SMTP_FROM=notifications@example.invalid
```

Use `compose.yaml` instead of `compose.external.yaml` only for the local database
profile. The explicit separator works on Windows and Linux. Do not use the
example SMTP server or sender for real delivery. Leave SMTP_HOST empty to defer
email delivery. Keep Google-only enabled only when OAuth credentials are ready.

Create these private files in `deploy/nas/secrets/`: `google_client_id`,
`google_client_secret`, `smtp_user`, `smtp_password`, `smtp_ca`. Unused SMTP files
must exist as empty placeholders. Compose mounts the files; secret values never
appear in Compose environment settings. Protect the containing directory; the
application UID 1000 needs read access. Preserve `owner_config`, `database_url`,
`vault_keys`, PostgreSQL data and certificate volumes during an upgrade.

Tạo các file bí mật trên trong `deploy/nas/secrets/`; file SMTP chưa dùng để trống.
Giới hạn quyền thư mục; tiến trình ứng dụng UID 1000 cần đọc được file. Khi nâng
cấp phải giữ owner, thông tin PostgreSQL, vault key, dữ liệu và certificate volume.
Thay email owner trong file không phải cơ chế chuyển quyền tài khoản hiện có;
email không khớp sẽ khiến bootstrap từ chối khởi động.

For existing accounts, verify the intended Google identity through the supported
owner/invitation flow before removing working access. Setting `AUTH_MODE` alone
does not authorize arbitrary email-based account linking. Validate Compose with
`docker compose config --quiet`, restart the app, then verify `/api/v1/auth/config`,
Google callback/session/logout and an approved SMTP message over the public HTTPS
origin. Never use `docker compose down -v` to apply these settings.

Với tài khoản hiện có, kiểm tra danh tính Google được duyệt qua luồng owner/lời mời
trước khi bỏ cách truy cập đang dùng. Sau khi kiểm tra Compose và khởi động lại,
thử đăng nhập/callback/session/đăng xuất cùng thư SMTP qua origin HTTPS thật.
Không xóa volume khi đổi cấu hình.

## Tunnel / Tunnel website

Configure the chosen private hostname to route to `http://ingress:8080` in the
dedicated Cloudflare tunnel. Place its token only in `secrets/tunnel_token`; the
start script enables the tunnel profile when the file is nonempty. Keep
`PUBLIC_ORIGIN` consistent with the hostname and Google callback configuration.
The tunnel publishes the website, not the database protocol.

Định tuyến hostname riêng tới `http://ingress:8080` trong Cloudflare Tunnel, lưu
token ở `secrets/tunnel_token` và thống nhất `PUBLIC_ORIGIN` với callback Google.
Tunnel chỉ phục vụ website, không mở giao thức database.

## Local verification / Kiểm tra cục bộ

### Troubleshooting: Cloudflare beacon and Atlas operations

`static.cloudflareinsights.com/beacon.min.js` blocked by `script-src 'self'`
means Cloudflare Web Analytics injection conflicts with this console's same-origin
script policy. It affects client analytics, not database connections. Disable
automatic Web Analytics injection for the console if it is not needed. Do not
remove CSP or allow arbitrary scripts to hide the warning. If analytics is an
explicit requirement, review the precise script and reporting destinations in the
[Cloudflare CSP FAQ](https://developers.cloudflare.com/web-analytics/faq/#what-do-i-need-to-add-to-my-content-security-policy-csp).

Atlas can reject `currentOp` with code 8000 and a tier-specific denial even when
ordinary database reads work. Version 0.1.4 reports this as an unknown capability
and a 503 operation failure. The next source fix classifies only explicit Atlas
tier denials as unsupported; it does not classify every code 8000 as unsupported.
Existing UI handling then displays the capability limitation and stops polling
that unsupported endpoint. This source fix is not in the immutable 0.1.4 images.

Script thống kê Cloudflare bị chặn bởi `script-src 'self'` chỉ ảnh hưởng thống kê
truy cập, không gây lỗi kết nối database. Nếu không cần thống kê trên console,
tắt tự động chèn Web Analytics cho website đó. Không bỏ CSP hoặc cho phép mọi
script chỉ để hết cảnh báo; nếu cần thống kê, đối chiếu đúng nguồn trong FAQ trên.

Atlas có thể từ chối `currentOp` với mã 8000 do giới hạn gói dù vẫn đọc database
được. Bản 0.1.4 nhận diện trường hợp này thành unknown và trả 503. Bản sửa mã nguồn
kế tiếp nhận diện riêng thông báo từ chối theo gói Atlas thành tính năng không
được hỗ trợ; giao diện sẵn có sẽ ngừng gọi lặp endpoint đó. Không coi mọi lỗi 8000
là giới hạn gói. Bản sửa chưa nằm trong image 0.1.4 đã phát hành.

On 2026-10-06 the seven NAS configuration tests passed, including password-free
Google-only owner configuration, private credential files, the cross-platform
Compose separator, missing OAuth credentials and SMTP transport validation. The
exported external + integrations + tunnel Compose configuration validated and
the 24-file public export passed the private-identifier scan. The container scan
reported only the already-reviewed one-shot certificate initializer and false
positives matching `cap_drop: ALL`; the overlay added no findings. These checks
do not prove live OAuth, SMTP delivery or native NAS operation.

Ngày 2026-10-06, 7 kiểm thử cấu hình NAS đạt; Compose kết hợp external,
integrations và tunnel hợp lệ; bộ xuất công khai 24 file qua quét thông tin riêng.
Các kết quả này chưa chứng minh OAuth/SMTP thật hoặc hoạt động trên NAS thật.
