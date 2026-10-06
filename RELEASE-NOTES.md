# DataCloud 0.1.4 — release notes / ghi chú phát hành

**Status / Trạng thái:** preview release verified locally and in published AMD64/ARM64 images. NAS 0.1.4 upgrade and SePay provider round-trip remain pending. / Bản preview đã kiểm tra cục bộ và với image AMD64/ARM64 đã công bố; nâng NAS 0.1.4 và kiểm thử xuyên suốt SePay còn chờ. See / Xem [VERIFICATION.md](VERIFICATION.md).

## English

DataCloud is an independent third-party web platform for managing existing
databases, in the same workflow category as DbGate, without affiliation.
Application source stays private under a proprietary license. The public
repository contains Docker deployment files and documentation. Docker targets
are Linux AMD64 and ARM64. Anonymous pulls and runtime smoke checks passed on AMD64 and emulated ARM64; see the image digest receipt.

### Connections and interface

MongoDB formats now include `mongodb+srv://`, ordinary MongoDB URIs, multi-host
seed lists and replica-set discovery. SRV/TXT records and every discovered peer
are checked against destination policy. Verified TLS and the configured host
allowlist remain required; credentials stay encrypted on the server. A URI
template containing `USER:PASS` requires real credentials in the private
connection form before it can be tested.

The Docker MongoDB 4.4 TLS fixture passed seed-list and SRV/TXT checks. This is
not a live Atlas verification. Supported engines remain MongoDB and the
MongoDB-compatible DocumentDB gateway; PostgreSQL is the metadata store, not
a customer database connector.

Console spacing, panel sizes, dialogs and aggregation columns are more
consistent. JSON results avoid a separate nested scrollbar for every document.
Local browser review found no page-level horizontal overflow on 20 routes at
1600 and 417 CSS pixels. Further sizes and final-image review remain pending.

### Free access, editable plans and SePay testing

Free remains the main evaluation experience with three database connections.
Suggested prices are **Pro 29,000 VND/month** and **Team 79,000 VND/month**.
Paid plans are disabled by default until the platform administrator enables
them; Business, Enterprise and Self-hosted have no approved price. A configured
checkout period policy is also required. Suggested quotas and feature names
do not imply every corresponding service has already been implemented.

The deployment bootstrap Owner can edit global plan prices, descriptions,
availability and quotas. Ordinary workspace Owners and API keys cannot edit
the global catalog. Changes persist through restart, reject conflicting edits
and commit with audit. Lower quotas prevent growth while allowing cleanup of
existing resources. Pending paid checkouts retain their approved price snapshot
when the plan is subsequently changed or disabled.

SePay Test Mode uses a separate provider and webhook credential, synthetic
ledger entries and test settlement events. Test payments cannot activate a paid
subscription, issue an invoice or send a real billing receipt. Signed local
webhook tests passed. A dedicated fake bank account, virtual account and payment-code pattern were configured in the provider
dashboard, but the webhook has not yet been saved and provider-to-platform
end-to-end verification is pending. No live payment completion is claimed.

### Migration and rollback

Before upgrading, back up metadata, vault keys, mounted private configuration,
integration credentials and certificate volumes together. Preserve external
customer database configuration and data. Check the published 0.1.4 image digests and
release checksums before changing a deployed image tag.

The additive migration creates `billing_catalog_state` and
`billing_catalog_history`, and adds `cp_checkouts.catalog_revision` with a durable
checkout migration marker. Existing policy becomes revision 1; legacy checkout
rows use that revision. Startup configuration becomes a first-install seed and
does not overwrite an administrator-edited policy. Existing deployments retain
their stored plans; administrators explicitly apply new prices or the proposed
Free limit if desired.

After plan edits or new checkouts, do not roll back only the image: older code
does not honor catalog revisions and may replace edited policy from startup
configuration. Pause checkout/webhook processing, record pending intents, and
restore a matching pre-upgrade metadata/secrets backup in a coordinated rollback.
Review provider events received after the backup before resuming to avoid
duplicate or missed settlement. Do not delete catalog history as a shortcut.

The 0.1.3 Google-only session and 0.1.2 encrypted connection-envelope restrictions
still apply. Google/SMTP setup is independent of payment configuration. Legal
content remains `DRAFT_AI`; additional engines, durable backup jobs and full
upstream DocumentDB acceptance are unfinished. Earlier NAS runtime receipts do not
verify the pending 0.1.4 NAS upgrade.

## Tiếng Việt

DataCloud là nền tảng bên thứ ba độc lập để quản lý database có sẵn qua website,
cùng nhóm cách sử dụng như DbGate và không có quan hệ liên kết với DbGate.
Mã nguồn ứng dụng được giữ riêng với giấy phép đóng. Repo công khai chỉ chứa
bộ triển khai Docker và tài liệu. Docker hỗ trợ Linux AMD64 và ARM64; đã tải image công khai và kiểm tra runtime AMD64 cùng ARM64 giả lập. Xem bản ghi digest image.

