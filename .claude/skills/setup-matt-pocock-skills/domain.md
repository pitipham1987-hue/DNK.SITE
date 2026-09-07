# Tài liệu Domain (Domain Docs)

Cách các skill kỹ thuật tiêu thụ tài liệu domain của repo này khi khám phá codebase.

## Trước khi khám phá, hãy đọc những tài liệu này

- **`CONTEXT.md`** tại gốc repo, hoặc
- **`CONTEXT-MAP.md`** tại gốc repo nếu nó tồn tại — nó trỏ tới một `CONTEXT.md` cho mỗi context. Đọc từng cái liên quan đến chủ đề.
- **`docs/adr/`** — đọc các ADR chạm vào khu vực bạn sắp làm việc. Trong các repo đa-context, kiểm tra cả `src/<context>/docs/adr/` cho các quyết định thuộc phạm vi context đó.

Nếu bất kỳ file nào trong số này không tồn tại, **tiến hành trong im lặng**. Đừng báo động sự vắng mặt của chúng; đừng đề xuất tạo chúng ngay từ đầu. Skill `/domain-modeling` (tiếp cận qua `/grill-with-docs` và `/improve-codebase-architecture`) sẽ tạo chúng một cách lười khi các thuật ngữ hoặc quyết định thực sự được giải quyết.

## Cấu trúc file

Repo đơn-context (hầu hết các repo):

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

Repo đa-context (sự có mặt của `CONTEXT-MAP.md` tại gốc):

```
/
├── CONTEXT-MAP.md
├── docs/adr/                          ← các quyết định toàn hệ thống
└── src/
    ├── ordering/
    │   ├── CONTEXT.md
    │   └── docs/adr/                  ← các quyết định riêng của context
    └── billing/
        ├── CONTEXT.md
        └── docs/adr/
```

## Dùng từ vựng của bảng thuật ngữ

Khi output của bạn nêu tên một khái niệm domain (trong tiêu đề issue, đề xuất refactor, giả thuyết, tên test), hãy dùng thuật ngữ như được định nghĩa trong `CONTEXT.md`. Đừng trôi sang các từ đồng nghĩa mà bảng thuật ngữ đã liệt kê dưới mục tránh dùng (`_Avoid_`).

Nếu khái niệm bạn cần chưa có trong bảng thuật ngữ, đó là một tín hiệu — hoặc bạn đang bịa ra ngôn ngữ mà dự án không dùng (hãy cân nhắc lại) hoặc có một khoảng trống thực sự (ghi chú lại cho `/domain-modeling`).

## Đánh dấu xung đột ADR

Nếu output của bạn mâu thuẫn với một ADR hiện có, hãy nêu rõ ràng thay vì âm thầm ghi đè:

> _Mâu thuẫn với ADR-0007 (event-sourced orders) — nhưng đáng mở lại vì…_
