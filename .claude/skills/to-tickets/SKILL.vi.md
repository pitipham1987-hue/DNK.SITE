---
name: to-tickets
description: Chia một kế hoạch, spec, hoặc cuộc hội thoại hiện tại thành một tập hợp các ticket kiểu tracer-bullet, mỗi ticket khai báo các cạnh chặn (blocking edge) của nó, được xuất bản lên tracker đã cấu hình — các cạnh dưới dạng văn bản trong một file riêng cho mỗi ticket khi dùng local, hoặc các liên kết chặn (blocking link) gốc trên một tracker thực sự.
disable-model-invocation: true
---

# To Tickets

Chia một kế hoạch, spec, hoặc cuộc hội thoại thành một tập hợp các **ticket** — các lát cắt dọc (vertical slice) kiểu tracer-bullet, mỗi ticket khai báo các ticket **chặn (block)** nó.

Issue tracker và bộ từ vựng triage label lẽ ra đã được cung cấp cho bạn. Nếu chưa, hãy bảo người dùng chạy `/setup-matt-pocock-skills`.

## Quy trình

### 1. Thu thập ngữ cảnh

Làm việc dựa trên những gì đã có sẵn trong ngữ cảnh hội thoại. Nếu người dùng cung cấp một tham chiếu (đường dẫn spec, số hoặc URL issue) như một đối số, hãy lấy về và đọc toàn bộ nội dung cùng các comment của nó.

### 2. Khám phá codebase (tùy chọn)

Nếu bạn chưa khám phá codebase, hãy làm điều đó để hiểu trạng thái hiện tại của code. Tiêu đề và mô tả ticket nên dùng bộ từ vựng domain glossary của project, và tôn trọng các ADR trong khu vực bạn đang động đến.

Tìm kiếm cơ hội để prefactor (tái cấu trúc trước) code nhằm làm cho việc triển khai dễ dàng hơn. "Làm cho thay đổi trở nên dễ dàng, rồi mới thực hiện thay đổi dễ dàng đó."

### 3. Phác thảo các lát cắt dọc (vertical slice)

Chia công việc thành các ticket kiểu **tracer bullet**.

<vertical-slice-rules>

- Mỗi lát cắt đi qua một đường đi hẹp nhưng HOÀN CHỈNH qua mọi tầng (schema, API, UI, test) — dọc (vertical), KHÔNG phải một lát cắt ngang của một tầng
- Một lát cắt hoàn thành có thể được demo hoặc kiểm chứng độc lập
- Mỗi lát cắt được định cỡ để vừa với một context window mới hoàn toàn
- Mọi công việc prefactor nên được làm trước

</vertical-slice-rules>

Cho mỗi ticket các **cạnh chặn (blocking edge)** của nó — các ticket khác phải hoàn thành trước khi nó có thể bắt đầu. Một ticket không có blocker nào có thể bắt đầu ngay lập tức.

**Các refactor diện rộng là ngoại lệ đối với việc cắt lát dọc.** Một **wide refactor** (refactor diện rộng) là một thay đổi máy móc duy nhất — đổi tên một cột, đổi kiểu một symbol dùng chung — có **bán kính ảnh hưởng (blast radius)** lan tỏa khắp codebase, khiến một chỉnh sửa đơn lẻ làm hỏng hàng nghìn call site cùng lúc và không có lát cắt dọc nào có thể hoàn thành trót lọt (green). Đừng ép nó vào một tracer bullet; hãy sắp xếp nó theo kiểu **expand–contract** (mở rộng–thu hẹp). Đầu tiên expand: thêm dạng mới bên cạnh dạng cũ để không có gì bị hỏng. Sau đó di chuyển (migrate) các call site theo từng đợt, kích thước đợt tùy theo blast radius (theo package, theo thư mục), mỗi đợt là một ticket riêng bị chặn bởi bước expand, giữ CI luôn xanh (green) từ đợt này sang đợt khác vì dạng cũ vẫn còn tồn tại. Cuối cùng contract: xóa dạng cũ khi không còn caller nào, trong một ticket bị chặn bởi tất cả các đợt migrate. Khi ngay cả các đợt cũng không thể tự giữ xanh riêng lẻ, vẫn giữ trình tự đó nhưng để chúng dùng chung một integration branch, tất cả cùng chặn một ticket tích hợp-và-kiểm-chứng cuối cùng — trạng thái xanh chỉ được đảm bảo ở đó.

