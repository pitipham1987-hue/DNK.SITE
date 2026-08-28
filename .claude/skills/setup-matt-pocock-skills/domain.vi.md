# Tài liệu Domain

Cách các engineering skill nên tiêu thụ (consume) tài liệu domain của repo này khi khám phá codebase.

## Trước khi khám phá, hãy đọc các file này

- **`CONTEXT.md`** ở gốc repo, hoặc
- **`CONTEXT-MAP.md`** ở gốc repo nếu nó tồn tại — nó trỏ tới một `CONTEXT.md` cho mỗi context. Đọc từng file liên quan tới chủ đề đang xử lý.
- **`docs/adr/`** — đọc các ADR liên quan tới khu vực bạn sắp làm việc. Trong repo multi-context, cũng kiểm tra `src/<context>/docs/adr/` để tìm các quyết định giới hạn trong context đó.

Nếu bất kỳ file nào trong số này không tồn tại, **hãy tiếp tục một cách im lặng**. Đừng gắn cờ báo sự vắng mặt của chúng; đừng đề xuất tạo chúng trước. Skill `/domain-modeling` (được truy cập qua `/grill-with-docs` và `/improve-codebase-architecture`) sẽ tạo chúng một cách lười (lazily) khi các thuật ngữ hoặc quyết định thực sự được giải quyết.

## Cấu trúc file

Repo single-context (đa số repo):

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

Repo multi-context (có sự hiện diện của `CONTEXT-MAP.md` ở gốc):

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

## Sử dụng từ vựng của bảng chú giải thuật ngữ (glossary)

Khi output của bạn nêu tên một khái niệm domain (trong tiêu đề issue, đề xuất refactor, giả thuyết, tên test), hãy dùng thuật ngữ đúng như định nghĩa trong `CONTEXT.md`. Đừng trôi dạt sang các từ đồng nghĩa mà bảng chú giải thuật ngữ đã cố tình tránh dùng.

Nếu khái niệm bạn cần chưa có trong bảng chú giải thuật ngữ, đó là một tín hiệu — hoặc là bạn đang bịa ra ngôn ngữ mà dự án không dùng (hãy xem xét lại), hoặc đó là một khoảng trống thực sự (ghi chú lại cho `/domain-modeling`).

## Gắn cờ các xung đột với ADR

Nếu output của bạn mâu thuẫn với một ADR hiện có, hãy nêu rõ điều đó thay vì âm thầm ghi đè:

> _Mâu thuẫn với ADR-0007 (event-sourced orders) — nhưng đáng để mở lại vì…_
