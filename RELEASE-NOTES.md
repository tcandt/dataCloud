# DataCloud 0.1.6

## Tiếng Việt

Khi MongoDB Atlas không cho phép currentOp trên gói hiện tại, bản 0.1.5 đã phân loại thành không hỗ trợ nhưng vẫn trả HTTP422 cho giao diện. Bản này thêm chế độ quan sát capability cho API và giao diện: trả trạng thái không hỗ trợ rõ ràng, không tạo yêu cầu HTTP lỗi cho tình huống dự kiến đó; dừng tự gọi lại khi mở trang, quay lại cửa sổ hoặc kết nối lại. Nút Refresh observations vẫn kiểm tra lại để phục hồi khi quyền/gói database thay đổi.

Không che lỗi xác thực, timeout hoặc mất kết nối; không coi việc không được hỗ trợ là không có operation đang chạy. Endpoint cũ không truyền view vẫn giữ phản hồi tương thích, bao gồm 422 khi client yêu cầu lệnh không được hỗ trợ.

Chủ nền tảng đã duyệt phát hành và triển khai bản này. Image Docker đã xuất bản; nâng cấp NAS đang chờ xác thực DSM, website hiện vẫn chạy 0.1.5. Xem VERIFICATION.md để biết kết quả kiểm tra. Bản vá không thay đổi gói khách hàng hoặc kích hoạt thanh toán thật.

## English

Atlas tier restrictions were classified correctly in 0.1.5 but still surfaced as HTTP422 in the web console. This update adds an opt-in operations capability report and uses it in the console. Unsupported observations render an explicit state and stop automatic polling, mount, focus and reconnect fetches. Manual refresh rechecks support and permits recovery after a database permission/tier change.

Authentication, transport and timeout failures remain errors. An unavailable observation is never presented as a supported empty operations list. The legacy API without a view retains its original array response and unsupported422 contract. Source/API/UI checks are recorded in VERIFICATION.md. Human release/deployment review approved. Docker images are published; the NAS upgrade awaits DSM authentication and the hosted service remains on 0.1.5.
