---
name: prototype
description: Xây dựng một prototype dùng-một-lần (throwaway) để trả lời một câu hỏi thiết kế. Dùng khi người dùng muốn kiểm tra xem một state model hoặc logic có "cảm giác đúng" hay không, hoặc khám phá xem một UI nên trông như thế nào.
---

# Prototype

Một prototype là **code dùng-một-lần (throwaway) trả lời một câu hỏi**. Câu hỏi quyết định hình dạng.

## Chọn nhánh

Xác định câu hỏi nào đang được trả lời — từ prompt của người dùng, code xung quanh, hoặc bằng cách hỏi nếu người dùng đang có mặt:

- **"Logic / state model này có đúng không?"** → [LOGIC.md](LOGIC.md). Xây dựng một file HTML có thể chia sẻ duy nhất — các nút chơi tự do cộng với các walkthrough hướng dẫn dạng tab — đẩy state machine qua các trường hợp khó suy luận trên giấy, và một người không phải developer có thể tự điều khiển.
- **"Cái này nên trông như thế nào?"** → [UI.md](UI.md). Tạo ra nhiều biến thể UI khác nhau hoàn toàn trên cùng một route, có thể chuyển đổi qua một tham số tìm kiếm URL (URL search param) và một thanh nổi ở dưới cùng.

Hai nhánh tạo ra các artifact rất khác nhau — chọn sai sẽ lãng phí toàn bộ prototype. Nếu câu hỏi thực sự mơ hồ và không thể liên hệ được với người dùng, mặc định chọn nhánh phù hợp hơn với code xung quanh (một module backend → logic; một page hoặc component → UI) và nêu rõ giả định đó ở đầu prototype.

## Các quy tắc áp dụng cho cả hai

1. **Là đồ bỏ (throwaway) ngay từ ngày đầu, và được đánh dấu rõ ràng như vậy.** Đặt code prototype gần nơi nó thực sự sẽ được sử dụng (cạnh module hoặc page mà nó đang làm prototype cho) để ngữ cảnh rõ ràng — nhưng đặt tên nó sao cho một người đọc thông thường có thể thấy đó là prototype, không phải production. Với các route UI throwaway, tuân theo bất kỳ quy ước routing nào mà dự án đã có sẵn; đừng phát minh ra một cấu trúc top-level mới.
2. **Dễ dàng chạy đến mức tầm thường.** Một UI prototype khởi động từ một lệnh duy nhất trong task runner của dự án — `pnpm <name>`, `python <path>`, `bun <path>`, v.v. Một demo logic là một file HTML duy nhất mà người dùng double-click. Dù bằng cách nào, không cần suy nghĩ gì để bắt đầu.
3. **Không có persistence theo mặc định.** State sống trong bộ nhớ (in memory). Persistence là thứ mà prototype đang _kiểm tra_, không phải thứ nó nên phụ thuộc vào. Nếu câu hỏi rõ ràng liên quan đến database, hãy dùng một scratch DB hoặc một file local với tên rõ ràng kiểu "PROTOTYPE — wipe me" (PROTOTYPE — xóa tôi đi).
4. **Bỏ qua việc đánh bóng.** Không test, không xử lý lỗi ngoài mức cần thiết để prototype _chạy được_, không trừu tượng hóa (abstraction). Mục đích là học được điều gì đó thật nhanh.
5. **Phơi bày state.** Sau mỗi action (logic) hoặc mỗi lần chuyển biến thể (UI), in ra hoặc render toàn bộ state liên quan để người dùng thấy được điều gì đã thay đổi.
6. **Ghi lại khi hoàn tất.** Gấp mọi quyết định đã được xác thực vào code thật, sau đó ghi lại chính bản prototype như một **nguồn chính (primary source)**: commit nó vào một nhánh throwaway, ngoài nhánh main, và để lại một con trỏ ngữ cảnh (context pointer) đến nhánh đó trên issue triển khai. Cũng ghi lại câu trả lời — kết luận và câu hỏi mà nó đã giải quyết — trong issue hoặc một commit. Nhánh main chỉ giữ lại quyết định đã được xác thực.
