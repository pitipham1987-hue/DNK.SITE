# Issue tracker: GitLab

Các issue và spec cho repo này sống dưới dạng GitLab issues. Dùng CLI [`glab`](https://gitlab.com/gitlab-org/cli) cho mọi thao tác.

## Quy ước

- **Tạo issue**: `glab issue create --title "..." --description "..."`. Dùng heredoc cho mô tả nhiều dòng. Truyền `--description -` để mở editor.
- **Đọc issue**: `glab issue view <number> --comments`. Dùng `-F json` cho output mà máy có thể đọc.
- **Liệt kê issues**: `glab issue list -F json` với các bộ lọc `--label` phù hợp.
- **Bình luận trên issue**: `glab issue note <number> --message "..."`. GitLab gọi comment là "notes".
- **Áp dụng / gỡ nhãn**: `glab issue update <number> --label "..."` / `--unlabel "..."`. Phân tách nhiều nhãn bằng dấu phẩy hoặc lặp lại cờ.
- **Đóng issue**: `glab issue close <number>`. `glab issue close` không chấp nhận comment đóng, vì vậy hãy đăng giải thích trước bằng `glab issue note <number> --message "..."`, sau đó mới đóng.
- **Merge requests**: GitLab gọi PR là "merge requests". Dùng `glab mr create`, `glab mr view`, `glab mr note`, v.v. — cùng hình dạng với `gh pr ...` thay `pr` bằng `mr` và `note`/`--message` bằng `comment`/`--body`.

Suy luận repo từ `git remote -v` — `glab` tự động làm việc này khi chạy bên trong một bản clone.

## Merge requests như một bề mặt triage

**MRs như một bề mặt request: no.** _(Đặt thành `yes` nếu repo này coi các merge request bên ngoài như các yêu cầu tính năng; `/triage` đọc cờ này.)_

Khi đặt thành `yes`, các MR chạy qua cùng nhãn và trạng thái như issue, dùng các lệnh tương đương `glab mr`:

- **Đọc an MR**: `glab mr view <number> --comments` và `glab mr diff <number>` để lấy diff.
- **Liệt kê MRs bên ngoài cho triage**: `glab mr list -F json`, sau đó chỉ giữ lại các MR mà tác giả không phải là member/owner của project (MR của contributor, không phải công việc đang làm của maintainer).
- **Bình luận / dán nhãn / đóng**: `glab mr note`, `glab mr update --label`/`--unlabel`, `glab mr close`.

Không giống GitHub, GitLab đánh số issue và MR riêng biệt, nên `#42` không bị mơ hồ một khi bạn biếtmaintainer muốn nói tới bề mặt nào.

## Khi một skill nói "xuất bản lên issue tracker"

Tạo một GitLab issue.

## Khi một skill nói "lấy ticket liên quan"

Chạy `glab issue view <number> --comments`.

## Các thao tác Wayfinding

Được sử dụng bởi `/wayfinder`. **Bản đồ (map)** là một issue đơn lẻ với các issue **con (child)** làm ticket.

- **Bản đồ**: một issue đơn lẻ được dán nhãn `wayfinder:map`, giữ phần body Ghi chú / Quyết định-cho-đến-nay / Sương mù. `glab issue create --label wayfinder:map`. (Trên các gói GitLab có epics gốc, một epic có thể giữ bản đồ; một issue được dán nhãn hoạt động ở mọi nơi.)
- **Ticket con**: một issue mang dòng `Part of #<map>` ở đầu mô tả và các nhãn `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`). Một khi được nhận làm, ticket được gán cho dev đang thực hiện.
- **Chặn (Blocking)**: **liên kết chặn gốc (native blocking link)** của GitLab — biểu diễn chuẩn hóa, hiển thị được trên UI. Thêm nó bằng quick action `/blocked_by #<n>`, đăng dưới dạng note (`glab issue note <child> --message "/blocked_by #<blocker>"`). Các liên kết chặn gốc là tính năng của Premium/Ultimate; trên gói free (hoặc nơi không có sẵn) fallback về dòng `Blocked by: #<n>, #<n>` ở đầu mô tả. Một ticket được bỏ chặn khi mọi blocker đều đóng.
- **Truy vấn đường biên (Frontier query)**: `glab issue list -F json` scoped vào các con của bản đồ, bỏ bất kỳ cái nào có một blocker đang mở — một liên kết `blocked_by` gốc tới một issue đang mở (`glab api projects/:id/issues/:iid/links`), hoặc một issue đang mở trong dòng `Blocked by` — hoặc đã có người nhận; cái đầu tiên theo thứ tự bản đồ sẽ thắng.
- **Nhận làm (Claim)**: `glab issue update <n> --assignee @me` — lần ghi đầu tiên của phiên.
- **Giải quyết (Resolve)**: `glab issue note <n> --message "<answer>"`, sau đó `glab issue close <n>`, rồi nối thêm một con trỏ ngữ cảnh (ý chính + link) vào mục Quyết định-cho-đến-nay của bản đồ.
