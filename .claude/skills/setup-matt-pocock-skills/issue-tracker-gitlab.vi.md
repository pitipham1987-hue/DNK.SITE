# Issue tracker: GitLab

Các issue và spec cho repo này được lưu trữ dưới dạng GitLab issue. Dùng CLI [`glab`](https://gitlab.com/gitlab-org/cli) cho mọi thao tác.

## Quy ước

- **Tạo một issue**: `glab issue create --title "..." --description "..."`. Dùng heredoc cho nội dung mô tả nhiều dòng. Truyền `--description -` để mở trình soạn thảo.
- **Đọc một issue**: `glab issue view <number> --comments`. Dùng `-F json` để có output dễ xử lý bằng máy.
- **Liệt kê các issue**: `glab issue list -F json` cùng với các bộ lọc `--label` phù hợp.
- **Comment vào một issue**: `glab issue note <number> --message "..."`. GitLab gọi comment là "note".
- **Áp dụng / gỡ bỏ label**: `glab issue update <number> --label "..."` / `--unlabel "..."`. Nhiều label có thể được phân tách bằng dấu phẩy hoặc lặp lại flag.
- **Đóng**: `glab issue close <number>`. `glab issue close` không nhận comment khi đóng, vì vậy hãy đăng lời giải thích trước bằng `glab issue note <number> --message "..."`, rồi mới đóng.
- **Merge request**: GitLab gọi PR là "merge request". Dùng `glab mr create`, `glab mr view`, `glab mr note`, v.v. — cùng dạng với `gh pr ...` nhưng thay `pr` bằng `mr` và `note`/`--message` thay cho `comment`/`--body`.

Suy ra repo từ `git remote -v` — `glab` tự động làm điều này khi chạy bên trong một bản clone.

## Merge request như một bề mặt triage

**MR như một bề mặt yêu cầu: không.** _(Đặt thành `yes` nếu repo này coi các merge request bên ngoài là yêu cầu tính năng; `/triage` đọc cờ này.)_

Khi được đặt thành `yes`, các MR sẽ đi qua cùng bộ nhãn và trạng thái như issue, dùng các lệnh tương đương `glab mr`:

- **Đọc một MR**: `glab mr view <number> --comments` và `glab mr diff <number>` để xem diff.
- **Liệt kê các MR bên ngoài để triage**: `glab mr list -F json`, sau đó chỉ giữ lại các MR có tác giả không phải là thành viên/chủ sở hữu dự án (MR của một contributor, không phải công việc đang thực hiện của một maintainer).
- **Comment / gắn nhãn / đóng**: `glab mr note`, `glab mr update --label`/`--unlabel`, `glab mr close`.

Không giống GitHub, GitLab đánh số issue và MR riêng biệt, vì vậy `#42` là không mơ hồ (unambiguous) một khi bạn biết maintainer đang nói tới bề mặt nào.

## Khi một skill nói "publish to the issue tracker" (xuất bản lên issue tracker)

Tạo một GitLab issue.

## Khi một skill nói "fetch the relevant ticket" (lấy ticket liên quan)

Chạy `glab issue view <number> --comments`.

## Các thao tác Wayfinding

Được dùng bởi `/wayfinder`. **Map (bản đồ)** là một issue duy nhất với các issue **con (child)** là các ticket.

- **Map**: một issue duy nhất được gắn nhãn `wayfinder:map`, chứa nội dung Notes / Decisions-so-far / Fog. `glab issue create --label wayfinder:map`. (Trên các gói GitLab có epic gốc (native), một epic có thể chứa map thay thế; một issue được gắn nhãn thì hoạt động ở mọi nơi.)
- **Child ticket**: một issue mang dòng `Part of #<map>` ở đầu phần mô tả và các label `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`). Sau khi được nhận (claimed), ticket được gán cho dev thực hiện.
- **Blocking (chặn)**: **native blocking link** của GitLab — biểu diễn chuẩn (canonical), hiển thị trên UI. Thêm nó bằng quick action `/blocked_by #<n>`, đăng dưới dạng một note (`glab issue note <child> --message "/blocked_by #<blocker>"`). Native blocking link là tính năng của gói Premium/Ultimate; ở gói free (hoặc nơi không khả dụng) dùng dự phòng dòng `Blocked by: #<n>, #<n>` ở đầu phần mô tả. Một ticket được gỡ chặn khi mọi blocker đã đóng.
- **Frontier query**: `glab issue list -F json` giới hạn trong phạm vi các child của map, loại bỏ bất kỳ ticket nào có blocker đang mở — một native `blocked_by` link tới một issue đang mở (`glab api projects/:id/issues/:iid/links`), hoặc một issue đang mở trong dòng `Blocked by` — hoặc đã có assignee; ticket đứng đầu theo thứ tự trong map sẽ thắng.
- **Claim (nhận việc)**: `glab issue update <n> --assignee @me` — thao tác ghi đầu tiên của phiên làm việc.
- **Resolve (giải quyết)**: `glab issue note <n> --message "<answer>"`, sau đó `glab issue close <n>`, rồi thêm một điểm tham chiếu ngữ cảnh (gist + link) vào Decisions-so-far của map.
