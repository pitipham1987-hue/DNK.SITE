---
name: prototype
description: Dựng một bản prototype dùng-một-lần-rồi-bỏ để trả lời một câu hỏi thiết kế. Dùng khi người dùng muốn kiểm tra thực tế xem một mô hình trạng thái hoặc logic có cảm giác đúng không, hoặc khám phá xem UI nên trông như thế nào.
---

# Prototype

Một prototype là **code dùng-một-lần-rồi-bỏ dùng để trả lời một câu hỏi**. Câu hỏi sẽ quyết định hình dạng của prototype.

## Chọn một nhánh

Xác định câu hỏi nào đang được trả lời — từ prompt của người dùng, code xung quanh, hoặc bằng cách hỏi nếu người dùng đang có mặt:

- **"Mô hình trạng thái / logic này có cảm giác đúng không?"** → [LOGIC.md](LOGIC.md). Dựng một file HTML đơn lẻ có thể chia sẻ được — gồm các nút bấm tự do cộng với các bài hướng dẫn theo tab — giúp đẩy state machine qua các trường hợp khó suy luận trên giấy mà một người không phải developer cũng có thể điều khiển được.
- **"Cái này nên trông như thế nào?"** → [UI.md](UI.md). Tạo ra nhiều biến thể UI khác biệt triệt để trên một route duy nhất, có thể chuyển đổi qua tham số tìm kiếm URL và một thanh công cụ nổi ở đáy màn hình.

Hai nhánh tạo ra các artifact rất khác nhau — chọn sai nhánh sẽ làm lãng phí toàn bộ prototype. Nếu câu hỏi thực sự mơ hồ và người dùng không thể tiếp cận được, hãy mặc định chọn nhánh phù hợp hơn với code xung quanh (một module backend → logic; một trang hoặc component → UI) và nêu rõ giả định ở đầu prototype.

## Quy tắc áp dụng cho cả hai

1. **Dùng-một-lần-rồi-bỏ ngay từ ngày đầu tiên, và được đánh dấu rõ ràng.** Đặt code prototype gần nơi nó thực sự được sử dụng (bên cạnh module hoặc trang mà nó làm prototype) để ngữ cảnh được rõ ràng — nhưng đặt tên sao cho người đọc bình thường thấy đây là prototype, không phải sản phẩm chính thức. Đối với các route UI dùng-một-lần-rồi-bỏ, hãy tuân theo quy ước routing mà dự án đã sử dụng; không tự bịa ra cấu trúc cấp cao nhất mới.
2. **Cực kỳ dễ chạy.** Một UI prototype bắt đầu bằng một lệnh duy nhất trong task runner của dự án — `pnpm <name>`, `python <path>`, `bun <path>`, v.v. Một logic demo là một file HTML đơn lẻ mà người dùng chỉ cần nhấp đôi chuột. Dù theo cách nào, không cần phải suy nghĩ để khởi chạy.
3. **Mặc định không lưu trữ dữ liệu (no persistence).** Trạng thái nằm trong bộ nhớ. Lưu trữ dữ liệu là thứ mà prototype đang _kiểm tra_, chứ không phải thứ nó nên phụ thuộc vào. Nếu câu hỏi liên quan rõ ràng đến cơ sở dữ liệu, hãy truy cập vào một DB nháp hoặc một file cục bộ với tên rõ ràng "PROTOTYPE — wipe me".
4. **Bỏ qua phần trau chuốt.** Không viết test, không xử lý lỗi ngoài những gì làm cho prototype _chạy được_, không tạo abstraction. Mục tiêu là học được điều gì đó nhanh chóng.
5. **Bộc lộ trạng thái.** Sau mỗi hành động (logic) hoặc trên mỗi lần chuyển đổi biến thể (UI), hãy in hoặc hiển thị toàn bộ trạng thái liên quan để người dùng có thể thấy điều gì đã thay đổi.
6. **Ghi lại khi hoàn tất.** Gấp bất kỳ quyết định nào đã được xác minh vào code thật, sau đó ghi lại chính bản prototype như một **nguồn sơ cấp (primary source)**: commit nó vào một branch dùng-một-lần-rồi-bỏ, ngoài main, và để lại một con trỏ ngữ cảnh trỏ tới branch đó trên issue triển khai. Ghi lại cả câu trả lời — phán quyết và câu hỏi mà nó đã giải quyết — trong issue hoặc commit. Branch main chỉ giữ lại quyết định đã được xác minh.
