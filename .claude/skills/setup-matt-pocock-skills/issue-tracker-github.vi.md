# Issue tracker: GitHub

Các issue và spec cho repo này được lưu trữ dưới dạng GitHub issue. Dùng CLI `gh` cho mọi thao tác.

## Quy ước

- **Tạo một issue**: `gh issue create --title "..." --body "..."`. Dùng heredoc cho nội dung nhiều dòng.
- **Đọc một issue**: `gh issue view <number> --comments`, lọc comment bằng `jq` và đồng thời lấy về các label.
- **Liệt kê các issue**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` cùng với các bộ lọc `--label` và `--state` phù hợp.
- **Comment vào một issue**: `gh issue comment <number> --body "..."`
- **Áp dụng / gỡ bỏ label**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Đóng**: `gh issue close <number> --comment "..."`

Suy ra repo từ `git remote -v` — `gh` tự động làm điều này khi chạy bên trong một bản clone.

## Pull request như một bề mặt triage

**PR như một bề mặt yêu cầu: không.** _(Đặt thành `yes` nếu repo này coi các PR bên ngoài là yêu cầu tính năng; `/triage` đọc cờ này.)_

Khi được đặt thành `yes`, các PR sẽ đi qua cùng bộ nhãn và trạng thái như issue, dùng các lệnh tương đương `gh pr`:

- **Đọc một PR**: `gh pr view <number> --comments` và `gh pr diff <number>` để xem diff.
- **Liệt kê các PR bên ngoài để triage**: `gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments` sau đó chỉ giữ lại những PR có `authorAssociation` là `CONTRIBUTOR`, `FIRST_TIME_CONTRIBUTOR`, hoặc `NONE` (loại bỏ `OWNER`/`MEMBER`/`COLLABORATOR`).
- **Comment / gắn nhãn / đóng**: `gh pr comment`, `gh pr edit --add-label`/`--remove-label`, `gh pr close`.

GitHub dùng chung một không gian số (number space) cho cả issue và PR, vì vậy một `#42` trơn có thể là một trong hai — xác định bằng `gh pr view 42` và dự phòng bằng `gh issue view 42`.

## Khi một skill nói "publish to the issue tracker" (xuất bản lên issue tracker)

Tạo một GitHub issue.

## Khi một skill nói "fetch the relevant ticket" (lấy ticket liên quan)

Chạy `gh issue view <number> --comments`.

## Các thao tác Wayfinding

Được dùng bởi `/wayfinder`. **Map (bản đồ)** là một issue duy nhất với các issue **con (child)** là các ticket.

- **Map**: một issue duy nhất được gắn nhãn `wayfinder:map`, chứa nội dung Notes / Decisions-so-far / Fog. `gh issue create --label wayfinder:map`.
- **Child ticket**: một issue được liên kết với map dưới dạng GitHub sub-issue (`gh api` trên endpoint sub-issues). Nơi sub-issue chưa được bật, thêm child vào một task list trong nội dung map và đặt `Part of #<map>` ở đầu nội dung của child. Label: `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`). Sau khi được nhận (claimed), ticket được gán cho dev thực hiện.
- **Blocking (chặn)**: **native issue dependencies** của GitHub — biểu diễn chuẩn (canonical), hiển thị trên UI. Thêm một cạnh (edge) bằng `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`, trong đó `<blocker-db-id>` là **database id** dạng số của blocker (`gh api repos/<owner>/<repo>/issues/<n> --jq .id`, _không phải_ `#number` hay `node_id`). GitHub báo cáo `issue_dependencies_summary.blocked_by` (chỉ các blocker đang mở — cổng chặn còn hiệu lực). Nơi dependencies không khả dụng, dùng dự phòng dòng `Blocked by: #<n>, #<n>` ở đầu nội dung child. Một ticket được gỡ chặn khi mọi blocker đã đóng.
- **Frontier query**: liệt kê các child đang mở của map (`gh issue list --state open`, giới hạn trong phạm vi sub-issue/task list của map), loại bỏ bất kỳ ticket nào có blocker đang mở (`issue_dependencies_summary.blocked_by > 0`, hoặc một issue đang mở trong dòng `Blocked by`) hoặc đã có assignee; ticket đứng đầu theo thứ tự trong map sẽ thắng.
- **Claim (nhận việc)**: `gh issue edit <n> --add-assignee @me` — thao tác ghi đầu tiên của phiên làm việc.
- **Resolve (giải quyết)**: `gh issue comment <n> --body "<answer>"`, sau đó `gh issue close <n>`, rồi thêm một điểm tham chiếu ngữ cảnh (gist + link) vào Decisions-so-far của map.
