# SePay Test Mode / Chế độ thử nghiệm SePay

DataCloud is an independent database management website. Payment integrations
manage its service plans; they do not grant access to a connected database.

## English

Create a dedicated fake bank account and HMAC-SHA256 webhook in SePay **Test Mode**.
Select only that test bank account, incoming transfers, JSON and automatic retry.
If SePay requires a virtual account (VA), create a dedicated fake official VA
and add `virtualAccountNumber` with its `SBSEPAY` value to `sepayTest`. The signed
`subAccount` must match exactly; other VAs on the same parent account are rejected.
Use your own HTTPS origin with `/api/v1/payments/webhooks/sepay-test` as the callback.
Configure a payment-code prefix `DL` allowing uppercase letters and digits.
Keep other applications' webhook and payment-code settings intact.

Save the following private JSON as `deploy/nas/secrets/payments_config` and add
`compose.payments.yaml` to `COMPOSE_FILE`. Replace placeholders locally. Never commit it.

```json
{
  "providers": {
    "sepayTest": {
      "enableTest": true,
      "bank": "Vietcombank",
      "accountNumber": "YOUR_FAKE_BANK_ACCOUNT",
      "virtualAccountNumber": "YOUR_SBSEPAY_TEST_VA",
      "webhookSecret": "YOUR_UNIQUE_TEST_HMAC_SECRET"
    }
  },
  "checkoutPolicy": { "approved": true, "periodDays": 30 }
}
```

The platform bootstrap Owner can use **Billing → Manage plans** to edit prices,
quota limits and availability. The catalog survives restarts. Ordinary tenant
Owners cannot change platform pricing. Initial Free is 0 VND with 3 connections;
Pro 29,000 VND/month and Team 79,000 VND/month are proposals until enabled there.
The billing period is separately approved server policy; this example uses 30 days.
Already-created payments keep their original catalog price and revision.

Choose **SePay Test Mode**, create a test checkout and copy its exact amount and
reference into SePay's transaction simulator for your dedicated fake bank account.
Successful authenticated delivery changes only the synthetic ledger to PAID.
It does not activate paid access, create a real invoice or send a payment receipt.
The platform administrator sees a SePay VietQR image using the fake VA, exact amount/reference and compact template. It is for the SePay simulator, not a real transfer. Without a configured sandbox VA, only local test instructions are shown. Customers cannot list, create or inspect sandbox payments. Replaying the same event is idempotent.
Check webhook delivery logs plus DataCloud's payment state before claiming a test passed.

Live configuration uses a separate `sepay` entry and callback ending `/sepay`.
Live and test HMAC keys must differ. An API Access token is not a webhook secret.
This integration does not need a SePay API token to receive HMAC webhooks.
Provider Test Mode resources are separate from Live; do not simulate against a real bank.

## Tiếng Việt

Tạo tài khoản ngân hàng giả và webhook riêng trong **Test Mode** của SePay.
Chỉ chọn tài khoản giả đó, giao dịch tiền vào, JSON, tự động gửi lại và HMAC-SHA256.
URL nhận là tên miền HTTPS của bạn cộng `/api/v1/payments/webhooks/sepay-test`.
Thêm tiền tố mã `DL`, cho phép chữ hoa và số; giữ nguyên cấu hình ứng dụng khác.

Lưu JSON mẫu trên vào file bí mật `deploy/nas/secrets/payments_config`, thay giá trị
mẫu trên máy của bạn và thêm `compose.payments.yaml` vào `COMPOSE_FILE`.
Tài khoản quản trị nền tảng ban đầu có thể sửa giá, hạn mức, bật/tắt gói ở trang Billing.
Free 0đ/3 kết nối được bật; Pro 29.000đ và Team 79.000đ là đề xuất cần bật riêng.
Chu kỳ thanh toán được cấu hình phía máy chủ; ví dụ dùng 30 ngày. Giao dịch đã tạo
giữ giá và phiên bản catalog ban đầu, kể cả khi admin thay đổi hoặc tắt gói sau đó.

Tạo checkout bằng SePay Test Mode, rồi mô phỏng đúng số tiền và nội dung trên SePay.
Kết quả xác thực chỉ ghi nhận thanh toán giả; không nâng gói, tạo hóa đơn thật hoặc
gửi email biên nhận. Quản trị viên xem ảnh VietQR dùng VA giả lập, số tiền và nội dung chính xác với mẫu compact; dùng trình mô phỏng SePay, không chuyển tiền thật. Khách không thấy và không gọi được API sandbox. Gửi lại cùng sự kiện không
ghi nhận thêm tiền. Khóa HMAC thử nghiệm phải khác khóa thật; không cần API Access
token cho luồng nhận webhook này. Chỉ kết luận đạt sau khi kiểm tra log và trạng thái.

Official references / Tài liệu chính thức:
- [SePay Test Mode](https://developer.sepay.vn/vi/tien-ich-khac/test-mode)
- [Test webhook configuration](https://developer.sepay.vn/vi/tien-ich-khac/test-mode/tao-webhook)
- [HMAC verification](https://developer.sepay.vn/vi/sepay-webhooks/xac-thuc)

- [VietQR Test Mode](https://developer.sepay.vn/vi/tien-ich-khac/test-mode/mo-phong-tao-ma-vietqr)
- [VietQR image parameters](https://developer.sepay.vn/vi/tien-ich-khac/tao-qr-code)
