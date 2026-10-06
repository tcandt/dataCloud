# DataCloud 0.1.5

**Human review approved / Đã được chủ nền tảng duyệt.** Versioned AMD64/ARM64 image verification and deployment status are recorded in [VERIFICATION.md](VERIFICATION.md).

## English

DataCloud is an independent third-party web console for external databases, in the workflow category of DbGate, without affiliation. Customer connectors support MongoDB and MongoDB-compatible DocumentDB gateways. PostgreSQL is the metadata store, not a customer SQL connector. Source remains private; deployment files/docs are public and images use a proprietary license.

This update adds the platform Owner's **Customers** page: search organizations/owner email; inspect contacts, plan, status, expiry, observed activity and measured resource counts. Grant/extend, suspend, reactivate or cancel with a reason and exact organization confirmation. Changes are audited, version checked and replay safe. Manual grants do not collect money or create paid invoices. Suspension/cancellation prevent new metered growth; existing reads and cleanup remain available.

One organization shares one subscription. Projects, connections and team seats are measured; other policy dimensions are marked unmetered. Independent self-hosted installations do not report identity or usage to your deployment. See [customer administration](docs/operations/CUSTOMER-SUBSCRIPTIONS.md).

A bounded background worker advances expired subscriptions. SMTP renewal reminders are opt-in, encrypted and deduplicated; default off. SePay Test Mode cannot activate paid subscriptions. This update does not enable live payment or recurring debit.

Explicit Atlas tier restrictions display as unsupported capabilities instead of repeating 503 responses; other driver failures remain errors. Production HTML/assets and APIs include `no-transform` to prevent automatic Cloudflare analytics injection while retaining strict CSP. The deployed HTTPS response was verified with no-transform, strict CSP and no injected Insights beacon. Legacy Free prices display as zero without rewriting catalog history.

### Upgrade and rollback

Back up metadata, original vault keys, private configuration and certificates together. Preserve existing mounts and customer engine data. This additive update adds administration/idempotency state and three lifecycle worker tables. Keep reminders disabled until the operator chooses to send them. Before rollback, reconcile pending payments and restore matching metadata/configuration with the old image; do not discard audit/payment events.

Local PostgreSQL races and a complete synthetic restore passed. These are not NAS disaster recovery or scale tests. See [verification](VERIFICATION.md) and [changelog](CHANGELOG.md).

## Tiếng Việt

DataCloud là nền tảng quản trị database bên thứ ba qua website, cùng nhóm công cụ với DbGate và không liên kết với DbGate. Hiện kết nối MongoDB/gateway tương thích MongoDB của DocumentDB; PostgreSQL dùng lưu metadata, chưa phải connector SQL cho khách. Mã nguồn riêng tư; bộ cài Docker/tài liệu công khai, image có giấy phép đóng.

Bản này thêm **Customers** cho chủ nền tảng: tìm tổ chức/email, xem chủ sở hữu, gói, trạng thái, hạn dùng, mức dùng và hoạt động. Có thể cấp/gia hạn/tạm ngưng/hủy/kích hoạt lại, bắt buộc lý do và xác nhận đúng tổ chức. Thay đổi có nhật ký, chống cập nhật chồng/lặp. Cấp thủ công không thu tiền hoặc tạo hóa đơn đã trả. Tạm ngưng/hủy chặn tăng tài nguyên đang đo; không xóa dữ liệu hoặc khóa việc đọc hiện có.

Một tổ chức dùng chung một gói. Hiện đo số project, kết nối và thành viên; hạn mức khác ghi rõ chưa đo. Khách tự chạy Docker chưa tự báo danh tính/mức dùng về máy chủ của bạn. [Hướng dẫn quản lý gói](docs/operations/CUSTOMER-SUBSCRIPTIONS.md).

Tác vụ nền xử lý hết hạn theo nhóm. Email nhắc hạn mặc định tắt, chỉ bật khi có SMTP và chủ nền tảng chọn sử dụng. SePay Test Mode không nâng gói trả phí; chưa bật thu tiền thật hoặc trừ tiền định kỳ.

Đã sửa hiển thị lỗi lệnh bị gói Atlas hạn chế và thêm `no-transform` cho HTML/assets/API để ngăn chèn analytics, giữ CSP nghiêm ngặt. Đã kiểm tra phản hồi HTTPS sau nâng NAS: có no-transform, giữ CSP và không có beacon Insights bị chèn. Giá Free cũ được chuẩn hóa lúc hiển thị, giữ lịch sử danh mục.

Trước nâng cấp, sao lưu PostgreSQL cùng khóa vault gốc, cấu hình riêng tư và chứng chỉ. Giữ volume/dữ liệu engine khách hàng. Quay lui cần bộ dữ liệu/cấu hình tương ứng và đối soát thanh toán phát sinh. Đã kiểm tra cạnh tranh PostgreSQL và khôi phục fixture; chưa diễn tập phục hồi NAS/kiểm tra quy mô lớn. Pháp lý vẫn `DRAFT_AI`.
