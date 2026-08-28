---
name: setup-matt-pocock-skills
description: Cấu hình repo này cho các engineering skill — thiết lập issue tracker của nó, từ vựng nhãn triage (triage label), và bố cục tài liệu domain. Chạy một lần trước khi sử dụng lần đầu các engineering skill khác.
disable-model-invocation: true
---

# Thiết lập các Skill của Matt Pocock

Dựng khung (scaffold) cấu hình theo từng repo mà các engineering skill giả định là đã có sẵn:

- **Issue tracker** — nơi các issue được lưu trữ (mặc định là GitHub; local markdown cũng được hỗ trợ sẵn)
- **Triage labels** — các chuỗi nhãn dùng cho năm vai trò triage chuẩn (canonical)
- **Domain docs** — nơi lưu `CONTEXT.md` và các ADR, cùng các quy tắc cho bên tiêu thụ (consumer) khi đọc chúng

Đây là một skill dẫn dắt bằng prompt (prompt-driven), không phải một kịch bản tất định (deterministic script). Khám phá, trình bày những gì tìm được, xác nhận với người dùng, rồi mới ghi.

## Quy trình

### 1. Khám phá

Xem xét repo hiện tại để hiểu trạng thái ban đầu của nó. Đọc bất cứ thứ gì đang tồn tại; đừng giả định:

- `git remote -v` và `.git/config` — đây có phải là repo GitHub không? Repo nào?
- `AGENTS.md` và `CLAUDE.md` ở gốc repo — có file nào tồn tại không? Đã có sẵn phần `## Agent skills` trong file nào chưa?
- `CONTEXT.md` và `CONTEXT-MAP.md` ở gốc repo
- `docs/adr/` và bất kỳ thư mục `src/*/docs/adr/` nào
- `docs/agents/` — output trước đó của skill này đã tồn tại chưa?
- `.scratch/` — dấu hiệu cho thấy quy ước issue tracker bằng local-markdown đã đang được dùng
- Skill `triage` đã được cài đặt chưa? (một thư mục skill `triage` nằm cạnh skill này, hoặc `triage` xuất hiện trong danh sách skill khả dụng của bạn.) Điều này quyết định liệu Phần B có chạy hay không.
- Các dấu hiệu monorepo — một file `pnpm-workspace.yaml`, trường `workspaces` trong `package.json`, hoặc `packages/*` được lấp đầy với `src/` riêng. Chỉ xuất hiện trong một repo đa gói (multi-package) thực sự lớn; sự vắng mặt của chúng nghĩa là single-context, tức gần như mọi repo.

### 2. Trình bày kết quả và hỏi

Tóm tắt những gì đang có và những gì còn thiếu. Sau đó xử lý các phần theo thứ tự — một phần, một câu trả lời, rồi mới sang phần tiếp theo.

Mở đầu mỗi phần bằng câu trả lời được đề xuất để người dùng có thể chấp nhận chỉ bằng một từ. Chỉ đưa ra giải thích một dòng khi lựa chọn thực sự có rẽ nhánh; bỏ qua toàn bộ phần đó khi việc khám phá đã tự quyết định rồi (Phần B khi `triage` chưa được cài, Phần C khi không có monorepo).

**Phần A — Issue tracker.**

> Giải thích: "issue tracker" là nơi các issue được lưu trữ cho repo này. Các skill như `to-tickets`, `triage`, và `to-spec` đọc từ và ghi vào đó — chúng cần biết nên gọi `gh issue create`, ghi một file markdown dưới `.scratch/`, hay theo một quy trình khác mà bạn mô tả. Hãy chọn nơi mà bạn thực sự đang theo dõi công việc cho repo này.

Lập trường mặc định: các skill này được thiết kế cho GitHub. Nếu một `git remote` trỏ tới GitHub, đề xuất phương án đó. Nếu một `git remote` trỏ tới GitLab (`gitlab.com` hoặc một host tự lưu trữ), đề xuất GitLab. Nếu không (hoặc nếu người dùng muốn khác), đưa ra các lựa chọn:

