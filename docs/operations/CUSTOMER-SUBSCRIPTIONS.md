# Customer & subscription administration / Quản lý khách hàng và gói dịch vụ

This guide describes the Customers interface included with this release. A server running an older image must be upgraded before this interface is available.

Hướng dẫn này mô tả màn hình Customers đi kèm bản phát hành. Máy chủ đang dùng image cũ cần được nâng cấp để có màn hình này.

## Tiếng Việt

### Tự động xử lý hết hạn và email

Tác vụ nền kiểm tra các gói đến hạn mỗi phút theo từng nhóm tối đa 25 tổ chức; khi có nhiều tổ chức, cần nhiều vòng để quét hết. Kiểm tra quyền khi khách sử dụng vẫn áp dụng hạn dùng ngay. Mặc định không gửi email nhắc hạn. Khi chủ nền tảng bật `SUBSCRIPTION_REMINDERS_ENABLED=true` và đã cấu hình SMTP, hệ thống xếp hàng thông báo trước hạn (mặc định 3 ngày) và khi kỳ sử dụng kết thúc cho các Owner đang hoạt động, đã xác minh email. Có thể đặt `SUBSCRIPTION_REMINDER_DAYS` từ 1 đến 30. Hàng đợi được mã hóa, chống tạo trùng và thử lại khi gửi lỗi. Khi bật lần đầu, các gói đã hết hạn tự động nhưng chưa được thông báo cũng có thể nhận thư. Gói Free, dữ liệu demo và gói bị hủy/tạm ngưng thủ công không nhận nhắc hạn này. Không tự trừ tiền hoặc tự gia hạn từ một thông báo.

Kiểm thử tác vụ và lỗi gửi dùng dữ liệu/transport giả lập; chưa xác nhận thư nhắc hạn thực tế trên NAS.

### Khách hàng của bạn được nhận diện như thế nào?

Khách hàng dùng website do bạn vận hành sẽ có tổ chức và tài khoản riêng trong DataCloud. **Một tổ chức dùng chung một gói**, bao gồm các workspace, thành viên và kết nối của tổ chức đó; không thu một gói riêng cho mỗi kết nối database.

Với cấu hình chỉ đăng nhập Google, người dùng mới chọn **Continue with Google**. Hệ thống tạo tổ chức riêng và bắt đầu bằng gói Free. Họ không trở thành quản trị viên nền tảng. Thành viên được mời vào tổ chức dùng gói của tổ chức đó. Khả năng người ngoài đăng nhập còn phụ thuộc cấu hình đối tượng và trạng thái phát hành ứng dụng Google OAuth.

### Mở trang quản lý

1. Đăng nhập bằng tài khoản chủ nền tảng đã được cấu hình khi cài đặt (`bootstrapOwner`), tại workspace gốc của tài khoản đó.
2. Chọn **Customers** trong thanh điều hướng, hoặc mở đường dẫn `/customers` trên website của bạn.
3. Tìm theo tên tổ chức hoặc email chủ tổ chức, rồi chọn **Manage**. Mỗi trang có tối đa 20 tổ chức.

Chỉ chủ nền tảng được chỉ định mới quản lý khách hàng và danh mục gói toàn hệ thống. Quyền Owner của một tổ chức khách hàng không cấp quyền này. Tài khoản thông thường có thể xem gói của mình tại **Billing**; truy cập trực tiếp trang quản trị sẽ bị từ chối. API key không thay thế phiên đăng nhập của chủ nền tảng.

Trang chi tiết hiển thị chủ tổ chức, gói, trạng thái, ngày hết hạn, hạn gia hạn, số tài nguyên, hoạt động và thanh toán gần đây. **Last activity** là thời điểm ghi nhận yêu cầu đã xác thực gần nhất từ phiên đăng nhập/API key, không phải bằng chứng khách hàng đang online. Trang này không mở tài liệu database, câu truy vấn hay mật khẩu kết nối của khách hàng.

### Thao tác với gói

| Nút trên giao diện          | Kết quả                                                                                                                                                                                                     |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Grant or change plan**    | Cấp, đổi hoặc gia hạn gói thủ công và đưa gói về trạng thái active. Có thể chọn lại cùng gói để đổi hạn. Gói trả phí phải được bật trong danh mục và có ngày hết hạn tương lai. Free không có ngày hết hạn. |
| **Suspend subscription**    | Tạm dừng quyền tăng mức sử dụng đang được tính hạn mức, có hiệu lực ngay.                                                                                                                                   |
| **Reactivate subscription** | Kích hoạt lại gói suspended, cancelled hoặc expired. Gói trả phí cần ngày hết hạn tương lai.                                                                                                                |
| **Cancel subscription**     | Chuyển sang cancelled ngay; không phải đặt lịch hủy cuối kỳ.                                                                                                                                                |

