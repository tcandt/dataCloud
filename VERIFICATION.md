# 0.1.6 verification / Kết quả kiểm tra

2026-10-06. Human release/deployment review approved. Docker images published; hosted upgrade pending operator DSM authentication. Current hosted image remains 0.1.5.

- 276/276 source tests passed; typecheck, web build and compiled runtime passed.
- API regression covers supported-empty versus unsupported, legacy422 compatibility, anonymous/foreign-resource denial, unknown view validation, sanitized response and preserved403/503/504 failures.
- QueryObserver regression covers unsupported mount/focus/reconnect suppression, connection isolation, manual recovery, resumed polling and real failure propagation without retries.
- Local browser using a synthetic tier restriction renders Current operations unavailable in Overview and Operations, with no console errors/warnings. After switching the fixture to supported, manual Refresh displays No current operations returned.
- Published application and certificate images are anonymously accessible for linux/amd64 and linux/arm64. Runtime checks passed on native AMD64 and emulated ARM64: Google-only enforcement, dynamic SOCKS dependency, compiled egress module and operations capability report. Certificate initialization passed on both architectures. Native ARM64/macOS acceptance is not claimed.
- Extracted application image privacy scans passed on both architectures. Exact registry digests are recorded in image-digests.json. The application image was built from private release source bf730c9795caece86fbea83453e109b7ac47276d.
- A fresh pre-upgrade PostgreSQL archive has a readable catalog; this is not a restore drill. DSM project stop failed and its container inventory includes a stale tunnel entry. Existing application services were restarted on 0.1.5, and public health returned HTTP 200 with live PostgreSQL storage. A disabled manual maintenance task is prepared but awaits DSM password confirmation. No successful hosted 0.1.6 deployment or live Atlas 0.1.6 acceptance is claimed.
- The legacy operations endpoint without `view=capability` intentionally retains its 422 unsupported response. The new web console uses the optional capability report. Actual database permission, transport and timeout failures remain errors.

Tiếng Việt: đạt 276/276 bài kiểm thử và các bước build/runtime. Image công khai có AMD64 và ARM64; đã chạy thử AMD64 trực tiếp, ARM64 giả lập, đăng nhập Google-only, SOCKS, báo cáo capability và tạo chứng chỉ. Đã quét dữ liệu riêng tư trong cả hai image. Chưa xác nhận chạy trực tiếp trên NAS ARM64 hoặc macOS.

Đã kiểm tra luồng không hỗ trợ và phục hồi bằng fixture cục bộ, không phát sinh thanh toán hoặc thay đổi database khách hàng. Đã sao lưu PostgreSQL trước nâng cấp và đọc được danh mục bản sao lưu; chưa diễn tập khôi phục NAS. Container Manager có mục tunnel cũ không thể thao tác, và dừng dự án thất bại. Website đã chạy lại bản 0.1.5 và kiểm tra sức khỏe trả HTTP 200. Tác vụ bảo trì thủ công đang chờ xác thực mật khẩu DSM; bản 0.1.6 chưa được xác nhận triển khai trên NAS. Endpoint cũ vẫn giữ HTTP 422 khi lệnh không hỗ trợ; giao diện mới dùng `view=capability`.

Payment remains a synthetic test integration. This patch does not activate live billing or renewal email delivery. Broader roadmap work is not declared complete.
