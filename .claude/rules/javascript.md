---
paths:
  - "assets/js/**/*.js"
---

# JavaScript

Vanilla JS, mỗi file một IIFE, không dùng module. Không thêm thư viện animation nặng (GSAP/AOS) trừ khi được yêu cầu.

## `main.js` — nạp trên **mọi** trang, làm ba việc

1. **scroll-reveal**: `IntersectionObserver` quan sát mọi `.reveal`, thêm class `.is-visible` (unobserve sau khi hiện). Nếu `prefers-reduced-motion` hoặc thiếu API thì hiện ngay tất cả.
2. **mobile nav**: toggle `body.nav-open` + `aria-expanded` trên `.nav-toggle`.
3. **sticky navbar**: toggle `.navbar.is-scrolled` khi `scrollY > 8`.

## `contact.js` — chỉ nạp trên `pages/contact.html`

Validate form client-side (name / email / phone VN / message), submit giả bằng `setTimeout`, ghi log vào `localStorage` key `dnk_contact_log`. Chưa có backend thật.

## Gắn animation cho section mới (không cần viết JS)

Thêm `class="reveal"` vào phần tử, tùy chọn `style="--reveal-delay: 0.1s"` để trễ. `main.js` lo phần còn lại.
