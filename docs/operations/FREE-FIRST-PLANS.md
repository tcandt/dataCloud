# Free-first capacity / Han muc uu tien Free

## English

Google-only hosted deployments immediately provision a workspace for a new Google identity whose email Google has verified. No local email confirmation, credit card, or manual approval is required. Google OAuth audience restrictions are configured separately in Google Cloud; the application cannot bypass Testing mode.

| Proposed plan | Monthly VND | Projects | Connections | Members | Analysis attempts/month | API-key requests/month |
|---|---:|---:|---:|---:|---:|---:|
| Free | 0 | 3 | 3 | 5 | 1,000 | 10,000 |
| Pro | 29,000 | 10 | 10 | 5 | 10,000 | 100,000 |
| Team | 79,000 | 30 | 30 | 25 | 50,000 | 500,000 |

Free is enabled by default. Paid plans still need owner-approved availability and checkout policy. Existing saved catalog settings are never overwritten by upgrades. Hosted platform owners edit prices, approval and limits in Billing > Manage plans; Customers manages individual subscriptions.

Projects, connections and members are measured across the organization. Analysis counts accepted aggregation/explain attempts before sending to the provider (including failed provider attempts); Find is excluded. API usage counts authenticated API-key calls, excluding billing/payments/admin/installation account recovery. Browser background refreshes are excluded. Monthly counters reset at UTC month boundaries; request retries count again. Atomic server decisions prevent concurrent requests from exceeding quota. Existing resources are preserved when limits drop; deletion remains available. Retention/storage/alert policy dimensions are not yet metered and are labeled accordingly, never shown as measured zero.

Ordinary tenants see database integrations only; SMTP/payment service configuration is platform-admin only at both API and UI. Optional hosted checkout belongs in Billing. Self-host edition has no checkout UI and uses signed installation capacity. Public installation setup writes DATACLOUD_EDITION=selfhost; existing deployments retain hosted behavior unless explicitly changed. Managed hosted operators set DATACLOUD_EDITION=hosted.

## Tieng Viet

Ban hosted dang nhap Google tao workspace ngay, khong yeu cau the, duyet thu cong hay email xac minh lan hai. Google van phai duoc cau hinh cho phep nguoi dung ben ngoai.

Free mien phi: 3 du an, 3 ket noi, 5 thanh vien; 1.000 lan Aggregate/Explain va 10.000 request bang API key moi thang UTC. Find va tu dong lam moi giao dien khong tinh vao hai bo dem nay. Request loi tu database van tinh la lan thu phan tich. Pro de xuat 29.000 VND/thang; Team 79.000 VND/thang. Bang tren la gia/hạn muc mac dinh de xuat, khong ghi de cac goi admin da sua.

Chu nen tang quan ly catalog tai Billing > Manage plans va goi tung khach tai Customers. Thay doi goi khong gia mao giao dich thanh toan. Khach khong thay cau hinh SePay/SMTP. Ban Docker tu cai dung license co chu ky va khong co checkout. Xem SELF-HOST-LICENSING.md va BACKUP-AUTOMATION.md de van hanh.
