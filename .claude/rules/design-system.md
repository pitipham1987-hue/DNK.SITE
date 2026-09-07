---
paths:
  - "assets/css/**/*.css"
  - "**/*.html"
---

# Design system (rút ra từ ảnh reference `weav.com_RS.png`)

Đây là điểm khởi đầu. Khi có brand color chính thức của DNK's House, thay "primary blue" bằng màu thương hiệu và giữ nguyên tỷ lệ tương phản / cấu trúc khối màu.

## Màu sắc — khối màu tương phản mạnh theo từng section

- **Primary blue** (hero, CTA nổi bật): xanh dương rực, đậm (~`#1A2BFF` / royal blue). Chữ trắng trên nền này.
- **Soft accent** (section xen kẽ): hồng pastel nhạt (~`#F7D9DE`) — có thể đổi sang accent khác (tím nhạt, xanh mint nhạt) miễn giữ tinh thần "pastel dịu, tương phản với block xanh đậm".
- **Neutral light**: trắng hoặc off-white (~`#F7F6F2`) cho section nội dung/feature thường.
- **Dark/footer**: đen hoặc near-black (~`#0A0A0A`) cho footer và 1–2 section nhấn cuối trang.
- Text tối (~`#0A0A0A`–`#1A1A1A`) trên nền sáng, trắng trên nền đậm. Không dùng gray xám lem nhem — ưu tiên đen/trắng thuần + 1 màu brand.

## Typography

- Heading: rất lớn, bold, letter-spacing hơi âm, line-height chặt (1.05–1.15). H1 hero ~56–80px desktop.
- Body: sans-serif thường, dễ đọc, ~16–18px, line-height ~1.5–1.6.
- Eyebrow label: nhãn nhỏ uppercase, letter-spacing rộng phía trên mỗi heading section ("AI AGENTS", "HOW IT WORKS"...) để dẫn dắt mắt.

## Component patterns

- **Nút**: pill-shaped (border-radius lớn/full), 2 biến thể — nền đen chữ trắng (secondary/nav) và nền xanh brand chữ trắng (primary CTA). Hover: đổi độ sáng nhẹ, không đổi shape.
- **Nav bar**: logo trái, menu giữa/phải, 1 CTA nút pill bên phải. Nền trong suốt/trắng, sticky top, border-bottom mảnh hoặc không có.
- **Card / UI mockup**: khung bo góc lớn (16–24px), shadow rất nhẹ, thường đặt "screenshot sản phẩm" hoặc chat UI bên trong để minh hoạ tính năng AI Agent.
- **Section divider**: đường zigzag/sóng ngăn giữa các khối màu — làm bằng SVG pattern lặp lại (`repeating` triangle/wave) ở mép trên/dưới section. Đây là chi tiết đặc trưng nhất của style — giữ lại nó.
- **Logo strip**: dải logo khách hàng/đối tác dạng grayscale nhỏ, căn giữa, dưới hero.
- **Alternating layout**: các section feature xen kẽ ảnh trái/chữ phải rồi ngược lại, tạo nhịp điệu khi cuộn.

## Bố cục trang chủ gợi ý

1. Nav
2. Hero (nền xanh đậm) — headline mạnh + CTA + hình minh hoạ AI agent đang hoạt động
3. Logo strip khách hàng/đối tác (nếu có)
4. Section vấn đề → giải pháp ("Ngừng làm thủ công, để AI Agent xử lý")
5. Section tính năng/loại AI Agent — dùng mockup UI
6. Section "Cách hoạt động" (quy trình triển khai)
7. Social proof / case study / số liệu
8. Pricing hoặc "Liên hệ tư vấn" CTA
9. Blog/insight (tuỳ chọn)
10. CTA cuối trang (nền đậm, tương phản)
11. Footer (nền đen, nhiều cột: sản phẩm, công ty, tài nguyên, pháp lý)
