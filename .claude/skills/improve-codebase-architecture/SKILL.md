---
name: improve-codebase-architecture
description: Quét codebase để tìm các cơ hội đào sâu (deepening opportunities), trình bày chúng dưới dạng báo cáo HTML trực quan, sau đó phỏng vấn chất vấn (grill) qua bất kỳ phương án nào bạn chọn.
disable-model-invocation: true
---

# Cải thiện Kiến trúc Codebase (Improve Codebase Architecture)

Bộc lộ các ma sát về kiến trúc và đề xuất các **cơ hội đào sâu (deepening opportunities)** — những đợt refactor biến các module nông (shallow module) thành các module sâu (deep module). Mục tiêu là khả năng kiểm thử (testability) và khả năng điều hướng AI (AI-navigability).

Lệnh này được *định hướng* bởi mô hình nghiệp vụ của dự án và được xây dựng trên từ vựng thiết kế dùng chung:

- Gọi tool Skill với "codebase-design" để lấy từ vựng kiến trúc (**module**, **interface**, **depth**, **seam**, **adapter**, **leverage**, **locality**) và các nguyên tắc của nó (phép thử xóa bỏ, "interface là bề mặt test", "một adapter = seam giả định, hai = thực sự"). Dùng chính xác các thuật ngữ này trong mọi đề xuất — không trôi sang "component," "service," "API," hay "boundary."
- Ngôn ngữ nghiệp vụ trong `CONTEXT.md` cung cấp tên cho các seam tốt; các ADR trong `docs/adr/` ghi lại những quyết định mà lệnh này không nên tranh luận lại.

## Quy trình

### 1. Khám phá

**Xác định phạm vi trước khi quét — YAGNI.** Việc đào sâu một module mang lại hiệu quả bằng cách làm cho những thay đổi trong tương lai với nó dễ dàng hơn, vì vậy hãy tập trung thêm vào các phần của codebase gần đây có thay đổi. Quyết định nhìn vào *đâu* trước khi bạn nhìn:

- Nếu người dùng nêu tên một hướng đi — một module, một hệ thống con, một điểm đau — hãy đi theo hướng đó, và bỏ qua phần suy luận bên dưới.
- Nếu không, hãy xem lại một đoạn lịch sử commit (`git log --oneline`) để tìm các điểm nóng (hot spots) của codebase — những file và khu vực liên tục xuất hiện — và để những đường dẫn đó thu hút sự chú ý của bạn trước tiên. Nếu các thay đổi bị rải rác mà không có điểm nóng rõ ràng, hãy mở rộng lưới quét.

Đọc bảng thuật ngữ nghiệp vụ của dự án (`CONTEXT.md`) và bất kỳ ADR nào trong khu vực bạn đang chạm vào trước tiên.

Sau đó sinh một sub-agent để đi qua codebase. Đừng tuân theo các quy tắc cứng nhắc — hãy khám phá một cách tự nhiên và ghi chú những nơi bạn gặp ma sát:

- Nơi nào mà việc hiểu một khái niệm yêu cầu phải nhảy qua nhảy lại giữa nhiều module nhỏ?
- Nơi nào các module bị **nông (shallow)** — interface gần phức tạp bằng chính implementation?
- Nơi nào các hàm thuần túy (pure functions) được trích xuất chỉ để dễ test, nhưng các bug thực sự lại ẩn trong cách chúng được gọi (không có **locality**)?
- Nơi nào các module gắn kết chặt chẽ bị rò rỉ qua seam của chúng?
- Những phần nào của codebase chưa được test, hoặc khó test qua interface hiện tại của chúng?

Áp dụng **phép thử xóa bỏ (deletion test)** cho bất kỳ thứ gì bạn nghi ngờ là nông: việc xóa nó sẽ làm dồn nén độ phức tạp, hay chỉ di chuyển nó đi nơi khác? Một câu trả lời "có, dồn nén lại" chính là tín hiệu bạn muốn.

### 2. Trình bày ứng viên dưới dạng báo cáo HTML

Ghi một file HTML tự chứa vào thư mục tạm của hệ điều hành để không có gì rơi vào repo. Phân giải thư mục tạm từ `$TMPDIR`, fallback về `/tmp` (hoặc `%TEMP%` trên Windows), và ghi vào `<tmpdir>/architecture-review-<timestamp>.html` để mỗi lần chạy có một file mới. Mở nó cho người dùng — `xdg-open <path>` trên Linux, `open <path>` trên macOS, `start <path>` trên Windows — và nói cho họ đường dẫn tuyệt đối.

