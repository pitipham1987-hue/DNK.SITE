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

## Trạng thái triển khai: Blog & Admin (cập nhật 2026-09-09)

### Đã hoàn thành

- Blog công khai lấy tối đa ba bài `published` từ Supabase tại section `#insights` trên trang chủ; trang chi tiết dùng URL `pages/blog.html?slug=<slug>`.
- Khu vực quản trị tại `admin/index.html`: đăng nhập Google OAuth, kiểm tra role `admin`, tạo/sửa bài, lưu nháp, xuất bản, upload ảnh đại diện, xóa mềm và khôi phục từ thùng rác.
- Nội dung bài viết được lưu Markdown và render theo tập cú pháp giới hạn; HTML thô không được render để giảm rủi ro XSS.
- Migration `supabase/001_admin_blog.sql` tạo/cập nhật schema blog (`profiles`, `categories`, `posts`), trigger profile, RLS policies, bucket `post-images`, và policy Storage. Script có thể chạy trên project đã có `public.profiles`.
- Đã xác minh tĩnh: JavaScript qua `node --check`; `/admin/` và `/pages/blog.html` trả HTTP 200 qua local server.

### Bước tiếp theo

- Vận hành: tạo các danh mục ban đầu trong `public.categories`, sau đó tạo và xuất bản bài viết đầu tiên tại `/admin/`.
- Deploy: thêm URL production của site vào Supabase Authentication → URL Configuration → Redirect URLs, bên cạnh URL local `http://localhost:8000/admin/`.
- Thiết lập dọn thùng rác: lên lịch Supabase Cron để xóa vĩnh viễn các bài có `deleted_at` quá 30 ngày.
- Kiểm thử trước khi public: đăng nhập Google, tạo/lưu nháp/xuất bản/xóa/khôi phục một bài, kiểm tra ảnh đại diện và trang chi tiết trên desktop lẫn mobile.

### Quyết định quan trọng

- Giữ kiến trúc HTML/CSS/JavaScript vanilla; không thêm framework hay build step, phù hợp website hiện có.
- Dùng Supabase cho Auth, Postgres và Storage để có backend thực dụng mà không phải duy trì server riêng.
- Dùng Google OAuth thay cho email/mật khẩu vì tài khoản quản trị hiện hữu đã được tạo bằng Google provider; admin không cần quản lý thêm password.
- Không có đăng ký công khai: tài khoản chỉ có quyền quản trị khi `public.profiles.role = 'admin'`.
- Frontend chỉ dùng Supabase URL và anon key cùng RLS; không bao giờ ghi hoặc sử dụng `service_role` key ở client hay trong repository.
- Khách chỉ đọc được bài `published` chưa bị xóa; toàn bộ CRUD bài viết, danh mục và ảnh bị giới hạn bởi policy `is_admin()`.
