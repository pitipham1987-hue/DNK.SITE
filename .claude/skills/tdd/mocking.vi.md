# Khi nào nên Mock

Chỉ mock tại **ranh giới hệ thống (system boundaries)**:

- Các API bên ngoài (thanh toán, email, v.v.)
- Database (đôi khi - ưu tiên dùng test DB)
- Thời gian/tính ngẫu nhiên
- Hệ thống file (đôi khi)

Đừng mock:

- Các class/module của chính bạn
- Các collaborator nội bộ
- Bất cứ thứ gì bạn kiểm soát được

## Thiết kế để dễ Mock (Mockability)

Tại ranh giới hệ thống, thiết kế các interface dễ mock:

**1. Dùng dependency injection**

Truyền các dependency bên ngoài vào thay vì tạo chúng ở bên trong:

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

**2. Ưu tiên interface kiểu SDK hơn là các hàm fetch chung chung**

Tạo các hàm riêng cho từng thao tác bên ngoài thay vì một hàm chung với logic điều kiện:

```typescript
// TỐT: Mỗi hàm có thể mock độc lập
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// TỆ: Việc mock đòi hỏi logic điều kiện bên trong mock
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

Cách tiếp cận kiểu SDK có nghĩa là:
- Mỗi mock trả về một hình dạng (shape) cụ thể duy nhất
- Không có logic điều kiện trong phần thiết lập test (test setup)
- Dễ dàng nhận biết test nào đang tác động tới endpoint nào
- Có type safety cho từng endpoint
