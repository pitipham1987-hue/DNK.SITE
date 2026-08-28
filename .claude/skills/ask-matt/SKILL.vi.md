---
name: ask-matt
description: Hỏi xem skill hay flow nào phù hợp với tình huống của bạn. Một bộ định tuyến (router) qua các skill trong repo này.
disable-model-invocation: true
---

# Ask Matt

Bạn không nhớ hết mọi skill, vậy nên hãy hỏi.

Một **flow** là một đường đi qua các skill. Hầu hết các đường đi chạy dọc theo một **flow chính (main flow)**, và có hai **đường nhập (on-ramp)** hòa vào đó. Mọi thứ còn lại là độc lập (standalone), hoặc là một lớp từ vựng chạy bên dưới.

## Flow chính: ý tưởng → giao sản phẩm (idea → ship)

Con đường mà hầu hết công việc đi qua. Bạn có một ý tưởng và muốn xây nó.

1. **`/grill-with-docs`** — mài sắc ý tưởng bằng cách phỏng vấn. Bắt đầu ở đây bất cứ khi nào bạn **đang làm việc trong một thư mục làm việc (working directory)**: nó có trạng thái (stateful), lưu giữ những gì nó học được vào `CONTEXT.md` và các ADR. (Không có thư mục làm việc? Dùng `/grill-me` — xem mục Standalone. Cả hai đều chạy cùng một cơ chế nền tảng `/grilling`; `grill-with-docs` là phiên bản để lại dấu vết giấy tờ, điều này khiến nó trở thành lựa chọn tốt hơn bất cứ khi nào có một repo để lưu lại dấu vết đó.)
2. **Rẽ nhánh — bạn có thể giải quyết mọi câu hỏi trong hội thoại không?** Nếu một câu hỏi cần một câu trả lời có thể chạy được (trạng thái, logic nghiệp vụ, một UI bạn phải nhìn thấy), hãy đi vòng qua một prototype, được nối bằng **`/handoff`** theo cả hai chiều (một prototype sống trong thư mục riêng của nó, đó chính xác là mục đích của `/handoff` — xem Phase boundaries):
   - **`/handoff`** ra ngoài, sau đó mở một phiên mới trỏ vào file đó,
   - **`/prototype`** để trả lời câu hỏi bằng code dùng-một-lần-rồi-bỏ,
   - **`/handoff`** quay lại những gì bạn học được, và tham chiếu nó từ thread ý tưởng ban đầu.
3. **Rẽ nhánh — đây có phải là một dự án xây dựng nhiều phiên (multi-session build) không?**
   - **Có** → **`/to-spec`** (biến thread thành một spec), sau đó **`/to-tickets`** để tách nó thành các ticket dạng tracer-bullet, mỗi ticket khai báo **các cạnh chặn (blocking edges)** của nó. Trên một tracker cục bộ, đó là một file cho mỗi ticket dưới `.scratch/<feature>/issues/`, được làm thủ công theo thứ tự ưu tiên các blocker trước; trên một tracker thực sự, các cạnh này trở thành liên kết chặn (blocking link) gốc, nên bất kỳ ticket nào có các blocker đã xong đều có thể được lấy ra làm — khởi động **`/implement`** cho từng ticket, **`/clear` ngữ cảnh giữa mỗi ticket**. Mỗi ticket là tự chứa (self-contained), nên ngữ cảnh của ticket cuối cùng là bỏ đi được.
   - **Không** → **`/implement`** ngay tại đây, trong cùng cửa sổ ngữ cảnh.

   Dù theo cách nào, **`/implement`** cũng xây dựng từng issue bằng cách điều khiển **`/tdd`** bên trong — từng lát cắt đỏ-xanh (red-green) một — sau đó kết thúc bằng cách chạy **`/code-review`**, một review hai trục (Standards + Spec) của diff, trước khi commit. Dùng riêng **`/tdd`** khi bạn chỉ muốn xây một hành vi cụ thể theo hướng test-first mà không cần một spec đầy đủ, và dùng riêng **`/code-review`** bất cứ khi nào bạn muốn review một branch hoặc PR so với một điểm cố định.

### Vệ sinh ngữ cảnh (Context hygiene)

