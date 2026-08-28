---
name: domain-modeling
description: Xây dựng và mài sắc mô hình nghiệp vụ (domain model) của một dự án. Dùng khi thảo luận về thuật ngữ codebase, viết hoặc chỉnh sửa một CONTEXT.md, hoặc ghi lại hoặc chỉnh sửa một ADR.
---

# Domain Modeling

Chủ động xây dựng và mài sắc mô hình nghiệp vụ của dự án trong khi bạn thiết kế. Đây là kỷ luật *chủ động* — thách thức các thuật ngữ, tạo ra các kịch bản edge-case, và viết ra bảng thuật ngữ cùng các quyết định ngay khi chúng kết tinh. (Chỉ *đọc* `CONTEXT.md` để lấy từ vựng không phải là skill này — đó là một thói quen một-dòng mà bất kỳ skill nào cũng có thể làm. Skill này dành cho khi bạn đang thay đổi mô hình, không chỉ tiêu thụ nó.)

## Cấu trúc file

Hầu hết các repo có một context duy nhất:

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

Nếu một `CONTEXT-MAP.md` tồn tại tại gốc, repo có nhiều context. Map trỏ tới nơi mỗi context sống:

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← các quyết định toàn hệ thống
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← các quyết định riêng của context
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

Tạo file một cách lười — chỉ khi bạn có thứ gì đó để viết. Nếu không có `CONTEXT.md` nào tồn tại, hãy tạo một cái khi thuật ngữ đầu tiên được giải quyết. Nếu không có `docs/adr/` nào tồn tại, hãy tạo nó khi ADR đầu tiên cần thiết.

## Trong lúc phiên làm việc

### Thách thức đối chiếu với bảng thuật ngữ

Khi người dùng dùng một thuật ngữ xung đột với ngôn ngữ hiện có trong `CONTEXT.md`, hãy chỉ ra ngay lập tức. "Bảng thuật ngữ của bạn định nghĩa 'cancellation' là X, nhưng có vẻ bạn đang muốn nói Y — vậy là cái nào?"

### Mài sắc ngôn ngữ mơ hồ

Khi người dùng dùng những thuật ngữ mơ hồ hoặc bị quá tải nghĩa, hãy đề xuất một thuật ngữ chuẩn hóa chính xác. "Bạn đang nói 'account' — ý bạn là Customer hay User? Đó là hai thứ khác nhau."

### Thảo luận các kịch bản cụ thể

Khi các mối quan hệ nghiệp vụ đang được thảo luận, hãy kiểm định chúng bằng các kịch bản cụ thể. Sáng tạo ra các kịch bản dò xét các trường hợp biên và buộc người dùng phải chính xác về ranh giới giữa các khái niệm.

### Đối chiếu chéo với code

Khi người dùng nói rõ một thứ gì đó hoạt động như thế nào, hãy kiểm tra xem code có đồng ý không. Nếu bạn tìm thấy một mâu thuẫn, hãy nêu ra: "Code của bạn hủy toàn bộ Order, nhưng bạn vừa nói rằng hủy một phần là có thể — vậy cái nào đúng?"

### Cập nhật CONTEXT.md ngay tại chỗ

Khi một thuật ngữ được giải quyết, hãy cập nhật `CONTEXT.md` ngay tại đó. Đừng dồn lại để làm sau — hãy ghi lại ngay khi chúng xảy ra. Dùng định dạng trong [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md).

`CONTEXT.md` nên hoàn toàn không chứa chi tiết triển khai. Đừng đối xử với `CONTEXT.md` như một spec, một sổ nháp, hoặc một kho lưu các quyết định triển khai. Nó là một bảng thuật ngữ và không gì khác.

### Đề xuất ADR một cách thận trọng

Chỉ đề xuất tạo một ADR khi cả ba điều sau đều đúng:

1. **Khó đảo ngược** — chi phí thay đổi quyết định sau này là đáng kể
2. **Gây ngạc nhiên nếu không có ngữ cảnh** — một người đọc trong tương lai sẽ thắc mắc "tại sao họ lại làm theo cách này?"
3. **Kết quả của một sự đánh đổi thực sự** — có những phương án thay thế thực sự và bạn chọn một vì những lý do cụ thể

Nếu thiếu bất kỳ điều nào trong ba điều trên, hãy bỏ qua ADR. Dùng định dạng trong [ADR-FORMAT.md](./ADR-FORMAT.md).
