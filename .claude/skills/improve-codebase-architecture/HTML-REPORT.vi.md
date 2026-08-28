# Định dạng báo cáo HTML

Bài đánh giá kiến trúc được render thành một file HTML tự chứa (self-contained) duy nhất trong thư mục temp của hệ điều hành. Cả Tailwind và Mermaid đều lấy từ CDN. Mermaid xử lý các sơ đồ dạng đồ thị (graph-shaped) một cách đáng tin cậy; các div tự dựng và inline SVG xử lý các hình ảnh mang tính biên tập hơn (sơ đồ khối lượng, mặt cắt ngang). Kết hợp cả hai — đừng chỉ dựa vào Mermaid cho tất cả mọi thứ, nó sẽ bắt đầu trông rất chung chung.

## Khung sườn (Scaffold)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Architecture review — {{repo name}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
    </script>
    <style>
      /* small custom layer for things Tailwind doesn't cover cleanly:
         dashed seam lines, hand-drawn-feeling arrow heads, etc. */
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
      .deep { background: linear-gradient(135deg, #0f172a, #1e293b); }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header>...</header>
      <section id="candidates" class="space-y-10">...</section>
      <section id="top-recommendation">...</section>
    </main>
  </body>
</html>
```

## Header

Tên repo, ngày tháng, và một chú giải (legend) gọn gàng: hộp liền nét = module, đường nét đứt = seam, mũi tên đỏ = leakage (rò rỉ), hộp đậm dày = deep module. Không có đoạn giới thiệu — đi thẳng vào các ứng viên (candidates).

## Thẻ ứng viên (Candidate card)

Các sơ đồ mang phần lớn trọng lượng thông tin. Văn xuôi thì thưa thớt, đơn giản, và dùng các thuật ngữ trong bảng thuật ngữ (từ skill `/codebase-design`) mà không cần rào đón.

Mỗi ứng viên là một `<article>`:

- **Tiêu đề (Title)** — ngắn gọn, đặt tên cho việc "deepening" (đào sâu) (ví dụ: "Gộp pipeline tiếp nhận Order").
- **Hàng badge (Badge row)** — mức độ khuyến nghị (`Strong` = màu emerald, `Worth exploring` = màu amber, `Speculative` = màu slate), cộng với một tag cho danh mục phụ thuộc (`in-process`, `local-substitutable`, `ports & adapters`, `mock`).
- **Files** — danh sách dạng monospace, `font-mono text-sm`.
- **Sơ đồ Before / After** — phần trung tâm. Hai cột, đặt cạnh nhau. Xem các mẫu (patterns) bên dưới.
- **Problem (Vấn đề)** — một câu. Điều gì đang gây khó chịu.
- **Solution (Giải pháp)** — một câu. Điều gì sẽ thay đổi.
- **Wins (Lợi ích)** — các gạch đầu dòng, ≤6 từ mỗi dòng. Ví dụ: "Test chạm vào một interface duy nhất", "Logic pricing thôi rò rỉ", "Xóa 4 wrapper shallow".
- **ADR callout** (nếu có) — một dòng trong một hộp có sắc thái màu amber.

Không có đoạn văn giải thích dài dòng. Nếu một sơ đồ cần một đoạn văn để hiểu được, hãy vẽ lại sơ đồ đó.

## Các mẫu sơ đồ (Diagram patterns)

Chọn mẫu phù hợp với từng ứng viên. Trộn lẫn chúng. Đừng làm cho mọi sơ đồ trông giống nhau — sự đa dạng cũng là một phần của mục đích.

### Sơ đồ Mermaid (công cụ chủ lực cho dependency / luồng gọi hàm)

Dùng Mermaid `flowchart` hoặc `graph` khi trọng tâm là "X gọi Y gọi Z, và nhìn xem nó lộn xộn thế nào." Bọc nó trong một thẻ có style Tailwind để nó không có cảm giác bị nhét vào một cách gượng gạo. Style bằng classDef để tô màu đỏ cho các cạnh (edge) bị rò rỉ và tô màu tối cho deep module. Sequence diagram hoạt động tốt cho kiểu "trước: 6 round-trip; sau: 1."

```html
<div class="rounded-lg border border-slate-200 bg-white p-4">
  <pre class="mermaid">
    flowchart LR
      A[OrderHandler] --> B[OrderValidator]
      B --> C[OrderRepo]
      C -.leak.-> D[PricingClient]
      classDef leak stroke:#dc2626,stroke-width:2px;
      class C,D leak
  </pre>
</div>
```

### Hộp-và-mũi tên tự dựng (khi bố cục của Mermaid gây khó khăn)

Các module dưới dạng `<div>` có viền và nhãn. Mũi tên dưới dạng các phần tử inline SVG `<line>` hoặc `<path>` được định vị tuyệt đối (absolutely) trên một container tương đối (relative). Dùng cách này khi bạn muốn sơ đồ "after" có cảm giác như một deep module viền dày duy nhất với phần bên trong bị làm mờ (greyed-out) — Mermaid sẽ không render được với đúng "trọng lượng" thị giác như vậy.

### Mặt cắt ngang (Cross-section) (tốt cho tính shallow theo lớp)

Xếp chồng các dải ngang (`h-12 border-l-4`) để cho thấy các lớp mà một lệnh gọi đi qua. Trước: 6 lớp mỏng, mỗi lớp không làm gì cả. Sau: 1 dải dày được gắn nhãn với trách nhiệm đã được gộp lại.

### Sơ đồ khối lượng (Mass diagram) (tốt cho "interface rộng bằng implementation")

Hai hình chữ nhật cho mỗi module — một cho diện tích bề mặt interface, một cho implementation. Trước: hình chữ nhật interface gần cao bằng hình chữ nhật implementation (shallow). Sau: hình chữ nhật interface thấp, hình chữ nhật implementation cao (deep).

### Gộp cây gọi hàm (Call-graph collapse)

Trước: một cây các lệnh gọi hàm được render dưới dạng các hộp lồng nhau. Sau: cùng cây đó được gộp lại thành một hộp, với các lệnh gọi giờ đã trở thành nội bộ được hiển thị mờ đi bên trong nó.

## Hướng dẫn về phong cách (Style guidance)

- Thiên về phong cách biên tập (editorial), không phải dashboard doanh nghiệp. Khoảng trắng rộng rãi. Font serif là tùy chọn cho tiêu đề (`font-serif` hợp với tông stone/slate).
- Dùng màu tiết kiệm: một màu nhấn (emerald hoặc indigo) cộng với đỏ cho leakage và amber cho cảnh báo.
- Giữ các sơ đồ cao khoảng 320px để before/after nằm cạnh nhau thoải mái mà không cần cuộn.
- Dùng `text-xs uppercase tracking-wider` cho nhãn module bên trong sơ đồ — chúng nên đọc như một sơ đồ kỹ thuật (schematic), không phải như UI.
- Các script duy nhất là Tailwind CDN và Mermaid ESM import. Báo cáo còn lại là tĩnh — không có app code, không có tương tác nào ngoài việc render của chính Mermaid.

## Mục khuyến nghị hàng đầu (Top recommendation section)

Một thẻ lớn hơn. Tên ứng viên, một câu giải thích lý do, liên kết neo (anchor link) tới thẻ của nó. Chỉ vậy thôi.

## Giọng điệu (Tone)

Tiếng Anh đơn giản, súc tích — nhưng các danh từ và động từ về kiến trúc phải lấy trực tiếp từ skill `/codebase-design`. Sự súc tích không phải là cái cớ để trôi khỏi đúng thuật ngữ.

**Dùng chính xác:** module, interface, implementation, depth, deep, shallow, seam, adapter, leverage, locality.

**Không bao giờ thay thế bằng:** component, service, unit (thay cho module) · API, signature (thay cho interface) · boundary (thay cho seam) · layer, wrapper (thay cho module, khi ý bạn là module).

**Các cách diễn đạt phù hợp với phong cách:**

- "Module tiếp nhận Order là shallow — interface gần như trùng với implementation."
- "Pricing rò rỉ qua seam."
- "Deepen: một interface, một nơi để test."
- "Hai adapter biện minh cho seam: HTTP ở production, in-memory ở test."

**Các gạch đầu dòng Wins** gọi tên lợi ích bằng thuật ngữ trong bảng thuật ngữ: *"locality: bug tập trung vào một module"*, *"leverage: một interface, N call site"*, *"interface thu nhỏ; implementation hấp thụ các wrapper"*. Đừng viết *"dễ bảo trì hơn"* hay *"code sạch hơn"* — những từ đó không có trong bảng thuật ngữ và không xứng đáng được dùng.

Không rào đón, không dạo đầu dài dòng, không "đáng chú ý là…". Nếu một câu có thể là một gạch đầu dòng, hãy làm nó thành gạch đầu dòng. Nếu một gạch đầu dòng có thể bị cắt, hãy cắt nó. Nếu một thuật ngữ không có trong bảng thuật ngữ `/codebase-design`, hãy tìm một thuật ngữ có trong đó trước khi bịa ra thuật ngữ mới.
