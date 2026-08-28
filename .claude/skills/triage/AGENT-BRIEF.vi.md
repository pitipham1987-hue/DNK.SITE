# Viết Agent Brief

Một agent brief là một comment có cấu trúc được đăng lên một GitHub issue hoặc PR khi nó chuyển sang trạng thái `ready-for-agent`. Đây là đặc tả chính thức (authoritative specification) mà một AFK agent sẽ dựa vào để làm việc. Nội dung gốc và phần thảo luận là ngữ cảnh — agent brief mới là hợp đồng (contract).

Brief nêu rõ **agent nên làm gì**, điều này trải dài trên cả hai bề mặt: đối với một issue, đó là xây dựng thay đổi từ con số không; đối với một PR, đó là những gì còn lại cần làm *đối với diff hiện có* — hoàn thiện nó, lấp các khoảng trống, giải quyết các điểm review. Nguyên tắc giống nhau ở cả hai trường hợp; ví dụ về PR bên dưới cho thấy sự khác biệt.

## Nguyên tắc

### Độ bền hơn là độ chính xác

Issue có thể nằm ở trạng thái `ready-for-agent` trong nhiều ngày hoặc nhiều tuần. Codebase sẽ thay đổi trong thời gian đó. Hãy viết brief sao cho nó vẫn hữu ích ngay cả khi file bị đổi tên, di chuyển, hoặc tái cấu trúc.

- **Nên** mô tả interface, type, và các hợp đồng hành vi (behavioral contract)
- **Nên** nêu tên các type cụ thể, chữ ký hàm (function signature), hoặc hình dạng config mà agent nên tìm kiếm hoặc sửa đổi
- **Không nên** tham chiếu đường dẫn file — chúng sẽ lỗi thời
- **Không nên** tham chiếu số dòng
- **Không nên** giả định rằng cấu trúc triển khai hiện tại sẽ không thay đổi

### Mang tính hành vi, không mang tính thủ tục

Mô tả **cái gì** hệ thống nên làm, không phải **cách** triển khai nó. Agent sẽ tự khám phá codebase mới và tự đưa ra quyết định triển khai của riêng nó.

- **Tốt:** "Type `SkillConfig` nên chấp nhận một field `schedule` tùy chọn, kiểu `CronExpression`"
- **Không tốt:** "Mở src/types/skill.ts và thêm một field schedule ở dòng 42"
- **Tốt:** "Khi một người dùng chạy `/triage` không kèm đối số, họ nên thấy một bản tóm tắt các issue cần được chú ý"
- **Không tốt:** "Thêm một câu lệnh switch trong hàm xử lý chính (main handler function)"

### Tiêu chí chấp nhận đầy đủ

Agent cần biết khi nào nó đã hoàn thành. Mọi agent brief phải có tiêu chí chấp nhận (acceptance criteria) cụ thể, có thể kiểm chứng được. Mỗi tiêu chí nên có thể được xác minh một cách độc lập.

- **Tốt:** "Chạy `gh issue list --label needs-triage` trả về các issue đã trải qua bước phân loại ban đầu"
- **Không tốt:** "Triage nên hoạt động đúng"

### Ranh giới phạm vi rõ ràng

Nêu rõ những gì nằm ngoài phạm vi. Điều này ngăn agent không mạ vàng (gold-plating) hoặc đưa ra các giả định về các tính năng liền kề.

## Mẫu (Template)

```markdown
## Agent Brief

**Category:** bug / enhancement
**Summary:** mô tả một dòng về điều cần xảy ra

**Current behavior:**
Mô tả điều gì đang xảy ra bây giờ. Đối với bug, đây là hành vi bị lỗi.
Đối với enhancement, đây là hiện trạng mà tính năng này được xây dựng dựa trên.

**Desired behavior:**
Mô tả điều gì nên xảy ra sau khi công việc của agent hoàn thành.
Hãy cụ thể về các trường hợp biên (edge case) và điều kiện lỗi.

**Key interfaces:**
- `TypeName` — cần thay đổi gì và tại sao
- kiểu trả về của `functionName()` — nó hiện đang trả về gì so với những gì nó nên trả về
- Hình dạng config — bất kỳ tùy chọn cấu hình mới nào cần thiết

**Acceptance criteria:**
- [ ] Tiêu chí cụ thể, có thể kiểm chứng 1
- [ ] Tiêu chí cụ thể, có thể kiểm chứng 2
- [ ] Tiêu chí cụ thể, có thể kiểm chứng 3

**Out of scope:**
- Điều KHÔNG nên được thay đổi hoặc giải quyết trong issue này
- Tính năng liền kề có vẻ liên quan nhưng thực chất tách biệt
```

## Ví dụ

### Agent brief tốt (bug)

```markdown
## Agent Brief

**Category:** bug
**Summary:** Việc cắt ngắn mô tả skill bị cắt giữa từ, tạo ra output bị lỗi

**Current behavior:**
Khi một mô tả skill vượt quá 1024 ký tự, nó bị cắt ngắn ở đúng
1024 ký tự bất kể ranh giới từ. Điều này tạo ra các mô tả
kết thúc giữa từ (ví dụ "Use when the user wants to confi").

**Desired behavior:**
Việc cắt ngắn nên dừng ở ranh giới từ cuối cùng trước 1024 ký tự
và thêm "..." vào để chỉ ra rằng nó đã bị cắt ngắn.

**Key interfaces:**
- Field `description` của type `SkillMetadata` — không cần thay đổi type,
  nhưng logic xác thực/xử lý điền vào nó cần tôn trọng
  ranh giới từ
- Bất kỳ hàm nào đọc frontmatter của SKILL.md và trích xuất mô tả

**Acceptance criteria:**
- [ ] Các mô tả dưới 1024 ký tự không thay đổi
- [ ] Các mô tả trên 1024 ký tự bị cắt ngắn ở ranh giới từ cuối cùng
      trước 1024 ký tự
- [ ] Các mô tả bị cắt ngắn kết thúc bằng "..."
- [ ] Tổng độ dài bao gồm cả "..." không vượt quá 1024 ký tự

**Out of scope:**
- Thay đổi chính giới hạn 1024 ký tự
- Hỗ trợ mô tả nhiều dòng
```

