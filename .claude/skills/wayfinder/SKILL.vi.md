---
name: wayfinder
description: Lập kế hoạch cho một khối lượng công việc khổng lồ — lớn hơn những gì một phiên agent có thể chứa đựng — dưới dạng một bản đồ dùng chung gồm các ticket quyết định trên issue tracker của bạn, và giải quyết chúng từng cái một cho đến khi con đường tới đích trở nên rõ ràng.
disable-model-invocation: true
---

Một ý tưởng còn mơ hồ vừa xuất hiện — quá lớn cho một phiên agent, và được bao phủ trong sương mù: con đường từ đây tới **đích (destination)** vẫn chưa nhìn thấy được. Wayfinding (tìm đường) là về việc tìm ra con đường đó, chứ không phải lao thẳng tới đích. Skill này vạch ra con đường đó dưới dạng một **bản đồ dùng chung (shared map)** trên issue tracker của repo, sau đó giải quyết các **ticket quyết định (decision ticket)** của nó — những câu hỏi mà lời giải là một quyết định, không phải các lát cắt của một việc xây dựng cần thực hiện — từng cái một cho đến khi tuyến đường trở nên rõ ràng.

Đích đến khác nhau tùy theo từng nỗ lực, và việc đặt tên cho nó là hành động vạch bản đồ đầu tiên — nó định hình mọi ticket. Đích có thể là một spec để bàn giao và lặp lại, một quyết định cần chốt trước khi việc lập kế hoạch bắt đầu, hoặc một thay đổi được thực hiện tại chỗ như một cuộc di chuyển cấu trúc dữ liệu (data-structure migration). Bản đồ này không phụ thuộc vào domain — công việc kỹ thuật, nội dung khóa học, bất cứ thứ gì phù hợp với hình dạng đó.

## Lập kế hoạch, đừng làm

Wayfinder mặc định là **lập kế hoạch (planning)**: mỗi ticket giải quyết một quyết định, và bản đồ hoàn tất khi con đường trở nên rõ ràng — không còn gì phải quyết định trước khi ai đó đi và làm việc đó. Sự thôi thúc muốn xắn tay làm việc luôn thường là tín hiệu cho thấy bạn đã tới rìa bản đồ và đã đến lúc bàn giao. Một nỗ lực có thể ghi đè điều này trong phần **Notes** của nó (đưa việc thực thi vào chính bản đồ) — nhưng nếu không có điều đó, hãy tạo ra các quyết định, không phải sản phẩm bàn giao.

## Tham chiếu bằng tên

Mỗi bản đồ và ticket là một issue, vì vậy nó có một **tên (name)** — tiêu đề của nó. Trong mọi thứ con người đọc — lời tường thuật, phần Decisions-so-far của bản đồ — hãy tham chiếu tới nó bằng tên đó, không bao giờ bằng một id, số, hoặc slug trần trụi. Một bức tường gồm `#42, #43, #44` là khó đọc; tên đọc được ngay lập tức. Id và URL không biến mất — một tên bọc lấy liên kết của nó — nhưng chúng nằm _bên trong_ tên, không bao giờ thay thế cho tên.

## Bản đồ (The Map)

Bản đồ là một issue duy nhất trên issue tracker của repo này, gắn label `wayfinder:map` — hiện vật chính thức (canonical artifact). Các ticket của nó là các child issue của bản đồ.

Bản đồ là một **chỉ mục (index)**, không phải một kho lưu trữ. Nó liệt kê các quyết định đã được đưa ra và trỏ tới các ticket chứa chi tiết của chúng; một quyết định chỉ tồn tại ở đúng một nơi — ticket của nó — vì vậy bản đồ không bao giờ nhắc lại nó, chỉ tóm lược (gist) và liên kết tới nó.

**Vị trí vật lý của bản đồ, các child ticket của nó, blocking, và các truy vấn frontier là đặc thù theo từng tracker.** Issue tracker lẽ ra đã được cung cấp cho bạn. Nếu chưa, hãy bảo người dùng chạy `/setup-matt-pocock-skills`. Tham khảo mục "Wayfinding operations" trong tài liệu tracker để biết cách repo _này_ diễn đạt chúng. Nếu chưa có tracker nào được cung cấp, mặc định dùng tracker local-markdown.

### Nội dung bản đồ

Toàn bộ bản đồ ở độ phân giải thấp, được tải một lần cho mỗi phiên. Các ticket còn mở **không** được liệt kê ở đây — chúng là các child issue đang mở, được tìm thấy qua truy vấn.