Mỗi thay đổi yêu cầu lý do dài 8–500 ký tự và nhập đúng tên tổ chức để xác nhận. Hệ thống ghi nhật ký quản trị. Nếu dữ liệu đã thay đổi ở nơi khác, chọn **Reload customer**, kiểm tra lại rồi thực hiện thao tác mới.

Cấp gói thủ công **không thu tiền và không tạo hóa đơn đã thanh toán**. Suspend/Cancel không xóa dữ liệu, không đăng xuất khách hàng và không chặn việc đọc database hiện có. Chúng hạn chế tăng tài nguyên đang được đo; giảm tài nguyên để dọn dẹp vẫn được phép. Đây không phải chức năng khóa toàn bộ tài khoản.

Ngày hết hạn nhập theo giờ địa phương của trình duyệt và được lưu dưới dạng thời điểm thống nhất. Hệ thống áp dụng chính sách gia hạn của máy chủ khi đánh giá gói/hạn mức; sau thời gian gia hạn, gói có thể chuyển sang suspended. Không có cam kết tự động trừ tiền định kỳ. Hãy kiểm tra trạng thái thực tế trước khi gia hạn thủ công.

### Hạn mức, giá và thanh toán

- Hiện hệ thống đo và áp dụng hạn mức cho **projects**, **database connections** và **team members**. Các mục ghi **Not metered** chưa được theo dõi tự động; không dùng chúng làm bằng chứng tiêu thụ hoặc căn cứ tính phí. Giới hạn lưu trong danh mục không có nghĩa mọi chỉ số đã được đo.
- Mở **Billing → Manage plans** hoặc **Plan catalog** để chỉnh tên, mô tả, giá, trạng thái cung cấp và hạn mức. Danh mục áp dụng cho mọi tổ chức; không phải giá riêng của khách hàng đang xem. Giảm hạn mức giữ nguyên tài nguyên đã có nhưng hạn chế tăng thêm. Yêu cầu thanh toán đã tạo giữ giá chụp tại thời điểm tạo.
- **SePay Test Mode** chỉ tạo kết quả thử nghiệm. Trạng thái test đã xác nhận không nâng gói, không tạo hóa đơn thật và không gửi email biên nhận thanh toán thật.
- Thanh toán thật cần cấu hình nhà cung cấp và merchant riêng, webhook xác thực cùng chính sách thương mại được phê duyệt. Luồng thanh toán đã xác minh mới có thể cập nhật gói/hóa đơn theo cấu hình. Trang chuyển hướng thành công hoặc lời báo đã chuyển tiền không đủ để xác nhận. Việc có nút thanh toán không chứng minh cấu hình production đã hoàn tất.

### Docker tự triển khai có được quản lý tập trung không?

Image công khai cho phép người khác chạy một DataCloud độc lập. Bản hiện tại **không có đăng ký installation, kích hoạt giấy phép hoặc hệ thống gửi thống kê về máy chủ trung tâm**. Vì vậy, trang Customers của bạn không biết ai tải image, đang chạy ở đâu hoặc sử dụng bao nhiêu. Gói `SELF-HOSTED` trong danh mục không tự tạo chức năng quản lý giấy phép từ xa.

Giấy phép đóng quy định quyền sử dụng; nó không phải DRM. Người giữ image có thể trích xuất và kiểm tra mã đã biên dịch. Không nên mô tả image là mã hóa không thể đọc hoặc không thể sao chép.

### Thông tin chủ nền tảng cần cung cấp trước khi bán chính thức

1. Nhà cung cấp thanh toán thật, merchant/tài khoản nhận tiền, cấu hình webhook và chính sách đối soát. Cung cấp khóa bí mật qua cấu hình riêng của máy chủ, không đưa vào tài liệu công khai.
2. Đơn vị bán dịch vụ, quốc gia/khu vực áp dụng, tiền tệ, giá, chu kỳ, thuế/hóa đơn, chính sách gia hạn, hủy và hoàn tiền. Nội dung pháp lý còn `DRAFT_AI` cần được chủ dịch vụ duyệt phù hợp với nơi kinh doanh.
3. Quyết định mô hình self-host: sử dụng miễn phí theo giấy phép, hợp đồng hỗ trợ, hoặc xây dựng dịch vụ cấp phép riêng; xác định có cần chạy offline, gia hạn và thu thập thống kê có thông báo hay không.

## English

### Background expiry and optional reminders

