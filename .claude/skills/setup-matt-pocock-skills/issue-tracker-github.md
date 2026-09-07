# Issue tracker: GitHub

Các issue và spec cho repo này sống dưới dạng GitHub issues. Dùng `gh` CLI cho mọi thao tác.

## Quy ước

- **Tạo an issue**: `gh issue create --title "..." --body "..."`. Dùng heredoc cho body nhiều dòng.
- **Đọc an issue**: `gh issue view <number> --comments`, lọc comment bằng `jq` và cũng lấy về các label.
- **Liệt kê issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` với các bộ lọc `--label` và `--state` thích hợp.
- **Bình luận trên issue**: `gh issue comment <number> --body "..."`
- **Áp dụng / gỡ nhãn**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Đóng issue**: `gh issue close <number> --comment "..."`

Suy luận repo từ `git remote -v` — `gh` tự động làm việc này khi chạy bên trong một bản clone.

## Pull requests như một bề mặt triage

**PRs như một bề mặt request: no.** _(Đặt thành `yes` nếu repo này coi các PR bên ngoài như các yêu cầu tính năng; `/triage` sẽ đọc cờ này.)_

Khi đặt thành `yes`, các PR chạy qua cùng các nhãn và trạng thái như issue, dùng các lệnh tương đương của `gh pr`:

- **Đọc a PR**: `gh pr view <number> --comments` và `gh pr diff <number>` để lấy diff.
- **Liệt kê PRs bên ngoài cho triage**: `gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments` sau đó chỉ giữ lại `authorAssociation` là `CONTRIBUTOR`, `FIRST_TIME_CONTRIBUTOR`, hoặc `NONE` (bỏ `OWNER`/`MEMBER`/`COLLABORATOR`).
- **Bình luận / gán nhãn / đóng**: `gh pr comment`, `gh pr edit --add-label`/`--remove-label`, `gh pr close`.

GitHub dùng chung một không gian số cho cả issue và PR, nên một số `#42` đơn thuần có thể là bất kỳ cái nào — giải quyết bằng `gh pr view 42` và fallback về `gh issue view 42`.

## Khi một skill nói "xuất bản lên issue tracker"

Tạo một GitHub issue.

## Khi một skill nói "lấy ticket liên quan"

Chạy `gh issue view <number> --comments`.

## Các thao tác Wayfinding

Được sử dụng bởi `/wayfinder`. **Bản đồ (map)** là một issue đơn lẻ với các issue **con (child)** làm ticket.

- **Bản đồ**: một issue đơn lẻ được dán nhãn `wayfinder:map`, giữ phần body Ghi chú / Quyết định-cho-đến-nay / Sương mù. `gh issue create --label wayfinder:map`.
- **Ticket con**: một issue được liên kết với bản đồ như một GitHub sub-issue (`gh api` trên sub-issues endpoint). Nơi sub-issues không được bật, thêm con vào một danh sách task trong body bản đồ và đặt `Part of #<map>` ở đầu body con. Nhãn: `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`). Một khi được nhận làm, ticket được gán cho dev đang thực hiện.
- **Chặn (Blocking)**: các **phụ thuộc issue gốc (native issue dependencies)** của GitHub — biểu diễn chuẩn hóa, hiển thị được trên UI. Thêm một cạnh bằng `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`, nơi `<blocker-db-id>` là **database id** dạng số của blocker (`gh api repos/<owner>/<repo>/issues/<n> --jq .id`, _không phải_ `#number` hay `node_id`). GitHub báo cáo `issue_dependencies_summary.blocked_by` (chỉ các blocker đang mở — cổng trực tiếp). Nơi các phụ thuộc không có sẵn, fallback về dòng `Blocked by: #<n>, #<n>` ở đầu body con. Một ticket được bỏ chặn khi mọi blocker đều đóng.
- **Truy vấn đường biên (Frontier query)**: liệt kê các con đang mở của bản đồ (`gh issue list --state open`, scoped vào sub-issues / task list của bản đồ), bỏ bất kỳ cái nào có một blocker đang mở (`issue_dependencies_summary.blocked_by > 0`, hoặc một issue đang mở trong dòng `Blocked by`) hoặc đã có người nhận; cái đầu tiên theo thứ tự bản đồ sẽ thắng.
- **Nhận làm (Claim)**: `gh issue edit <n> --add-assignee @me` — lần ghi đầu tiên của phiên.
- **Giải quyết (Resolve)**: `gh issue comment <n> --body "<answer>"`, sau đó `gh issue close <n>`, rồi nối thêm một con trỏ ngữ cảnh (ý chính + link) vào mục Quyết định-cho-đến-nay của bản đồ.