```markdown
## Destination

<đích đến của bản đồ này trông như thế nào khi đạt được — spec, quyết định, hoặc thay đổi mà nỗ lực này đang tìm đường tới. Một hoặc hai dòng; mỗi phiên định hướng theo đó trước khi chọn một ticket.>

## Notes

<domain; các skill mà mỗi phiên nên tham khảo; các sở thích chuẩn cho nỗ lực này>

## Decisions so far

<!-- chỉ mục — một dòng cho mỗi ticket đã đóng: đủ để đánh giá mức độ liên quan, sau đó phóng to liên kết để xem chi tiết mà ticket chứa -->

- [<tiêu đề ticket đã đóng>](link) — <tóm lược một dòng về câu trả lời>

## Not yet specified

<!-- xem "Fog of war": sương mù trong phạm vi mà bạn chưa thể lập ticket được, sẽ tốt nghiệp khi frontier tiến lên -->

## Out of scope

<!-- xem "Out of scope": công việc bị xem là ngoài phạm vi đích đến; đã đóng, không bao giờ tốt nghiệp -->
```

### Ticket

Mỗi ticket là một **child issue** của bản đồ; id issue của tracker là danh tính của nó. Nội dung của nó là câu hỏi, được định cỡ để vừa với một phiên agent 100K token:

```markdown
## Question

<quyết định hoặc cuộc điều tra mà ticket này giải quyết>
```

