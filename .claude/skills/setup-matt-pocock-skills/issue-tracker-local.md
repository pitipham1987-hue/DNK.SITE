# Issue tracker: Markdown cục bộ

Các issue và spec cho repo này sống dưới dạng các file markdown trong `.scratch/`.

## Quy ước

- Mỗi tính năng một thư mục: `.scratch/<feature-slug>/`
- Spec là `.scratch/<feature-slug>/spec.md`
- Các issue triển khai là một file cho mỗi ticket tại `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, đánh số từ `01` — không bao giờ là một file ticket gộp duy nhất
- Trạng thái Triage được ghi dưới dạng một dòng `Status:` gần đầu mỗi file issue (xem `triage-labels.md` để biết các chuỗi vai trò)
- Comments và lịch sử hội thoại được nối vào cuối file dưới heading `## Comments`

## Khi một skill nói "xuất bản lên issue tracker"

Tạo một file mới dưới `.scratch/<feature-slug>/` (tạo thư mục nếu cần).

## Khi một skill nói "lấy ticket liên quan"

Đọc file tại đường dẫn được tham chiếu. Người dùng thường sẽ truyền trực tiếp đường dẫn hoặc số issue.

## Các thao tác Wayfinding

Được sử dụng bởi `/wayfinder`. **Bản đồ (map)** là một file với mỗi file **con (child)** cho một ticket.

- **Bản đồ**: `.scratch/<effort>/map.md` — phần body Ghi chú / Quyết định-cho-đến-nay / Sương mù.
- **Ticket con**: `.scratch/<effort>/issues/NN-<slug>.md`, đánh số từ `01`, với câu hỏi trong body. Dòng `Type:` ghi loại ticket (`research`/`prototype`/`grilling`/`task`); dòng `Status:` ghi `claimed`/`resolved`.
- **Chặn (Blocking)**: dòng `Blocked by: NN, NN` gần đầu file. Một ticket được bỏ chặn khi mọi file nó liệt kê đều là `resolved`.
- **Đường biên (Frontier)**: quét `.scratch/<effort>/issues/` để tìm các file đang mở (open), không bị chặn (unblocked), và chưa có người nhận (unclaimed); file đầu tiên theo số sẽ thắng.
- **Nhận làm (Claim)**: đặt `Status: claimed` và lưu trước bất kỳ công việc nào.
- **Giải quyết (Resolve)**: nối thêm câu trả lời dưới heading `## Answer`, đặt `Status: resolved`, sau đó nối thêm một con trỏ ngữ cảnh (ý chính + link) vào mục Quyết định-cho-đến-nay của bản đồ trong `map.md`.