### 4. Hỏi ý kiến người dùng

Trình bày cấu trúc chia nhỏ đề xuất dưới dạng danh sách có đánh số. Với mỗi ticket, hiển thị:

- **Title**: tên mô tả ngắn gọn
- **Blocked by**: bị chặn bởi ticket nào khác (nếu có) phải hoàn thành trước
- **What it delivers**: hành vi đầu-cuối (end-to-end) mà ticket này làm cho hoạt động được

Hỏi người dùng:

- Độ chi tiết (granularity) có ổn không? (quá thô / quá mịn)
- Các cạnh chặn có chính xác không — mỗi ticket chỉ phụ thuộc vào những ticket thực sự làm điều kiện tiên quyết cho nó?
- Có ticket nào nên được gộp lại hoặc chia nhỏ thêm không?

Lặp lại cho đến khi người dùng chấp thuận cách chia.

### 5. Xuất bản các ticket lên tracker đã cấu hình

Xuất bản các ticket đã được chấp thuận. **Cách thức** phụ thuộc vào tracker mà `/setup-matt-pocock-skills` đã cấu hình — các ticket giống nhau ở cả hai trường hợp, chỉ hình dạng của các cạnh chặn thay đổi:

- **File local** → viết một file cho mỗi ticket trong `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, đánh số từ `01` theo thứ tự phụ thuộc (blocker trước). Mục "Blocked by" của mỗi file liệt kê các số/tiêu đề mà nó phụ thuộc vào. Dùng mẫu file ticket bên dưới - một ticket cho mỗi file, không bao giờ gộp vào một file duy nhất.
- **Một issue tracker thực sự (GitHub, Linear, …)** → xuất bản một issue cho mỗi ticket theo thứ tự phụ thuộc (blocker trước) để các cạnh chặn của mỗi ticket có thể tham chiếu tới các identifier thực. Dùng quan hệ blocking / sub-issue gốc (native) của nền tảng nếu có; nếu không thì đặt mục "Blocked by" của mỗi ticket trỏ tới các issue chặn nó. Áp dụng triage label `ready-for-agent` trừ khi được chỉ dẫn khác — các ticket được thiết kế để agent có thể nhặt lên làm ngay (agent-grabbable).

Làm việc trên **frontier** (biên): bất kỳ ticket nào mà tất cả blocker của nó đã hoàn thành. Với một chuỗi tuyến tính thuần túy, điều đó nghĩa là từ trên xuống dưới.

ĐỪNG đóng hoặc sửa đổi bất kỳ parent issue nào.

<local-ticket-template>

# <NN> — <Ticket title>

**What to build:** hành vi đầu-cuối mà ticket này làm cho hoạt động được, từ góc nhìn người dùng - không phải danh sách triển khai theo từng tầng.

**Blocked by:** số/tiêu đề của các ticket làm điều kiện tiên quyết cho ticket này, hoặc "None — can start immediately".

**Status:** ready-for-agent

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2

</local-ticket-template>

<issue-template>

## Parent

Tham chiếu tới parent issue trên tracker (nếu nguồn gốc là một issue có sẵn, nếu không thì bỏ mục này).

## What to build

Hành vi đầu-cuối mà ticket này làm cho hoạt động được, từ góc nhìn người dùng - không phải triển khai theo từng tầng.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocked by

- Tham chiếu tới từng ticket chặn nó, hoặc "None — can start immediately".

</issue-template>

Ở cả hai dạng, tránh dùng đường dẫn file cụ thể hoặc đoạn code - chúng nhanh chóng lỗi thời. Ngoại lệ: nếu một prototype tạo ra một đoạn code mã hóa một quyết định chính xác hơn văn xuôi có thể diễn đạt (state machine, reducer, schema, type shape), hãy chèn nó vào và ghi chú ngắn gọn rằng nó đến từ một prototype. Cắt gọn xuống chỉ những phần chứa quyết định — không phải một bản demo hoạt động đầy đủ, chỉ những phần quan trọng.
