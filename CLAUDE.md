# CLAUDE.md

Hướng dẫn cho Claude Code khi làm việc trong dự án này.

Website landing page cho **DNK's House** — dịch vụ AI Agents hỗ trợ khách hàng. Site tĩnh thuần: HTML5 + CSS3 + JavaScript vanilla, không build step, không framework, không test suite. Design tham chiếu: `weav.com_RS.png`.

## Nguyên tắc viết code

Bắt buộc tuân thủ skill `karpathy-guidelines` mỗi khi viết, review hoặc refactor code trong dự án này: không làm phức tạp hoá vấn đề, thực hiện thay đổi có chủ đích (surgical), phơi bày các giả định, và định nghĩa tiêu chí thành công có thể kiểm chứng. Đọc `.claude/skills/karpathy-guidelines/SKILL.md` trước khi bắt tay vào code.

## Rules

Hướng dẫn chi tiết được tách theo chủ đề trong `.claude/rules/`. Claude Code tự nạp các file này — file không có `paths:` nạp mọi session, file có `paths:` chỉ nạp khi đụng file khớp.

| File                     | Phạm vi                      | Chủ đề                                                       |
| ------------------------ | ---------------------------- | ------------------------------------------------------------ |
| `project-overview.md`    | luôn nạp                     | Mục tiêu, ràng buộc nền tảng, tech stack, bố cục file        |
| `preview-and-tooling.md` | luôn nạp                     | Chạy server, đường dẫn asset, Prettier & hooks `.claude/`    |
| `mandatory-checks.md`    | luôn nạp                     | 3 quy tắc bắt buộc: so sánh design, mobile, scroll animation |
| `agent-workflows.md`     | luôn nạp                     | Issue tracker, triage labels, domain docs                    |
| `html-structure.md`      | `**/*.html`                  | Sync nav/footer 4 file, semantic HTML, BEM, accessibility    |
| `css-architecture.md`    | `assets/css/**`, `**/*.html` | Thứ tự tokens→base→components, section color system          |
| `design-system.md`       | `assets/css/**`, `**/*.html` | Màu, typography, component patterns, bố cục trang chủ        |
| `javascript.md`          | `assets/js/**`               | Vanilla IIFE, `main.js`, `contact.js`, reveal pattern        |
| `content-and-brand.md`   | `**/*.html`                  | Thông tin công ty, giọng văn, ngôn ngữ, kênh liên hệ         |
