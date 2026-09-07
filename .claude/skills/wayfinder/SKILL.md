---
name: wayfinder
description: Lập kế hoạch cho một khối lượng công việc lớn — vượt quá khả năng xử lý của một phiên làm việc — dưới dạng một bản đồ các quyết định chung (decision tickets) trên tracker công việc, và giải quyết từng ticket một cho đến khi đường tới đích trở nên rõ ràng.
disable-model-invocation: true
---

Một ý tưởng sơ khai đã xuất hiện — quá lớn cho một phiên agent đơn lẻ, và bao phủ trong sương mù: con đường từ đây tới **điểm đến (destination)** vẫn chưa thể nhìn thấy. Wayfinding là việc tìm ra con đường đó, chứ không phải lao thẳng tới điểm đến. Skill này lập bản đồ đường đi dưới dạng một **bản đồ chung (shared map)** trên tracker công việc của repository, sau đó xử lý các **decision ticket** của bản đồ — những câu hỏi mà việc giải quyết chúng là đưa ra một quyết định, chứ không phải thực thi từng phần của sản phẩm — từng ticket một cho đến khi tuyến đường trở nên rõ ràng.

Điểm đến thay đổi tùy thuộc vào nỗ lực thực hiện, và việc đặt tên cho nó là hành động đầu tiên của việc lập bản đồ — nó định hình mọi ticket. Đó có thể là một bản tả kỹ thuật (spec) để bàn giao và lặp lại, một quyết định cần khóa lại trước khi bắt đầu lập kế hoạch, hoặc một thay đổi được thực hiện tại chỗ như di chuyển cấu trúc dữ liệu. Bản đồ không phụ thuộc vào miền cụ thể (domain-agnostic) — công việc kỹ thuật, nội dung khóa học, hoặc bất kỳ điều gì phù hợp với mô hình này.

## Lập kế hoạch, không phải thực thi (Plan, don't do)

Mặc định Wayfinder là **lập kế hoạch**: mỗi ticket giải quyết một quyết định, và bản đồ hoàn tất khi con đường đã rõ ràng — không còn gì cần quyết định trước khi ai đó bắt tay vào làm. Ý muốn nhảy vào làm ngay thường là tín hiệu cho thấy bạn đã chạm đến rìa của bản đồ và đã tới lúc bàn giao. Một nỗ lực có thể ghi đè điều này trong phần **Ghi chú (Notes)** của nó — đưa việc thực thi vào chính bản đồ — nhưng nếu không có điều đó, hãy tạo ra các quyết định, không phải là sản phẩm bàn giao (deliverables).

## Tham chiếu bằng tên (Refer by name)

Mỗi bản đồ và ticket đều là một issue, vì vậy nó có một **tên** — tiêu đề của nó. Trong tất cả những gì con người đọc — phần tường thuật, danh sách Các quyết định từ trước đến nay của bản đồ — hãy tham chiếu nó bằng tên đó, tuyệt đối không dùng ID, số hay slug trần trụi. Một dãy `#42, #43, #44` rất khó đọc; tên gọi giúp người đọc hiểu ngay lập tức. ID và URL không biến mất — tên sẽ bọc lấy link của nó — nhưng chúng nằm _bên trong_ tên, chứ không bao giờ thay thế cho tên.

## Bản đồ (The Map)

Bản đồ là một issue duy nhất trên tracker công việc của repo này, được gắn label `wayfinder:map` — đây là artifact chính thức (canonical artifact). Các ticket của nó là các issue con (child issues) của bản đồ.

Bản đồ là một **mục lục (index)**, không phải là kho lưu trữ. Nó liệt kê các quyết định đã đưa ra và trỏ tới các ticket lưu giữ chi tiết của chúng; một quyết định sống ở đúng một nơi — ticket của nó — vì vậy bản đồ không bao giờ nhắc lại, chỉ tóm tắt ngắn gọn và chèn link.

**Vị trí vật lý của bản đồ, các ticket con, quan hệ chặn (blocking) và truy vấn vùng biên (frontier queries) phụ thuộc vào tracker cụ thể.** Tracker công việc đáng lẽ đã được cung cấp cho bạn. Nếu chưa, hãy báo người dùng chạy `/setup-matt-pocock-skills`. Tham khảo phần "Wayfinding operations" trong tài liệu tracker để biết cách repo _này_ thể hiện chúng. Nếu không có tracker nào được cung cấp, mặc định dùng tracker local-markdown.

### Thân bản đồ (The map body)

Toàn bộ bản đồ ở độ phân giải thấp, được tải một lần cho mỗi phiên. Các ticket đang mở **không** được liệt kê — chúng là các issue con đang mở, được tìm bằng câu truy vấn.

