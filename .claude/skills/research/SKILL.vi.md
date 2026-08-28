---
name: research
description: Điều tra một câu hỏi dựa trên các nguồn chính (primary sources) đáng tin cậy và ghi lại kết quả tìm được vào một file Markdown trong repo. Dùng khi người dùng muốn một chủ đề được nghiên cứu, cần thu thập thông tin từ tài liệu/API, hoặc muốn giao việc đọc cho một agent chạy nền.
---

Khởi chạy một **agent chạy nền (background agent)** để thực hiện việc nghiên cứu, nhờ đó bạn vẫn có thể tiếp tục làm việc khác trong khi nó đọc tài liệu.

Nhiệm vụ của agent đó:

1. Điều tra câu hỏi dựa trên **các nguồn chính (primary sources)** — tài liệu chính thức, mã nguồn, đặc tả kỹ thuật (spec), API do chính bên thứ nhất cung cấp — chứ không phải bài viết tổng hợp lại (secondary write-up) về chúng. Truy ngược mọi khẳng định về đúng nguồn sở hữu nó.
2. Ghi các kết quả tìm được vào một file Markdown duy nhất, trích dẫn nguồn cho từng khẳng định.
3. Lưu file ở nơi mà repo đã sẵn có quy ước lưu các ghi chú như vậy; tuân theo quy ước hiện có, và nếu chưa có quy ước nào, hãy đặt ở một vị trí hợp lý và nêu rõ vị trí đó.
