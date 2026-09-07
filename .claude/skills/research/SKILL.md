---
name: research
description: Điều tra một câu hỏi dựa trên các nguồn sơ cấp có độ tin cậy cao và ghi lại kết quả dưới dạng một file Markdown trong repo. Dùng khi người dùng muốn nghiên cứu một chủ đề, thu thập tài liệu hoặc sự thật về API, hoặc giao công việc đọc tài liệu cho một agent chạy nền.
---

Khởi chạy một **agent chạy nền (background agent)** để thực hiện nghiên cứu, để bạn tiếp tục làm việc trong khi nó đọc tài liệu.

Nhiệm vụ của nó:

1. Điều tra câu hỏi dựa trên các **nguồn sơ cấp (primary sources)** — tài liệu chính thức, mã nguồn, specs, API chính chủ — không phải các bài viết thứ cấp lại từ chúng. Truy nguyên từng khẳng định về đúng nguồn sở hữu nó.
2. Viết các phát hiện vào một file Markdown duy nhất, trích dẫn nguồn cho mỗi khẳng định.
3. Lưu nó ở nơi mà repo đã lưu các ghi chú như vậy; khớp với quy ước hiện có, và nếu không có, hãy đặt ở một nơi hợp lý và thông báo vị trí.
