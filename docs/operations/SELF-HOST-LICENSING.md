# Offline self-host licensing / Giấy phép self-host ngoại tuyến

## English

### Scope

Self-host Free does not require license registration, a license server or a vendor connection. Authentication and optional integrations may still need network access; for example, Google sign-in requires Google connectivity.

The operator can explicitly create a persistent, random installation ID, send that ID to the vendor through an agreed channel, and import an Ed25519-signed license. No automatic telemetry, customer upload or phone-home is implemented. The license applies only to the installation's registered bootstrap-owner organization; it does not grant paid entitlements to every hosted organization.

This feature verifies offline entitlements. It is not DRM: a server administrator can inspect or modify an image, replace its verifier or clone its metadata store. Offline expiry depends on the server clock. Restoring an old database backup can also restore earlier registration and sequence state. An installation ID is not proof of unique physical hardware.

### Operator workflow

1. Set `DATACLOUD_EDITION=selfhost` and retain the persistent control-plane database during upgrades.
2. Configure the vendor's **Ed25519 public verification key**, in SPKI PEM format, by setting `INSTALLATION_PUBLIC_KEY_FILE` to a mounted PEM file. Never put the private signing key in a customer environment, Docker image or public repository.
3. Sign in as the installation's configured bootstrap platform owner. Open **Installation license** from administration, or `/installation` when enabled by the deployment.
4. Choose **Create installation ID**, then confirm **Create locally**. Free works without doing this. The ID is created in your local database; this is not registration with the vendor.
5. Copy the installation ID and send it to the vendor through your agreed support/purchase channel. The screen sends nothing automatically.
6. Choose **Import license**, paste the supplied document and confirm. The server verifies the signature, target installation, bounded limits, validity dates and replacement sequence before atomically saving and auditing activation.

Import does not collect payment, create an invoice or verify an external purchase. The status screen displays license identity, expiry and signed limits. Only projects, database connections and team members have signed limits. Runtime checks must apply the license only to its registered organization and reevaluate validity on each entitlement decision. No permanent paid subscription grant is created by the license service.

A missing, invalid, expired or unverifiable document provides no paid license entitlement. Free limits remain available; existing resources are preserved and metered growth is restricted when limits are exceeded. Keep the clock accurate. Refresh the status after an expiry or configuration change. A version conflict requires refreshing before importing a replacement.

### Vendor issuance

The private signing key stays on a protected vendor machine. Use a separate key for this purpose. The signing utility does not generate, upload or log the key.

Create a private request JSON with exactly these fields; the identifier below is illustrative:

```json
{
  "installationId": "00000000-0000-4000-8000-000000000001",
  "sequence": 1,
  "expiresAt": "2030-01-01T00:00:00.000Z",
  "limits": {
    "projects": 20,
    "database_connections": 50,
    "team_members": 10
  }
}
```

Use the actual installation ID. Choose an expiry after issuance and within ten years. Each limit must be an integer from 0 to 1,000,000. Replacements for the same installation must use a higher sequence number than the last accepted license.

From the private source checkout:

```text
node scripts/sign-installation-license.mjs --key <private.pem> --request <request.json> --out <new.license> --receipt <new-receipt.json>
```

The tool writes a license file and a separate private issuance receipt, and refuses to overwrite either output. A failure may leave a receipt without a delivered license; review it before retrying with new paths. Deliver only the license document to the customer. Configure/distribute the corresponding public key through your trusted release/configuration channel.

The receipt includes signed entitlement metadata and the public verifier key, never the private key. Store receipts privately as a manual issuance register; do not publish installation identifiers. `issued-not-confirmed` means the vendor issued a document, not that a customer imported it or is online. This is not an automatic device registry, usage dashboard or remote subscription monitor.

### Renewal, revocation and limitations

- Issue a new signed document with a higher sequence and a future expiry for renewal. Import is explicit; there is no automatic renewal or collection.
- Reimporting an identical active document is idempotent. An older/different document with the same or lower sequence is rejected while the current database state is intact.
- An offline client cannot receive immediate remote revocation. Stop issuing renewals or deliver a replacement through an agreed channel. Key rotation requires changing the public verifier on the customer runtime and reissuing licenses; existing signatures may stop verifying.
- Preserve metadata backups and protect the host clock. Neither signed documents nor sequence checks prevent a host administrator from deliberately modifying software, clocks or persisted state.
- Decide support terms, licensed resource counts, validity period, refund policy and whether offline operation meets your commercial requirements before selling this option.

## Tiếng Việt

### Phạm vi

Self-host Free không cần đăng ký giấy phép, máy chủ cấp phép hoặc kết nối đến nhà cung cấp. Đăng nhập và dịch vụ tích hợp vẫn có thể cần mạng; ví dụ đăng nhập Google cần kết nối Google.

Quản trị viên có thể chủ động tạo mã installation ngẫu nhiên, gửi mã này cho nhà cung cấp qua kênh đã thống nhất, rồi nhập giấy phép được ký bằng Ed25519. Hệ thống không tự gửi dữ liệu khách hàng, thống kê sử dụng hay báo cáo về máy chủ trung tâm. Giấy phép chỉ áp dụng cho tổ chức của chủ nền tảng đã đăng ký installation; không tự cấp gói trả phí cho mọi tổ chức trên máy chủ.

