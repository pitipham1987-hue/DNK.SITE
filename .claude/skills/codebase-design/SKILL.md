---
name: codebase-design
description: Từ vựng chung để thiết kế các module sâu (deep module). Dùng khi người dùng muốn thiết kế hoặc cải thiện interface của một module, tìm các cơ hội đào sâu, quyết định vị trí đặt một seam, làm cho code dễ test hơn hoặc dễ điều hướng hơn với AI, hoặc khi một skill khác cần từ vựng module-sâu.
---

# Codebase Design

Thiết kế các **module sâu (deep module)**: nhiều hành vi đằng sau một interface nhỏ, đặt tại một seam sạch, có thể test được qua interface đó. Dùng ngôn ngữ và các nguyên tắc này ở bất cứ đâu code đang được thiết kế hoặc tái cấu trúc. Mục tiêu là leverage cho caller, locality cho người bảo trì, và khả năng test cho tất cả mọi người.

## Bảng thuật ngữ

Dùng chính xác các thuật ngữ này — đừng thay bằng "component," "service," "API," hay "boundary." Ngôn ngữ nhất quán chính là trọng tâm.

**Module** — bất cứ thứ gì có một interface và một implementation. Cố tình không phân biệt theo quy mô: một hàm, class, package, hoặc một lát cắt trải dài qua nhiều tầng (tier). _Tránh_: unit, component, service.

**Interface** — mọi thứ mà một caller phải biết để dùng module đúng cách: chữ ký kiểu (type signature), mà còn cả các bất biến (invariant), các ràng buộc về thứ tự, chế độ lỗi, cấu hình bắt buộc, và đặc tính hiệu năng. _Tránh_: API, signature (quá hẹp — chúng chỉ chỉ đến bề mặt ở cấp kiểu).

**Implementation** — những gì bên trong một module, phần thân code của nó. Khác với **Adapter**: một thứ có thể là một adapter nhỏ với một implementation lớn (một repo Postgres) hoặc một adapter lớn với một implementation nhỏ (một bản giả trong bộ nhớ — in-memory fake). Dùng "adapter" khi seam là chủ đề; nếu không thì dùng "implementation".

**Depth (Độ sâu)** — leverage tại interface: lượng hành vi mà một caller (hoặc test) có thể sử dụng trên mỗi đơn vị interface mà họ phải học. Một module là **sâu (deep)** khi một lượng lớn hành vi nằm sau một interface nhỏ, **nông (shallow)** khi interface gần phức tạp bằng chính implementation.

**Seam** _(Michael Feathers)_ — một nơi bạn có thể thay đổi hành vi mà không cần sửa ngay tại đó; *vị trí* nơi interface của một module sống. Đặt seam ở đâu là một quyết định thiết kế riêng, khác với việc đặt gì đằng sau nó. _Tránh_: boundary (bị quá tải nghĩa với bounded context của DDD).

**Adapter** — một thứ cụ thể thỏa mãn một interface tại một seam. Mô tả *vai trò* (nó lấp vào chỗ nào), không phải *nội dung* (bên trong có gì).

**Leverage** — thứ caller nhận được từ depth: nhiều khả năng hơn trên mỗi đơn vị interface họ học. Một implementation trả công qua N điểm gọi và M test.

**Locality (Tính cục bộ)** — thứ người bảo trì nhận được từ depth: thay đổi, bug, kiến thức, và việc kiểm chứng tập trung ở một nơi thay vì lan ra khắp các caller. Sửa một lần, sửa ở khắp mọi nơi.

## Sâu vs nông

**Module sâu (Deep module)** = interface nhỏ + implementation nhiều:

```
┌─────────────────────┐
│   Small Interface   │  ← Ít phương thức, tham số đơn giản
├─────────────────────┤
│                     │
│  Deep Implementation│  ← Logic phức tạp được giấu đi
│                     │
└─────────────────────┘
```

**Module nông (Shallow module)** = interface lớn + implementation ít (tránh):

