# Định dạng Báo cáo HTML (HTML Report Format)

Buổi review kiến trúc được xuất ra dưới dạng một file HTML tự chứa duy nhất trong thư mục tạm của hệ điều hành. Tailwind và Mermaid đều đến từ CDN. Mermaid xử lý các sơ đồ dạng đồ thị một cách đáng tin cậy; các div tự tạo và SVG nội tuyến xử lý các hình ảnh mang tính biên tập hơn (sơ đồ khối lượng, lát cắt ngang). Hãy trộn lẫn cả hai — đừng dựa vào Mermaid cho mọi thứ, nó sẽ bắt đầu trông đơn điệu.

## Khung trang (Scaffold)

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
      /* lớp tùy chỉnh nhỏ cho những thứ Tailwind không cover sạch:
         đường seam đứt nét, đầu mũi tên cảm giác vẽ tay, v.v. */
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

Tên repo, ngày tháng, và một chú giải cô đọng: hộp nét liền = module, đường đứt nét = seam, mũi tên đỏ = rò rỉ (leakage), hộp tối dày = module sâu. Không có đoạn văn giới thiệu — đi thẳng vào các ứng viên.

## Card ứng viên (Candidate card)

Các sơ đồ gánh trọng trách chính. Văn xuôi thưa thớt, rõ ràng, và dùng các thuật ngữ bảng giải thích (từ skill `/codebase-design`) mà không cầu kỳ.

Mỗi ứng viên là một `<article>`:

- **Title** — ngắn gọn, nêu tên việc đào sâu (ví dụ "Collapse the Order intake pipeline").
- **Badge row** — mức độ khuyến nghị (`Strong` = emerald, `Worth exploring` = amber, `Speculative` = slate), cộng với thẻ cho nhóm dependency (`in-process`, `local-substitutable`, `ports & adapters`, `mock`).
- **Files** — danh sách monospaced, `font-mono text-sm`.
- **Before / After diagram** — phần trọng tâm. Hai cột đặt cạnh nhau. Xem các mẫu bên dưới.
- **Problem** — một câu. Điều gì gây đau đớn.
- **Solution** — một câu. Điều gì thay đổi.
- **Wins** — các gạch đầu dòng, ≤6 từ mỗi cái. Ví dụ "Tests hit one interface", "Pricing logic stops leaking", "Delete 4 shallow wrappers".
- **ADR callout** (nếu áp dụng) — một dòng trong một box màu hổ phách.

Không có các đoạn văn giải thích. Nếu sơ đồ cần một đoạn văn mới hiểu được, hãy vẽ lại sơ đồ.

## Các mẫu sơ đồ (Diagram patterns)

Chọn mẫu phù hợp với ứng viên. Trộn lẫn chúng. Đừng làm mọi sơ đồ trông giống hệt nhau — sự đa dạng là một phần của mục tiêu.

### Đồ thị Mermaid (ngựa chiến cho dependency / luồng gọi)

Dùng Mermaid `flowchart` hoặc `graph` khi điểm cần nói là "X gọi Y gọi Z, và hãy nhìn vào sự hỗn loạn này." Bọc nó trong một card mang style Tailwind để nó không có cảm giác bị ném vào ngẫu nhiên. Style với classDef để tô màu các cạnh rò rỉ màu đỏ và module sâu màu tối. Sơ đồ trình tự (sequence diagram) hoạt động tốt cho "trước: 6 vòng đi-về; sau: 1."

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

### Hộp-và-mũi-tên tự dựng (khi bố cục của Mermaid chống lại bạn)

Các module là các `<div>` với viền và nhãn. Mũi tên là các phần tử SVG `<line>` hoặc `<path>` nội tuyến được đặt vị trí tuyệt đối (absolute) trên một container tương đối (relative). Hãy dùng cách này khi bạn muốn sơ đồ "sau" mang cảm giác như một module sâu viền dày với phần bên trong mờ đi — Mermaid sẽ không render điều đó với độ nặng phù hợp.

