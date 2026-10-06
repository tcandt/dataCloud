# 0.1.7 release evidence / Kết quả kiểm tra

2026-10-06. Owner approved release 0.1.7. All three images are public with AMD64/ARM64 manifests; see image-digests.json. NAS activation is separate.

## Verified release

- Typecheck, web build and minified server compilation pass.
- 304/304 application tests passed. The suite covers tenant authorization, verified payment/webhook replay, bounded long-poll observers and disconnect cleanup, monthly quota races, installation signature/expiry/isolation and public deployment export.
- QR browser review includes the SePay-documented compact VietQR with a dedicated sandbox VA; a pending test payment shows automatic status observation. Test QR cannot transfer money. Live webhook integration is covered by signed fixtures; no new bank transfer was initiated.
- Browser review of Billing, QR, query summaries/detail and tenant integrations at narrow and desktop widths. Initial measured viewport widths were 417 and 1600 CSS pixels; final customer-plan/VietQR review also used 1185 and 433 CSS pixels; no page-level horizontal overflow was observed. Narrow widths use query cards and the detail dialog retains all available measurements.
- Published application image was pulled by immutable architecture digest and passed compiled hosted/selfhost/Free/tenant-privacy/QR dependency smoke on AMD64 and emulated ARM64. Published certificate tools and backup bytecode/source-exclusion checks also passed on both architectures.
- Backup image ships compiled bytecode only, without private Python source or its build layer. Bytecode is inspectable and is not a secrecy guarantee.
- Backup companion native AMD64 and emulated ARM64 passed 7 safety tests plus real encrypted dump, isolated restore, offline reverification, tamper rejection, failure preservation and unchanged source data. Recovery-input helper preserves keys/source permissions and atomically rotates private snapshots.

- GitHub Linux CI passed all 304 application tests, compiled runtime checks, encrypted backup/restore drill, TypeScript, dependency audit and secret-pattern gate. CI fixture synchronization and Linux fixture permissions were corrected in test-only commits after the immutable image source tag; application and backup runtime sources are unchanged.
- Customers can select/renew approved plans on Billing. Synthetic providers/payments and internal legal monitoring are blocked at the API and UI for ordinary customers. Live SePay checkout still requires separate live merchant configuration; Test Mode never activates paid access.

- Private-identifier scan passed for 80 files extracted from published image archives and the 37-file allowlisted deployment export. No application source directories, generated settings or operator credentials are included in the public repository.

## Still requires activation or external evidence

- Human release review required by AGENTS.md is satisfied by the owner’s release instruction. The image publishing workflow succeeded and anonymous manifests were verified for all three images and both architectures. Prior immutable 0.1.6 records are retained under history/0.1.6/.
- Hosted NAS remains on its previously verified release. Backup must be enabled there with a private key, recovery-input snapshot, resource capacity and a verified first run. Store recovery key and encrypted copies off the NAS.
- Google Cloud currently has Testing audience and incomplete Branding. Application onboarding is immediate for valid Google identities; external-audience publication must be completed in Google Cloud. User policies remain DRAFT_AI as deferred.
- No claim of new native ARM64 hardware, macOS hardware, Windows containers, customer-database backup or additional database engines. Docker uses Linux containers on supported AMD64/ARM64 hosts, including Docker Desktop.
- Offline licenses cannot provide instant remote revocation or reliable real-time deployment usage. No telemetry is sent. Vendor issuance receipt is not proof the customer activated or is currently using it.

## Tiếng Việt

Đã kiểm tra mã nguồn, QR, phân quyền khách, hạn mức đồng thời, giấy phép và bản sao lưu/khôi phục cô lập. Đã phát hành image 0.1.7 cho AMD64/ARM64 và xác minh tải không cần đăng nhập; chưa cập nhật NAS. Google vẫn cần hoàn tất Branding và mở audience; không thể bỏ qua giới hạn này bằng giao diện DataCloud. Backup chỉ sao lưu dữ liệu nội bộ/cấu hình DataCloud. Khôi phục thử không thay database đang chạy; kiểm tra khôi phục toàn bộ ứng dụng trên NAS vẫn cần một buổi diễn tập riêng.
