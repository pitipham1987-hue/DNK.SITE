---
name: improve-codebase-architecture
description: Quét một codebase để tìm các cơ hội "deepening" (đào sâu), trình bày chúng dưới dạng một báo cáo HTML trực quan, sau đó "grill" (chất vấn kỹ) về bất kỳ cái nào được chọn.
disable-model-invocation: true
---

# Cải thiện kiến trúc codebase (Improve Codebase Architecture)

Đưa ra ánh sáng những điểm ma sát về kiến trúc và đề xuất các **cơ hội deepening (đào sâu)** — các refactor biến module shallow thành module deep. Mục tiêu là khả năng test (testability) và khả năng AI có thể điều hướng (AI-navigability).

Command này được _thông tin (informed)_ bởi mô hình domain của dự án và được xây dựng trên một bộ từ vựng thiết kế chung:

- Gọi tool Skill với "codebase-design" để lấy bộ từ vựng kiến trúc (**module**, **interface**, **depth**, **seam**, **adapter**, **leverage**, **locality**) và các nguyên tắc của nó (deletion test, "interface là bề mặt test", "một adapter = seam giả định, hai = seam thật"). Dùng chính xác các thuật ngữ này trong mọi đề xuất — đừng trôi sang "component," "service," "API," hay "boundary."
- Ngôn ngữ domain trong `CONTEXT.md` đặt tên cho các seam tốt; các ADR trong `docs/adr/` ghi lại các quyết định mà command này không nên tranh cãi lại.

## Quy trình

### 1. Khám phá (Explore)

**Xác định phạm vi trước khi quét — YAGNI.** Việc deepening một module chỉ có lợi khi nó làm cho các thay đổi trong tương lai đối với module đó trở nên dễ dàng hơn, vì vậy hãy đặt trọng số cao hơn cho các phần của codebase đã thay đổi gần đây. Quyết định *nơi cần nhìn* trước khi nhìn:

- Nếu người dùng đã nêu tên một hướng — một module, một hệ thống con, một điểm đau — hãy dùng nó, và bỏ qua phần suy luận bên dưới.
- Nếu không, hãy lùi lại một khoảng lịch sử commit đáng kể (`git log --oneline`) để tìm các điểm nóng (hot spots) của codebase — những file và khu vực liên tục xuất hiện — và để các đường dẫn đó thu hút sự chú ý của bạn trước tiên. Nếu các thay đổi rải rác không có điểm nóng rõ ràng, hãy mở rộng phạm vi.

Đọc bảng thuật ngữ domain của dự án (`CONTEXT.md`) và bất kỳ ADR nào trong khu vực bạn đang động tới trước.

Sau đó triển khai một sub-agent để đi khắp codebase. Đừng theo các heuristic cứng nhắc — khám phá một cách tự nhiên và ghi lại nơi bạn cảm thấy có ma sát:

- Ở đâu việc hiểu một khái niệm đòi hỏi phải nhảy qua lại giữa nhiều module nhỏ?
- Ở đâu các module bị **shallow** — interface gần bằng độ phức tạp của implementation?
- Ở đâu các hàm thuần túy (pure function) đã được tách ra chỉ vì mục đích testability, nhưng các bug thật lại ẩn trong cách chúng được gọi (không có **locality**)?
- Ở đâu các module bị coupling chặt rò rỉ qua seam của chúng?
- Những phần nào của codebase chưa được test, hoặc khó test qua interface hiện tại của chúng?

Áp dụng **deletion test** cho bất cứ thứ gì bạn nghi ngờ là shallow: nếu xóa nó đi thì độ phức tạp sẽ tập trung lại, hay chỉ di chuyển đi nơi khác? "Có, tập trung lại" chính là tín hiệu bạn đang tìm.

### 2. Trình bày các ứng viên dưới dạng báo cáo HTML

Viết một file HTML tự chứa (self-contained) vào thư mục temp của hệ điều hành để không có gì lọt vào repo. Xác định thư mục temp từ `$TMPDIR`, nếu không có thì dùng `/tmp` (hoặc `%TEMP%` trên Windows), và ghi vào `<tmpdir>/architecture-review-<timestamp>.html` để mỗi lần chạy đều có một file mới. Mở nó ra cho người dùng — `xdg-open <path>` trên Linux, `open <path>` trên macOS, `start <path>` trên Windows — và cho họ biết đường dẫn tuyệt đối.

