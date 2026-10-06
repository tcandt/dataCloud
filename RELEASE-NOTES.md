# DataCloud 0.1.1

## English

DataCloud is an independent third-party platform for managing connected databases
through a website, in the same workflow category as DbGate. It is a management
layer above existing database engines. There is no affiliation with DbGate.

This update adds bilingual documentation, clarifies current connector coverage,
removes operator-specific installation defaults and permits approved external
database hostnames through a private configuration allowlist.

MongoDB is implemented and locally tested. The DocumentDB adapter targets its
MongoDB-compatible gateway; verification against a live upstream endpoint remains
pending. PostgreSQL in the stack stores DataCloud metadata and is not an external
database connector. Other engine integrations are future work.

Public Docker images support Linux AMD64 and ARM64 under the same version tag.
The application remains proprietary; this repository publishes deployment files
and documentation. See README.md and VERIFICATION.md for installation and limits.

The initial public release was withdrawn and public history replaced to remove
private operator information. Update existing installations by preserving their
private `.env`, secrets, vault keys and data volumes, setting `APP_TAG=0.1.1`, and
running the startup script. No metadata schema or database engine version changes.
Existing downloads or third-party caches cannot be recalled.

## Tiếng Việt

DataCloud là nền tảng bên thứ ba độc lập để quản lý các database đã kết nối trên
website, cùng nhóm cách sử dụng như DbGate. Đây là lớp quản lý phía trên database
engine đang có. Dự án không có quan hệ liên kết với DbGate.

Bản này thêm tài liệu Anh/Việt, làm rõ phạm vi connector, gỡ cấu hình mặc định riêng
và cho phép thêm hostname database bên ngoài vào danh sách được phép trong cấu
hình riêng của người vận hành.

MongoDB đã triển khai và kiểm tra cục bộ. Adapter DocumentDB dùng gateway tương
thích MongoDB, chưa xác minh trên endpoint upstream thật. PostgreSQL trong stack
lưu metadata DataCloud, chưa phải connector cho database PostgreSQL bên ngoài.
Các engine khác sẽ được tích hợp sau.

Image Docker công khai hỗ trợ Linux AMD64/ARM64 cùng một tag phiên bản. Ứng dụng
vẫn dùng giấy phép đóng; repo chỉ công khai bộ cài và hướng dẫn. Xem README.vi.md
và VERIFICATION.md để biết cách cài và giới hạn đã kiểm tra.

Bản công khai ban đầu đã thu hồi; lịch sử công khai được thay để gỡ thông tin
riêng. Khi cập nhật, giữ `.env`, secrets, khóa vault và volume dữ liệu, đặt
`APP_TAG=0.1.1` rồi chạy script khởi động. Không đổi schema metadata hay phiên bản
database engine. Không thể thu hồi các bản đã tải hoặc cache của bên khác.
