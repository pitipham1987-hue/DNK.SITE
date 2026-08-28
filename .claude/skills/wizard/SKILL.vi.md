---
name: wizard
description: Tạo ra một wizard bash tương tác dẫn dắt một con người qua các bước mà chỉ họ mới có thể thực hiện. Dùng khi cấp phát hạ tầng, thiết lập thông tin xác thực hoặc CI secret, dẫn dắt qua một dashboard bên thứ ba chưa quen thuộc, hoặc thực hiện một cuộc di chuyển (migration) hay chuyển đổi (cutover) một lần. Đừng gọi skill này cho các bước mà agent có thể tự thực hiện.
---

# Wizard

Một **wizard** là một script bash dẫn dắt một con người, từng bước một, qua một quy trình thủ công tẻ nhạt khi làm bằng tay và tẻ nhạt khi phải giải thích lại cho một AI mỗi lần. Nó mở từng URL, nói chính xác cần click và copy cái gì, thu thập các giá trị, ghi chúng vào nơi chúng thuộc về (`.env`, GitHub secret), xác nhận ở mỗi giai đoạn, và hiển thị còn bao nhiêu giai đoạn nữa. Nó có thể cấu hình các dịch vụ bên thứ ba, chạy một cuộc di chuyển một lần, hoặc chuyển project từ trạng thái này sang trạng thái khác.

Trải nghiệm người dùng thú vị đã được giải quyết sẵn bởi [template.sh](template.sh) — tiến trình theo từng giai đoạn, các cổng xác nhận, mở URL đa nền tảng (bao gồm cả WSL), nhập secret ẩn, upsert `.env` một cách idempotent, ghi `gh secret`/`gh variable`, và một bản tóm tắt kết thúc. **Công việc của bạn chỉ là định phạm vi cho quy trình và soạn các giai đoạn của nó.** Thư viện phía trên đánh dấu `STAGES` giống hệt nhau trong mọi wizard; sự nhất quán đó chính là điểm mấu chốt — đừng bao giờ chỉnh sửa nó bằng tay.

Một wizard mặc định là phù du (ephemeral) — được xây dựng cho một lần chạy, lưu vào đường dẫn scratch hoặc `scripts/`, bị xóa khi công việc xong. Chỉ commit nó khi người dùng muốn một đường dẫn thiết lập có thể lặp lại và nên tồn tại trong repo.

## Quy trình

### 1. Định phạm vi cho quy trình

Xác định mọi bước thủ công mà con người phải thực hiện và mọi giá trị được thu thập trong quá trình đó. Đọc repo trước — đừng hỏi ngay từ đầu:

- Đối với việc thiết lập: `.env`, `.env.example`, `.env.*`, `README`, `docker-compose*`, config của framework, và `.github/workflows/*` (mỗi tham chiếu `secrets.*` / `vars.*` là một giá trị mà wizard phải tạo ra).
- Đối với một cuộc di chuyển hoặc chuyển đổi: trạng thái hiện tại, trạng thái đích, và các hành động không thể đảo ngược ở giữa.

Sau đó hiển thị cho người dùng danh sách các giai đoạn theo thứ tự và các giá trị mỗi giai đoạn tạo ra, và xác nhận lại — họ có thể thêm, bớt, hoặc sắp xếp lại.

**Hoàn thành khi:** mọi giai đoạn được nêu tên theo thứ tự, và với mỗi giá trị được thu thập, bạn biết (a) con người lấy nó ở đâu, (b) nó được ghi vào đâu (`.env`, một GitHub secret, cả hai, hoặc không đâu cả — một số giai đoạn chỉ là hành động thuần túy), và (c) nó có phải là bí mật (nhập ẩn) hay công khai.

### 2. Vạch ra hành trình của mỗi giai đoạn

Với mỗi giai đoạn, viết ra con đường chính xác mà một con người sẽ đi theo: mở URL nào, làm gì ở đó, giá trị hiển thị ở đâu, nó điền vào biến nào — ví dụ: "Dashboard → Developers → API keys → Reveal test key → copy". Nơi bạn thực sự không biết giao diện hiện tại hoặc lệnh chính xác, hãy nói rõ điều đó và hỏi người dùng hoặc kiểm tra tài liệu — đừng bao giờ bịa ra các bước có thể không tồn tại.

**Hoàn thành khi:** mỗi giai đoạn dẫn tới các hướng dẫn cụ thể mà một người lạ có thể làm theo.

### 3. Soạn wizard

Sao chép `template.sh` tới đường dẫn đích. Thay thế giai đoạn ví dụ bằng một `stage` cho mỗi bước, theo thứ tự phụ thuộc. Dùng các hàm hỗ trợ trong thư viện — `stage`, `say`/`step`, `open_url`, `ask`/`ask_secret`, `write_env`, `set_secret`/`set_var`, `pause`/`confirm` — và đặt `TOTAL_STAGES` bằng số giai đoạn bạn đã viết.

Giữ đúng chuẩn mực mà template đặt ra: mở URL trước khi hỏi giá trị của nó, dùng `ask_secret` cho bất kỳ điều gì bí mật, `write_env` cho mọi giá trị được lưu trữ, `set_secret` chỉ với các giá trị mà CI thực sự cần, và `confirm` trước bất kỳ hành động không thể đảo ngược nào. Mỗi `stage` xóa màn hình để chỉ bước hiện tại được hiển thị — giữ mỗi giai đoạn tập trung vào một nhiệm vụ để không có gì con người cần bị trôi mất khỏi màn hình. Đừng đụng vào thư viện phía trên đánh dấu marker.

### 4. Xác minh và bàn giao

- `bash -n <script>`; chạy `shellcheck` nếu có.
- `chmod +x <script>`.
- Đừng tự chạy nó từ đầu đến cuối — nó mở trình duyệt và chờ đầu vào của con người. Thay vào đó hãy truy vết nó theo cách tĩnh (static): mọi giá trị từ bước 1 đều được thu thập và đi tới đúng nơi bước 1 đã nói, và mọi `set_secret` khớp chính xác với một tham chiếu `secrets.*` trong CI.
- Nói cho người dùng biết cách chạy nó. Nếu đây là một đường dẫn thiết lập có thể lặp lại, hãy commit nó và liên kết tới nó từ README để người tiếp theo chạy script thay vì hỏi một AI.
