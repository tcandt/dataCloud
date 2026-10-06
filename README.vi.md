# DataCloud

[English](README.md) | [Tiếng Việt](README.vi.md)

**DataCloud là nền tảng bên thứ ba độc lập, tích hợp các database để quản lý
trên một website.** Bạn kết nối database đang có vào một giao diện chung để
duyệt collection, chạy truy vấn có giới hạn, quản lý kết nối và thực hiện các
thay đổi dữ liệu theo quyền được cấp.

Cách sử dụng thuộc cùng nhóm công cụ như [DbGate](https://dbgate.org): giao diện
quản lý nằm phía trên các database engine. DataCloud là dự án độc lập, không
có quan hệ liên kết với DbGate. So sánh này mô tả cách sử dụng, không khẳng định
hai sản phẩm có số lượng connector hoặc chức năng tương đương.

Ứng dụng dùng giấy phép đóng. Repo công khai chỉ chứa bộ cài Docker, script,
hướng dẫn và lịch sử phiên bản. Mã nguồn ứng dụng được giữ riêng tư; image công
khai chứa mã thực thi đã biên dịch và vẫn có thể được kiểm tra hoặc phân tích.

## Mô hình hoạt động

```text
Trình duyệt -> Website/API DataCloud -> Adapter -> Database của bạn
                          |
                          +-> PostgreSQL lưu tài khoản và metadata DataCloud
```

Dữ liệu được lưu ở database đã kết nối. DataCloud lưu tài khoản, dự án, thông
tin kết nối và nhật ký kiểm toán trong PostgreSQL riêng. Thông tin xác thực
database được mã hóa trong kho bí mật phía máy chủ, không trả về trình duyệt.
DataCloud là lớp quản lý, không phải database engine mới hay bản fork của
MongoDB hoặc dự án DocumentDB upstream.

## Phạm vi bản 0.1.4

Bản preview 0.1.4 bổ sung kết nối SRV/replica set, sửa gói từ admin và SePay
Test Mode độc lập. Xem [kết quả kiểm tra](VERIFICATION.md) về image và triển khai.
Bằng chứng NAS/Google/SMTP trước đó thuộc phiên bản 0.1.3.

| Thành phần | Trạng thái |
| --- | --- |
| Adapter MongoDB | Đã triển khai; kiểm tra TLS và CRUD với dữ liệu thử trên MongoDB 4.4.29 cục bộ |
| Adapter DocumentDB | Qua gateway tương thích MongoDB; chưa xác minh với endpoint upstream thực tế |
| Chế độ demo | Chỉ dữ liệu giả lập; không kết nối database thật |
| PostgreSQL trong bộ cài | Lưu metadata DataCloud; chưa phải connector quản lý PostgreSQL của người dùng |
| Database engine khác | Định hướng tích hợp tiếp; chưa triển khai hoặc xác minh trong bản này |

Chức năng thực tế phụ thuộc endpoint, tài khoản và khả năng của provider.
Chức năng chưa hỗ trợ được hiển thị là không khả dụng.

## Docker trên nhiều hệ thống

Hai image cùng phiên bản hỗ trợ `linux/amd64` và `linux/arm64`. Docker tự chọn
kiến trúc phù hợp. Dùng Linux containers trên Docker Desktop Windows, Docker
Engine trên Linux/Ubuntu/NAS hoặc Docker Desktop trên macOS Intel/Apple Silicon.
Yêu cầu Compose v2, ổ lưu trữ bền vững và ít nhất 4 GB RAM khả dụng cho cả stack.
Chưa hỗ trợ ARM32 hoặc Windows containers nguyên bản.

Đã kiểm tra Docker Desktop AMD64 và chạy ARM64 bằng giả lập. Chưa kiểm tra trên
NAS cho bản 0.1.4, phần cứng macOS hoặc Ubuntu riêng; NAS Synology AMD64 đã được kiểm tra ở bản 0.1.3. Xem [bằng chứng kiểm tra](VERIFICATION.md).

## Cài đặt

Nếu kernel Synology báo `NanoCPUs can not be set`, thêm
`:compose.synology.yaml` vào cuối `COMPOSE_FILE` trong `deploy/nas/.env` riêng.
Overlay này đặt hạn mức CPU ứng dụng về 0 (không giới hạn); vẫn giữ giới hạn
bộ nhớ 1 GB và các hạn chế container khác. Khi nhập YAML đã gộp vào Container
Manager, cần giữ rõ `services.app.cpus: 0`.

Clone repo hoặc giải nén ZIP từ Releases. Chạy trong thư mục vừa tải.
Mặc định website là `https://localhost:8443`. Nhập origin HTTPS, email quản trị
Google quản trị được duyệt và thông tin OAuth web client của bạn khi cấu hình.
Cài mới mặc định **chỉ đăng nhập Google**, không tạo mật khẩu cục bộ và không có
email quản trị mặc định. Chọn **m (mixed)** nếu cần giữ đăng nhập mật khẩu.
Công cụ không ghi đè cấu hình của hệ thống hiện có.

Chọn **E (external)** để chỉ chạy DataCloud và quản lý các database bạn đã có.
Đây là mặc định khi cấu hình mới qua màn hình nhập: website/API, PostgreSQL lưu
metadata và nginx chạy cùng nhau, không tạo MongoDB mẫu. Nhập danh sách hostname/IP
được phép rồi thêm URI và thông tin xác thực riêng trong Connections.
Chọn **l (local)** nếu cần thêm MongoDB mẫu. Cấu hình hiện có giữ nguyên chế độ;
biến `COMPOSE_FILE` trong `.env` riêng chọn bộ dịch vụ tương ứng.

Linux, Ubuntu, macOS và NAS:

```sh
docker run --rm -it --user "$(id -u):$(id -g)" \
  -v "$PWD:/workspace" -w /workspace \
  node:24.15.0-bookworm-slim node scripts/nas-configure.mjs
sh deploy/nas/start.sh
```

Windows PowerShell:

```powershell
docker run --rm -it --mount "type=bind,source=$($PWD.Path),target=/workspace" `
  -w /workspace node:24.15.0-bookworm-slim node scripts/nas-configure.mjs
powershell -ExecutionPolicy Bypass -File deploy/nas/start.ps1
```

Nếu tạo database mới, trả lời `n` khi được hỏi dùng lại dữ liệu MongoDB.
Nếu dùng lại dữ liệu, sao lưu trước, dừng container MongoDB cũ rồi nhập đường
dẫn tuyệt đối và mật khẩu hiện tại. Windows dùng dấu `/`, ví dụ `D:/mongo/data`.
Bộ cài giữ MongoDB 4.4.29; không tự nâng cấp engine hoặc di chuyển dữ liệu.
Service tên `documentdb` trong Compose là MongoDB mẫu, không phải engine
DocumentDB xây dựng trên PostgreSQL.

Stack khởi động website/API, PostgreSQL metadata, MongoDB và nginx cùng nhau.
Các dịch vụ tự khởi động lại cùng Docker nếu chưa bị dừng chủ động. Cần bật
Docker khởi động cùng máy; Docker Desktop có thể chỉ chạy sau khi đăng nhập.

HTTPS cục bộ dùng CA riêng. Xuất CA và cài vào kho tin cậy của máy trước khi
truy cập; xem lệnh và chi tiết trong [hướng dẫn tiếng Anh](README.md).

## Đăng nhập Google và email

Làm theo [hướng dẫn tích hợp Anh–Việt](docs/operations/GOOGLE-SMTP-NAS.md).
Cần OAuth client loại Web application trong dự án Google của bạn, origin HTTPS
chính xác và callback `PUBLIC_ORIGIN/api/v1/auth/google/callback`. Khi ứng dụng
Google ở chế độ testing, thêm người được phép vào danh sách test user. Đăng nhập
Google trên trình duyệt không thay thế OAuth client hoặc credential SMTP.

Công cụ lưu bí mật OAuth thành file riêng và bật `compose.integrations.yaml`.
Google-only tắt đăng nhập mật khẩu, đăng ký thường, khôi phục mật khẩu và demo.
Người dùng Google đã xác minh có thể tạo tổ chức riêng biệt; tham gia tổ chức đã
có cần lời mời. Owner chỉ liên kết với email Google đã được cấu hình rõ ràng và
xác minh. Google đã xác minh email nên không cần thêm mật khẩu hoặc bước xác minh
email trùng lặp. API key có giới hạn quyền vẫn dùng được cho tích hợp máy.

SMTP có thể để tắt tới khi có thông tin nhà cung cấp. Cần cổng 465/TLS hoặc 587/
STARTTLS bắt buộc, địa chỉ gửi được duyệt, username và app password/credential.
Thông tin xác thực nằm trong file bí mật. SMTP phục vụ lời mời và hàng đợi thông
báo đã có; cấu hình thành công chưa đồng nghĩa gửi thư thật thành công.

## Giao diện thích ứng màn hình

Giao diện sáng/tối mới điều chỉnh menu, thẻ thông tin và biểu mẫu theo máy tính,
tablet và điện thoại. Bảng rộng và JSON cuộn bên trong vùng dữ liệu. Tùy chọn truy
vấn trên điện thoại có thể thu gọn và giữ nguyên nội dung projection/sort đang nhập.

## Kết nối database đang có

Chế độ local có MongoDB khởi đầu; chế độ external không kèm database này.
Để thêm MongoDB bên ngoài hoặc gateway
DocumentDB, thêm hostname vào `DATABASE_ALLOWED_HOSTS` trong
`deploy/nas/.env` riêng, giữ `documentdb` nếu dùng database khởi đầu, rồi khởi động
lại ứng dụng. Ví dụ:

```dotenv
DATABASE_ALLOWED_HOSTS=documentdb,mongo.example.invalid
DATABASE_ALLOW_PRIVATE=true
```

Container ứng dụng phải truy cập được hostname và tin cậy CA TLS của database.
Nếu dùng CA riêng, mở **Private certificate authority** trong hộp thoại kết nối
và dán chứng chỉ CA dạng PEM. Chứng chỉ được mã hóa cùng URI và không trả về qua
API đọc. Khi đổi thông tin xác thực, mặc định giữ CA; bạn có thể chọn thay CA
hoặc dùng kho tin cậy hệ thống. Endpoint chưa có TLS cần bật TLS trước khi kết nối.
Nhập URI riêng trong Connections. Hỗ trợ mongodb:// trực tiếp, nhiều seed của
replica set và mongodb+srv://. SRV tự bật TLS; URI thường cần tls=true. Chỉ dùng
directConnection=true cho endpoint đơn. Mọi seed và máy chủ tự khám phá cần nằm
trong danh sách hostname được phép; địa chỉ riêng cần bật chính sách mạng riêng.
Chỉ cho phép hậu tố DNS của cluster cần dùng. Hỗ trợ xác thực default/SCRAM;
chưa hỗ trợ load-balanced routing hoặc cơ chế xác thực khác. Cần credential thật
để kiểm tra chính cluster Atlas của bạn. Dùng tài khoản database tối thiểu quyền.

Với SRV, thêm hậu tố DNS riêng của cluster vào `.env` riêng, ví dụ
`DATABASE_ALLOWED_HOSTS=*.cluster.example.invalid`; giữ các host đã duyệt khác.
Form cài đặt hiện nhận hostname/IP cụ thể, nên thêm wildcard trực tiếp vào file
sau cài đặt rồi khởi động lại ứng dụng. Không cho phép toàn bộ miền Atlas.


Để chuyển hệ thống hiện có sang chế độ external, sao lưu cấu hình/dữ liệu, đặt
`COMPOSE_FILE=compose.external.yaml` (giữ thêm `:compose.integrations.yaml` nếu
đang bật) và danh sách hostname được phép. Metadata
kết nối cũ vẫn được giữ; xóa kết nối MongoDB mẫu trên website nếu không cần.
Đổi file Compose không tự dừng MongoDB mẫu đang chạy. Khi phù hợp, dừng riêng
service đó bằng file Compose local cũ và giữ nguyên dữ liệu. Chế độ external
không tự thêm URI database bên ngoài lúc khởi tạo quản trị viên.

## Tên miền và thông tin riêng

Tên miền thực, email quản trị, mật khẩu và token chỉ lưu trong `.env` và
`secrets/` cục bộ đã được loại khỏi Git. Không đưa chúng vào ZIP chia sẻ,
screenshot, issue hoặc ghi chú phát hành. Giữ quyền đọc thư mục secrets giới
hạn cho tài khoản vận hành. Compose secrets là file trên host, không phải kho
bí mật đã mã hóa.

Cloudflare Tunnel là tùy chọn. Để trống token sẽ tắt tunnel. Khi dùng, nhập token
mới trong cấu hình riêng, đặt hostname của bạn và service HTTP `ingress:8080`
trong Cloudflare. Truy cập origin đã cấu hình với đường dẫn `/login`.

## Cập nhật và phục hồi

Đọc [CHANGELOG](CHANGELOG.md) và ghi chú phiên bản. Sao lưu dữ liệu MongoDB,
PostgreSQL, secrets và volume chứng chỉ. Tải bộ cài mới, giữ `.env`, secrets,
khóa vault và các volume hiện tại, đặt `APP_TAG=0.1.4`, rồi chạy script khởi động.
Không chạy `docker compose down -v` vì lệnh đó xóa volume dữ liệu.

Bản 0.1.4 cung cấp ZIP triển khai, digest image và `SHA256SUMS.txt`.
Docker tải image công khai từ GHCR và tự chọn AMD64/ARM64, không cần đăng nhập.
Bản này không đính kèm TAR ngoại tuyến; archive của bản trước chỉ dùng cho đúng
phiên bản đó.

0.1.2 không đổi bảng metadata hay phiên bản engine. Sau khi tạo/thay kết nối,
bản cũ không đọc được định dạng mã hóa mới; hạ phiên bản cần khôi phục backup
metadata trước cập nhật cùng khóa vault.

0.1.3 đã thêm bảng đánh dấu phiên Google. Bật Google-only yêu cầu đăng nhập Google
lại; phiên mật khẩu cũ bị từ chối. Không đổi `owner_config.email` để chuyển owner:
email không khớp khiến bootstrap từ chối khởi động, không tự chuyển quyền. Cần
quy trình chuyển danh tính được kiểm tra trước. Bản cũ không thực thi chính sách
Google-only; khi hạ phiên bản phải xem lại cấu hình xác thực và khôi phục backup
metadata/secrets phù hợp, không chỉ đổi tag image. Giữ backup hiện tại và kết thúc
phiên đang hoạt động trước khi hạ phiên bản.

Bản 0.1.0 đã được
thu hồi để gỡ thông tin cấu hình riêng; không thể thu hồi bản đã tải hoặc
bộ nhớ đệm của bên khác. Chính sách pháp lý vẫn là bản nháp. NAS, Google
và một thư SMTP đã được kiểm tra ở bản 0.1.3; nâng NAS 0.1.4 còn chờ. Xem VERIFICATION.md.
Triển khai endpoint thực tế cần cấu hình
TLS và phạm vi kiểm tra được chủ hệ thống cho phép.

## Giấy phép

Bộ cài: [MIT](LICENSE). Ứng dụng: [giấy phép đóng](APPLICATION-LICENSE.txt).
Phần mềm bên thứ ba giữ giấy phép gốc. Có sử dụng AI đáng kể trong phát triển
và chuẩn bị phát hành.

## Gói giá thấp và thử nghiệm SePay

Free 0đ với 3 kết nối; Pro 29.000đ và Team 79.000đ/30 ngày là mức giá đề xuất.
Quản trị nền tảng có thể sửa giá, hạn mức và bật gói. Cấu hình giữ sau khởi động
lại, giao dịch cũ giữ giá ban đầu. [Hướng dẫn SePay Test Mode](docs/operations/SEPAY-TEST-MODE.md)
thử giao dịch giả, không nâng gói hoặc tạo hóa đơn thanh toán thật.