### Kết nối và giao diện

Hỗ trợ thêm `mongodb+srv://`, URI MongoDB thường, danh sách nhiều máy chủ và
khám phá replica set. SRV/TXT và từng máy chủ được phát hiện phải qua kiểm tra
đích đến. Vẫn bắt buộc TLS hợp lệ và danh sách tên máy chủ được phép; thông tin
đăng nhập lưu mã hóa ở máy chủ. URI mẫu có `USER:PASS` cần được thay bằng tài
khoản thật trong form kết nối riêng tư trước khi kiểm tra.

Đã kiểm tra seed list và SRV/TXT với MongoDB 4.4 TLS chạy thật trong Docker cục
bộ. Chưa xác minh tài khoản Atlas thật. Engine hiện hỗ trợ vẫn là MongoDB và
gateway tương thích MongoDB của DocumentDB; PostgreSQL lưu metadata nền tảng,
chưa phải connector cho database khách hàng.

Điều chỉnh khoảng cách, kích thước panel, hộp thoại và các cột aggregation.
Kết quả JSON không còn thanh cuộn riêng lồng trong từng document. Kiểm tra
20 trang ở chiều rộng 1600 và 417 CSS pixel không thấy tràn ngang toàn trang.
Các kích thước khác và bản image cuối vẫn đang chờ kiểm tra.

### Trải nghiệm miễn phí, quản trị gói và SePay Test

Free là gói trải nghiệm chính với ba kết nối database. Giá đề xuất:
**Pro 29.000đ/tháng**, **Team 79.000đ/tháng**. Gói trả phí mặc định tắt đến khi
quản trị viên nền tảng bật; Business, Enterprise và Self-hosted chưa có giá
được duyệt. Checkout còn cần chính sách kỳ thanh toán đã cấu hình. Hạn mức và
tên tính năng đề xuất không có nghĩa mọi dịch vụ tương ứng đã triển khai xong.

Owner khởi tạo khi triển khai được sửa giá, mô tả, trạng thái và hạn mức chung.
Owner của workspace thường và API key không được sửa danh mục toàn hệ thống.
Thay đổi giữ qua khởi động lại, có kiểm tra xung đột và lưu cùng audit. Giảm
hạn mức chặn tăng tài nguyên nhưng vẫn cho phép dọn bớt. Checkout đang chờ giữ
giá được duyệt lúc tạo dù admin đổi giá hoặc tắt gói sau đó.

SePay Test Mode là nhà cung cấp riêng, dùng khóa webhook riêng và đánh dấu rõ
giao dịch giả lập. Thanh toán thử không kích hoạt subscription trả phí, tạo
invoice hay gửi email biên nhận thật. Kiểm tra webhook ký cục bộ đã đạt. Đã tạo
tài khoản ngân hàng, VA và mẫu mã thanh toán giả lập riêng trong dashboard, nhưng chưa lưu webhook
và chưa hoàn tất kiểm thử xuyên suốt SePay–DataCloud. Không tuyên bố có giao
dịch tiền thật thành công.

### Nâng cấp và hạ phiên bản

Sao lưu đồng bộ metadata, khóa vault, cấu hình riêng, credential tích hợp và
volume chứng chỉ trước nâng cấp. Giữ dữ liệu và cấu hình database khách hàng.
Chỉ đổi tag triển khai sau khi image 0.1.4 và checksum được xác minh.

Migration bổ sung `billing_catalog_state`, `billing_catalog_history` và cột
`cp_checkouts.catalog_revision`, kèm dấu phiên bản migration bền vững. Chính
sách hiện có trở thành revision 1; checkout cũ dùng revision này. Cấu hình khởi
động chỉ là dữ liệu ban đầu cho lần cài mới, không ghi đè gói admin đã sửa.
Bản cài hiện có giữ gói đang lưu; admin cần áp dụng rõ ràng giá mới hoặc hạn
mức Free đề xuất nếu muốn dùng.

Sau khi sửa gói hoặc tạo checkout, không chỉ hạ tag image: mã cũ không xử lý
snapshot revision và có thể ghi đè gói từ cấu hình khởi động. Tạm dừng xử lý
checkout/webhook, ghi nhận giao dịch đang chờ rồi khôi phục bộ backup metadata
và secrets đồng bộ trước nâng cấp. Đối chiếu sự kiện nhà cung cấp phát sinh
sau mốc backup trước khi chạy lại để tránh xử lý trùng hoặc bỏ sót. Không xóa
lịch sử catalog để thay thế quy trình rollback.

Giới hạn Google-only của 0.1.3 và định dạng bí mật kết nối mã hóa từ 0.1.2 vẫn
áp dụng. Google/SMTP độc lập với cấu hình thanh toán. Pháp lý vẫn `DRAFT_AI`;
các engine khác, tác vụ backup bền vững và xác nhận đầy đủ DocumentDB upstream
chưa hoàn thiện. Bằng chứng vận hành NAS bản trước không xác minh được lần nâng NAS 0.1.4 đang chờ.