Giữ các bước 1–3 trong **một cửa sổ ngữ cảnh liền mạch** — đừng compact hay clear cho đến sau `/to-tickets` — để việc grilling, spec, và tickets đều xây dựng trên cùng một mạch suy nghĩ. Sau đó mỗi `/implement` bắt đầu mới hoàn toàn, làm việc dựa trên ticket.

Giới hạn ở đây là **[smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)**: cửa sổ (~150k token trên các model tiên tiến nhất) mà trong đó model vẫn còn suy luận sắc bén. Nếu một phiên tiến gần đến giới hạn đó trước khi `/to-tickets`, đừng cố đẩy tiếp khi đã suy giảm — `/compact` tại ranh giới pha gần nhất rồi tiếp tục (xem Phase boundaries).

## Các đường nhập (On-ramps)

Một tình huống khởi đầu sinh ra công việc, rồi hòa vào flow chính.

- **Bug và yêu cầu chất đống** → **`/triage`**. Nó di chuyển các issue qua các vai trò triage và tạo ra các issue sẵn sàng cho agent, mà **`/implement`** sau đó sẽ lấy để làm.

  Triage chỉ dành cho các issue **mà bạn không tạo ra** — báo cáo lỗi, yêu cầu tính năng gửi đến, bất cứ thứ gì đến ở dạng thô. Các ticket mà `/to-tickets` tạo ra đã sẵn sàng cho agent rồi, nên **đừng triage chúng**.

- **Có gì đó bị hỏng** → **`/diagnosing-bugs`**. Dành cho những ca khó: con bug không chịu lộ diện ngay từ cái nhìn đầu tiên, sự chập chờn không liên tục (flake), sự hồi quy (regression) len lỏi vào giữa hai trạng thái đã biết là tốt. Nó từ chối đưa ra lý thuyết cho đến khi có một **vòng phản hồi chặt (tight feedback loop)** — một lệnh duy nhất đã báo đỏ trên *chính* con bug này — rồi sửa bằng một regression test. Phần hậu kiểm (post-mortem) của nó bàn giao sang **`/improve-codebase-architecture`** khi phát hiện thực sự là không có một điểm nối (seam) tốt để khóa chặt con bug lại.

- **Một nỗ lực lớn, mờ mịt — một dự án greenfield hoặc một tính năng khổng lồ, quá lớn cho một phiên** → **`/wayfinder`**, flow đòi hỏi tư duy cao nhất ở đây. Khi con đường từ đây đến đích chưa hiện rõ, nó vẽ ra một **bản đồ chung (shared map)** gồm các **ticket quyết định (decision tickets)** trên issue tracker và giải quyết chúng từng cái một — tạo ra **các quyết định, không phải sản phẩm bàn giao** — cho đến khi sương mù được đẩy lùi và con đường trở nên rõ ràng. Trong khi **`/grill-with-docs`** mài sắc một ý tưởng bạn có thể nắm gọn trong một phiên, thì wayfinder dành cho ý tưởng mà bạn không thể — và nó chậm hơn và dày đặc hơn, nên hãy dành nó cho đúng trường hợp đó, không bao giờ dùng cho một tính năng đã được xác định phạm vi rõ ràng.

  Khi bản đồ trở nên rõ ràng, **nó bàn giao, nó không xây dựng**: hòa vào flow chính tại **`/to-spec`**, nơi gộp các quyết định liên kết trong bản đồ thành một kế hoạch có thể xây dựng được, sau đó `/to-tickets` và `/implement` như bình thường. Việc lặp bản đồ thẳng vào `/implement` bỏ qua bước gộp đó và vứt bỏ chi tiết liên kết — chỉ đi thẳng vào `/implement` khi nỗ lực thực ra hóa ra nhỏ.

## Sức khỏe codebase (Codebase health)

Không phải công việc tính năng — mà là bảo trì.

- **`/improve-codebase-architecture`** — chạy bất cứ khi nào bạn có thời gian rảnh để giữ cho codebase tốt cho agent vận hành. Nó phát hiện ra các **cơ hội đào sâu (deepening opportunities)**; chọn một cái sẽ _sinh ra một ý tưởng_ mà bạn có thể mang vào flow chính tại `/grill-with-docs`. Nó là công cụ khảo sát tìm ứng viên; **`/codebase-design`** (bên dưới) là bàn thiết kế nơi bạn thiết kế ứng viên đã chọn.