Đây là xác thực quyền sử dụng ngoại tuyến, không phải DRM. Người quản trị máy chủ có thể kiểm tra/chỉnh sửa image, thay khóa xác thực hoặc sao chép cơ sở dữ liệu cấu hình. Hết hạn phụ thuộc đồng hồ máy chủ; khôi phục backup cũ có thể khôi phục cả trạng thái giấy phép và số thứ tự cũ. Mã installation không chứng minh một thiết bị vật lý duy nhất.

### Cách kích hoạt

1. Đặt `DATACLOUD_EDITION=selfhost` và giữ cơ sở dữ liệu quản trị khi nâng cấp.
2. Cấu hình **khóa công khai Ed25519** của nhà cung cấp, định dạng SPKI PEM, bằng `INSTALLATION_PUBLIC_KEY_FILE` trỏ tới file PEM được mount vào container. Không đặt khóa ký bí mật trên máy khách hàng, trong Docker image hoặc repo công khai.
3. Đăng nhập bằng tài khoản bootstrap chủ nền tảng. Mở **Installation license**, hoặc `/installation` khi chế độ triển khai cho phép.
4. Chọn **Create installation ID → Create locally**. Free vẫn dùng được nếu không tạo ID. Mã được lưu trong database cục bộ; không có đăng ký tự động với nhà cung cấp.
5. Sao chép ID và gửi qua kênh mua hàng/hỗ trợ đã thống nhất.
6. Chọn **Import license**, dán giấy phép rồi xác nhận. Máy chủ kiểm tra chữ ký, installation đích, hạn mức, thời hạn và số thứ tự trước khi lưu và ghi nhật ký cùng một giao dịch.

Nhập giấy phép không thu tiền, không tạo hóa đơn và không chứng minh đã thanh toán. Trang trạng thái hiển thị mã giấy phép, ngày hết hạn và hạn mức đã ký cho project, kết nối database và thành viên. Quyền giấy phép được kiểm tra lại khi đánh giá hạn mức, chỉ cho tổ chức đã đăng ký; dịch vụ cấp phép không tạo một gói trả phí vĩnh viễn.

Giấy phép thiếu, sai, hết hạn hoặc không xác minh được sẽ không cung cấp quyền trả phí. Free vẫn là mức cơ bản; tài nguyên hiện có được giữ lại nhưng tăng sử dụng bị hạn chế khi vượt hạn mức. Đồng hồ máy chủ cần chính xác. Khi gặp xung đột phiên bản, làm mới trạng thái trước khi nhập lại.

### Phát hành và quản lý từ phía nhà cung cấp

Khóa ký bí mật chỉ nằm trên máy được bảo vệ của nhà cung cấp. Tạo request JSON theo mẫu tiếng Anh ở trên với ID thực tế, số thứ tự, thời hạn tương lai tối đa mười năm và ba hạn mức nguyên từ 0 đến 1.000.000. Chạy tiện ích ký từ mã nguồn riêng tư bằng lệnh ở trên.

Tiện ích tạo file giấy phép và biên nhận phát hành riêng, không ghi đè file cũ. Nếu lỗi giữa chừng, có thể đã có biên nhận nhưng chưa có giấy phép được giao; kiểm tra trước khi thử lại bằng đường dẫn mới. Chỉ gửi giấy phép cho khách hàng. Phân phối khóa công khai tương ứng qua cấu hình/bản phát hành đáng tin cậy.

Giữ biên nhận trong sổ phát hành riêng tư; không công khai ID installation. Biên nhận chứa thông tin quyền đã ký và khóa công khai, không chứa khóa bí mật. Trạng thái `issued-not-confirmed` chỉ nói đã phát hành, không khẳng định khách đã kích hoạt hay đang online. Hiện chưa có danh sách thiết bị/hoạt động từ xa tự động.

### Gia hạn và giới hạn thu hồi

- Gia hạn bằng tài liệu mới có số thứ tự cao hơn và hạn tương lai; khách hàng chủ động nhập. Không có tự gia hạn hoặc tự trừ tiền.
- Nhập lại cùng giấy phép còn hiệu lực không áp dụng lần hai. Giấy phép khác có số thứ tự cũ/bằng bị từ chối khi trạng thái database hiện tại còn nguyên.
- Máy ngoại tuyến không nhận được thu hồi tức thì từ xa. Có thể ngừng cấp gia hạn hoặc giao giấy phép thay thế theo thỏa thuận. Đổi khóa xác thực cần cập nhật runtime và phát hành lại giấy phép; chữ ký cũ có thể mất hiệu lực.
- Backup, đồng hồ và quyền quản trị máy chủ ảnh hưởng kiểm soát này. Chữ ký không ngăn quản trị viên máy chủ cố tình sửa phần mềm hay dữ liệu.
- Cần thống nhất hỗ trợ, hạn mức, thời hạn, hoàn tiền và nhu cầu hoạt động ngoại tuyến trước khi bán.
