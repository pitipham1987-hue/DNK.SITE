---
paths:
  - "assets/css/**/*.css"
  - "**/*.html"
---

# Kiến trúc CSS

## Ba file, nạp đúng thứ tự trong mọi file HTML

1. `tokens.css` — **chỉ** chứa CSS custom properties trong `:root`: màu `--color-*`, `--space-1..8`, `--radius-*`, `--font-sans`, biến motion. Mọi giá trị màu/spacing ở nơi khác phải tham chiếu qua biến này — không hardcode màu/spacing rải rác.
2. `base.css` — reset, typography nền, `.container`, `.visually-hidden`, xử lý `prefers-reduced-motion`.
3. `components.css` — file lớn (~1300 dòng) chứa **tất cả**: button, navbar, section theo màu, mọi mockup/card, và style riêng của từng trang. Thực tế mọi thứ hiện nằm ở đây; việc tách nhỏ hơn chưa được áp dụng.

Giữ tư duy chia lớp: tokens (design system) → base → components → page-specific. Tránh để logic token rò rỉ xuống component.

## Section color system

Mỗi `<section>` mang một class nền, xen kẽ để tạo nhịp trang:

| Class           | Dùng cho                            | Màu chữ |
| --------------- | ----------------------------------- | ------- |
| `section-blue`  | hero, CTA nổi bật                   | trắng   |
| `section-pink`  | section xen kẽ (soft accent)        | tối     |
| `section-cream` | section nội dung/feature thường     | tối     |
| `section-white` | section nội dung/feature thường     | tối     |
| `section-black` | footer, 1–2 section nhấn cuối trang | trắng   |
