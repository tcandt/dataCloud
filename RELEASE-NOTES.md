# DataCloud 0.1.7 — Free-first Docker preview

## Tiếng Việt

- QR VietQR theo tài liệu SePay, mẫu compact và VA riêng cho Test Mode; trạng thái thanh toán theo webhook đã xác minh, tự cập nhật và đọc lại khi kết nối gián đoạn. Thông báo xác nhận thanh toán tách biệt với việc kích hoạt gói. QR thử nghiệm không dùng để chuyển tiền.
- Khách chọn/mua hoặc gia hạn gói từ thẻ gói trên Billing; không có sandbox hay Legal center nội bộ. Khách chỉ thấy kết nối database trong Integrations; SePay/SMTP dành cho chủ nền tảng. Checkout tùy chọn nằm trong Billing của bản hosted; Docker tự cài không có checkout.
- Free mặc định: 3 dự án, 3 kết nối, 5 thành viên. Bổ sung 1.000 lần Aggregate/Explain và 10.000 request API-key mỗi tháng; không tính việc tự làm mới trình duyệt. Các gói đã được admin sửa được giữ nguyên.
- Giấy phép Docker có chữ ký Ed25519, mã cài đặt riêng, giới hạn và hạn dùng; không gửi telemetry hay nội dung database. Free dùng offline. Chủ nền tảng ký giấy phép ngoài máy khách và lưu biên nhận cấp phép.
- Container sao lưu mã hóa mỗi ngày, giữ 14 bản đã kiểm tra; tự khôi phục thử vào PostgreSQL cô lập. Bao gồm dữ liệu nội bộ và cấu hình/khóa khôi phục DataCloud, không bao gồm database bên ngoài của khách.
- Query insights thu gọn, có thẻ trên điện thoại và chi tiết riêng. Metrics một mẫu hiển thị snapshot; số RAM không được nhà cung cấp hỗ trợ hiển thị không có dữ liệu.

**Đã được chủ nền tảng duyệt phát hành; xem VERIFICATION.md về image và triển khai.** Google bên ngoài cần hoàn tất Branding và chuyển OAuth khỏi Testing. Pháp lý vẫn DRAFT_AI; SePay vẫn Test Mode. Khôi phục thử tự động không ghi đè hệ thống đang chạy.

Nâng cấp hosted: giữ `DATACLOUD_EDITION=hosted`. Bộ cài mới ghi `selfhost`; biến `DEPLOYMENT_MODE=local|external` vẫn chỉ lựa chọn có cài database đi kèm hay không. Backup cần chuẩn bị khóa và snapshot riêng, sau đó bật overlay; lưu thêm bản sao khóa ngoài NAS.

## English

- SePay-documented VietQR images with the compact template and dedicated Test Mode VA; verified-webhook status observation with reconnect catchup. Payment confirmation and subscription fulfillment are distinct. Synthetic QR codes cannot transfer money.
- Customers choose or renew approved plans directly from plan cards. Sandbox APIs/UI and internal Legal center are platform-admin only. Tenant integrations show database connections; SMTP/payment configuration is platform-admin only. Hosted checkout remains optional in Billing; self-hosted Docker has no checkout.
- Free defaults: 3 projects, 3 connections, 5 members, 1,000 aggregation/explain attempts and 10,000 API-key requests per UTC month. Browser refreshes do not consume API quota. Saved administrator catalogs are preserved.
- Offline Ed25519 installation licenses bind limits and expiry to an installation ID. No hidden telemetry or database-data upload. Vendor signing and issuance receipts remain private; offline revocation/anti-cloning limits are documented.
- Daily encrypted platform backup, 14 verified artifacts, and automatic isolated PostgreSQL restore drills. Includes platform metadata and recovery configuration; external customer databases are outside this scope.
- Compact query summaries, mobile cards, full detail dialog, honest single-sample metrics and unavailable memory states.

**Publication approved by the owner; see VERIFICATION.md for image and deployment evidence.** External Google access needs completed Branding and audience publication. Legal documents remain DRAFT_AI; SePay stays in Test Mode. Automated restore drills never replace the live database.

Hosted upgrades must retain `DATACLOUD_EDITION=hosted`; new installers select `selfhost`. The separate `DEPLOYMENT_MODE=local|external` option still selects the optional starter database. Backups require private key/input preparation and the backup overlay, with an off-NAS recovery-key copy.
