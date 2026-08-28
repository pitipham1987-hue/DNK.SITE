# Định dạng CONTEXT.md

## Cấu trúc

```md
# {Tên Context}

{Mô tả một hoặc hai câu về context này là gì và tại sao nó tồn tại.}

## Language

**Order**:
{Mô tả một hoặc hai câu về thuật ngữ}
_Avoid_: Purchase, transaction

**Invoice**:
Một yêu cầu thanh toán gửi cho khách hàng sau khi giao hàng.
_Avoid_: Bill, payment request

**Customer**:
Một cá nhân hoặc tổ chức đặt đơn hàng.
_Avoid_: Client, buyer, account
```

## Quy tắc

- **Có chính kiến.** Khi có nhiều từ tồn tại cho cùng một khái niệm, hãy chọn từ tốt nhất và liệt kê những từ còn lại dưới `_Avoid_`.
- **Giữ định nghĩa chặt chẽ.** Tối đa một hoặc hai câu. Định nghĩa nó LÀ gì, không phải nó LÀM gì.
- **Chỉ đưa vào những thuật ngữ đặc thù cho context của dự án này.** Các khái niệm lập trình chung (timeout, kiểu lỗi, các mẫu tiện ích) không thuộc về đây dù dự án có dùng chúng nhiều đến đâu. Trước khi thêm một thuật ngữ, hãy hỏi: đây có phải là khái niệm riêng của context này, hay là một khái niệm lập trình chung? Chỉ cái trước mới thuộc về đây.
- **Nhóm các thuật ngữ dưới các heading phụ** khi các cụm tự nhiên xuất hiện. Nếu tất cả thuật ngữ thuộc về một khu vực gắn kết duy nhất, một danh sách phẳng cũng ổn.

## Repo đơn context vs đa context

**Đơn context (hầu hết các repo):** Một `CONTEXT.md` tại gốc repo.

**Đa context:** Một `CONTEXT-MAP.md` tại gốc repo liệt kê các context, chúng sống ở đâu, và chúng liên quan với nhau như thế nào:

```md
# Context Map

## Contexts

- [Ordering](./src/ordering/CONTEXT.md) — nhận và theo dõi đơn hàng của khách
- [Billing](./src/billing/CONTEXT.md) — tạo hóa đơn và xử lý thanh toán
- [Fulfillment](./src/fulfillment/CONTEXT.md) — quản lý việc lấy hàng và giao hàng tại kho

## Relationships

- **Ordering → Fulfillment**: Ordering phát ra sự kiện `OrderPlaced`; Fulfillment tiêu thụ chúng để bắt đầu lấy hàng
- **Fulfillment → Billing**: Fulfillment phát ra sự kiện `ShipmentDispatched`; Billing tiêu thụ chúng để tạo hóa đơn
- **Ordering ↔ Billing**: Các kiểu dùng chung cho `CustomerId` và `Money`
```

Skill này suy luận cấu trúc nào áp dụng:

- Nếu `CONTEXT-MAP.md` tồn tại, đọc nó để tìm các context
- Nếu chỉ có `CONTEXT.md` gốc tồn tại, đó là đơn context
- Nếu không có cái nào tồn tại, tạo một `CONTEXT.md` gốc một cách lười khi thuật ngữ đầu tiên được giải quyết

Khi có nhiều context tồn tại, hãy suy luận chủ đề hiện tại liên quan đến context nào. Nếu không rõ, hãy hỏi.
