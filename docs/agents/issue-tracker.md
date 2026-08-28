# Issue tracker: Local Markdown

Các issue và spec cho repo này được lưu trữ dưới dạng file markdown trong `.scratch/`.

## Quy ước

- Mỗi feature một thư mục: `.scratch/<feature-slug>/`
- Spec là `.scratch/<feature-slug>/spec.md`
- Các issue triển khai là mỗi ticket một file tại `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, đánh số bắt đầu từ `01` — không bao giờ dùng một file ticket gộp chung duy nhất
- Trạng thái triage được ghi lại bằng một dòng `Status:` gần đầu mỗi file issue (xem `triage-labels.md` để biết các chuỗi vai trò)
- Các comment và lịch sử trao đổi được thêm vào cuối file dưới heading `## Comments`

## Khi một skill nói "publish to the issue tracker" (xuất bản lên issue tracker)

Tạo một file mới dưới `.scratch/<feature-slug>/` (tạo thư mục nếu cần).

## Khi một skill nói "fetch the relevant ticket" (lấy ticket liên quan)

Đọc file tại đường dẫn được tham chiếu. Người dùng thường sẽ truyền trực tiếp đường dẫn hoặc số issue.

## Các thao tác Wayfinding

Được dùng bởi `/wayfinder`. **Map (bản đồ)** là một file với mỗi ticket là một file **con (child)**.

- **Map**: `.scratch/<effort>/map.md` — chứa nội dung Notes / Decisions-so-far / Fog.
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`, đánh số bắt đầu từ `01`, với câu hỏi nằm trong nội dung. Một dòng `Type:` ghi lại loại ticket (`research`/`prototype`/`grilling`/`task`); một dòng `Status:` ghi lại `claimed`/`resolved`.
- **Blocking (chặn)**: một dòng `Blocked by: NN, NN` gần đầu file. Một ticket được gỡ chặn khi mọi file nó liệt kê đều ở trạng thái `resolved`.
- **Frontier**: quét `.scratch/<effort>/issues/` để tìm các file đang mở, không bị chặn, và chưa được nhận; file có số nhỏ nhất thắng.
- **Claim (nhận việc)**: đặt `Status: claimed` và lưu trước khi bắt đầu bất kỳ công việc nào.
- **Resolve (giải quyết)**: thêm câu trả lời dưới heading `## Answer`, đặt `Status: resolved`, sau đó thêm một điểm tham chiếu ngữ cảnh (gist + link) vào Decisions-so-far của map trong `map.md`.
