# DataCloud 0.1.3

**Preview status:** public AMD64/ARM64 images are available; native Synology
deployment and HTTPS tunnel startup passed. Google consent/callback and SMTP
delivery still require operator completion. See the
[verification receipt](https://github.com/tcandt/dataCloud/blob/v0.1.3/VERIFICATION.md).

## English

DataCloud is an independent third-party web platform for managing existing
databases, in the same workflow category as DbGate, without affiliation.
This preview connects MongoDB and the MongoDB-compatible DocumentDB gateway.
PostgreSQL stores platform metadata; it is not yet a customer database connector.

New interactive Docker installations default to **Google-only sign-in** and
external databases. Password login, ordinary registration, recovery and demo
login are disabled in Google-only mode. Verified Google users can create their
own isolated organization or accept an invitation to an existing organization.
The bootstrap owner links only through the explicitly configured verified Google
email. Old password sessions cannot authenticate in Google-only mode; scoped API
keys remain available. Existing installations retain their chosen mode and secrets.

OAuth and SMTP credentials now use private mounted files through the optional
Docker integrations overlay. Google verifies the signed-in email. SMTP handles
invitations and configured notifications, and requires its own provider credentials;
being logged into Gmail does not configure SMTP. See the
[English/Vietnamese setup guide](https://github.com/tcandt/dataCloud/blob/v0.1.3/docs/operations/GOOGLE-SMTP-NAS.md).

The console and public pages have refreshed light/dark styling, responsive
navigation, cards and forms. Wide tables and JSON scroll within their panels.
Mobile query options collapse without losing projection/sort drafts. Browser
checks at 320, 375, 767 and 1440 CSS pixels found no page-level horizontal overflow
on the checked views; this does not establish coverage of every device or route.

Local checks passed: **226 tests**, type checking and application builds.
Published images passed runtime checks on AMD64 and emulated ARM64. Native
Synology AMD64 startup and HTTPS access passed; Google callback and actual SMTP
delivery remain unverified. Intended Docker targets are Linux AMD64/ARM64.
Executable application code remains proprietary and source remains private.

Update with your existing private settings, secrets and volumes; set
`APP_TAG=0.1.3` and run the startup script. Back up metadata, vault keys, other
secrets and certificate volumes first. Google-only needs OAuth configuration and
the integrations overlay; changing the image tag alone does not configure it.
Do not change `owner_config.email` to transfer ownership: a mismatch now refuses
bootstrap. Plan an explicit migration if the intended Google owner email differs
from the stored identity.

Version 0.1.3 adds `identity_google_sessions` to distinguish Google sessions.
Earlier versions do not enforce Google-only authentication; review that policy,
end active sessions and restore a matching metadata/secrets backup before rolling
back. The 0.1.2 connection-envelope restriction remains: versions 0.1.1 and earlier
cannot read newly created or rotated connection secrets. Legal content remains
`DRAFT_AI`; additional engines, durable backup jobs and full upstream DocumentDB
acceptance remain unfinished.

## Tiếng Việt

DataCloud là nền tảng bên thứ ba độc lập để quản lý database có sẵn trên website,
cùng nhóm cách sử dụng như DbGate và không có quan hệ liên kết với DbGate.
Bản preview hỗ trợ adapter MongoDB và gateway tương thích MongoDB của DocumentDB.
PostgreSQL lưu metadata nền tảng, chưa phải connector cho database khách hàng.

Cài mới mặc định **chỉ đăng nhập Google** và kết nối database ngoài. Google-only
tắt mật khẩu, đăng ký thường, khôi phục mật khẩu và demo. Người dùng Google đã
xác minh có thể tạo tổ chức riêng hoặc nhận lời mời vào tổ chức đã có. Owner chỉ
liên kết bằng email Google được cấu hình rõ ràng và đã xác minh. Phiên mật khẩu
cũ không dùng được trong Google-only; API key có giới hạn quyền vẫn hoạt động.
Bản cài hiện có giữ chế độ và bí mật đang dùng.

Bí mật OAuth/SMTP được đưa vào container qua file riêng trong overlay tùy chọn.
Google xác minh email đăng nhập; SMTP phục vụ lời mời và thông báo đã cấu hình.
SMTP cần credential nhà cung cấp riêng; đăng nhập Gmail chưa cấu hình được SMTP.
Xem [hướng dẫn tích hợp Anh–Việt](https://github.com/tcandt/dataCloud/blob/v0.1.3/docs/operations/GOOGLE-SMTP-NAS.md).

Giao diện console và trang công khai đổi kiểu sáng/tối, menu, thẻ thông tin và
biểu mẫu thích ứng màn hình. Bảng rộng và JSON cuộn trong vùng dữ liệu. Tùy chọn
truy vấn di động thu gọn mà giữ nội dung projection/sort. Kiểm tra ở chiều rộng
320, 375, 767 và 1440 CSS pixel không thấy tràn ngang toàn trang trên các màn hình
đã thử; chưa thể khẳng định mọi thiết bị và mọi trang đều được kiểm tra.

Đã đạt **226 bài kiểm tra**, kiểm tra kiểu dữ liệu và build cục bộ. Image công khai
đạt kiểm tra AMD64 và ARM64 giả lập. NAS Synology AMD64 đã khởi động và truy cập
HTTPS thành công; callback Google và gửi SMTP thật chưa xác minh. Docker hướng
tới Linux AMD64/ARM64. Ứng dụng giữ giấy phép đóng và mã
nguồn riêng tư; repo công khai chỉ chứa bộ triển khai và tài liệu.

Khi nâng cấp, giữ cấu hình riêng, secrets, volume và đặt `APP_TAG=0.1.3` rồi chạy
script khởi động. Sao lưu metadata, khóa vault, secrets và volume chứng chỉ trước.
Google-only cần OAuth client và overlay integrations; đổi tag image chưa đủ.
Không đổi email trong `owner_config` để chuyển owner: email không khớp sẽ khiến
bootstrap từ chối. Cần quy trình chuyển danh tính rõ ràng nếu email lưu trước đó
khác email Google muốn dùng.

0.1.3 thêm bảng `identity_google_sessions` để phân biệt phiên Google. Bản cũ không
thực thi Google-only; xem lại chính sách xác thực, kết thúc phiên đang hoạt động
và khôi phục backup metadata/secrets phù hợp trước khi hạ phiên bản. Giới hạn mã
hóa từ 0.1.2 vẫn áp dụng: bản 0.1.1 trở xuống không đọc được kết nối mới tạo hoặc
thay bí mật. Pháp lý vẫn `DRAFT_AI`; các engine bổ sung, backup bền vững và bộ kiểm
tra đầy đủ DocumentDB upstream chưa hoàn tất.