```markdown
## Destination

<trạng thái khi đạt đến cuối bản đồ này trông như thế nào — spec, quyết định, hoặc thay đổi mà nỗ lực này đang tìm đường tới. Một hoặc hai dòng; mỗi phiên đều định hướng theo nó trước khi chọn ticket.>

## Notes

<domain; các skill mà mỗi phiên nên tham khảo; các ưu tiên cố định cho nỗ lực này>

## Decisions so far

<!-- mục lục — một dòng cho mỗi ticket đã đóng: đủ để đánh giá mức độ liên quan, sau đó phóng to link để xem chi tiết nằm trong ticket -->

- [<tiêu đề ticket đã đóng>](link) — <tóm tắt một dòng về câu trả lời>

## Not yet specified

<!-- xem "Sương mù chiến tranh": sương mù nằm trong phạm vi nhưng chưa thể tạo ticket; chuyển thành ticket khi vùng biên tiến lên -->

## Out of scope

<!-- xem "Ngoài phạm vi": công việc được xác định nằm ngoài điểm đến; đã đóng, không bao giờ chuyển thành ticket -->
```

### Ticket

Mỗi ticket là một **issue con** của bản đồ; ID issue của tracker chính là định danh của nó. Thân của nó là câu hỏi, được kích thước hóa cho một phiên agent 100K token:

```markdown
## Question

<quyết định hoặc cuộc điều tra mà ticket này giải quyết>
```