The worker checks up to 25 due organizations per minute; larger backlogs need multiple passes. Entitlement checks enforce expiry at request time. Email is off by default. Set `SUBSCRIPTION_REMINDERS_ENABLED=true` with configured SMTP to enqueue renewal notices (default three days before expiry) and period-ended notices to verified active Owners. `SUBSCRIPTION_REMINDER_DAYS` accepts 1–30. Encrypted durable queues deduplicate enqueue across restart/concurrent workers and use delivery retries. Enabling reminders can notify subscriptions already expired automatically but not yet notified. Free/demo/cancelled/manually suspended subscriptions are excluded. Notices do not charge or renew subscriptions. Tests use synthetic transport; actual NAS reminder delivery is not yet verified.

### How are customers identified?

Customers using your hosted website have separate organizations and accounts. **One subscription belongs to one organization**, shared by its workspaces, members and database connections. A database connection is not a separate subscription.

With Google-only authentication, a new user chooses **Continue with Google**, receives an isolated organization and starts on Free. They do not become platform administrators. Invited members share their organization's subscription. Access by external users also depends on your Google OAuth audience and publication settings.

### Open customer administration

1. Sign in as the installation's configured platform owner (`bootstrapOwner`), using that account's original workspace.
2. Select **Customers** in navigation or open `/customers` on your website.
3. Search by organization name or owner email and select **Manage**. Pages contain at most 20 organizations.

Only the designated platform owner can manage other customers and the global plan catalog. A customer's organization Owner role does not grant platform access. Ordinary customers use **Billing** to view their own subscription; direct admin access is denied. API keys cannot replace the platform owner's browser session.

Details include owners, plan, status, expiry, grace deadline, resource counts, recent activity and payments. **Last activity** is the latest observed authenticated session/API-key request, not online presence. This screen does not expose customer database documents, query text or connection credentials.

### Change a subscription

| Control                     | Effect                                                                                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Grant or change plan**    | Manually activate, change or extend a plan. Select the same plan to change its expiry. Paid plans must be enabled in the catalog and have a future expiry. Free has no expiry. |
| **Suspend subscription**    | Immediately restrict growth in metered resources.                                                                                                                              |
| **Reactivate subscription** | Restore a suspended, cancelled or expired subscription. Paid plans require a future expiry.                                                                                    |
| **Cancel subscription**     | Set cancelled immediately; this does not schedule cancellation at period end.                                                                                                  |

Every change requires an 8–500 character reason and exact organization-name confirmation, and is audited. On a conflict, choose **Reload customer**, review current details and make a fresh change.

Manual grants **do not collect money or create paid invoices**. Suspension/cancellation preserves data, does not sign users out and does not block existing database reads. It restricts growth in metered resources while permitting cleanup that reduces usage. It is not a complete account lock.

Expiry input uses browser local time and is stored as an unambiguous timestamp. The server applies its configured grace policy when evaluating subscriptions/entitlements; a subscription may become suspended after grace expires. Automatic recurring collection is not implied. Check the current state before manually extending a term.

### Usage, pricing and payments

- **Projects**, **database connections** and **team members** are currently metered and enforced. **Not metered** means automatic usage tracking is not implemented for that dimension; do not treat it as measured consumption or a billing basis. A configured limit alone does not establish metering.
- Open **Billing → Manage plans**, or **Plan catalog**, to edit plan names, descriptions, prices, availability and limits. The catalog is global, not specific to the selected customer. Lower limits preserve existing resources and restrict new growth. Existing payment intents retain their original price snapshot.
- **SePay Test Mode** produces synthetic results only. A confirmed test does not upgrade a subscription, create a real invoice or send a real payment receipt.
- Live payments require separate provider/merchant configuration, authenticated webhooks and approved commercial policy. Verified payment processing can update subscriptions/invoices according to configuration. A successful return page or a customer's transfer claim cannot settle a payment. Visible checkout controls do not establish production readiness.

### Independently hosted Docker installations

A public image can run as an independent DataCloud installation. This version has **no central installation registry, license activation or automatic usage reporting**. Your Customers page cannot identify who downloaded the image, where it runs or its usage. A `SELF-HOSTED` catalog plan does not implement remote license management.

A proprietary license defines permitted use; it is not DRM. An image holder can extract and inspect compiled code. Do not promise unreadable encryption or copy protection.

### Owner decisions needed before commercial launch

1. Live payment provider, merchant/receiving account, webhook configuration and reconciliation policy. Supply secrets through private server configuration, never public documentation.
2. Seller identity, operating jurisdiction, currency, prices, billing periods, taxes/invoicing, renewal, cancellation and refund policies. Legal content marked `DRAFT_AI` still needs the operator's appropriate review.
3. Self-host policy: free licensed use, support contracts or a separate licensing service; decide requirements for offline use, renewal and disclosed telemetry.