## Từ vựng bên dưới

Hai tài liệu tham chiếu do model tự gọi (model-invoked), chạy *bên dưới* các skill khác — mỗi cái là nguồn chân lý duy nhất cho từ vựng của nó. Dùng trực tiếp khi vấn đề nằm ở **từ ngữ**, không phải ở quy trình; hoặc để các skill ở trên tự kéo chúng vào.

- **`/domain-modeling`** — mài sắc ngôn ngữ *nghiệp vụ (domain)* của dự án: thách thức một thuật ngữ mơ hồ, giải quyết một từ bị quá tải nghĩa ("account" đang làm ba việc), ghi lại một quyết định khó đảo ngược dưới dạng ADR. Đây là kỷ luật chủ động mà `/grill-with-docs` thúc đẩy để giữ cho `CONTEXT.md` là một bảng thuật ngữ sạch.
- **`/codebase-design`** — từ vựng module-sâu (module, interface, depth, seam, adapter, leverage, locality) để thiết kế *hình dạng* của một module: nhiều hành vi đằng sau một interface nhỏ tại một seam sạch. Cả `/tdd` và `/improve-codebase-architecture` đều dùng từ vựng này.

## Ranh giới pha (Phase boundaries)

Một **pha (phase)** là một khối công việc bên trong một phiên — việc grilling, việc implement, việc QA. Tại **ranh giới** giữa hai pha, bạn có năm lựa chọn, và việc chọn giữa chúng là quyết định mơ hồ nhất trong toàn bộ bản đồ này:

- **Continue** — ở nguyên tại chỗ. Không tốn gì, không mất gì.
- **`/clear`** — xóa sạch cửa sổ, khi không có gì ở đây quan trọng cho việc tiếp theo.
- **`/handoff`** — ghi ra một file markdown có thể mang theo. Hẹp: chỉ dùng cho một **harness mới**, một **thư mục mới**, một **đồng nghiệp**, hoặc tách một nhánh việc phụ **giữa pha**. Cái nó mang lại là tính di động.
- **Subagent** — gửi một tác vụ được giới hạn chặt chẽ sang cửa sổ riêng của nó và nhận lại báo cáo.
- **`/compact`** — nén ngữ cảnh này và khởi tạo một phiên mới với nó. **Mặc định**, ở dưới cùng cây quyết định chứ không phải lựa chọn đầu tiên.

Đọc [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md) để biết cây quyết định theo thứ tự — năm câu hỏi, lý lẽ đằng sau mỗi nhánh, và tại sao chi phí của nguồn sơ cấp khiến **Continue** là lựa chọn cần loại trừ trước tiên. Đưa ra quyết định **tại** một ranh giới; giữa pha thì tiếp tục hoặc chia phần còn lại cho các subagent.

## Độc lập (Standalone)

Nằm hoàn toàn ngoài flow chính.

