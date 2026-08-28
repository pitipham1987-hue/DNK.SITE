# Thiết kế hai lần (Design It Twice)

Khi người dùng muốn khám phá các interface thay thế cho một ứng viên đào sâu đã chọn, hãy dùng mẫu sub-agent song song này. Dựa trên "Design It Twice" (Ousterhout) — ý tưởng đầu tiên của bạn khó có khả năng là tốt nhất.

Dùng từ vựng trong [SKILL.md](SKILL.md) — **module**, **interface**, **seam**, **adapter**, **leverage**.

## Quy trình

### 1. Đóng khung không gian bài toán

Trước khi sinh các sub-agent, hãy viết một giải thích hướng tới người dùng về không gian bài toán cho ứng viên đã chọn:

- Các ràng buộc mà bất kỳ interface mới nào cũng cần thỏa mãn
- Các dependency mà nó sẽ dựa vào, và chúng thuộc nhóm nào (xem [DEEPENING.md](DEEPENING.md))
- Một bản phác thảo code minh họa sơ bộ để làm cụ thể hóa các ràng buộc — không phải một đề xuất, chỉ là một cách để làm cho các ràng buộc trở nên cụ thể

Cho người dùng xem cái này, rồi ngay lập tức tiến sang Bước 2. Người dùng đọc và suy nghĩ trong khi các sub-agent làm việc song song.

### 2. Sinh các sub-agent

Sinh 3+ sub-agent song song. Mỗi cái phải tạo ra một interface **khác biệt triệt để** cho module đã đào sâu.

Đưa cho mỗi sub-agent một bản tóm tắt kỹ thuật riêng (đường dẫn file, chi tiết coupling, nhóm dependency từ [DEEPENING.md](DEEPENING.md), những gì nằm sau seam). Bản tóm tắt này độc lập với giải thích không gian bài toán hướng tới người dùng ở Bước 1. Cho mỗi agent một ràng buộc thiết kế khác nhau:

- Agent 1: "Tối thiểu hóa interface — nhắm tới tối đa 1–3 điểm truy cập (entry point). Tối đa hóa leverage trên mỗi điểm truy cập."
- Agent 2: "Tối đa hóa tính linh hoạt — hỗ trợ nhiều trường hợp sử dụng và khả năng mở rộng."
- Agent 3: "Tối ưu hóa cho caller phổ biến nhất — làm cho trường hợp mặc định trở nên đơn giản."
- Agent 4 (nếu áp dụng): "Thiết kế xoay quanh ports & adapters cho các dependency vượt seam."

Đưa vào bản tóm tắt cả từ vựng [SKILL.md](SKILL.md) lẫn từ vựng CONTEXT.md để mỗi sub-agent gọi tên mọi thứ nhất quán với ngôn ngữ kiến trúc và ngôn ngữ nghiệp vụ của dự án.

Mỗi sub-agent xuất ra:

1. Interface (kiểu, phương thức, tham số — cộng với các bất biến (invariant), thứ tự, các chế độ lỗi)
2. Ví dụ sử dụng cho thấy caller dùng nó như thế nào
3. Những gì việc triển khai giấu sau seam
4. Chiến lược dependency và các adapter (xem [DEEPENING.md](DEEPENING.md))
5. Đánh đổi — nơi leverage cao, nơi nó mỏng

### 3. Trình bày và so sánh

Trình bày các thiết kế theo tuần tự để người dùng có thể tiếp thu từng cái, sau đó so sánh chúng bằng văn xuôi. Đối chiếu theo **độ sâu (depth)** (leverage tại interface), **tính cục bộ (locality)** (nơi thay đổi tập trung), và **vị trí seam**.

Sau khi so sánh, đưa ra khuyến nghị của riêng bạn: bạn nghĩ thiết kế nào mạnh nhất và tại sao. Nếu các phần tử từ các thiết kế khác nhau có thể kết hợp tốt, hãy đề xuất một phương án lai (hybrid). Hãy có chính kiến — người dùng muốn một nhận định mạnh mẽ, không phải một thực đơn.
