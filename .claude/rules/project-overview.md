# Tổng quan dự án

Website giới thiệu công ty **DNK's House**, tập trung vào **dịch vụ AI Agents** cho hỗ trợ khách hàng. Mục tiêu: một landing page tối giản, hiện đại, chuyên nghiệp, thuyết phục khách hàng doanh nghiệp tin dùng dịch vụ AI Agent của công ty.

## Ràng buộc nền tảng

- **Design tham chiếu**: `weav.com_RS.png` (screenshot trang weav.com) — chuẩn về phong cách thị giác. Nội dung/mô hình dịch vụ cũng tham khảo từ https://weav.com/, nhưng phải diễn giải lại bằng giọng DNK's House, không copy nguyên văn dài và không dùng tên "Weav" trong nội dung hiển thị.
- **Site tĩnh thuần**: không có build step, không `package.json`, không test suite, không framework. HTML5 + CSS3 + JavaScript vanilla.
- **Không thêm framework/dependency mới** (React/Vue/bundler...) trừ khi được yêu cầu rõ ràng. Có thể dùng ES modules native (`<script type="module">`) nếu cần chia nhỏ JS.
- **Responsive, mobile-first**. Test tối thiểu 3 breakpoint: mobile (~390px), tablet (~768px), desktop (~1280px+).
- **Font**: Be Vietnam Pro nạp qua link Google Fonts trong `<head>` (chưa self-host).
- **Icon**: SVG inline hoặc một icon set nhẹ (Lucide/Heroicons dạng SVG), không kéo theo thư viện nặng.

## Bố cục file thực tế

- `index.html` — landing 1 trang; nav trỏ tới anchor `#features`, `#how-it-works`, `#pricing`, `#insights`.
- `pages/about.html`, `pages/contact.html`, `pages/services.html` — 3 trang con.
- `assets/css/` — `tokens.css`, `base.css`, `components.css` (nạp đúng thứ tự này trong mọi file HTML).
- `assets/js/` — `main.js` (nạp mọi trang), `contact.js` (chỉ `pages/contact.html`).
- `assets/images/`.