- **`/grill-me`** — cuộc phỏng vấn không khoan nhượng giống như `/grill-with-docs`, nhưng **không trạng thái (stateless)**: nó không lưu gì cục bộ và không xây dựng `CONTEXT.md`. Dùng nó khi bạn **không làm việc trong một thư mục làm việc** — mài sắc một kế hoạch, một thiết kế, một bài viết, bất cứ thứ gì không có repo bên dưới. Nếu bạn đang ở trong một thư mục làm việc, hãy dùng `/grill-with-docs` thay vào đó: nó chạy cùng cuộc phỏng vấn nhưng để lại dấu vết giấy tờ, nên nó chắc chắn là lựa chọn tốt hơn.
- **`/grilling`** — bản thân cơ chế phỏng vấn nền tảng: các vòng (rounds), ranh giới hiểu biết (frontier), sự thật là việc của agent còn quyết định là của bạn. `/grill-me` và `/grill-with-docs` là hai cách đặt tên để vào nó, và `/triage`, `/wayfinder` và `/improve-codebase-architecture` đều chạy nó ở bên trong. Chỉ dùng trực tiếp khi bạn muốn cuộc phỏng vấn không có lớp bọc nào xung quanh.
- **`/resolving-merge-conflicts`** — xử lý một xung đột merge hoặc rebase đang diễn ra, từng hunk một, giải quyết theo **ý định (intent)** truy ngược về nguồn sơ cấp của mỗi bên thay vì chọn dòng theo cảm tính, rồi hoàn tất thao tác. Nó không bao giờ chạy `--abort`. Độc lập và nằm ngoài mọi flow: dùng nó khi bạn đang giữa một xung đột.
- **`/prototype`** — một chương trình nhỏ, dùng-một-lần-rồi-bỏ, trả lời một câu hỏi thiết kế duy nhất: mô hình trạng thái này có cảm giác đúng không, hoặc UI này nên trông như thế nào. Dùng-một-lần-rồi-bỏ là một ràng buộc về cách viết code, không phải một lời hứa sẽ hủy nó: câu trả lời được gấp vào code thật, còn bản thân prototype được giữ lại như một **nguồn sơ cấp** trên một branch `prototype/<name>` tách ra từ main, được trỏ tới từ issue implementation. Đây là bước đi vòng ở bước 2 của flow chính, nhưng hãy dùng nó bất cứ khi nào một câu hỏi thiết kế khó giải quyết trên giấy.
- **`/research`** — giao việc đọc tài liệu cho một **agent chạy nền (background agent)**: nó điều tra một câu hỏi dựa trên **nguồn sơ cấp**, rồi để lại một file Markdown có trích dẫn trong repo. Bạn tiếp tục làm việc trong khi nó đọc. File nó tạo ra là thứ để mang *vào* flow chính tại `/grill-with-docs` — nghiên cứu nuôi dưỡng tư duy, nó không thay thế tư duy.
- **`/to-questionnaire`** — khi thứ đang chặn bạn không nằm trong đầu bạn hay trong codebase mà nằm trong **đầu người khác**, skill này viết cho họ một bảng câu hỏi để điền vào. Nó là nghịch đảo của `/grill-me`: thay vì phỏng vấn bạn về chủ đề, nó phỏng vấn bạn về **việc gửi** — gửi cho ai, bạn cần nhận lại gì — và nhắm các câu hỏi vào khoảng trống đó. Những gì nhận lại là tư liệu cho `/grill-with-docs` hoặc `/to-spec`.
- **`/wizard`** — dành cho các bước chỉ **con người** mới làm được: cấp phát hạ tầng, thiết lập credential hoặc CI secret, click qua một dashboard bên thứ ba xa lạ, chạy một cuộc di trú (migration) hoặc chuyển đổi (cutover) một lần. Nó tạo ra một script bash tương tác mở từng URL, thu thập từng giá trị, và ghi nó vào `.env` và GitHub secrets — để quy trình đó không còn là thứ bạn phải giải thích lại cho agent mỗi lần. Do model tự gọi, nên agent sẽ dùng nó ngay khi gặp một bức tường mà chỉ con người mới vượt qua được. Nếu agent có thể tự làm được, nó nên tự làm; skill này dành cho nơi con người thực sự cần tham gia.
- **`/wait-what`** — biện pháp khắc phục cho một tin nhắn không được tiếp nhận đúng. Dùng nó giữa cuộc hội thoại, bên trong bất kỳ skill nào khác, và agent sẽ trình bày lại những gì nó vừa nói với ngữ cảnh mà bạn còn thiếu, bằng tiếng Anh đơn giản, dùng từ vựng trong `CONTEXT.md`. Nó hoạt động sau khi sự việc đã xảy ra; `/grill-with-docs` là liều thuốc phòng ngừa từ đầu, vì một ngôn ngữ chung được thống nhất sớm chính là thứ ngăn thuật ngữ chuyên môn xuất hiện ngay từ đầu.
- **`/teach`** — học một khái niệm qua nhiều phiên, dùng thư mục hiện tại như một không gian làm việc có trạng thái.
- **`/writing-for-agents`** — tài liệu tham chiếu để viết các tài liệu mà agent tiêu thụ: skill, AGENTS.md, các tài liệu được trỏ tới.

## Điều kiện tiên quyết

**`/setup-matt-pocock-skills`** — chạy trước flow kỹ thuật đầu tiên của bạn để cấu hình issue tracker, các nhãn triage, và cách bố trí tài liệu mà các skill khác giả định sẵn có. Các issue tracker tùy chỉnh cũng hoạt động được.