Mỗi ticket mang một label `wayfinder:<type>` — một trong số `research`, `prototype`, `grilling`, `task` (xem [Loại Ticket](#loại-ticket)).

Một phiên **nhận (claim)** ticket bằng cách gán nó cho dev đang điều hành bản đồ, **đầu tiên**, trước bất kỳ công việc nào, để các phiên chạy đồng thời bỏ qua nó. Người được gán đó _chính là_ việc nhận ticket: một ticket đang mở, chưa được gán là chưa được nhận.

Việc chặn (blocking) sử dụng quan hệ phụ thuộc **nguyên bản (native)** của tracker — điều này rất quan trọng vì nó hiển thị vùng biên _bằng hình ảnh_ ngay trong UI của tracker, giúp con người thấy những gì có thể nhận mà không cần mở bản đồ. Chỉ những tracker thiếu tính năng chặn nguyên bản mới phải dùng quy ước trong thân issue. Một ticket được **giải phóng (unblocked)** khi tất cả các ticket chặn nó đã đóng; **vùng biên (frontier)** là các ticket con đang mở, chưa bị chặn, chưa được nhận — rìa của những gì đã biết.

Câu trả lời không phải là một phần của thân issue — nó được ghi lại khi giải quyết ticket (xem [Làm việc qua bản đồ](#làm-việc-qua-bản-đồ)). Các asset được tạo ra trong quá trình giải quyết ticket được link từ issue, chứ không dán trực tiếp vào issue.

## Loại Ticket (Ticket Types)

Mỗi ticket hoặc là **HITL** (human in the loop - người tham gia vào quy trình), làm việc _cùng với_ con người tự phát biểu ý kiến — hoặc là **AFK**, được điều hành bởi một mình agent. Một ticket HITL chỉ giải quyết thông qua cuộc trao đổi trực tiếp đó; agent không bao giờ đại diện cho phía con người (một grilling agent tự trả lời các câu hỏi của chính mình là đã vi phạm quy tắc này).

- **Research** (AFK): Đọc tài liệu, API bên thứ ba, hoặc các tài nguyên cục bộ như knowledge base để làm nổi bật một thực tế mà quyết định đang chờ đợi. Được giải quyết bởi một subagent gọi công cụ Skill với "research". Sử dụng khi cần kiến thức bên ngoài thư mục làm việc hiện tại.
- **Prototype** (HITL): Nâng cao độ trung thực của cuộc thảo luận bằng cách tạo ra một artifact nhanh, thô, cụ thể để phản hồi — một dàn ý, một bản nháp, một stub, hoặc code UI/logic, bằng cách gọi công cụ Skill với "prototype". Link prototype dưới dạng một asset. Sử dụng khi "nó nên trông như thế nào" hoặc "nó nên hoạt động ra sao" là câu hỏi cốt lõi.
- **Grilling** (HITL): Trò chuyện. Trường hợp mặc định. Luôn gọi công cụ Skill hai lần, cho "grilling" và "domain-modeling".
- **Task** (HITL hoặc AFK): Công việc thủ công phải diễn ra trước khi có thể đưa ra _quyết định_ — không có gì để quyết định, làm prototype hay nghiên cứu, nhưng cuộc thảo luận bị chặn cho đến khi công việc đó hoàn thành. Đăng ký dịch vụ để đánh giá API của nó, cấp quyền truy cập, di chuyển dữ liệu để thấy được hình thái của nó. Đây là loại duy nhất _thực thi_ thay vì đưa ra quyết định — và nó có vị trí nhờ việc giải phóng cho một quyết định, chứ không phải nhờ việc bàn giao điểm đến. Agent tự mình thực hiện ở những nơi có thể (AFK); nếu không nó sẽ đưa cho con người một checklist chính xác (HITL). Được giải quyết khi công việc hoàn tất; câu trả lời ghi lại những gì đã làm và bất kỳ thực tế kết quả nào (vị trí credentials, URL mới, số lượng dòng) mà các ticket sau phụ thuộc vào.

## Sương mù chiến tranh (Fog of war)

Bản đồ _cố tình_ không đầy đủ: đừng lập bản đồ cho những gì bạn chưa thể nhìn thấy. Phía sau các ticket đang hoạt động là **sương mù chiến tranh** — cái nhìn mờ nhạt về các quyết định và cuộc điều tra mà bạn có thể biết là sắp tới nhưng chưa thể chốt hạ, vì chúng phụ thuộc vào các câu hỏi vẫn đang mở. Giải quyết một ticket sẽ làm sạch sương mù phía trước nó, chuyển bất kỳ điều gì hiện đã có thể xác định rõ thành các ticket mới — từng ticket một, cho đến khi con đường tới điểm đến trở nên rõ ràng và không còn ticket nào.

Phần **Not yet specified** của bản đồ là nơi cái nhìn mờ nhạt đó được ghi lại: câu hỏi nghi vấn, khu vực cần xem xét lại sau. Đó là vùng biên chưa được khám phá _hướng tới_ điểm đến — mọi thứ ở đây đều nằm trong phạm vi, chỉ là chưa đủ rõ ràng để tạo ticket. Hãy viết tự do hoặc đầy đủ tùy theo mức độ quan sát cho phép; nó vừa là bảng chỉ đường cho các cộng sự đọc để biết nỗ lực này đang đi về đâu.

**Sương mù hay Ticket?** Bài kiểm tra là liệu bạn có thể phát biểu câu hỏi một cách chính xác ngay bây giờ hay không — _không phải_ là bạn có thể trả lời nó ngay bây giờ hay không.

- **Tạo ticket khi** câu hỏi đã rõ ràng — ngay cả khi nó bị chặn và bạn chưa thể hành động trên đó.
- **Not yet specified khi** bạn chưa thể diễn đạt nó một cách rõ ràng như vậy. Đừng chia nhỏ sương mù trước thành các miếng cỡ ticket: nó thô hơn ticket, và một mảng sương mù có thể chuyển thành nhiều ticket, hoặc không có ticket nào, khi vùng biên chạm tới nó.

**Not yet specified** loại trừ những gì đã được quyết định (Decisions so far), những gì đã là ticket đang mở, và những gì ngoài phạm vi (phần tiếp theo).

## Ngoài phạm vi (Out of scope)

Sương mù chỉ bao phủ _hướng tới_ điểm đến. Điểm đến cố định phạm vi, vì vậy công việc vượt quá nó là **out of scope (ngoài phạm vi)** — nó không phải sương mù, và không thuộc về **Not yet specified**. Nó có phần **Out of scope** riêng trên bản đồ: công việc bạn đã chủ động loại trừ khỏi nỗ lực _này_. Phạm vi (scope), chứ không phải độ rõ ràng, đưa nó vào đây.

Công việc ngoài phạm vi không bao giờ chuyển thành ticket — vùng biên dừng lại ở điểm đến — vì vậy nó chỉ quay lại nếu điểm đến được vẽ lại, và khi đó là một nỗ lực mới, chứ không phải tiếp tục nỗ lực cũ.

Đưa một thứ vào ngoài phạm vi là một hành động xác định phạm vi, không phải một bước trên tuyến đường. Khi một ticket đã tồn tại hóa ra nằm ngoài điểm đến — bị đưa nhầm vào khi lập bản đồ, hoặc bị lộ ra bởi một kết quả giải quyết — hãy **đóng nó** (một ticket đã đóng nằm ngoài vùng biên một cách rõ ràng) và để lại một dòng trong phần **Out of scope**: tóm tắt ngắn gọn cộng với lý do tại sao nó ngoài phạm vi, link tới ticket đã đóng. Nó nằm ngoài phần **Decisions so far**, nơi ghi lại tuyến đường thực sự đã đi — ranh giới phạm vi không phải là một bước trên đó.

## Cách gọi thực thi (Invocation)

Có hai chế độ. Dù theo cách nào, **không bao giờ giải quyết nhiều hơn một ticket cho mỗi phiên** — ngoại trừ các ticket research.

### Lập bản đồ (Chart the map)

Người dùng gọi với một ý tưởng sơ khai.

1. **Đặt tên cho điểm đến (destination).** Gọi công cụ Skill hai lần, cho "grilling" và "domain-modeling", để chốt hạ bản đồ này đang tìm đường tới cái gì — spec, quyết định, hay thay đổi. Điểm đến cố định phạm vi, nên nó được chốt đầu tiên.
2. **Lập bản đồ vùng biên.** Grill lần nữa, lần này theo **chiều rộng trước (breadth-first)**: mở rộng ra toàn bộ không gian thay vì đi sâu vào bất kỳ luồng nào, làm nổi bật các quyết định đang mở và các bước đầu tiên có thể thực hiện ngay bây giờ. **Nếu điều này không làm lộ ra sương mù nào** — con đường tới điểm đến đã rõ ràng, toàn bộ hành trình đủ nhỏ cho một phiên — bạn không cần bản đồ. Dừng lại và hỏi người dùng họ muốn tiếp tục như thế nào.
3. **Tạo bản đồ** (label `wayfinder:map`): Điền Destination và Notes, Decisions-so-far để trống, phác thảo sương mù vào **Not yet specified**.
4. **Tạo các ticket bạn có thể xác định ngay bây giờ** dưới dạng các issue con của bản đồ — sau đó nối các liên kết chặn (blocking) ở **bước thứ hai** (các issue cần có ID trước khi có thể tham chiếu lẫn nhau). Việc nối liên kết phân loại chúng vào vùng biên và bị chặn; mọi thứ bạn chưa thể xác định sẽ ở lại trong sương mù — phần **Not yet specified**.
5. **Kích hoạt các subagent research.** Đối với mỗi ticket `research` bạn vừa tạo, khởi chạy một subagent gọi công cụ Skill với "research" để giải quyết nó song song, ghi lại phát hiện của nó trên một branch tạm `research/<name>` với con trỏ ngữ cảnh từ ticket.
6. Dừng lại — lập bản đồ là công việc của một phiên; nó không tự giải quyết bất kỳ ticket nào.

### Làm việc qua bản đồ (Work through the map)

Người dùng gọi với một bản đồ (URL hoặc số). Một ticket là **tùy chọn** — nếu không có ticket, bạn sẽ tự chọn quyết định tiếp theo, chứ không phải người dùng.

1. Tải **bản đồ** — góc nhìn độ phân giải thấp, không phải toàn bộ thân của từng ticket.
2. Chọn ticket. Nếu người dùng chỉ định một ticket, hãy dùng nó. Nếu không, hãy lấy ticket vùng biên đầu tiên theo thứ tự. **Nhận ticket (Claim it)**: tự gán nó cho chính bạn trước bất kỳ công việc nào.
3. Giải quyết ticket — **phóng to khi cần (zoom as needed)**: lấy toàn bộ thân issue của bất kỳ ticket liên quan hoặc đã đóng nào theo nhu cầu; gọi công cụ Skill cho bất kỳ skill nào mà khối `## Notes` đặt tên. Nếu nghi ngờ, hãy gọi công cụ Skill hai lần, cho "grilling" và "domain-modeling".
4. Ghi lại kết quả giải quyết: đăng câu trả lời dưới dạng **resolution comment**, **đóng** issue, và **thêm con trỏ ngữ cảnh** vào phần Decisions-so-far của bản đồ.
5. Thêm các ticket mới xuất hiện (tạo-sau-đó-nối-liên-kết); chuyển bất kỳ mảng sương mù nào mà câu trả lời đã giúp xác định rõ thành ticket mới, xóa mảng sương mù đó khỏi **Not yet specified** để nó chỉ sống dưới dạng ticket mới. Nếu câu trả lời cho thấy một ticket — ticket này hoặc ticket khác — nằm vượt quá điểm đến, hãy **đưa nó vào loại ngoài phạm vi (out of scope)** thay vì giải quyết nó trên tuyến đường. Nếu quyết định làm vô hiệu hóa các phần khác của bản đồ, hãy cập nhật hoặc xóa các ticket đó.

Người dùng có thể chạy các ticket không bị chặn một cách song song, vì vậy hãy chuẩn bị tinh thần rằng các phiên khác cũng đang chỉnh sửa tracker đồng thời.