Báo cáo dùng **Tailwind qua CDN** cho layout và styling, và **Mermaid qua CDN** cho sơ đồ ở những nơi mà một graph/flow/sequence truyền đạt cấu trúc một cách đáng tin cậy. Trộn Mermaid với các hình ảnh CSS/SVG tự tạo — dùng Mermaid khi các mối quan hệ có dạng đồ thị (call graph, dependency, sequence), và div/SVG tự dựng khi bạn muốn thứ gì đó mang tính biên tập hơn (mass diagram, cross-section, hoạt cảnh gộp/collapse). Mỗi ứng viên có một **hình ảnh hóa before/after**. Hãy trực quan.

Với mỗi ứng viên, render một thẻ gồm:

- **Files** — những file/module nào có liên quan
- **Problem (Vấn đề)** — tại sao kiến trúc hiện tại đang gây ma sát
- **Solution (Giải pháp)** — mô tả bằng tiếng Anh đơn giản về điều gì sẽ thay đổi
- **Benefits (Lợi ích)** — giải thích theo thuật ngữ locality và leverage, và test sẽ được cải thiện như thế nào
- **Sơ đồ Before / After** — đặt cạnh nhau, vẽ tùy chỉnh, minh họa tính shallow và việc deepening
- **Mức độ khuyến nghị (Recommendation strength)** — một trong `Strong`, `Worth exploring`, `Speculative`, hiển thị dưới dạng badge

Kết thúc báo cáo bằng một mục **Khuyến nghị hàng đầu (Top recommendation)**: ứng viên nào bạn sẽ xử lý trước và tại sao.

**Dùng từ vựng CONTEXT.md cho domain, và từ vựng `/codebase-design` cho kiến trúc.** Nếu `CONTEXT.md` định nghĩa "Order," hãy nói về "module tiếp nhận Order" — không phải "FooBarHandler," và cũng không phải "Order service."

**Xung đột với ADR**: nếu một ứng viên mâu thuẫn với một ADR hiện có, chỉ nêu ra khi ma sát đủ thực sự để đáng xem xét lại ADR. Đánh dấu rõ ràng trong thẻ (ví dụ: một callout cảnh báo: _"mâu thuẫn với ADR-0007 — nhưng đáng để mở lại vì…"_). Đừng liệt kê mọi refactor lý thuyết mà một ADR cấm.

Xem [HTML-REPORT.md](HTML-REPORT.md) để biết khung sườn HTML đầy đủ, các mẫu sơ đồ, và hướng dẫn về style.

CHƯA đề xuất interface vội. Sau khi file được ghi xong, hỏi người dùng: "Bạn muốn khám phá cái nào trong số này?"

### 3. Vòng lặp Grilling

Khi người dùng chọn một ứng viên, gọi tool Skill với "grilling" để cùng họ đi qua cây quyết định — các ràng buộc, phụ thuộc, hình dạng của module đã deepened, những gì nằm sau seam, những test nào còn sống sót.

Các side effect xảy ra ngay khi các quyết định kết tinh — gọi tool Skill với "domain-modeling" để giữ mô hình domain luôn cập nhật khi bạn tiến hành:

- **Đặt tên cho một module đã deepened theo một khái niệm chưa có trong `CONTEXT.md`?** Thêm thuật ngữ đó vào `CONTEXT.md`. Tạo file một cách lười (lazily) nếu nó chưa tồn tại.
- **Mài giũa một thuật ngữ mơ hồ trong lúc trò chuyện?** Cập nhật `CONTEXT.md` ngay tại chỗ.
- **Người dùng từ chối ứng viên với một lý do có trọng lượng?** Đề nghị một ADR, diễn đạt như sau: _"Bạn có muốn tôi ghi lại điều này như một ADR để các buổi xem xét kiến trúc trong tương lai không đề xuất lại điều tương tự không?"_ Chỉ đề nghị khi lý do đó thực sự cần thiết để một người khám phá trong tương lai tránh đề xuất lại cùng một điều — bỏ qua các lý do nhất thời ("hiện tại không đáng") và các lý do hiển nhiên.
- **Muốn khám phá các interface thay thế cho module đã deepened?** Gọi tool Skill với "codebase-design" và dùng mẫu sub-agent song song "design-it-twice" của nó.
