---
name: tdd
description: Phát triển hướng kiểm thử (Test-driven development). Dùng khi người dùng muốn xây dựng tính năng hoặc sửa lỗi theo hướng test-first, nhắc tới "red-green-refactor", hoặc muốn có integration test.
---

# Test-Driven Development

TDD là vòng lặp red → green. Skill này là tài liệu tham chiếu giúp vòng lặp đó tạo ra những test đáng để giữ lại: thế nào là một test tốt, test nên đặt ở đâu, các anti-pattern, và các quy tắc của vòng lặp. Mọi phần đều áp dụng cho mọi chu kỳ (cycle) — tham khảo chúng trước và trong khi thực hiện vòng lặp, không phải sau đó.

Khi khám phá codebase, đọc `CONTEXT.md` (nếu có) để tên test và từ vựng interface khớp với ngôn ngữ domain của dự án, và tôn trọng các ADR trong khu vực bạn đang động tới.

## Thế nào là một test tốt

Test xác minh hành vi (behavior) thông qua các interface công khai, không phải chi tiết triển khai (implementation detail). Mã nguồn có thể thay đổi hoàn toàn; test thì không nên. Một test tốt đọc như một bản đặc tả (specification) — "user can checkout with valid cart" cho bạn biết chính xác khả năng nào đang tồn tại — và sống sót qua các đợt refactor vì nó không quan tâm tới cấu trúc nội bộ.

Xem [tests.md](tests.md) để có ví dụ và [mocking.md](mocking.md) để biết hướng dẫn về mocking.

## Seam — nơi test được đặt

Một **seam** là ranh giới công khai mà bạn kiểm thử tại đó: interface nơi bạn quan sát hành vi mà không phải chạm vào bên trong. Test sống ở các seam, không bao giờ nhắm vào phần nội bộ.

**Chỉ test tại các seam đã được thống nhất từ trước.** Trước khi viết bất kỳ test nào, hãy viết ra các seam đang được kiểm thử và xác nhận chúng với người dùng. Không test nào được viết tại một seam chưa được xác nhận. Bạn không thể test mọi thứ — việc thống nhất các seam từ trước là cách để công sức test đổ vào các đường dẫn quan trọng (critical path) và logic phức tạp thay vì mọi trường hợp biên (edge case).

Hãy hỏi: "Interface công khai là gì, và những seam nào nên được test?"

Khi bản thân hình dạng của interface đó đang là câu hỏi — module đó sâu (deep) đến mức nào, seam nên nằm ở đâu, interface nên phơi bày điều gì — hãy gọi công cụ Skill với "codebase-design" để có từ vựng phù hợp. Đó là nguồn chung cho các thuật ngữ module, interface, depth, seam, adapter, leverage và locality, và nó là một tài liệu tham chiếu để tra cứu, không phải một phiên làm việc để chạy.

## Anti-pattern

- **Gắn chặt với implementation (Implementation-coupled)** — mock các collaborator nội bộ, test các phương thức private, hoặc xác minh qua một kênh phụ (side channel) (truy vấn database thay vì dùng interface). Dấu hiệu nhận biết: test bị hỏng khi bạn refactor dù hành vi không đổi.
- **Tautological (tự đúng theo cấu trúc)** — phần assertion tính lại giá trị kỳ vọng theo đúng cách mà code tính (`expect(add(a, b)).toBe(a + b)`, một snapshot được tính tay theo cùng cách, một hằng số được so sánh bằng chính nó), nên nó luôn pass do cấu trúc và không bao giờ có thể bất đồng với code. Giá trị kỳ vọng phải đến từ một nguồn sự thật độc lập (independent source of truth) — một giá trị literal đã biết là đúng, một ví dụ đã tính sẵn (worked example), bản spec.
- **Cắt lát theo chiều ngang (Horizontal slicing)** — viết tất cả test trước, rồi mới viết tất cả phần triển khai. Test viết hàng loạt xác minh hành vi _tưởng tượng_: bạn test _hình dạng_ của sự vật thay vì hành vi hướng tới người dùng, các test trở nên không nhạy với thay đổi thực sự, và bạn cam kết vào cấu trúc test trước khi hiểu phần triển khai. Thay vào đó hãy làm theo **lát cắt dọc (vertical slice)** — một test → một phần triển khai → lặp lại, mỗi test là một **viên đạn vạch đường (tracer bullet)** phản hồi lại những gì chu kỳ trước đã dạy cho bạn.

## Các quy tắc của vòng lặp

- **Red trước green.** Viết test thất bại trước, sau đó chỉ viết đủ code để nó pass. Đừng đoán trước các test tương lai hay thêm các tính năng suy đoán (speculative).
- **Mỗi lần một lát cắt.** Một seam, một test, một phần triển khai tối thiểu cho mỗi chu kỳ.
- **Refactor không phải là một phần của vòng lặp.** Nó thuộc về giai đoạn review (xem skill `code-review`), không phải chu kỳ triển khai red → green.
