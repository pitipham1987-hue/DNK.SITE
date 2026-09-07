---
name: to-tickets
description: Tách một kế hoạch, spec, hoặc cuộc hội thoại hiện tại thành một tập hợp các ticket dạng tracer-bullet, mỗi ticket khai báo các cạnh chặn (blocking edges) của nó, được xuất bản lên tracker đã cấu hình — các cạnh dưới dạng văn bản trong một file cho mỗi ticket cục bộ, hoặc các liên kết chặn gốc trên một tracker thực sự.
disable-model-invocation: true
---

# To Tickets

Tách một kế hoạch, spec, hoặc cuộc hội thoại thành một tập hợp các **ticket** — các lát cắt dọc dạng tracer-bullet, mỗi ticket khai báo các ticket **chặn (block)** nó.

Từ vựng nhãn triage và issue tracker lẽ ra đã được cung cấp cho bạn. Nếu chưa, hãy báo người dùng chạy `/setup-matt-pocock-skills`.

## Quy trình

### 1. Thu thập ngữ cảnh

Làm việc từ bất kỳ điều gì đã có trong ngữ cảnh hội thoại. Nếu người dùng truyền vào một tham chiếu (một đường dẫn spec, một số issue hoặc URL) dưới dạng một đối số, hãy lấy về và đọc toàn bộ phần body và comments của nó.

### 2. Khám phá codebase (tùy chọn)

Nếu bạn chưa khám phá codebase, hãy làm vậy để hiểu trạng thái hiện tại của code. Tiêu đề và mô tả của ticket nên sử dụng từ vựng trong bảng thuật ngữ domain của dự án, và tôn trọng các ADR trong khu vực bạn đang chạm vào.

Tìm kiếm các cơ hội tái cấu trúc trước (prefactor) code để làm cho việc triển khai dễ dàng hơn. "Làm cho thay đổi trở nên dễ dàng, sau đó hãy thực hiện thay đổi dễ dàng đó."

### 3. Phác thảo các lát cắt dọc

Tách công việc thành các ticket dạng **tracer bullet**.

<vertical-slice-rules>

- Mỗi lát cắt cắt một đường hẹp nhưng HOÀN CHỈNH xuyên qua mọi tầng (schema, API, UI, tests) — theo chiều dọc, KHÔNG phải một lát cắt ngang của một tầng
- Một lát cắt hoàn thành có thể demo được hoặc xác minh được một cách độc lập
- Mỗi lát cắt được định kích thước để vừa vặn trong một cửa sổ ngữ cảnh mới duy nhất
- Bất kỳ việc tái cấu trúc trước nào cũng nên được thực hiện đầu tiên

</vertical-slice-rules>

Ghi cho mỗi ticket các **cạnh chặn (blocking edges)** của nó — các ticket khác phải hoàn thành trước khi nó có thể bắt đầu. Một ticket không có blocker nào có thể bắt đầu ngay lập tức.

**Các đợt refactor diện rộng là ngoại lệ đối với việc cắt lát dọc.** Một **đợt refactor diện rộng** là một thay đổi cơ học — đổi tên một cột, đổi kiểu của một symbol dùng chung — mà **bán kính ảnh hưởng (blast radius)** của nó xòe ra khắp toàn bộ codebase, nên một chỉnh sửa duy nhất làm hỏng hàng ngàn điểm gọi cùng một lúc và không lát cắt dọc nào có thể cập bến màu xanh được. Đừng ép nó thành một tracer bullet; hãy xếp trình tự nó dưới dạng **mở rộng–thu hẹp (expand–contract)**. Đầu tiên mở rộng: thêm dạng mới bên cạnh dạng cũ để không gì bị hỏng. Sau đó di trú các điểm gọi theo từng đợt được định kích thước theo bán kính ảnh hưởng (theo package, theo thư mục), mỗi đợt là một ticket riêng bị chặn bởi bước mở rộng, giữ cho CI xanh từ đợt này sang đợt khác vì dạng cũ vẫn tồn tại. Cuối cùng thu hẹp: xóa dạng cũ khi không còn caller nào còn lại, trong một ticket bị chặn bởi mọi đợt di trú. Ngay cả khi các đợt di trú không thể tự giữ màu xanh một mình, hãy giữ nguyên trình tự nhưng để chúng chia sẻ một branch tích hợp mà tất cả đều chặn một ticket tích-hợp-và-xác-minh cuối cùng — màu xanh chỉ được hứa hẹn ở đó.