Mỗi ticket mang một label `wayfinder:<type>` — một trong số `research`, `prototype`, `grilling`, `task` (xem [Ticket Types](#ticket-types)).

Một phiên **nhận (claim)** một ticket bằng cách gán nó cho dev đang điều khiển bản đồ, **trước**, trước khi làm bất kỳ công việc nào, để các phiên song song bỏ qua nó. Người được gán chính _là_ sự nhận đó: một ticket đang mở, chưa được gán là chưa được nhận.

Blocking dùng quan hệ phụ thuộc **gốc (native)** của tracker — điều này rất cần thiết vì nó hiển thị frontier một cách _trực quan_ ngay trong giao diện của chính tracker, để con người thấy được cái gì có thể nhặt lên mà không cần mở bản đồ. Chỉ tracker nào thiếu blocking gốc mới quay về dùng một quy ước trong nội dung (body convention). Một ticket được coi là **không bị chặn (unblocked)** khi mọi ticket chặn nó đã đóng; **frontier** (biên) là các child đang mở, không bị chặn, chưa được nhận — rìa của những gì đã biết.

Câu trả lời không phải là một phần của nội dung — nó được ghi lại khi giải quyết (xem [Work through the map](#work-through-the-map)). Các tài sản (asset) được tạo ra trong khi giải quyết một ticket được liên kết từ issue, không dán trực tiếp vào.

## Các loại ticket (Ticket Types)

Mọi ticket đều là **HITL** — human in the loop (có con người tham gia), được xử lý _cùng với_ một con người tự nói lên tiếng nói của họ — hoặc **AFK**, do agent tự điều khiển một mình. Một ticket HITL chỉ được giải quyết thông qua sự trao đổi trực tiếp đó; agent không bao giờ đóng thế cho phần của con người trong đó (một grilling agent tự trả lời câu hỏi của chính nó đã phá vỡ nguyên tắc này).

- **Research** (AFK): Đọc tài liệu, API bên thứ ba, hoặc các tài nguyên local như knowledge base để tìm ra một sự thật mà một quyết định đang chờ. Được giải quyết bởi một subagent gọi tool Skill với "research". Dùng khi cần kiến thức bên ngoài thư mục làm việc hiện tại.
- **Prototype** (HITL): Nâng độ trung thực (fidelity) của cuộc thảo luận bằng cách tạo ra một hiện vật cụ thể, rẻ, thô sơ để phản ứng lại — một bản phác thảo, một bản nháp thô, một stub, hoặc code UI/logic, bằng cách gọi tool Skill với "prototype". Liên kết prototype như một asset. Dùng khi "nó nên trông như thế nào" hoặc "nó nên hành xử như thế nào" là câu hỏi then chốt.
- **Grilling** (HITL): Trò chuyện. Trường hợp mặc định. Luôn gọi tool Skill hai lần, cho "grilling" và "domain-modeling".
- **Task** (HITL hoặc AFK): Công việc thủ công phải xảy ra trước khi một _quyết định_ có thể được đưa ra — không có gì để quyết định, làm prototype, hoặc nghiên cứu, nhưng cuộc thảo luận bị chặn cho đến khi nó xong. Đăng ký một dịch vụ để API của nó có thể được đánh giá, cấp quyền truy cập, di chuyển dữ liệu để hình dạng của nó có thể được nhìn thấy. Đây là loại duy nhất _thực hiện_ thay vì quyết định — và nó xứng đáng có mặt vì nó gỡ chặn một quyết định, không phải vì nó mang tới đích đến. Agent tự điều khiển một mình nơi nó có thể (AFK); nếu không, nó đưa cho con người một danh sách kiểm tra chính xác (HITL). Được giải quyết khi công việc đã xong; câu trả lời ghi lại những gì đã được làm và mọi sự thật kết quả (vị trí thông tin xác thực, URL mới, số lượng dòng) mà các ticket sau phụ thuộc vào.

## Sương mù chiến tranh (Fog of war)

Bản đồ _cố tình_ không đầy đủ: đừng vạch ra những gì bạn chưa thể nhìn thấy. Vượt ra ngoài các ticket đang sống là **fog of war (sương mù chiến tranh)** — cái nhìn mờ nhạt về các quyết định và cuộc điều tra mà bạn có thể cảm nhận sẽ đến nhưng chưa thể chốt lại, vì chúng phụ thuộc vào các câu hỏi vẫn còn mở. Giải quyết một ticket sẽ xua tan sương mù phía trước nó, khiến bất cứ thứ gì giờ đây có thể đặc tả được "tốt nghiệp" thành các ticket mới — từng cái một, cho đến khi con đường tới đích trở nên rõ ràng và không còn ticket nào.

Mục **Not yet specified** của bản đồ là nơi cái nhìn mờ nhạt đó được ghi lại: câu hỏi bị nghi ngờ, khu vực cần quay lại sau. Đây là biên giới chưa được khám phá _hướng tới_ đích đến — mọi thứ ở đây đều nằm trong phạm vi, chỉ là chưa đủ sắc nét để lập ticket. Viết một cách lỏng lẻo hoặc đầy đủ tùy theo tầm nhìn cho phép; nó cũng đóng vai trò như một biển chỉ dẫn cho những người cộng tác đọc về nơi nỗ lực này đang hướng tới.

**Sương mù hay ticket?** Phép thử là liệu bạn có thể phát biểu câu hỏi một cách chính xác _ngay bây giờ_ hay không — _không_ phải liệu bạn có thể trả lời nó ngay bây giờ hay không.

- **Là ticket khi** câu hỏi đã đủ sắc nét — ngay cả khi nó đang bị chặn và bạn chưa thể hành động ngay.
- **Là Not yet specified khi** bạn chưa thể diễn đạt nó sắc nét đến mức đó. Đừng cắt sương mù thành các mảnh cỡ ticket trước: nó thô hơn một ticket, và một mảng có thể tốt nghiệp thành nhiều ticket, hoặc không ticket nào, một khi frontier chạm tới nó.

**Not yet specified** loại trừ những gì đã được quyết định (Decisions so far), những gì đã là ticket đang sống, và những gì nằm ngoài phạm vi (mục tiếp theo).

## Ngoài phạm vi (Out of scope)

Sương mù chỉ bao giờ tích tụ _hướng tới_ đích đến. Đích đến ấn định phạm vi, vì vậy công việc vượt ra ngoài nó là **ngoài phạm vi (out of scope)** — nó không phải là sương mù, và nó không thuộc về **Not yet specified**. Nó có mục **Out of scope** riêng trên bản đồ: công việc bạn đã cố ý loại trừ khỏi nỗ lực _này_. Phạm vi, chứ không phải độ sắc nét, quyết định nó rơi vào đây.

Công việc ngoài phạm vi không bao giờ tốt nghiệp — frontier dừng lại ở đích đến — vì vậy nó chỉ quay lại nếu đích đến được vẽ lại, và khi đó là một nỗ lực mới, không phải sự tiếp tục.

Việc xác định một điều gì đó là ngoài phạm vi là một hành động định phạm vi (scoping act), không phải một bước trên tuyến đường. Khi một ticket đã tồn tại hóa ra nằm sau đích đến — bị định phạm vi sai khi vạch bản đồ, hoặc bị lộ ra bởi một lời giải — hãy **đóng nó** (một ticket đã đóng chắc chắn không còn nằm trên frontier) và để lại một dòng trong mục **Out of scope**: tóm lược cộng với lý do tại sao nó ngoài phạm vi, liên kết tới ticket đã đóng. Nó không nằm trong **Decisions so far**, vì mục đó ghi lại tuyến đường thực sự đã đi qua — một ranh giới phạm vi không phải là một bước trên tuyến đường đó.

## Cách gọi (Invocation)

Hai chế độ. Dù theo cách nào, **không bao giờ giải quyết nhiều hơn một ticket mỗi phiên** — ngoại trừ các ticket research.

### Vạch bản đồ (Chart the map)

Người dùng gọi với một ý tưởng mơ hồ.

1. **Đặt tên cho đích đến.** Gọi tool Skill hai lần, cho "grilling" và "domain-modeling", để chốt lại điều bản đồ này đang tìm đường tới — spec, quyết định, hoặc thay đổi. Đích đến ấn định phạm vi, vì vậy nó được chốt trước tiên.
2. **Lập bản đồ frontier.** Chất vấn lại, lần này theo chiều **rộng trước (breadth-first)**: mở rộng ra khắp toàn bộ không gian thay vì đi sâu vào một luồng duy nhất, làm nổi lên các quyết định còn mở và các bước đầu tiên có thể thực hiện ngay bây giờ. **Nếu điều này không làm nổi lên sương mù nào** — con đường tới đích đến đã rõ ràng, toàn bộ hành trình đủ nhỏ cho một phiên — bạn không cần một bản đồ. Dừng lại và hỏi người dùng họ muốn tiến hành như thế nào.
3. **Tạo bản đồ** (label `wayfinder:map`): điền Destination và Notes, Decisions-so-far để trống, sương mù được phác thảo vào **Not yet specified**.
4. **Tạo các ticket bạn có thể đặc tả ngay bây giờ** dưới dạng child issue của bản đồ — sau đó nối các cạnh blocking trong một **đợt thứ hai** (các issue cần có id trước khi chúng có thể tham chiếu tới nhau). Việc nối dây sẽ sắp xếp chúng vào frontier và các ticket bị chặn; mọi thứ bạn chưa thể đặc tả được vẫn nằm trong sương mù — mục **Not yet specified**.
5. **Kích hoạt các subagent research.** Với mỗi ticket `research` bạn vừa tạo, khởi chạy một subagent gọi tool Skill với "research" để giải quyết nó song song, ghi lại các phát hiện của nó trên một nhánh `research/<name>` dùng một lần, kèm một context pointer từ ticket.
6. Dừng lại — vạch bản đồ là công việc của một phiên; nó không tự tay giải quyết bất kỳ ticket nào.

### Làm việc qua bản đồ (Work through the map)

Người dùng gọi với một bản đồ (URL hoặc số). Một ticket là **tùy chọn** — nếu không có, bạn chọn quyết định tiếp theo, không phải người dùng.

1. Tải **bản đồ** — chế độ xem độ phân giải thấp, không phải toàn bộ nội dung mỗi ticket.
2. Chọn ticket. Nếu người dùng đã nêu tên một ticket, dùng ticket đó. Nếu không, lấy ticket frontier đầu tiên theo thứ tự. **Nhận nó**: gán cho chính bạn trước khi làm bất kỳ công việc nào.
3. Giải quyết nó — **phóng to khi cần**: lấy toàn bộ nội dung của bất kỳ ticket liên quan hoặc đã đóng nào theo yêu cầu; gọi tool Skill cho bất kỳ skill nào được nêu tên trong khối `## Notes`. Nếu còn nghi ngờ, gọi tool Skill hai lần, cho "grilling" và "domain-modeling".
4. Ghi lại lời giải: đăng câu trả lời như một **comment giải quyết (resolution comment)**, **đóng** issue, và **thêm một context pointer** vào Decisions-so-far của bản đồ.
5. Thêm các ticket mới xuất hiện (tạo rồi nối dây); tốt nghiệp bất kỳ sương mù nào mà câu trả lời đã làm cho đặc tả được, xóa từng mảng đã tốt nghiệp khỏi **Not yet specified** để nó chỉ còn tồn tại dưới dạng ticket mới của nó. Nếu câu trả lời tiết lộ rằng một ticket — ticket này hoặc một ticket khác — nằm ngoài đích đến, hãy **xác định nó là ngoài phạm vi** thay vì giải quyết nó trên tuyến đường. Nếu quyết định này làm mất hiệu lực các phần khác của bản đồ, hãy cập nhật hoặc xóa các ticket đó.

Người dùng có thể chạy các ticket không bị chặn song song, vì vậy hãy dự đoán rằng các phiên khác đang chỉnh sửa tracker đồng thời.
