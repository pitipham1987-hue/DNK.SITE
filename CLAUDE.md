# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Hướng dẫn cho Claude Code khi làm việc trong dự án này.

## Tổng quan dự án

Website giới thiệu công ty, tập trung vào **dịch vụ AI Agents**. Mục tiêu: một trang landing page tối giản, hiện đại, chuyên nghiệp, thuyết phục khách hàng doanh nghiệp tin dùng dịch vụ AI Agent của công ty.

Design tham chiếu: `weav.com_RS.png` (screenshot trang weav.com) — dùng làm chuẩn về phong cách thị giác.

## Chạy & xem trước

Site tĩnh thuần — **không có build step, không có `package.json`, không có test suite, không có framework**. Mở bằng một static server rồi xem trong trình duyệt:

```bash
python -m http.server 8000    # rồi mở http://localhost:8000
```

- Ưu tiên skill `run` hoặc `browser-automation` để khởi chạy và chụp screenshot khi cần xác minh UI (xem "Quy tắc bắt buộc").
- Đường dẫn asset khác nhau theo vị trí file: `index.html` ở gốc dùng `assets/...`; các trang trong `pages/` dùng `../assets/...`. Luôn mở qua HTTP server, không mở file trực tiếp (`file://`) vì đường dẫn tương đối + Google Fonts sẽ lệch.
- **Prettier tự chạy sau mỗi Write/Edit** qua PostToolUse hook (`npx prettier --write` — dùng default, không có file config). Không cần format thủ công; giữ style khớp Prettier default (2 space, double quote).

## Kiến trúc thực tế

**Không có hệ thống template** — `<header class="navbar">` và `<footer>` được copy nguyên văn trong cả 4 file HTML. Khi sửa nav/footer/menu phải cập nhật đồng bộ: `index.html`, `pages/about.html`, `pages/contact.html`, `pages/services.html`.

**Trang**: `index.html` (landing 1 trang, nav trỏ tới anchor `#features`, `#how-it-works`, `#pricing`, `#insights`) + 3 trang con trong `pages/`.

**CSS** — mọi file HTML link đúng thứ tự 3 file trong `assets/css/`:

1. `tokens.css` — chỉ chứa CSS custom properties trong `:root` (màu `--color-*`, `--space-1..8`, `--radius-*`, `--font-sans`, motion). Mọi giá trị màu/spacing phải tham chiếu qua biến này.
2. `base.css` — reset, typography nền, `.container`, `.visually-hidden`, xử lý `prefers-reduced-motion`.
3. `components.css` — file lớn (~1300 dòng) chứa **tất cả**: button, navbar, section theo màu, mọi mockup/card, và style riêng của từng trang. Đề xuất tách file trong phần "Cấu trúc thư mục" bên dưới **chưa được áp dụng** — thực tế mọi thứ nằm ở đây.

**Section color system**: mỗi `<section>` mang một class nền — `section-blue` (hero/CTA, chữ trắng), `section-pink`, `section-cream`, `section-white`, `section-black` (footer). Xen kẽ các block màu này tạo nhịp trang.

**JavaScript** (`assets/js/`, vanilla IIFE, không module):

- `main.js` — nạp trên **mọi** trang. Ba việc: (1) scroll-reveal: `IntersectionObserver` quan sát mọi `.reveal`, thêm class `.is-visible` (unobserve sau khi hiện); nếu `prefers-reduced-motion` hoặc thiếu API thì hiện ngay tất cả. (2) mobile nav: toggle `body.nav-open` + `aria-expanded` trên `.nav-toggle`. (3) sticky navbar: toggle `.navbar.is-scrolled` khi `scrollY > 8`.
- `contact.js` — chỉ nạp trên `pages/contact.html`. Validate form client-side (name/email/phone VN/message), submit giả bằng `setTimeout`, ghi log vào `localStorage` key `dnk_contact_log`. **Chưa có backend thật.**

**Pattern animation cho section mới**: thêm `class="reveal"` (và tùy chọn `style="--reveal-delay: 0.1s"`) vào phần tử — `main.js` lo phần còn lại. Không cần viết JS mới.

**Font**: Be Vietnam Pro nạp qua link Google Fonts trong `<head>` (chưa self-host).

## `.claude/` — hooks

