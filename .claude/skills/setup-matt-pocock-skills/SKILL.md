---
name: setup-matt-pocock-skills
description: Cấu hình repo này cho các skill kỹ thuật — thiết lập issue tracker, từ vựng nhãn triage, và bố cục tài liệu domain. Chạy một lần trước khi sử dụng lần đầu các skill kỹ thuật khác.
disable-model-invocation: true
---

# Setup Matt Pocock's Skills

Khởi tạo cấu hình trên từng repo mà các skill kỹ thuật giả định sẵn:

- **Issue tracker** — nơi các issue sống (GitHub mặc định; markdown cục bộ cũng được hỗ trợ sẵn)
- **Nhãn triage (Triage labels)** — các chuỗi được dùng cho 5 vai trò triage chuẩn hóa
- **Tài liệu domain (Domain docs)** — nơi `CONTEXT.md` và các ADR sống, và các quy tắc dành cho người đọc để đọc chúng

Đây là một skill được điều khiển bằng prompt, không phải một script tất định. Hãy khám phá, trình bày những gì bạn tìm thấy, xác nhận với người dùng, sau đó ghi file.

## Quy trình

### 1. Khám phá

Nhìn vào repo hiện tại để hiểu trạng thái ban đầu của nó. Đọc những gì tồn tại; đừng giả định:

- `git remote -v` và `.git/config` — đây có phải là repo GitHub không? Repo nào?
- `AGENTS.md` và `CLAUDE.md` tại gốc repo — cái nào tồn tại? Đã có mục `## Agent skills` trong cái nào chưa?
- `CONTEXT.md` và `CONTEXT-MAP.md` tại gốc repo
- `docs/adr/` và bất kỳ thư mục `src/*/docs/adr/` nào
- `docs/agents/` — output trước đây của skill này đã tồn tại chưa?
- `.scratch/` — dấu hiệu cho thấy quy ước issue tracker bằng markdown cục bộ đã được sử dụng
- Skill `triage` đã được cài đặt chưa? (một thư mục skill `triage` bên cạnh thư mục này, hoặc `triage` trong các skill khả dụng của bạn.) Điều này quyết định Phần B có chạy hay không.
- Dấu hiệu monorepo — `pnpm-workspace.yaml`, một trường `workspaces` trong `package.json`, hoặc thư mục `packages/*` có chứa `src/` riêng. Chỉ xuất hiện trong các repo đa-package thực sự lớn; việc không có chúng đồng nghĩa với đơn-context (single-context), vốn là hầu hết mọi repo.

### 2. Trình bày phát hiện và hỏi

Tóm tắt những gì có mặt và những gì còn thiếu. Sau đó thực hiện các phần theo thứ tự — một phần, một câu trả lời, rồi sang phần tiếp theo.

Mở đầu mỗi phần bằng câu trả lời được khuyến nghị để người dùng có thể chấp nhận bằng một từ. Chỉ đưa ra lời giải thích một dòng khi lựa chọn thực sự rẽ nhánh; bỏ qua hoàn toàn phần đó khi việc khám phá đã giải quyết xong (Phần B khi `triage` chưa được cài đặt, Phần C khi không có monorepo).

**Phần A — Issue tracker.**

> Lời giải thích: "Issue tracker" là nơi lưu trữ các issue cho repo này. Các skill như `to-tickets`, `triage`, và `to-spec` đọc và ghi vào đó — chúng cần biết nên gọi `gh issue create`, ghi file markdown dưới `.scratch/`, hay đi theo một workflow nào khác bạn mô tả. Hãy chọn nơi bạn thực sự theo dõi công việc cho repo này.

Tư thế mặc định: các skill này được thiết kế cho GitHub. Nếu `git remote` trỏ tới GitHub, hãy đề xuất GitHub. Nếu `git remote` trỏ tới GitLab (`gitlab.com` hoặc host tự nâng cấp), hãy đề xuất GitLab. Nếu không (hoặc nếu người dùng ưu tiên), hãy đưa ra các lựa chọn:

