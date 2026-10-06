# DataCloud 0.1.2

## English

DataCloud is an independent third-party web platform for managing existing
databases, in the same workflow category as DbGate, without affiliation.
This preview connects MongoDB and the MongoDB-compatible DocumentDB gateway.
PostgreSQL stores platform metadata; it is not yet a customer database connector.

New installations default to external-only mode: website/API, PostgreSQL metadata
and nginx start together without a starter MongoDB. Choose local mode when a
starter database is wanted. Existing installations retain their mode and data.

Connections now accept private CA certificates. URI and CA are encrypted together;
read APIs never return them. Rotation verifies independent candidates, preserves
working settings on failure and rejects stale observations after a credential
change. TLS and hostname validation remain mandatory. Capability evidence,
metrics and DocumentDB operation identifiers have also been corrected.

The console displays DataCloud consistently. Docker images share a version tag
for Linux AMD64/ARM64; executable application code remains proprietary and source
remains private. Public files contain only deployment materials and documentation.

Update with your existing private settings, secrets and volumes; set
`APP_TAG=0.1.2` and run the startup script. Back up metadata and vault keys first.
There is no engine upgrade or table migration. New/rotated connection records use
a secret envelope that older versions cannot read: rollback requires the matching
pre-update metadata backup. See [verification](VERIFICATION.md) for tested scope.
Legal drafts and SMTP/Google live validation remain deferred.

## Tiếng Việt

DataCloud là nền tảng bên thứ ba độc lập để quản lý database có sẵn trên website,
cùng nhóm cách sử dụng như DbGate và không có quan hệ liên kết với DbGate.
Bản preview hỗ trợ adapter MongoDB và gateway tương thích MongoDB của DocumentDB.
PostgreSQL lưu metadata nền tảng, chưa phải connector cho database khách hàng.

Cài mới mặc định dùng chế độ external: website/API, kho metadata PostgreSQL và
nginx khởi động cùng nhau, không kèm MongoDB khởi tạo. Chọn local khi cần database
khởi tạo. Cấu hình và dữ liệu của hệ thống đã cài được giữ lại.

Có thể nhập CA riêng khi tạo hoặc thay kết nối. URI và CA được lưu mã hóa; API
đọc không trả lại chúng. Mỗi lần thay kết nối được kiểm tra riêng, giữ cấu hình
cũ nếu thất bại và không cho kết quả kiểm tra cũ ghi đè sau khi đổi mật khẩu.
TLS và kiểm tra tên máy chủ vẫn bắt buộc. Bản này cũng sửa nhận diện tính năng,
metric và mã thao tác DocumentDB.

Giao diện thống nhất tên DataCloud. Image Docker dùng cùng tag cho Linux
AMD64/ARM64; ứng dụng giữ giấy phép đóng và mã nguồn riêng tư. Repo công khai chỉ
chứa bộ triển khai và tài liệu.

Khi nâng cấp, giữ cấu hình riêng, secrets, volume và đặt `APP_TAG=0.1.2` rồi chạy
script khởi động. Sao lưu metadata và khóa vault trước. Không nâng engine hoặc
đổi bảng metadata. Kết nối tạo/thay ở bản này dùng định dạng mã hóa mới mà bản cũ
không đọc được; hạ phiên bản cần khôi phục backup metadata trước cập nhật.
Xem [kết quả kiểm tra](VERIFICATION.md) để biết phạm vi thực tế. Pháp lý vẫn là
bản nháp; xác minh SMTP/Google trực tiếp tiếp tục được hoãn.
