# DataCloud 0.1.5 verification / Kiểm tra bản 0.1.5

2026-10-06. Human review approved. Versioned public images and native NAS AMD64 deployment verified. / Đã được duyệt; đã phát hành image và kiểm tra triển khai NAS AMD64.

| Check / Kiểm tra | Evidence / Bằng chứng |
| --- | --- |
| Source gates | 273 tests passed, typecheck, web build and compiled runtime passed. Release workflow succeeded. |
| Admin authorization | Platform Owner only; demo, ordinary tenant and API-key denial, CSRF, version conflicts, audit rollback and replay tested locally. |
| Worker | Eight focused tests cover expiry, encrypted opt-in reminders, duplicate workers/restart, rollback, validation and bounded recipient continuation. No real reminder email sent. |
| PostgreSQL | Six independent processes/pools: quota, catalog, checkout, webhook, settlement and lifecycle races plus reminder deduplication. Synthetic local fixture. |
| Full restore | 44 tables / 46 rows matched after actual fixture database drop and archive restoration. Vault/AAD, audit, ledger and three encrypted email jobs recovered. Not a NAS restore or HA/RPO/RTO claim. |
| Customer UI | Synthetic local Owner granted Pro with expiry. Actual 320/417/800/1600 CSS px, no page overflow. Keyboard dialog focus wrap tested. Live NAS Owner directory and customer detail views verified with two existing organizations. No customer subscription was changed during deployment checks. |
| Images | Anonymous registry manifest checks passed for application and certificate initializer, AMD64 and ARM64. Published app startup, Google-only enforcement, dynamic SOCKS, compiled egress and certificate generation passed on native AMD64 and emulated ARM64. See image-digests.json. |
| Privacy | Both published app filesystems scanned: 17,611 / 17,610 files. Public deployment export uses an explicit allowlist and private-identifier checks. Source archive encrypted and restored byte-for-byte; decryption key stays private. |
| NAS | Native AMD64 runtime reports 0.1.5. App, PostgreSQL and ingress healthy; tunnel HTTPS health reports live/PostgreSQL. Existing mounts and private configuration preserved. Pre-upgrade custom PostgreSQL backup catalog readable (201 lines); no NAS restore drill performed. |
| Google and MongoDB | Fresh Google-only sign-in restored the platform Owner. Existing MongoDB Explorer returned synthetic orders, 50-row page limit. The existing TLS bridge has a plaintext backend hop on the same NAS; this is not end-to-end database TLS. |
| Atlas | Read-only operator probe using the deployed 0.1.5 connector against the previously reported connection returned UNSUPPORTED_CAPABILITY for its tier-restricted currentOp command. Regression tests preserve unrelated errors. The customer's own browser session was not available for a live UI retest. |
| Cloudflare/CSP | Public HTTPS HTML returns no-cache, no-transform and strict script-src self. No Cloudflare Insights beacon in the delivered HTML. |
| Payment isolation | Post-upgrade read-only checks: both subscriptions remain Free/active; zero invoices and zero email jobs. Existing SePay Test Mode ledger contains only synthetic records. Renewal reminders remain disabled. |

Earlier evidence: a real SePay **Test Mode** provider callback passed in 0.1.4; one SMTP inbox delivery passed in 0.1.3. They are not new 0.1.5 payment/reminder delivery tests. No live money, recurring debit, unrestricted Google onboarding, upstream DocumentDB acceptance, native ARM64/macOS hardware, NAS disaster recovery or scale capacity is claimed.

Tiếng Việt: Bản 0.1.5 đã chạy trên NAS và có Customers cho chủ nền tảng. Đã kiểm tra đăng nhập Google mới, đọc MongoDB, phân loại hạn chế Atlas và phản hồi Cloudflare. Gói khách hàng/dữ liệu được giữ nguyên; thanh toán vẫn là Test Mode và email nhắc hạn vẫn tắt. Kiểm thử quyền khách thường và thay đổi gói dùng fixture cục bộ; chưa đăng nhập lại tài khoản khách thường trên NAS. Bằng chứng ARM64 là giả lập, khôi phục dữ liệu là fixture, không phải diễn tập phục hồi NAS.
