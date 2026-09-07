---
name: tdd
description: Phát triển hướng kiểm thử (Test-driven development). Dùng khi người dùng muốn xây dựng tính năng hoặc sửa bug theo hướng test-first, nhắc đến "red-green-refactor", hoặc muốn viết integration tests.
---

# Phát triển Hướng Kiểm thử (Test-Driven Development)

TDD là vòng lặp đỏ (red) → xanh (green). Skill này là tài liệu tham chiếu giúp vòng lặp đó tạo ra các test đáng giữ lại: một test tốt là gì, các test nằm ở đâu, các mẫu chống lại (anti-patterns), và các quy tắc của vòng lặp. Mọi phần đều áp dụng trên mỗi chu kỳ — hãy tham khảo chúng trước và trong vòng lặp, không phải sau đó.

Khi khám phá codebase, hãy đọc `CONTEXT.md` (nếu có) để tên test và từ vựng interface khớp với ngôn ngữ nghiệp vụ của dự án, và tôn trọng các ADR trong khu vực bạn đang chạm vào.

## Một test tốt là gì

Các test xác minh hành vi thông qua các interface công khai, không phải chi tiết triển khai. Code có thể thay đổi hoàn toàn; test thì không nên. Một test tốt đọc như một bản tả kỹ thuật (specification) — "user có thể thanh toán với giỏ hàng hợp lệ" cho bạn biết chính xác khả năng nào tồn tại — và sống sót qua các đợt refactor vì nó không quan tâm đến cấu trúc nội bộ.

Xem [tests.md](tests.md) để biết các ví dụ và [mocking.md](mocking.md) để biết hướng dẫn về cách mock.

## Seams — nơi các test nằm

Một **seam** là ranh giới công khai mà bạn test tại đó: interface nơi bạn quan sát hành vi mà không cần chui vào bên trong. Các test sống tại các seam, không bao giờ test trực tiếp phần nội bộ.

**Chỉ test tại các seam đã thống nhất trước.** Trước khi viết bất kỳ test nào, hãy ghi ra các seam được test và xác nhận chúng với người dùng. Không có test nào được viết tại một seam chưa được xác nhận. Bạn không thể test mọi thứ — thống nhất các seam ngay từ đầu là cách để công sức kiểm thử rơi đúng vào các đường dẫn quan trọng và logic phức tạp thay vì mọi trường hợp biên.

Hãy hỏi: "Interface công khai là gì, và chúng ta nên test những seam nào?"

Khi chính hình dạng của interface đó đang bị đặt nghi vấn — module sâu đến mức nào, seam thuộc về đâu, interface nên bộc lộ những gì — hãy gọi tool Skill với "codebase-design" để lấy từ vựng. Nó là nguồn chung cho các thuật ngữ module, interface, depth, seam, adapter, leverage và locality, và là một tài liệu tham chiếu để tra cứu, không phải một phiên làm việc để chạy.

## Mẫu chống lại (Anti-patterns)

- **Gắn chặt với việc triển khai (Implementation-coupled)** — mock các thành phần hợp tác nội bộ, test các phương thức private, hoặc xác minh qua một kênh phụ (truy vấn database thay vì dùng interface). Dấu hiệu nhận biết: test bị hỏng khi bạn refactor dù hành vi không hề thay đổi.
- **Táo bạo tự chứng minh (Tautological)** — câu khẳng định tính toán lại giá trị kỳ vọng theo đúng cách code làm (`expect(add(a, b)).toBe(a + b)`, một snapshot được tạo thủ công theo cùng một cách, một hằng số được khẳng định bằng chính nó), nên nó pass theo đúng định nghĩa và không bao giờ có thể bất đồng với code. Giá trị kỳ vọng phải đến từ một nguồn chân lý độc lập — một giá trị hằng số đã biết là đúng, một ví dụ đã được tính toán, hoặc bản spec.
- **Cắt lát ngang (Horizontal slicing)** — viết tất cả các test trước, sau đó mới viết tất cả phần triển khai. Viết test hàng loạt sẽ xác minh hành vi _tưởng tượng_: bạn test *hình dạng* của sự vật thay vì hành vi hướng tới người dùng, các test trở nên trơ với những thay đổi thực sự, và bạn cam kết với cấu trúc test trước khi hiểu việc triển khai. Thay vào đó hãy làm việc theo **các lát cắt dọc (vertical slices)** — một test → một triển khai → lặp lại, mỗi test là một **tracer bullet** phản hồi lại những gì chu kỳ trước đã dạy cho bạn.

## Quy tắc của vòng lặp

- **Đỏ trước xanh (Red before green).** Viết test thất bại trước, sau đó chỉ viết đủ code để làm cho nó pass. Đừng dự đoán các test trong tương lai hoặc thêm các tính năng mang tính suy đoán.
- **Mỗi lần một lát cắt.** Một seam, một test, một triển khai tối thiểu cho mỗi chu kỳ.
- **Refactoring không phải là một phần của vòng lặp.** Nó thuộc về giai đoạn review (xem skill `code-review`), không thuộc về chu kỳ triển khai đỏ → xanh.
