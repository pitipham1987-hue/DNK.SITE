# Cơ sở Kiến thức Nằm ngoài Phạm vi (Out-of-Scope Knowledge Base)

Thư mục `.out-of-scope/` trong một repo lưu trữ các bản ghi lâu dài về các yêu cầu tính năng bị từ chối. Nó phục vụ hai mục đích:

1. **Bộ nhớ tổ chức (Institutional memory)** — tại sao một tính năng bị từ chối, để lý lẽ không bị mất khi issue bị đóng
2. **Loại bỏ trùng lặp (Deduplication)** — khi một issue mới đến khớp với một lần từ chối trước đó, skill có thể bộc lộ quyết định trước đó thay vì tranh luận lại từ đầu

## Cấu trúc thư mục

```
.out-of-scope/
├── dark-mode.md
├── plugin-system.md
└── graphql-api.md
```

Mỗi file đại diện cho một **khái niệm (concept)**, không phải cho từng issue. Nhiều issue yêu cầu cùng một thứ được nhóm lại dưới một file.

## Định dạng file

File nên được viết theo phong cách thoải mái, dễ đọc — giống một tài liệu thiết kế ngắn hơn là một mục trong cơ sở dữ liệu. Sử dụng các đoạn văn, code mẫu, và ví dụ để làm cho lý lẽ rõ ràng và hữu ích cho ai đó tiếp cận lần đầu.

```markdown
# Dark Mode

Dự án này không hỗ trợ dark mode hoặc giao diện hướng tới người dùng (theming).

## Tại sao điều này nằm ngoài phạm vi

Pipeline rendering giả định một bảng màu duy nhất được định nghĩa trong
`ThemeConfig`. Việc hỗ trợ nhiều theme sẽ yêu cầu:

- Một theme context provider bọc toàn bộ cây component
- Giải quyết style theo từng component dựa trên theme
- Một tầng lưu trữ cho sở thích theme của người dùng

Đây là một thay đổi kiến trúc lớn không phù hợp với mục tiêu của dự án
là tập trung vào sáng tác nội dung. Theming là mối quan tâm của người tiêu thụ
phía hạ nguồn, những người nhúng hoặc phân phối lại output.

```ts
// Interface ThemeConfig hiện tại không được thiết kế cho việc chuyển đổi lúc runtime:
interface ThemeConfig {
  colors: ColorPalette; // bảng màu duy nhất, giải quyết lúc build
  fonts: FontStack;
}
```

## Yêu cầu trước đây

- #42 — "Add dark mode support"
- #87 — "Night theme for accessibility"
- #134 — "Dark theme option"
```

### Đặt tên file

Dùng tên kebab-case ngắn gọn, mô tả cho khái niệm: `dark-mode.md`, `plugin-system.md`, `graphql-api.md`. Tên nên đủ dễ nhận biết để ai đó duyệt thư mục hiểu những gì đã bị từ chối mà không cần mở file.

### Viết lý do

Lý do nên mang tính thực chất — không phải "chúng tôi không muốn cái này" mà là tại sao. Các lý do tốt thường tham chiếu:

- Phạm vi hoặc triết lý dự án ("Dự án này tập trung vào X; theming là mối quan tâm phía hạ nguồn")
- Ràng buộc kỹ thuật ("Hỗ trợ điều này sẽ yêu cầu Y, vốn mâu thuẫn với kiến trúc Z của chúng tôi")
- Quyết định chiến lược ("Chúng tôi chọn dùng A thay vì B vì...")

Lý do phải có độ bền. Tránh tham chiếu các hoàn cảnh tạm thời ("lúc này chúng tôi đang quá bận") — đó không phải là các đợt từ chối thực sự, đó là sự hoãn lại.

## Khi nào nên kiểm tra `.out-of-scope/`

Trong quá trình triage (Bước 1: Thu thập ngữ cảnh), đọc tất cả các file trong `.out-of-scope/`. Khi đánh giá một issue mới:

- Kiểm tra xem yêu cầu có khớp với một khái niệm out-of-scope hiện có không
- Khớp là theo độ tương đồng về khái niệm, không phải từ khóa — "night theme" khớp với `dark-mode.md`
- Nếu có sự khớp, bộc lộ nó cho maintainer: "Điều này tương tự như `.out-of-scope/dark-mode.md` — chúng ta đã từ chối điều này trước đây vì [lý do]. Bạn có còn cảm thấy như vậy không?"

Maintainer có thể:

- **Xác nhận (Confirm)** — issue mới được thêm vào danh sách "Prior requests" của file hiện có, sau đó đóng
- **Cân nhắc lại (Reconsider)** — file out-of-scope bị xóa hoặc cập nhật, và issue tiến hành qua triage bình thường
- **Không đồng ý (Disagree)** — các issue có liên quan nhưng riêng biệt, tiến hành triage bình thường

## Khi nào nên ghi vào `.out-of-scope/`

Chỉ khi một **enhancement** (không phải bug) bị *từ chối* dưới dạng `wontfix`. Điều này áp dụng cho các enhancement PR chính xác như đối với các issue — một PR bị từ chối được ghi lại ở đây để cùng một yêu cầu không quay lại dưới dạng code mới.

Đừng **không** ghi vào đây khi có điều gì đó bị đóng dưới dạng `wontfix` vì nó **đã được triển khai**. Đó là một tính năng đã được xây dựng, không phải tính năng bị từ chối; việc ghi lại sẽ làm hỏng các kiểm tra dedup với các từ chối giả. Thay vào đó, comment đóng chỉ ra nơi tính năng đã sống.

Luồng xử lý:

1. Maintainer quyết định một yêu cầu tính năng nằm ngoài phạm vi
2. Kiểm tra xem file `.out-of-scope/` phù hợp đã tồn tại chưa
3. Nếu có: nối thêm issue mới vào danh sách "Prior requests"
4. Nếu chưa: tạo file mới với tên khái niệm, quyết định, lý do, và yêu cầu trước đây đầu tiên
5. Đăng một comment trên issue giải thích quyết định và nhắc tới file `.out-of-scope/`
6. Đóng issue với nhãn `wontfix`

## Cập nhật hoặc xóa các file out-of-scope

Nếu maintainer thay đổi ý định về một khái niệm đã bị từ chối trước đó:

- Xóa file `.out-of-scope/`
- Skill không cần mở lại các issue cũ — chúng là các bản ghi lịch sử
- Issue mới đã kích hoạt việc xem xét lại tiến hành qua triage bình thường
