# Test tốt và Test tệ

## Test tốt

**Kiểu tích hợp (Integration-style)**: Test thông qua các interface thật, không phải mock của các phần nội bộ.

```typescript
// TỐT: Test hành vi có thể quan sát được
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

Đặc điểm:

- Test hành vi mà người dùng/bên gọi (caller) quan tâm
- Chỉ dùng API công khai
- Sống sót qua các đợt refactor nội bộ
- Mô tả CÁI GÌ (WHAT), không phải LÀM THẾ NÀO (HOW)
- Một assertion logic cho mỗi test

## Test tệ

**Test chi tiết triển khai (Implementation-detail tests)**: Gắn chặt với cấu trúc nội bộ.

```typescript
// TỆ: Test chi tiết triển khai
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

Dấu hiệu cảnh báo:

- Mock các collaborator nội bộ
- Test các phương thức private
- Assertion trên số lần gọi/thứ tự gọi
- Test bị hỏng khi refactor dù hành vi không đổi
- Tên test mô tả LÀM THẾ NÀO (HOW) chứ không phải CÁI GÌ (WHAT)
- Xác minh bằng phương tiện bên ngoài thay vì qua interface

```typescript
// TỆ: Bỏ qua interface để xác minh
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// TỐT: Xác minh thông qua interface
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

**Test tự đúng theo cấu trúc (Tautological tests)**: Giá trị kỳ vọng nhắc lại (restate) chính phần triển khai, nên test luôn pass do cấu trúc.

```typescript
// TỆ: Giá trị kỳ vọng được tính lại đúng theo cách mà code tính
test("calculateTotal sums line items", () => {
  const items = [{ price: 10 }, { price: 5 }];
  const expected = items.reduce((sum, i) => sum + i.price, 0);
  expect(calculateTotal(items)).toBe(expected);
});

// TỐT: Giá trị kỳ vọng là một literal độc lập, đã biết trước
test("calculateTotal sums line items", () => {
  expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15);
});
```
