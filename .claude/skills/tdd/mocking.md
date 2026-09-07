# Khi nào nên Mock

Chỉ mock tại các **ranh giới hệ thống (system boundaries)**:

- Các API bên ngoài (thanh toán, email, v.v.)
- Cơ sở dữ liệu (đôi khi - ưu tiên dùng test DB)
- Thời gian / tính ngẫu nhiên (time/randomness)
- File system (đôi khi)

Đừng mock:

- Các class / module của chính bạn
- Các thành phần hợp tác nội bộ
- Bất kỳ thứ gì bạn kiểm soát

## Thiết kế để dễ Mock (Designing for Mockability)

Tại ranh giới hệ thống, hãy thiết kế các interface dễ mock:

**1. Dùng dependency injection**

Truyền các dependency bên ngoài vào thay vì tự khởi tạo chúng bên trong:

```typescript
// Dễ mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// Khó mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**2. Ưu tiên các interface dạng SDK hơn các bộ lấy dữ liệu chung (generic fetchers)**

Tạo các hàm cụ thể cho từng thao tác bên ngoài thay vì một hàm chung duy nhất chứa logic điều kiện:

```typescript
// TỐT: Mỗi hàm có thể mock một cách độc lập
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// XẤU: Mocking đòi hỏi logic điều kiện bên trong bản mock
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

Cách tiếp cận SDK nghĩa là:
- Mỗi mock trả về một hình dạng dữ liệu cụ thể
- Không có logic điều kiện trong phần thiết lập test (test setup)
- Dễ thấy endpoint nào mà một test đang thực thi
- An toàn về kiểu (type safety) cho từng endpoint