```
┌─────────────────────────────────┐
│       Large Interface           │  ← Nhiều phương thức, tham số phức tạp
├─────────────────────────────────┤
│  Thin Implementation            │  ← Chỉ chuyển tiếp
└─────────────────────────────────┘
```

Khi thiết kế một interface, hãy hỏi:

- Tôi có thể giảm số lượng phương thức không?
- Tôi có thể đơn giản hóa các tham số không?
- Tôi có thể giấu thêm nhiều độ phức tạp bên trong không?

## Các nguyên tắc

- **Depth là một thuộc tính của interface, không phải của implementation.** Một module sâu có thể được cấu thành nội bộ từ các phần nhỏ, có thể mock, có thể hoán đổi — chúng chỉ đơn giản là không thuộc về interface. Một module có thể có các **seam nội bộ** (riêng tư với việc triển khai của nó, được dùng bởi test riêng của nó) cũng như **seam bên ngoài** tại interface của nó.
- **Phép thử xóa bỏ (deletion test).** Hãy tưởng tượng xóa module đi. Nếu độ phức tạp biến mất, nó chỉ là một lớp chuyển tiếp (pass-through). Nếu độ phức tạp xuất hiện lại ở N caller, nó đang xứng đáng với vị trí của mình.
- **Interface là bề mặt test.** Caller và test đi qua cùng một seam. Nếu bạn muốn test *vượt qua* interface, module có lẽ đang sai hình dạng.
- **Một adapter nghĩa là một seam giả định. Hai adapter nghĩa là một seam thực.** Đừng đưa vào một seam trừ khi thực sự có thứ gì đó biến đổi qua nó.

## Thiết kế để dễ test

Các interface tốt làm cho việc test trở nên tự nhiên:

1. **Nhận dependency, đừng tự tạo ra chúng.**

   ```typescript
   // Dễ test
   function processOrder(order, paymentGateway) {}

   // Khó test
   function processOrder(order) {
     const gateway = new StripeGateway();
   }
   ```

2. **Trả về kết quả, đừng tạo hiệu ứng phụ (side effect).**

   ```typescript
   // Dễ test
   function calculateDiscount(cart): Discount {}

   // Khó test
   function applyDiscount(cart): void {
     cart.total -= discount;
   }
   ```

3. **Bề mặt nhỏ.** Ít phương thức hơn = ít test cần hơn. Ít tham số hơn = thiết lập test đơn giản hơn.

## Các mối quan hệ

- Một **Module** có đúng một **Interface** (bề mặt nó trình bày cho caller và test).
- **Depth** là một thuộc tính của một **Module**, được đo dựa trên **Interface** của nó.
- Một **Seam** là nơi **Interface** của một **Module** sống.
- Một **Adapter** ngồi tại một **Seam** và thỏa mãn **Interface**.
- **Depth** tạo ra **Leverage** cho caller và **Locality** cho người bảo trì.

## Các cách đóng khung bị bác bỏ

- **Depth như tỷ lệ số dòng implementation trên số dòng interface** (Ousterhout): thưởng cho việc độn thêm implementation. Thay vào đó chúng ta dùng depth-như-leverage.
- **"Interface" như từ khóa `interface` của TypeScript hoặc các phương thức public của một class**: quá hẹp — interface ở đây bao gồm mọi sự kiện mà một caller phải biết.
- **"Boundary"**: bị quá tải nghĩa với bounded context của DDD. Hãy dùng **seam** hoặc **interface**.

## Đi sâu hơn

- **Đào sâu một cụm dựa trên dependency của nó** — xem [DEEPENING.md](DEEPENING.md): các nhóm dependency, kỷ luật về seam, và cách test thay-thế-đừng-xếp-chồng.
- **Khám phá các interface thay thế** — xem [DESIGN-IT-TWICE.md](DESIGN-IT-TWICE.md): khởi động các sub-agent song song để thiết kế interface theo nhiều cách khác biệt triệt để, rồi so sánh dựa trên depth, locality, và vị trí seam.