- `PreToolUse` Write|Edit → `backup-file.js` tạo `<file>.bak` (đã gitignore).
- `PreToolUse`/`PostToolUse` `.*` → `audit-log.js` ghi `.claude/logs/<session>.jsonl` (đã gitignore).
- `PostToolUse` Write|Edit → `format-file.js` chạy Prettier (xem trên).
- `Stop` → `notify-done.ps1` thông báo khi xong.

Các hook đều best-effort, nuốt lỗi, không chặn tool call.

## Quy tắc bắt buộc

- **So sánh design sau mỗi thay đổi lớn**: sau khi implement/sửa xong 1 section hoặc 1 trang, dùng skill `browser-automation` (hoặc `run`) để chụp screenshot trang đang chạy, rồi so sánh trực quan với `weav.com_RS.png` (bố cục, khối màu, spacing, tỷ lệ). Nêu rõ điểm khác biệt và chỉnh sửa nếu lệch nhiều so với tinh thần thiết kế gốc.
- **Mobile-friendly bắt buộc**: mọi section phải kiểm tra và hoạt động tốt ở mobile (~390px) trước khi coi là hoàn thành — không chỉ desktop. Chụp screenshot ở cả viewport mobile và desktop khi so sánh design.
- **Animation khi scroll bắt buộc cho mọi section**: mỗi `<section>` phải có hiệu ứng xuất hiện khi cuộn tới (vd: fade-in + dịch chuyển nhẹ theo trục Y) dùng `IntersectionObserver` thuần trong `main.js`, thêm/bỏ class (vd: `.is-visible`) để trigger transition CSS. Tôn trọng `prefers-reduced-motion: reduce` — tắt/giảm animation khi user bật cờ này. Không dùng thư viện animation nặng (GSAP/AOS) trừ khi được yêu cầu.

## Thông tin công ty

Nội dung/mô hình dịch vụ tham khảo từ https://weav.com/, đã điều chỉnh tên thương hiệu thành công ty thực tế của khách hàng.

- **Tên công ty**: DNK's House
- **Sản phẩm/dịch vụ chính**: nền tảng/dịch vụ AI Agents cho hỗ trợ khách hàng, gồm: AI Agents, Chatbots, Unified Inbox, Ask DNK (công cụ hỏi-đáp nội bộ), Training Module, Reporting.
- **Tagline**: "Bạn không bắt đầu kinh doanh để trả lời email hỗ trợ suốt cả ngày." AI Agent giải quyết hơn 70% câu hỏi khách hàng tự động, hoạt động 24/7 với đúng giọng điệu thương hiệu.
- **Sứ mệnh**: "Automate the volume, humanize the interaction" — tự động hoá khối lượng công việc, nhưng nhân tính hoá tương tác. Hỗ trợ khách hàng không nên đánh đổi chất lượng lấy tốc độ.
- **Giá trị cốt lõi**:
  - Câu trả lời "personal, not templated" — cá nhân hoá thay vì rập khuôn.
  - AI "think before it speaks" — suy nghĩ trước khi phản hồi.
  - Khách hàng cảm thấy "understood, not dismissed" — được thấu hiểu, không bị bỏ qua.
  - Context là nền tảng cốt lõi, không phải tính năng phụ.
  - "The future of support isn't less human, it's more" — tương lai của hỗ trợ là nhiều tính người hơn, không phải ít đi.
- **Vấn đề giải quyết**: các hệ thống hỗ trợ khách hàng hiện tại vận hành theo "upside-down incentives" — ưu tiên đóng ticket nhanh thay vì xây dựng lòng tin với khách hàng.
- **Tính năng chính**:
  | Tính năng              | Mô tả                                                                                |
  | ---------------------- | ------------------------------------------------------------------------------------ |
  | AI Agents              | Triển khai tác nhân AI hiểu sản phẩm, xử lý truy vấn thường gặp với độ chính xác cao |
  | Deep Product Knowledge | Học từ website, tài liệu, dữ liệu đào tạo của công ty                                |
  | Continuous Learning    | Phân tích các ticket đã xử lý thực tế, cải thiện liên tục                            |
  | Unified Inbox          | Một không gian làm việc chung cho AI và con người trên mọi kênh (email, chat...)     |
  | Reply Generation       | AI soạn sẵn phản hồi, con người có thể chỉnh sửa hoặc để tự động gửi                 |
  | Zero Setup Required    | Kết nối tài liệu có sẵn trong vài phút, không cần code                               |