### Lát cắt ngang (Cross-section - tốt cho tính chất nông theo tầng)

Xếp chồng các dải ngang (`h-12 border-l-4`) để hiển thị các tầng mà một lệnh gọi đi qua. Trước: 6 tầng mỏng mỗi tầng không làm gì cả. Sau: 1 dải dày được dán nhãn trách nhiệm đã gộp.

### Sơ đồ khối lượng (Mass diagram - tốt cho "interface rộng bằng implementation")

Hai hình chữ nhật cho mỗi module — một cho diện tích bề mặt interface, một cho implementation. Trước: hình chữ nhật interface cao gần bằng hình chữ nhật implementation (nông). Sau: hình chữ nhật interface ngắn, hình chữ nhật implementation cao (sâu).

### Thu gọn đồ thị gọi (Call-graph collapse)

Trước: một cây các lệnh gọi hàm được render dưới dạng các hộp lồng nhau. Sau: cùng cây đó thu gọn thành một hộp, với các lệnh gọi giờ đây là nội bộ được hiển thị mờ bên trong nó.

## Hướng dẫn phong cách (Style guidance)

- Thiên về hướng biên tập (editorial), không phải dashboard doanh nghiệp. Khoảng trắng rộng rãi. Serif là tùy chọn cho tiêu đề (`font-serif` hoạt động tốt với tone stone/slate).
- Dùng màu sắc tiết kiệm: một màu nhấn (emerald hoặc indigo) cộng với đỏ cho rò rỉ và màu hổ phách cho cảnh báo.
- Giữ các sơ đồ cao ~320px để trước/sau nằm thoải mái cạnh nhau mà không cần scroll.
- Dùng `text-xs uppercase tracking-wider` cho các nhãn module bên trong sơ đồ — chúng nên đọc như sơ đồ kỹ thuật, không phải UI.
- Các script duy nhất là Tailwind CDN và import ESM của Mermaid. Báo cáo hoàn toàn tĩnh — không có code app, không có tính tương tác ngoài việc render của chính Mermaid.

## Mục Top recommendation

Một card lớn hơn. Tên ứng viên, một câu về lý do tại sao, link anchor tới card của nó. Vậy là xong.

## Giọng văn (Tone)

Rõ ràng, ngắn gọn — nhưng các danh từ và động từ kiến trúc đến thẳng từ skill `/codebase-design`. Sự ngắn gọn không phải là cớ để trôi dạt thuật ngữ.

**Dùng chính xác:** module, interface, implementation, depth, deep, shallow, seam, adapter, leverage, locality.

**Không bao giờ thay thế:** component, service, unit (cho module) · API, signature (cho interface) · boundary (cho seam) · layer, wrapper (cho module, khi bạn có ý nói module).

**Các cách diễn đạt phù hợp phong cách:**

- "Order intake module is shallow — interface nearly matches the implementation."
- "Pricing leaks across the seam."
- "Deepen: one interface, one place to test."
- "Two adapters justify the seam: HTTP in prod, in-memory in tests."

**Các gạch đầu dòng Wins** nêu tên phần thu được bằng các thuật ngữ bảng giải thích: *"locality: bugs concentrate in one module"*, *"leverage: one interface, N call sites"*, *"interface shrinks; implementation absorbs the wrappers"*. Đừng viết *"easier to maintain"* hay *"cleaner code"* — những thuật ngữ đó không có trong bảng giải thích và không đáng có mặt.

Không quanh co, không chuẩn bị tinh thần, không "it's worth noting that…". Nếu một câu có thể là một gạch đầu dòng, hãy biến nó thành gạch đầu dòng. Nếu một gạch đầu dòng có thể cắt, hãy cắt nó. Nếu một thuật ngữ không có trong bảng giải thích `/codebase-design`, hãy tìm một thuật ngữ có sẵn trước khi bịa ra thuật ngữ mới.
