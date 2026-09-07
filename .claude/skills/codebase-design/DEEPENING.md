# Đào sâu (Deepening)

Cách đào sâu một cụm module nông (shallow module) một cách an toàn, dựa trên các dependency của nó. Giả định bạn đã biết từ vựng trong [SKILL.md](SKILL.md) — **module**, **interface**, **seam**, **adapter**.

## Các nhóm dependency

Khi đánh giá một ứng viên để đào sâu, hãy phân loại các dependency của nó. Nhóm này quyết định cách module đã đào sâu được test qua seam của nó như thế nào.

### 1. Trong tiến trình (In-process)

Tính toán thuần túy, trạng thái trong bộ nhớ, không I/O. Luôn có thể đào sâu — gộp các module lại và test trực tiếp qua interface mới. Không cần adapter.

### 2. Có thể thay thế cục bộ (Local-substitutable)

Các dependency có bản thay thế test cục bộ (PGLite cho Postgres, filesystem trong bộ nhớ). Có thể đào sâu nếu bản thay thế tồn tại. Module đã đào sâu được test với bản thay thế chạy trong test suite. Seam là nội bộ; không có port ở interface bên ngoài của module.

### 3. Từ xa nhưng thuộc sở hữu (Remote but owned) (Ports & Adapters)

Các service của riêng bạn qua một ranh giới mạng (microservice, API nội bộ). Định nghĩa một **port** (interface) tại seam. Module sâu sở hữu logic; tầng truyền tải (transport) được tiêm (inject) vào như một **adapter**. Test dùng một adapter trong bộ nhớ. Production dùng một adapter HTTP/gRPC/queue.

Hình dạng khuyến nghị: *"Định nghĩa một port tại seam, triển khai một adapter HTTP cho production và một adapter trong bộ nhớ cho test, để logic nằm trong một module sâu duy nhất dù nó được triển khai qua mạng."*

### 4. Bên ngoài thực sự (True external) (Mock)

Các service bên thứ ba (Stripe, Twilio, v.v.) mà bạn không kiểm soát. Module đã đào sâu nhận dependency bên ngoài như một port được tiêm vào; test cung cấp một adapter mock.

## Kỷ luật về seam

- **Một adapter nghĩa là một seam giả định. Hai adapter nghĩa là một seam thực.** Đừng đưa vào một port trừ khi có ít nhất hai adapter là hợp lý (thường là production + test). Một seam chỉ có một adapter chỉ là một lớp gián tiếp (indirection) mà thôi.
- **Seam nội bộ vs seam bên ngoài.** Một module sâu có thể có các seam nội bộ (riêng tư với việc triển khai của nó, được dùng bởi test riêng của nó) cũng như seam bên ngoài tại interface của nó. Đừng phơi bày các seam nội bộ qua interface chỉ vì test dùng chúng.

## Chiến lược test: thay thế, đừng xếp chồng

- Các unit test cũ trên các module nông trở thành lãng phí một khi các test tại interface của module đã đào sâu tồn tại — hãy xóa chúng.
- Viết các test mới tại interface của module đã đào sâu. **Interface là bề mặt test**.
- Test khẳng định (assert) trên các kết quả có thể quan sát được qua interface, không phải trạng thái nội bộ.
- Test nên sống sót qua các lần refactor nội bộ — chúng mô tả hành vi, không phải cách triển khai. Nếu một test phải thay đổi khi việc triển khai thay đổi, nó đang test vượt qua interface.