- **Đối tượng khách hàng**: doanh nghiệp muốn mở rộng hỗ trợ khách hàng mà không tăng nhân sự, có sẵn tài liệu/docs sản phẩm, ưu tiên trải nghiệm khách hàng (CX) chất lượng cao.
- **Cách hoạt động (How it works)**:
  1. **Đào tạo** — kết nối website, tải tài liệu hoặc đồng bộ dữ liệu hiện có.
  2. **Học tập** — AI phân tích tài liệu và các ticket đã giải quyết trước đó.
  3. **Triển khai** — AI Agent hoạt động 24/7 để xử lý yêu cầu khách hàng.
  4. **Cải thiện** — hệ thống liên tục cập nhật theo dữ liệu mới và tương tác thực tế.
- **Điểm mạnh nổi bật**: độc lập với mô hình AI (managed model routing), thiết lập nhanh, API sạch với webhook real-time, được các thương hiệu đặt tiêu chuẩn về CX tin dùng.
- **Cấu trúc trang tham khảo** (theo mô hình weav.com, đổi sang domain/tên thật của DNK's House khi triển khai): Product, Pricing, Blog, Docs, Comparison, About, Contact/Sales — dùng làm gợi ý sitemap khi cần mở rộng ngoài trang chủ.
- **Kênh liên hệ**: chưa có thông tin thật — cần hỏi khách hàng (DNK's House) để điền domain, email, mạng xã hội thực tế trước khi đưa lên site. KHÔNG dùng handle/social của weav.com (@weavdotcom...) vì đó là kênh liên hệ thật của công ty khác.

> Khi viết copy cho site, ưu tiên diễn giải lại các ý trên bằng giọng văn phù hợp với DNK's House (có thể Việt hoá), không copy nguyên văn dài từ weav.com và không dùng tên "Weav" trong nội dung hiển thị trên site.

## Tech stack

- HTML5 + CSS3 + JavaScript thuần (vanilla). Không dùng framework (React/Vue/...) trừ khi được yêu cầu rõ ràng.
- Không cần build step / bundler. Có thể dùng ES modules native (`<script type="module">`) nếu cần chia nhỏ JS.
- Responsive, mobile-first. Test ở 3 breakpoint tối thiểu: mobile (~390px), tablet (~768px), desktop (~1280px+).
- Font: Google Fonts (self-host hoặc link) — chọn 1 sans-serif hiện đại, bo tròn nhẹ (kiểu Inter, General Sans, Geist, Satoshi...).
- Icon: SVG inline hoặc 1 icon set nhẹ (Lucide/Heroicons dạng SVG), không kéo theo thư viện nặng.

## Cấu trúc thư mục (đề xuất)

```
/
├── index.html
├── /assets
│   ├── /css
│   │   ├── tokens.css       (biến màu, spacing, typography)
│   │   ├── base.css         (reset, base styles)
│   │   └── components.css   (button, card, nav, footer...)
│   ├── /js
│   │   └── main.js
│   └── /images
├── /pages                   (nếu có nhiều trang: services.html, about.html, contact.html...)
└── CLAUDE.md
```

Giữ CSS chia theo lớp: tokens (design system) → base → components → page-specific. Tránh 1 file CSS khổng lồ.

## Design system (rút ra từ ảnh reference)

### Màu sắc — khối màu tương phản mạnh theo từng section

- **Primary blue** (hero, CTA nổi bật): xanh dương rực, đậm (~`#1A2BFF` / royal blue). Chữ trắng trên nền này.
- **Soft accent** (section xen kẽ): hồng pastel nhạt (~`#F7D9DE`) — có thể đổi thành accent màu khác phù hợp brand AI Agents (vd: tím nhạt, xanh mint nhạt) miễn giữ tinh thần "pastel dịu, tương phản với block xanh đậm".
- **Neutral light**: trắng hoặc off-white (~`#F7F6F2`) cho section nội dung/feature thường.
- **Dark/footer**: đen hoặc near-black (~`#0A0A0A`) cho footer và 1-2 section nhấn mạnh cuối trang.
- Text màu tối (~`#0A0A0A`–`#1A1A1A`) trên nền sáng, trắng trên nền đậm. Không dùng gray xám lem nhem — ưu tiên đen/trắng thuần + 1 màu brand.

> Đây là điểm khởi đầu — khi có brand color chính thức của công ty, thay thế "primary blue" bằng màu thương hiệu và giữ nguyên tỷ lệ tương phản/cấu trúc khối màu.

### Typography

- Heading: rất lớn, bold, letter-spacing hơi âm, line-height chặt (kiểu 1.05–1.15). H1 hero ~56–80px desktop.
- Body: sans-serif thường, dễ đọc, ~16–18px, line-height ~1.5–1.6.
- Dùng nhãn nhỏ viết hoa/uppercase, letter-spacing rộng phía trên mỗi heading section (kiểu "eyebrow label": "AI AGENTS", "HOW IT WORKS"...) để dẫn dắt mắt.

### Component patterns

- **Nút**: pill-shaped (border-radius lớn/full), 2 biến thể — nền đen chữ trắng (secondary/nav) và nền xanh brand chữ trắng (primary CTA). Hover: đổi độ sáng nhẹ, không đổi shape.
- **Nav bar**: logo trái, menu giữa/phải, 1 CTA nút pill bên phải. Nền trong suốt/trắng, sticky top, border-bottom mảnh hoặc không có.
- **Card/UI mockup**: khung bo góc lớn (16–24px), shadow rất nhẹ, thường đặt "screenshot sản phẩm" hoặc chat UI bên trong để minh hoạ tính năng AI Agent.
- **Section divider**: đường zigzag/sóng ngăn giữa các khối màu — có thể làm bằng SVG pattern lặp lại (`repeating` triangle/wave) đặt ở mép trên/dưới section. Đây là chi tiết đặc trưng nhất của style — giữ lại nó.
- **Logo strip**: dải logo khách hàng/đối tác dạng grayscale nhỏ, căn giữa, dưới hero.
- **Alternating layout**: các section feature xen kẽ ảnh trái/chữ phải rồi ngược lại, tạo nhịp điệu khi cuộn trang.

### Bố cục trang chủ gợi ý (cho dịch vụ AI Agents)

1. Nav
2. Hero (nền xanh đậm) — headline mạnh + CTA + hình minh hoạ AI agent đang hoạt động
3. Logo strip khách hàng/đối tác (nếu có)
4. Section giới thiệu vấn đề → giải pháp ("Ngừng làm thủ công, để AI Agent xử lý")
5. Section tính năng/loại AI Agent (support agent, sales agent, workflow automation...) — dùng mockup UI
6. Section "Cách hoạt động" (quy trình 3 bước triển khai)
7. Social proof / case study / số liệu
8. Pricing hoặc "Liên hệ tư vấn" CTA
9. Blog/insight (tuỳ chọn)
10. CTA cuối trang (nền đậm, tương phản)
11. Footer (nền đen, nhiều cột: sản phẩm, công ty, tài nguyên, pháp lý)

## Nguyên tắc code

- Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`...), không lạm dụng `<div>`.
- Dùng CSS custom properties (`--color-primary`, `--space-*`, `--radius-*`, `--font-*`) khai báo trong `tokens.css`, tất cả component/section tham chiếu qua biến — không hardcode màu/spacing rải rác.
- Đặt tên class theo BEM đơn giản hoặc utility nhẹ — nhất quán xuyên suốt file, không trộn 2 kiểu.
- Ảnh: dùng `srcset`/kích thước tối ưu, `alt` mô tả đầy đủ (SEO cho trang công ty rất quan trọng).
- Accessibility: contrast đủ (đặc biệt chữ trắng trên nền xanh/đen phải đạt AA), focus state rõ ràng cho nút/link, heading order hợp lý (không nhảy cấp h1→h3).
- Không thêm framework/dependency mới nếu không được yêu cầu.
- Trước khi báo hoàn thành 1 tính năng UI, mở trang trong trình duyệt (dùng skill `run` hoặc `browser-automation`) để kiểm tra thực tế thay vì chỉ đọc code.

## Nội dung

- Copy tiếng Việt hoặc song ngữ Việt/Anh tuỳ yêu cầu — hỏi rõ ngôn ngữ chính trước khi viết nội dung dài nếu chưa được chỉ định trong hội thoại.
- Giọng văn: tự tin, ngắn gọn, tập trung lợi ích kinh doanh của AI Agent (tiết kiệm thời gian, tự động hoá, phục vụ khách hàng 24/7) hơn là thuật ngữ kỹ thuật.
