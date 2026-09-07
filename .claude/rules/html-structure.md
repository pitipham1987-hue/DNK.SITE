---
paths:
  - "**/*.html"
---

# Cấu trúc HTML & accessibility

## Không có hệ thống template — sync thủ công

`<header class="navbar">` và `<footer>` được copy nguyên văn trong cả 4 file HTML. Khi sửa nav / footer / menu phải cập nhật đồng bộ cả 4 file: `index.html`, `pages/about.html`, `pages/contact.html`, `pages/services.html`.

## Nguyên tắc markup

- Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`...), không lạm dụng `<div>`.
- Đặt tên class theo BEM đơn giản hoặc utility nhẹ — nhất quán xuyên suốt, không trộn 2 kiểu.
- Mỗi `<section>` mang một class nền theo section color system (xem `css-architecture.md`).
- Ảnh: dùng `srcset` / kích thước tối ưu, `alt` mô tả đầy đủ (SEO cho trang công ty rất quan trọng).

## Accessibility

- Contrast đủ chuẩn AA, đặc biệt chữ trắng trên nền xanh/đen.
- Focus state rõ ràng cho mọi nút/link.
- Heading order hợp lý, không nhảy cấp (h1 → h3).