- **GitHub** — issue sống trong GitHub Issues của repo (dùng CLI `gh`)
- **GitLab** — issue sống trong GitLab Issues của repo (dùng CLI [`glab`](https://gitlab.com/gitlab-org/cli))
- **Markdown cục bộ** — issue sống dưới dạng các file dưới `.scratch/<feature>/` trong repo này (tốt cho các dự án cá nhân hoặc repo không có remote)
- **Khác** (Jira, Linear, v.v.) — yêu cầu người dùng mô tả workflow trong một đoạn văn; skill sẽ ghi lại dưới dạng văn xuôi tự do

Ghi lại lựa chọn vào `docs/agents/issue-tracker.md`. Mẫu GitHub và GitLab mang theo cờ "PRs as a request surface", mặc định là **off** — hãy để off và đừng nêu ra; người dùng muốn PR bên ngoài nằm trong hàng đợi triage có thể bật cờ trong file sau.

**Phần B — Từ vựng nhãn triage.** Bỏ qua phần này nếu skill `triage` chưa được cài đặt (khám phá đã báo cho bạn) — một skill chưa cài đặt thì không cần nhãn.

Nếu đã cài đặt, hãy hỏi đúng một câu:

> Bạn có muốn giữ các nhãn triage mặc định không? (khuyến nghị: **có**)

Các mặc định là 5 vai trò chuẩn hóa, mỗi chuỗi nhãn bằng tên của nó: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. Nếu **có**, ghi nguyên văn. Chỉ khi người dùng nói không — thường vì tracker của họ đã dùng các tên khác (ví dụ `bug:triage` cho `needs-triage`) — hãy thu thập các ghi đè để `triage` áp dụng các nhãn hiện có thay vì tạo trùng lặp.

**Phần C — Tài liệu domain.** Mặc định là **đơn-context (single-context)** — một `CONTEXT.md` + `docs/adr/` tại gốc repo. Cách này phù hợp với hầu hết mọi repo; ghi file mà không cần hỏi.

Chỉ đề xuất **đa-context (multi-context)** — một `CONTEXT-MAP.md` gốc trỏ tới các file `CONTEXT.md` theo từng context — khi khám phá tìm thấy các dấu hiệu monorepo. Sau đó xác nhận bố cục nào họ muốn.

### 3. Xác nhận và chỉnh sửa

Cho người dùng xem bản nháp của:

- Khối `## Agent skills` để thêm vào file nào đang được chỉnh sửa trong `CLAUDE.md` / `AGENTS.md` (xem bước 4 để biết quy tắc chọn file)
- Nội dung của `docs/agents/issue-tracker.md`, `docs/agents/domain.md`, và `docs/agents/triage-labels.md` (file cuối cùng chỉ có khi `triage` đã được cài đặt)

Cho phép họ chỉnh sửa trước khi ghi.

### 4. Ghi file

**Chọn file để chỉnh sửa:**

- Nếu `CLAUDE.md` tồn tại, chỉnh sửa nó.
- Nếu không, nếu `AGENTS.md` tồn tại, chỉnh sửa nó.
- Nếu không có cái nào tồn tại, hỏi người dùng nên tạo cái nào — không tự chọn giúp họ.

Không bao giờ tạo `AGENTS.md` khi `CLAUDE.md` đã tồn tại (hoặc ngược lại) — luôn chỉnh sửa cái đã có sẵn.

Nếu khối `## Agent skills` đã tồn tại trong file đã chọn, hãy cập nhật nội dung của nó tại chỗ thay vì nối thêm bản trùng lặp. Đừng ghi đè lên các chỉnh sửa của người dùng ở các phần xung quanh.

Khối mã:

```markdown
## Agent skills

### Issue tracker

[tóm tắt một dòng về nơi theo dõi issue]. Xem `docs/agents/issue-tracker.md`.

### Triage labels

[tóm tắt một dòng về từ vựng nhãn]. Xem `docs/agents/triage-labels.md`.

### Domain docs

[tóm tắt một dòng về bố cục — "single-context" hoặc "multi-context"]. Xem `docs/agents/domain.md`.
```

Chỉ đưa vào khối phụ `### Triage labels`, và ghi `docs/agents/triage-labels.md`, khi `triage` đã được cài đặt và Phần B đã chạy. Khi chưa, cả hai đều bị bỏ qua.

Sau đó ghi các file tài liệu dùng mẫu khởi đầu trong thư mục skill này làm điểm bắt đầu:

- [issue-tracker-github.md](./issue-tracker-github.md) — GitHub issue tracker
- [issue-tracker-gitlab.md](./issue-tracker-gitlab.md) — GitLab issue tracker
- [issue-tracker-local.md](./issue-tracker-local.md) — markdown issue tracker cục bộ
- [triage-labels.md](./triage-labels.md) — ánh xạ nhãn (chỉ khi `triage` được cài đặt)
- [domain.md](./domain.md) — quy tắc đọc tài liệu domain + bố cục

Đối với các issue tracker "khác", viết `docs/agents/issue-tracker.md` từ đầu dựa trên mô tả của người dùng.

### 5. Hoàn tất

Nói với người dùng rằng việc thiết lập đã hoàn tất và những skill kỹ thuật nào giờ đây sẽ đọc từ các file này. Nhắc rằng họ có thể chỉnh sửa trực tiếp `docs/agents/*.md` sau này — việc chạy lại skill này chỉ cần thiết nếu họ muốn chuyển đổi issue tracker hoặc bắt đầu lại từ đầu.