Báo cáo dùng **Tailwind qua CDN** cho layout và styling, và **Mermaid qua CDN** cho các sơ đồ nơi mà đồ thị/luồng/trình tự truyền đạt cấu trúc một cách đáng tin cậy. Trộn Mermaid với các hình ảnh CSS/SVG tự tạo — dùng Mermaid khi các mối quan hệ có dạng đồ thị (call graph, dependency, sequence), và dùng div/SVG tự dựng khi bạn muốn thứ gì đó mang tính biên tập hơn (sơ đồ khối lượng, lát cắt ngang, animation thu gọn). Mỗi ứng viên nhận được một **sơ đồ trực quan trước / sau (before/after)**. Hãy trực quan.

Với mỗi ứng viên, hiển thị một card với:

- **Files** — các file/module nào liên quan
- **Problem** — tại sao kiến trúc hiện tại gây ra ma sát
- **Solution** — mô tả bằng tiếng Anh/Việt đơn giản về những gì sẽ thay đổi
- **Benefits** — được giải thích theo thuật ngữ locality và leverage, và các test sẽ cải thiện như thế nào
- **Before / After diagram** — đặt cạnh nhau, tự vẽ, minh họa tính chất nông và việc đào sâu
- **Recommendation strength** — một trong các mức `Strong`, `Worth exploring`, `Speculative`, hiển thị dưới dạng badge

Kết thúc báo cáo bằng mục **Top recommendation**: ứng viên nào bạn sẽ giải quyết đầu tiên và tại sao.

**Dùng từ vựng CONTEXT.md cho nghiệp vụ, và từ vựng `/codebase-design` cho kiến trúc.** Nếu `CONTEXT.md` định nghĩa "Order," hãy nói về "Order intake module" — không phải "FooBarHandler," và không phải "Order service."

**Xung đột ADR**: nếu một ứng viên mâu thuẫn với một ADR hiện có, chỉ hiển thị nó khi ma sát đủ thực tế để xứng đáng xem xét lại ADR đó. Đánh dấu rõ ràng trong card (ví dụ một warning callout: _"mâu thuẫn với ADR-0007 — nhưng đáng mở lại vì..."_). Đừng liệt kê mọi refactor lý thuyết mà một ADR cấm.

Xem [HTML-REPORT.md](HTML-REPORT.md) để biết đầy đủ khung HTML, mẫu sơ đồ, và hướng dẫn kiểu dáng.

Đừng đề xuất interface ngay. Sau khi file được ghi, hãy hỏi người dùng: "Bạn muốn khám phá phương án nào trong số này?"

### 3. Vòng lặp chất vấn (Grilling loop)

Khi người dùng chọn một ứng viên, hãy gọi tool Skill với "grilling" để đi qua cây quyết định với họ — các ràng buộc, dependency, hình dạng của module đã đào sâu, những gì nằm sau seam, những test nào sẽ sống sót.

Các hiệu ứng phụ diễn ra nội tuyến khi các quyết định kết tinh — gọi tool Skill với "domain-modeling" để giữ cho domain model luôn cập nhật khi bạn tiến hành:

- **Đặt tên một module đã đào sâu theo một khái niệm chưa có trong `CONTEXT.md`?** Thêm thuật ngữ đó vào `CONTEXT.md`. Tạo file một cách lười nếu nó chưa tồn tại.
- **Mài sắc một thuật ngữ mơ hồ trong cuộc hội thoại?** Cập nhật `CONTEXT.md` ngay tại đó.
- **Người dùng từ chối ứng viên với một lý do mang tính tải trọng?** Đề xuất một ADR, framed như sau: _"Bạn có muốn tôi ghi lại điều này dưới dạng ADR để các buổi review kiến trúc trong tương lai không đề xuất lại nó không?"_ Chỉ đề xuất khi lý do đó thực sự cần thiết cho một người khám phá trong tương lai để tránh đề xuất lại cùng một thứ — bỏ qua các lý do tạm thời ("lúc này không đáng làm") và các lý do tự hiển nhiên.
- **Muốn khám phá các interface thay thế cho module đã đào sâu?** Gọi tool Skill với "codebase-design" và dùng mẫu sub-agent song song design-it-twice của nó.