### Agent brief tốt (enhancement)

```markdown
## Agent Brief

**Category:** enhancement
**Summary:** Thêm hỗ trợ thư mục `.out-of-scope/` để theo dõi các yêu cầu tính năng bị từ chối

**Current behavior:**
Khi một yêu cầu tính năng bị từ chối, issue được đóng lại với label `wontfix`
và một comment. Không có bản ghi lâu dài nào về quyết định hoặc lý do.
Các yêu cầu tương tự trong tương lai đòi hỏi người bảo trì phải nhớ lại hoặc tìm kiếm
cuộc thảo luận trước đó.

**Desired behavior:**
Các yêu cầu tính năng bị từ chối nên được ghi lại trong các file
`.out-of-scope/<concept>.md`, nội dung ghi lại quyết định, lý do,
và liên kết tới tất cả các issue đã từng yêu cầu tính năng đó. Khi triage
các issue mới, các file này nên được kiểm tra để tìm sự trùng khớp.

**Key interfaces:**
- Định dạng file Markdown trong `.out-of-scope/` — mỗi file nên có một
  tiêu đề `# Concept Name`, một dòng `**Decision:**`, một dòng `**Reason:**`,
  và một danh sách `**Prior requests:**` với liên kết tới các issue
- Quy trình triage nên đọc tất cả các file `.out-of-scope/*.md` sớm
  và so khớp các issue mới đến với chúng theo độ tương đồng khái niệm

**Acceptance criteria:**
- [ ] Việc đóng một tính năng dưới dạng wontfix tạo/cập nhật một file trong `.out-of-scope/`
- [ ] File này bao gồm quyết định, lý do, và liên kết tới issue đã đóng
- [ ] Nếu một file `.out-of-scope/` khớp đã tồn tại, issue mới được
      thêm vào danh sách "Prior requests" của nó thay vì tạo bản trùng lặp
- [ ] Trong quá trình triage, các file `.out-of-scope/` hiện có được kiểm tra và hiển thị
      khi một issue mới khớp với một lần từ chối trước đó

**Out of scope:**
- So khớp tự động (con người xác nhận sự trùng khớp)
- Mở lại các tính năng đã bị từ chối trước đó
- Báo cáo bug (chỉ các enhancement bị từ chối mới vào `.out-of-scope/`)
```

### Agent brief tốt (PR)

Đối với một PR, "Current behavior" mô tả trạng thái của diff, và brief yêu cầu agent hoàn thiện hoặc sửa nó thay vì xây dựng từ đầu.

```markdown
## Agent Brief

**Category:** enhancement
**Summary:** Hoàn thiện flag output `--json` của contributor cho `triage list`

**Current behavior:**
PR này thêm một flag `--json` để serialize danh sách issue thành JSON. Đường đi thành công (happy path)
hoạt động và diff khớp với cấu trúc lệnh của project. Còn hai khoảng trống
còn lại: lỗi vẫn được in ra dưới dạng văn bản (không phải JSON), và flag mới chưa có
test coverage.

**Desired behavior:**
Với `--json`, tất cả output — kể cả lỗi — đều là JSON hợp lệ trên stdout,
và mã thoát (exit code) của lệnh không đổi. Output dạng người-đọc-được hiện có
vẫn giữ nguyên khi flag không được dùng.

**Key interfaces:**
- Đường xử lý lỗi của lệnh nên phát ra `{ "error": string }` khi dùng `--json`
  thay vì thông báo lỗi dạng văn bản thuần
- Tái sử dụng serializer hiện có mà PR đã thêm; đừng đưa vào một cái thứ hai

**Acceptance criteria:**
- [ ] `triage list --json` phát ra JSON hợp lệ cho cả trường hợp thành công và lỗi
- [ ] Mã thoát khớp với lệnh không dùng JSON
- [ ] Một test bao phủ output thành công `--json` và một trường hợp lỗi
- [ ] Output mặc định (không dùng JSON) không đổi từng byte

**Out of scope:**
- Thêm `--json` vào bất kỳ lệnh nào khác
- Thay đổi hình dạng JSON của payload thành công mà PR đã định nghĩa
```

### Agent brief tồi

```markdown
## Agent Brief

**Summary:** Sửa lỗi triage

**What to do:**
Cái triage bị hỏng rồi. Xem file chính và sửa nó.
Hàm ở khoảng dòng 150 có vấn đề.

**Files to change:**
- src/triage/handler.ts (line 150)
- src/types.ts (line 42)
```

Điều này tồi vì:
- Không có category
- Mô tả mơ hồ ("cái triage bị hỏng rồi")
- Tham chiếu đường dẫn file và số dòng sẽ lỗi thời
- Không có acceptance criteria
- Không có ranh giới phạm vi
- Không mô tả hành vi hiện tại so với hành vi mong muốn