### 4. Đặt câu hỏi cho người dùng

Trình bày sự phân chia đề xuất dưới dạng một danh sách được đánh số. Đối với mỗi ticket, hiển thị:

- **Tiêu đề**: tên mô tả ngắn gọn
- **Blocked by**: các ticket khác nào (nếu có) phải hoàn thành trước
- **Những gì nó giao (What it delivers)**: hành vi end-to-end mà ticket này làm cho chạy được

Hỏi người dùng:

- Độ chi tiết có cảm giác đúng không? (quá thô / quá mịn)
- Các cạnh chặn có chính xác không — mỗi ticket chỉ phụ thuộc vào các ticket thực sự chặn nó chứ?
- Có ticket nào nên được gộp lại hoặc tách nhỏ hơn nữa không?

Lặp lại cho đến khi người dùng phê duyệt sự phân chia.

### 5. Xuất bản các ticket lên tracker đã cấu hình

Xuất bản các ticket đã được phê duyệt. **Cách thực hiện** phụ thuộc vào tracker mà `/setup-matt-pocock-skills` đã cấu hình — các ticket là giống nhau theo cả hai cách, chỉ có hình dạng của các cạnh chặn thay đổi:

- **File cục bộ** → ghi một file cho mỗi ticket dưới `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, đánh số từ `01` theo thứ tự phụ thuộc (các blocker trước). Phần "Blocked by" của mỗi file liệt kê các số/tiêu đề mà nó phụ thuộc vào. Dùng mẫu file theo từng ticket bên dưới — một ticket một file, không bao giờ là một file gộp duy nhất.
- **Một issue tracker thực sự (GitHub, Linear, …)** → xuất bản một issue cho mỗi ticket theo thứ tự phụ thuộc (các blocker trước) để các cạnh chặn của mỗi ticket có thể tham chiếu các định danh thực tế. Dùng mối quan hệ blocking / sub-issue gốc của nền tảng nơi nó có sẵn; nếu không hãy đặt "Blocked by" của mỗi ticket thành các issue chặn. Áp dụng nhãn triage `ready-for-agent` trừ khi được hướng dẫn khác — các ticket sẵn sàng cho agent lấy theo cấu trúc.

Làm việc trên **đường biên (frontier)**: bất kỳ ticket nào có các blocker đều đã xong. Đối với một chuỗi tuyến tính thuần túy, điều đó có nghĩa là từ trên xuống dưới.

Đừng đóng hoặc sửa đổi bất kỳ issue cha nào.

<local-ticket-template>

# <NN> — <Tiêu đề ticket>

**Những gì cần dựng:** hành vi end-to-end mà ticket này làm cho chạy được, từ góc nhìn của người dùng — không phải danh sách triển khai từng tầng một.

**Blocked by:** số/tiêu đề của các ticket chặn ticket này, hoặc "None — can start immediately".

**Status:** ready-for-agent

- [ ] Tiêu chí chấp nhận 1
- [ ] Tiêu chí chấp nhận 2

</local-ticket-template>

<issue-template>

## Parent

Một tham chiếu tới issue cha trên tracker (nếu nguồn là một issue hiện có, nếu không thì bỏ mục này).

## Những gì cần dựng

Hành vi end-to-end mà ticket này làm cho chạy được, từ góc nhìn của người dùng — không phải triển khai từng tầng một.

## Tiêu chí chấp nhận

- [ ] Tiêu chí 1
- [ ] Tiêu chí 2

## Blocked by

- Một tham chiếu tới từng ticket chặn, hoặc "None — can start immediately".

</issue-template>

Trong cả hai định dạng, hãy tránh các đường dẫn file cụ thể hoặc code snippet — chúng nhanh chóng lỗi thời. Ngoại lệ: nếu một prototype tạo ra một snippet mã hóa một quyết định chính xác hơn văn xuôi có thể làm (state machine, reducer, schema, type shape), hãy đưa nó vào nội tuyến và ghi chú ngắn gọn rằng nó đến từ một prototype. Cắt gọt còn lại các phần giàu quyết định — không phải một bản demo đang chạy, chỉ là các phần quan trọng.
