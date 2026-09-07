# Viết Agent Briefs (Writing Agent Briefs)

Một agent brief là một comment có cấu trúc được đăng trên một GitHub issue hoặc PR khi nó chuyển sang trạng thái `ready-for-agent`. Nó là bản tả kỹ thuật có thẩm quyền mà một agent AFK sẽ làm việc dựa vào. Nội dung ban đầu và các thảo luận là ngữ cảnh — agent brief mới là hợp đồng.

Brief nêu rõ **những gì agent nên làm**, kéo dài cho cả hai bề mặt: đối với an issue, đó là xây dựng thay đổi từ con số không; đối với một PR, đó là những gì còn lại cần làm *trên diff hiện có* — hoàn tất nó, đóng các khoảng trống, giải quyết các điểm review. Cùng các nguyên tắc theo cả hai cách; ví dụ PR bên dưới hiển thị sự khác biệt.

## Các nguyên tắc

### Độ bền vượt trên sự chính xác tuyệt đối (Durability over precision)

Issue có thể nằm ở `ready-for-agent` trong nhiều ngày hoặc nhiều tuần. Codebase sẽ thay đổi trong thời gian đó. Hãy viết brief sao cho nó vẫn hữu ích ngay cả khi các file bị đổi tên, di chuyển, hoặc refactor.

- **NÊN** mô tả các interface, kiểu (types), và hợp đồng hành vi (behavioral contracts)
- **NÊN** nêu tên các kiểu cụ thể, chữ ký hàm (function signatures), hoặc hình dạng config mà agent nên tìm kiếm hoặc sửa đổi
- **KHÔNG NÊN** tham chiếu đường dẫn file — chúng sẽ lỗi thời
- **KHÔNG NÊN** tham chiếu số dòng
- **KHÔNG NÊN** giả định cấu trúc triển khai hiện tại sẽ giữ nguyên

### Hướng hành vi, không hướng quy trình (Behavioral, not procedural)

Mô tả **những gì** hệ thống nên làm, không phải **làm thế nào** để triển khai nó. Agent sẽ khám phá codebase một cách tươi mới và đưa ra các quyết định triển khai của riêng mình.

- **Tốt:** "Kiểu `SkillConfig` nên chấp nhận một trường `schedule` tùy chọn thuộc kiểu `CronExpression`"
- **Xấu:** "Mở src/types/skill.ts và thêm một trường schedule ở dòng 42"
- **Tốt:** "Khi một người dùng chạy `/triage` mà không có tham số, họ nên thấy bản tóm tắt các issue cần chú ý"
- **Xấu:** "Thêm một câu lệnh switch trong hàm xử lý chính"

### Tiêu chí chấp nhận đầy đủ (Complete acceptance criteria)

Agent cần biết khi nào nó hoàn thành. Mỗi agent brief phải có các tiêu chí chấp nhận cụ thể, có thể kiểm thử được. Mỗi tiêu chí nên có thể xác minh được một cách độc lập.

- **Tốt:** "Chạy `gh issue list --label needs-triage` trả về các issue đã qua phân loại ban đầu"
- **Xấu:** "Triage nên hoạt động chính xác"

### Ranh giới phạm vi rõ ràng (Explicit scope boundaries)

Nêu rõ những gì nằm ngoài phạm vi (out of scope). Điều này ngăn agent làm quá đà (gold-plating) hoặc đưa ra các giả định về các tính năng liền kề.

## Mẫu (Template)

```markdown
## Agent Brief

**Category:** bug / enhancement
**Summary:** tóm tắt một dòng về những gì cần xảy ra

**Current behavior:**
Mô tả những gì xảy ra hiện tại. Đối với bug, đây là hành vi bị hỏng.
Đối với enhancement, đây là trạng thái hiện tại mà tính năng xây dựng trên đó.

**Desired behavior:**
Mô tả những gì nên xảy ra sau khi công việc của agent hoàn tất.
Hãy cụ thể về các trường hợp biên (edge cases) và các điều kiện lỗi.

**Key interfaces:**
- `TypeName` — những gì cần thay đổi và tại sao
- `functionName()` return type — những gì nó hiện trả về vs những gì nó nên trả về
- Config shape — bất kỳ tùy chọn cấu hình mới nào cần thiết

**Acceptance criteria:**
- [ ] Tiêu chí cụ thể, có thể kiểm thử 1
- [ ] Tiêu chí cụ thể, có thể kiểm thử 2
- [ ] Tiêu chí cụ thể, có thể kiểm thử 3

**Out of scope:**
- Điều KHÔNG nên thay đổi hoặc giải quyết trong issue này
- Tính năng liền kề có vẻ liên quan nhưng là riêng biệt
```