- **GitHub** — các issue nằm trong GitHub Issues của repo (dùng CLI `gh`)
- **GitLab** — các issue nằm trong GitLab Issues của repo (dùng CLI [`glab`](https://gitlab.com/gitlab-org/cli))
- **Local markdown** — các issue là các file nằm dưới `.scratch/<feature>/` trong repo này (phù hợp cho dự án cá nhân hoặc repo không có remote)
- **Khác** (Jira, Linear, v.v.) — yêu cầu người dùng mô tả quy trình trong một đoạn văn; skill sẽ ghi lại nó dưới dạng văn xuôi tự do (freeform prose)

Ghi lại lựa chọn vào `docs/agents/issue-tracker.md`. Các template GitHub và GitLab có cờ "PRs as a request surface" (PR như một bề mặt yêu cầu), mặc định là **tắt** — hãy để nó tắt và không đề cập tới; người dùng muốn đưa PR bên ngoài vào hàng đợi triage có thể tự bật cờ này trong file sau.

**Phần B — Từ vựng nhãn triage.** Bỏ qua toàn bộ phần này nếu skill `triage` chưa được cài đặt (việc khám phá đã cho bạn biết) — một skill chưa cài đặt thì không cần nhãn.

Nếu đã cài đặt, hỏi đúng một câu hỏi:

> Bạn có muốn giữ các nhãn triage mặc định không? (khuyến nghị: **có**)

Các mặc định là năm vai trò chuẩn (canonical), mỗi chuỗi nhãn trùng với tên của nó: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. Nếu **có**, ghi nguyên trạng. Chỉ khi người dùng nói không — thường vì tracker của họ đã dùng tên khác (ví dụ `bug:triage` cho `needs-triage`) — thu thập các giá trị ghi đè (override) để `triage` áp dụng các nhãn hiện có thay vì tạo bản trùng lặp.

**Phần C — Tài liệu domain.** Mặc định là **single-context** — một `CONTEXT.md` + `docs/adr/` duy nhất ở gốc repo. Điều này phù hợp với hầu hết mọi repo; ghi luôn mà không cần hỏi.

Chỉ đề xuất **multi-context** — một `CONTEXT-MAP.md` ở gốc trỏ tới các file `CONTEXT.md` theo từng context — khi việc khám phá phát hiện các dấu hiệu monorepo. Sau đó xác nhận bố cục nào họ muốn.

### 3. Xác nhận và chỉnh sửa

Cho người dùng xem bản nháp của:

- Khối `## Agent skills` sẽ được thêm vào bất kỳ file nào trong `CLAUDE.md` / `AGENTS.md` đang được chỉnh sửa (xem bước 4 để biết quy tắc chọn)
- Nội dung của `docs/agents/issue-tracker.md`, `docs/agents/domain.md`, và `docs/agents/triage-labels.md` (file cuối chỉ khi `triage` đã được cài)

Cho phép họ chỉnh sửa trước khi ghi.

### 4. Ghi

**Chọn file cần chỉnh sửa:**

- Nếu `CLAUDE.md` tồn tại, chỉnh sửa nó.
- Nếu không, nếu `AGENTS.md` tồn tại, chỉnh sửa nó.
- Nếu cả hai đều không tồn tại, hỏi người dùng muốn tạo file nào — đừng tự chọn thay họ.

Không bao giờ tạo `AGENTS.md` khi `CLAUDE.md` đã tồn tại (hoặc ngược lại) — luôn chỉnh sửa file đã có sẵn.

Nếu một khối `## Agent skills` đã tồn tại trong file được chọn, cập nhật nội dung tại chỗ thay vì thêm bản trùng lặp. Đừng ghi đè các chỉnh sửa của người dùng ở các phần xung quanh.

Khối đó:

```markdown
## Agent skills

### Issue tracker

[tóm tắt một dòng về nơi issue được theo dõi]. Xem `docs/agents/issue-tracker.md`.

### Triage labels

[tóm tắt một dòng về từ vựng nhãn]. Xem `docs/agents/triage-labels.md`.

### Domain docs

[tóm tắt một dòng về bố cục — "single-context" hoặc "multi-context"]. Xem `docs/agents/domain.md`.
```

Chỉ đưa vào tiểu mục `### Triage labels`, và ghi `docs/agents/triage-labels.md`, khi `triage` đã được cài đặt và Phần B đã chạy. Khi không, cả hai đều được bỏ qua.

Sau đó ghi các file tài liệu bằng cách dùng các template mẫu (seed template) trong thư mục skill này làm điểm khởi đầu:

- [issue-tracker-github.md](./issue-tracker-github.md) — issue tracker GitHub
- [issue-tracker-gitlab.md](./issue-tracker-gitlab.md) — issue tracker GitLab
- [issue-tracker-local.md](./issue-tracker-local.md) — issue tracker local-markdown
- [triage-labels.md](./triage-labels.md) — ánh xạ nhãn (chỉ khi `triage` đã được cài)
- [domain.md](./domain.md) — quy tắc cho bên tiêu thụ tài liệu domain + bố cục

Đối với các issue tracker "khác", ghi `docs/agents/issue-tracker.md` từ đầu dựa trên mô tả của người dùng.

### 5. Hoàn tất

Báo cho người dùng biết việc thiết lập đã hoàn tất và các engineering skill nào sẽ đọc từ các file này. Đề cập rằng họ có thể tự chỉnh sửa `docs/agents/*.md` trực tiếp sau này; chỉ cần chạy lại skill này nếu họ muốn đổi issue tracker hoặc bắt đầu lại từ đầu.
