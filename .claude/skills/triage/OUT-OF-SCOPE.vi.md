# Kho tri thức Out-of-Scope

Thư mục `.out-of-scope/` trong một repo lưu trữ các bản ghi lâu dài về các yêu cầu tính năng bị từ chối. Nó phục vụ hai mục đích:

1. **Trí nhớ thể chế (institutional memory)** — tại sao một tính năng bị từ chối, để lý do không bị mất khi issue được đóng lại
2. **Khử trùng lặp (deduplication)** — khi một issue mới đến khớp với một lần từ chối trước đó, skill có thể hiển thị quyết định trước đó thay vì tranh luận lại từ đầu

## Cấu trúc thư mục

```
.out-of-scope/
├── dark-mode.md
├── plugin-system.md
└── graphql-api.md
```

Một file cho mỗi **khái niệm (concept)**, không phải cho mỗi issue. Nhiều issue yêu cầu cùng một điều được nhóm dưới một file.

## Định dạng file

File nên được viết theo phong cách thoải mái, dễ đọc — giống một tài liệu thiết kế ngắn hơn là một mục trong cơ sở dữ liệu. Dùng đoạn văn, ví dụ code, và ví dụ để làm cho lý do rõ ràng và hữu ích với người gặp nó lần đầu.

```markdown
# Dark Mode

This project does not support dark mode or user-facing theming.

## Why this is out of scope

The rendering pipeline assumes a single color palette defined in
`ThemeConfig`. Supporting multiple themes would require:

- A theme context provider wrapping the entire component tree
- Per-component theme-aware style resolution
- A persistence layer for user theme preferences

This is a significant architectural change that doesn't align with the
project's focus on content authoring. Theming is a concern for downstream
consumers who embed or redistribute the output.

```ts
// The current ThemeConfig interface is not designed for runtime switching:
interface ThemeConfig {
  colors: ColorPalette; // single palette, resolved at build time
  fonts: FontStack;
}
```

## Prior requests

- #42 — "Add dark mode support"
- #87 — "Night theme for accessibility"
- #134 — "Dark theme option"
```

### Đặt tên file

Dùng một tên kebab-case ngắn gọn, mô tả cho khái niệm: `dark-mode.md`, `plugin-system.md`, `graphql-api.md`. Tên nên đủ dễ nhận biết để ai đó duyệt qua thư mục có thể hiểu điều gì đã bị từ chối mà không cần mở file.

### Viết lý do

Lý do nên có tính thực chất — không phải "chúng tôi không muốn cái này" mà là tại sao. Những lý do tốt tham chiếu tới:

- Phạm vi hoặc triết lý của project ("Project này tập trung vào X; theming là mối quan tâm của bên hạ nguồn")
- Ràng buộc kỹ thuật ("Hỗ trợ điều này sẽ đòi hỏi Y, mâu thuẫn với kiến trúc Z của chúng ta")
- Quyết định chiến lược ("Chúng tôi chọn dùng A thay vì B vì...")

Lý do nên bền vững lâu dài. Tránh tham chiếu tới các hoàn cảnh tạm thời ("hiện tại chúng tôi quá bận") — đó không phải là những sự từ chối thực sự, mà là những sự trì hoãn.

## Khi nào cần kiểm tra `.out-of-scope/`

Trong quá trình triage (Bước 1: Thu thập ngữ cảnh), đọc tất cả các file trong `.out-of-scope/`. Khi đánh giá một issue mới:

- Kiểm tra xem yêu cầu có khớp với một khái niệm out-of-scope hiện có không
- Việc so khớp dựa trên độ tương đồng khái niệm, không phải từ khóa — "night theme" khớp với `dark-mode.md`
- Nếu có sự trùng khớp, hãy hiển thị nó cho người bảo trì: "Cái này tương tự với `.out-of-scope/dark-mode.md` — chúng ta đã từ chối cái này trước đây vì [lý do]. Bạn vẫn giữ nguyên quan điểm đó chứ?"

Người bảo trì có thể:

- **Xác nhận** — issue mới được thêm vào danh sách "Prior requests" của file hiện có, sau đó bị đóng
- **Xem xét lại** — file out-of-scope bị xóa hoặc cập nhật, và issue tiếp tục qua quy trình triage bình thường
- **Không đồng ý** — các issue có liên quan nhưng khác biệt, tiếp tục với triage bình thường

## Khi nào cần viết vào `.out-of-scope/`

Chỉ khi một **enhancement** (không phải bug) bị *từ chối* dưới dạng `wontfix`. Điều này áp dụng cho các PR enhancement giống hệt như với các issue — một PR bị từ chối được ghi lại ở đây để cùng yêu cầu đó không quay lại dưới dạng code mới.

**Không** viết vào đây khi một điều gì đó bị đóng dưới dạng `wontfix` vì nó **đã được triển khai rồi**. Đó là một tính năng đã được xây dựng, không phải một tính năng bị từ chối; ghi lại nó sẽ đầu độc các kiểm tra khử trùng lặp bằng những sự từ chối giả. Thay vào đó, comment đóng issue nên trỏ tới nơi tính năng đó đã tồn tại.

Quy trình:

1. Người bảo trì quyết định một yêu cầu tính năng nằm ngoài phạm vi
2. Kiểm tra xem đã có một file `.out-of-scope/` khớp tồn tại chưa
3. Nếu có: thêm issue mới vào danh sách "Prior requests"
4. Nếu không: tạo một file mới với tên khái niệm, quyết định, lý do, và yêu cầu trước đó đầu tiên
5. Đăng một comment lên issue giải thích quyết định và đề cập tới file `.out-of-scope/`
6. Đóng issue với label `wontfix`

## Cập nhật hoặc xóa các file out-of-scope

Nếu người bảo trì đổi ý về một khái niệm đã bị từ chối trước đó:

- Xóa file `.out-of-scope/`
- Skill không cần mở lại các issue cũ — chúng là các bản ghi lịch sử
- Issue mới đã kích hoạt việc xem xét lại này sẽ tiếp tục qua quy trình triage bình thường