## Ví dụ

### Agent brief tốt (bug)

```markdown
## Agent Brief

**Category:** bug
**Summary:** Skill description truncation drops mid-word, producing broken output

**Current behavior:**
When a skill description exceeds 1024 characters, it is truncated at exactly
1024 characters regardless of word boundaries. This produces descriptions
that end mid-word (e.g. "Use when the user wants to confi").

**Desired behavior:**
Truncation should break at the last word boundary before 1024 characters
and append "..." to indicate truncation.

**Key interfaces:**
- The `SkillMetadata` type's `description` field — no type change needed,
  but the validation/processing logic that populates it needs to respect
  word boundaries
- Any function that reads SKILL.md frontmatter and extracts the description

**Acceptance criteria:**
- [ ] Descriptions under 1024 chars are unchanged
- [ ] Descriptions over 1024 chars are truncated at the last word boundary
      before 1024 chars
- [ ] Truncated descriptions end with "..."
- [ ] The total length including "..." does not exceed 1024 chars

**Out of scope:**
- Changing the 1024 char limit itself
- Multi-line description support
```

### Agent brief tốt (enhancement)

```markdown
## Agent Brief

**Category:** enhancement
**Summary:** Add `.out-of-scope/` directory support for tracking rejected feature requests

**Current behavior:**
When a feature request is rejected, the issue is closed with a `wontfix` label
and a comment. There is no persistent record of the decision or reasoning.
Future similar requests require the maintainer to recall or search for the
prior discussion.

**Desired behavior:**
Rejected feature requests should be documented in `.out-of-scope/<concept>.md`
files that capture the decision, reasoning, and links to all issues that
requested the feature. When triaging new issues, these files should be
checked for matches.

**Key interfaces:**
- Markdown file format in `.out-of-scope/` — each file should have a
  `# Concept Name` heading, a `**Decision:**` line, a `**Reason:**` line,
  and a `**Prior requests:**` list with issue links
- The triage workflow should read all `.out-of-scope/*.md` files early
  and match incoming issues against them by concept similarity

**Acceptance criteria:**
- [ ] Closing a feature as wontfix creates/updates a file in `.out-of-scope/`
- [ ] The file includes the decision, reasoning, and link to the closed issue
- [ ] If a matching `.out-of-scope/` file already exists, the new issue is
      appended to its "Prior requests" list rather than creating a duplicate
- [ ] During triage, existing `.out-of-scope/` files are checked and surfaced
      when a new issue matches a prior rejection

**Out of scope:**
- Automated matching (human confirms the match)
- Reopening previously rejected features
- Bug reports (only enhancement rejections go to `.out-of-scope/`)
```

### Agent brief tốt (PR)

Đối với một PR, "Current behavior" mô tả trạng thái của diff, và brief yêu cầu agent hoàn tất hoặc sửa nó thay vì dựng lại từ đầu.

```markdown
## Agent Brief

**Category:** enhancement
**Summary:** Finish the contributor's `--json` output flag for `triage list`

**Current behavior:**
The PR adds a `--json` flag that serializes the issue list to JSON. The happy
path works and the diff matches the project's command structure. Two gaps
remain: errors are still printed as human text (not JSON), and the new flag has
no test coverage.

**Desired behavior:**
With `--json`, all output — including errors — is well-formed JSON on stdout,
and the command's exit codes are unchanged. The existing human-readable output
is untouched when the flag is absent.

**Key interfaces:**
- The command's error path should emit `{ "error": string }` under `--json`
  instead of the plain-text error
- Reuse the existing serializer the PR already added; don't introduce a second

**Acceptance criteria:**
- [ ] `triage list --json` emits valid JSON for both success and error cases
- [ ] Exit codes match the non-JSON command
- [ ] A test covers the `--json` success output and one error case
- [ ] Default (non-JSON) output is byte-for-byte unchanged

**Out of scope:**
- Adding `--json` to any other command
- Changing the JSON shape of the success payload the PR already defined
```

### Agent brief xấu

```markdown
## Agent Brief

**Summary:** Fix the triage bug

**What to do:**
The triage thing is broken. Look at the main file and fix it.
The function around line 150 has the issue.

**Files to change:**
- src/triage/handler.ts (line 150)
- src/types.ts (line 42)
```

Đây là bản brief xấu vì:
- Không có category
- Mô tả mơ hồ ("the triage thing is broken")
- Tham chiếu đường dẫn file và số dòng sẽ bị lỗi thời
- Không có tiêu chí chấp nhận
- Không có ranh giới phạm vi
- Không có mô tả về hành vi hiện tại vs mong muốn
