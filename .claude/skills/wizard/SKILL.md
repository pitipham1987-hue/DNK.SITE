---
name: wizard
description: Tạo một bash wizard tương tác để hướng dẫn con người qua các bước mà chỉ có họ mới có thể thực hiện. Sử dụng khi khởi tạo hạ tầng, thiết lập credentials hoặc CI secrets, hướng dẫn qua một dashboard bên thứ ba xa lạ, hoặc chạy một đợt di chuyển/chuyển giao một lần. Không gọi skill này cho các bước mà agent có thể tự thực hiện.
---

# Wizard

Một **wizard** là một bash script hướng dẫn con người, từng bước một, qua một quy trình thủ công tốn thời gian nếu làm bằng tay và phiền phức nếu phải giải thích lại cho AI mỗi lần. Nó mở từng URL, nói chính xác những gì cần nhấp và sao chép, thu thập các giá trị, ghi chúng vào nơi thuộc về (`.env`, GitHub secrets), xác nhận ở mỗi giai đoạn, và hiển thị còn bao nhiêu giai đoạn nữa. Nó có thể cấu hình các dịch vụ bên thứ ba, chạy một đợt migration một lần, hoặc chuyển dự án từ trạng thái này sang trạng thái khác.

UX tuyệt vời đã được giải quyết sẵn bởi [template.sh](template.sh) — tiến trình theo từng giai đoạn, các cổng xác nhận, mở URL đa nền tảng (bao gồm cả WSL), nhập secret bị ẩn, ghi đè `.env` an toàn (idempotent), ghi `gh secret`/`gh variable`, và phần tóm tắt kết thúc. **Nhiệm vụ của bạn chỉ là xác định phạm vi quy trình và soạn thảo các giai đoạn của nó.** Thư viện phía trên đánh dấu `STAGES` là giống hệt nhau trong mọi wizard; sự nhất quán đó là điểm mấu chốt — không bao giờ chỉnh sửa thủ công phần đó.

Một wizard mặc định là tạm thời (ephemeral) — được xây dựng cho một lần chạy, lưu vào đường dẫn nháp hoặc `scripts/`, xóa khi công việc hoàn thành. Chỉ commit nó khi người dùng muốn có một đường dẫn thiết lập có thể lặp lại và nên sống trong repo.

## Quy trình (Process)

### 1. Xác định phạm vi quy trình (Scope the procedure)

Xác định mọi bước thủ công mà con người phải thực hiện và mọi giá trị được thu thập trong suốt quá trình. Đọc repo trước — không hỏi bừa:

- Đối với thiết lập: `.env`, `.env.example`, `.env.*`, `README`, `docker-compose*`, cấu hình framework, và `.github/workflows/*` (mỗi tham chiếu `secrets.*` / `vars.*` là một giá trị mà wizard phải tạo ra).
- Đối với đợt di chuyển hoặc chuyển đổi: trạng thái hiện tại, trạng thái mục tiêu, và các hành động không thể đảo ngược giữa chúng.

Sau đó hiển thị cho người dùng danh sách các giai đoạn đã được sắp xếp theo thứ tự và các giá trị mà mỗi giai đoạn tạo ra, và xác nhận — họ có thể thêm, bớt hoặc sắp xếp lại.

**Hoàn thành khi:** mỗi giai đoạn được đặt tên theo thứ tự, và đối với mỗi giá trị thu thập được bạn biết (a) con người lấy nó ở đâu, (b) nó được ghi vào đâu (`.env`, GitHub secret, cả hai, hoặc không đâu cả — một số giai đoạn chỉ là hành động thuần túy), và (c) liệu nó có phải secret (nhập bị ẩn) hay công khai.

### 2. Lập bản đồ hành trình của từng giai đoạn (Map each stage's journey)

Đối với mỗi giai đoạn, hãy viết đường dẫn chính xác mà con người tuân theo: URL nào cần mở, cần làm gì ở đó, giá trị được hiển thị ở đâu, biến nào sẽ lưu nó — ví dụ: "Dashboard → Developers → API keys → Reveal test key → copy". Ở những nơi bạn thực sự không biết UI hiện tại hoặc lệnh chính xác, hãy nói rõ và hỏi người dùng hoặc kiểm tra tài liệu — không bao giờ bịa ra các bước có thể không tồn tại.

**Hoàn thành khi:** mỗi giai đoạn đều dẫn tới các hướng dẫn cụ thể mà một người lạ cũng có thể làm theo.

### 3. Soạn thảo wizard (Author the wizard)

Sao chép `template.sh` sang đường dẫn mục tiêu. Thay thế giai đoạn ví dụ bằng một `stage` cho mỗi bước, theo thứ tự phụ thuộc. Sử dụng các hàm trợ giúp của thư viện — `stage`, `say`/`step`, `open_url`, `ask`/`ask_secret`, `write_env`, `set_secret`/`set_var`, `pause`/`confirm` — và đặt `TOTAL_STAGES` thành số lượng giai đoạn bạn đã viết.

Giữ đúng tiêu chuẩn mà template đặt ra: mở URL trước khi hỏi giá trị của nó, sử dụng `ask_secret` cho bất kỳ điều gì bí mật, `write_env` cho mọi giá trị được lưu trữ lâu dài, `set_secret` chỉ cho các giá trị mà CI thực sự cần, và `confirm` trước bất kỳ hành động không thể đảo ngược nào. Mỗi `stage` sẽ xóa màn hình để chỉ có bước hiện tại được hiển thị — giữ cho một stage tập trung vào một nhiệm vụ để nội dung con người cần không bị cuộn mất. Không chạm vào thư viện phía trên dòng đánh dấu.

### 4. Xác minh và bàn giao (Verify and hand off)

- `bash -n <script>`; chạy `shellcheck` nếu có sẵn.
- `chmod +x <script>`.
- Đừng tự mình chạy nó từ đầu đến cuối — nó mở trình duyệt và bị chặn để chờ đầu vào của con người. Hãy kiểm tra tĩnh (statically): mọi giá trị từ bước 1 đều được thu thập và ghi đúng nơi bước 1 đã chỉ định, và mỗi tên `set_secret` khớp chính xác với tham chiếu `secrets.*` trong CI.
- Hướng dẫn người dùng cách chạy nó. Nếu đó là một quy trình thiết lập có thể lặp lại, hãy commit nó và chèn link từ README để người tiếp theo chạy script thay vị đi hỏi AI.
