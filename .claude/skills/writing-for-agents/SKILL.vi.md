---
name: writing-for-agents
description: Viết tài liệu cho agent. Dùng khi tạo hoặc chỉnh sửa skill, hoặc sửa đổi AGENTS.md hay CLAUDE.md.
---

Tài liệu tham khảo cho việc viết bất kỳ tài liệu nào mà một agent sẽ tiêu thụ — một skill, một `AGENTS.md` / `CLAUDE.md`, một tài liệu được tiếp cận qua một pointer. Cách đóng gói (packaging) khác nhau; cách viết thì không: cùng những đòn bẩy làm cho mỗi tài liệu trở nên dễ đoán — agent thực hiện cùng một _quy trình_ mỗi lần chạy, chứ không phải tạo ra cùng một kết quả đầu ra.

Khi tài liệu bạn đang viết là một skill, hãy đọc [`SKILL-MECHANICS.md`](SKILL-MECHANICS.md) để biết về frontmatter, lựa chọn cách gọi, và các router skill.

## Context pointer

Một **context pointer** (con trỏ ngữ cảnh) là một tham chiếu được giữ trong ngữ cảnh của agent, nêu tên một tài liệu nằm ngoài ngữ cảnh và mã hóa điều kiện để tiếp cận nó. Description của một skill là một ví dụ; một dòng trong `AGENTS.md` nêu tên một tài liệu cũng là cùng một đối tượng đó. Chính _cách diễn đạt_ của pointer, chứ không phải đích của nó, quyết định khi nào agent tiếp cận tài liệu đó — và mức độ đáng tin cậy của việc đó. Một đích bắt-buộc-phải-có đằng sau một pointer diễn đạt yếu là một lỗi biến thiên (variance bug): hãy mài sắc cách diễn đạt trước, và chỉ đưa tài liệu vào nội tuyến (inline) nếu việc mài sắc thất bại.

Một pointer làm hai việc — nêu rõ tài liệu đó là gì, và liệt kê các **nhánh (branch)** nên kích hoạt việc tiếp cận nó (một nhánh là một trường hợp riêng biệt mà tài liệu xử lý, để các lần chạy khác nhau đi theo các đường khác nhau qua nó). Mỗi từ trong một pointer luôn-được-nạp đều tốn phí ở mỗi lượt, vì vậy nó xứng đáng bị cắt gọt còn khắt khe hơn cả phần nội dung chính:

- **Đưa từ dẫn lên đầu** — pointer là nơi nó thực hiện công việc kích hoạt của mình.
- **Một trigger cho mỗi nhánh.** Các từ đồng nghĩa chỉ đặt tên lại cho cùng một nhánh là một nhánh được viết hai lần; hãy gộp chúng lại và chỉ giữ những nhánh thực sự khác biệt.
- **Cắt bỏ những gì phần nội dung chính đã mang theo.**

## Hai loại tải (The two loads)

Mỗi tài liệu và pointer bạn thêm vào đều tiêu tốn một trong hai ngân sách:

- **Tải ngữ cảnh (Context load)** — chi phí của tài liệu luôn-được-nạp trên cửa sổ ngữ cảnh của agent: một dòng trong `AGENTS.md`, một description của skill, bất cứ thứ gì nằm trong ngữ cảnh ở mỗi lượt, tiêu tốn token và sự chú ý dù nó có được kích hoạt hay không.
- **Tải nhận thức (Cognitive load)** — chi phí đối với con người: những tài liệu nào tồn tại và khi nào cần tìm tới mỗi cái. Con người chính là chỉ mục. Đây không phải là một chi phí cần tối thiểu hóa — nó là cái giá của quyền tự chủ của con người; hãy chi tiêu nó ở nơi phán đoán của con người quan trọng, loại bỏ nó ở nơi không quan trọng.

Tài liệu chỉ được tiếp cận qua một pointer sẽ thoát khỏi tải ngữ cảnh với cái giá là dòng của chính pointer đó; tài liệu hoàn toàn không có pointer nào sẽ hoàn toàn dựa vào tải nhận thức.

## Hệ thống phân cấp thông tin (Information hierarchy)

Một tài liệu được xây dựng từ hai loại nội dung — **các bước (steps)** (các hành động có thứ tự mà agent thực hiện) và **tài liệu tham khảo (reference)** (định nghĩa, quy tắc, sự kiện được tra cứu theo yêu cầu) — hai loại này trộn lẫn tự do: toàn bộ là steps (một công thức), toàn bộ là reference (các quy tắc của một buổi review, chính skill này), hoặc cả hai. Quyết định cốt lõi là mỗi phần nội dung nên nằm ở đâu trên **hệ thống phân cấp thông tin (information hierarchy)**, một cái thang được xếp hạng theo mức độ agent cần tài liệu đó ngay lập tức đến đâu:

1. **In-file step** (bước trong file) — tầng chính: những gì agent làm, theo thứ tự.
2. **In-file reference** (tài liệu tham khảo trong file) — được tra cứu theo yêu cầu. Thường là một tập hợp ngang hàng (peer-set) hợp lệ theo đúng nghĩa (mọi quy tắc của một buổi review nằm trên cùng một bậc thang) — một cách sắp xếp tốt, không phải một dấu hiệu xấu.
3. **Disclosed reference** (tài liệu tham khảo được công bố riêng) — được đẩy ra một file riêng biệt, tiếp cận qua một context pointer, chỉ được nạp khi pointer đó kích hoạt. Trải dài từ một file anh em (sibling file) trong cùng thư mục cho tới tài liệu tham khảo hoàn toàn bên ngoài, có thể sống ở bất cứ đâu và bất kỳ tài liệu nào cũng có thể trỏ tới.

Đẩy xuống quá ít thì phần đầu sẽ phình to; đẩy xuống quá nhiều thì bạn sẽ giấu đi tài liệu mà agent thực sự cần. Sự căng thẳng đó chính là toàn bộ quyết định.

**Progressive disclosure** (công bố dần dần) là hành động di chuyển xuống thang — ra khỏi file chính và đằng sau một pointer — để phần đầu vẫn dễ đọc. Đây không chủ yếu là một sự tối ưu hóa token: đây là cách hệ thống phân cấp được bảo vệ. Phân nhánh (branching) là phép thử công bố sạch nhất: đưa nội tuyến những gì mọi nhánh đều cần, và đẩy ra sau một pointer những gì chỉ một số nhánh mới tiếp cận. Khi một tài liệu có các bước, tài liệu tham khảo trong file mà lẽ ra nên được công bố riêng sẽ chôn vùi chúng và biến việc chú ý tới chúng thành một trò tung đồng xu — một đòn bẩy biến thiên (variance lever), không chỉ là một đòn bẩy về tính dễ đọc.

**Co-location** (đồng vị trí) là phần đồng hành trong-file: trong khi cái thang quyết định _một phần nội dung nằm sâu bao nhiêu_, co-location quyết định _cái gì nằm cạnh nó_ một khi đã ở đó. Giữ định nghĩa, quy tắc, và các lưu ý của một khái niệm dưới cùng một tiêu đề thay vì rải rác, để đọc một phần sẽ mang theo các phần lân cận của nó. Phép thử: tài liệu nên đọc như tài liệu được viết cho agent — tài liệu được nhóm lại đọc như vậy; tài liệu bị rải rác thì không. (Khác với sự trùng lặp (duplication): trùng lặp lặp lại một ý nghĩa ở hai nơi; rải rác phân mảnh một ý nghĩa ra nhiều nơi.)

**Sprawl** (lan man) là chế độ thất bại ở đây: một tài liệu đơn giản là quá dài, ngay cả khi mọi dòng đều còn sống và duy nhất. Sự chú ý bị pha loãng trên phần dư thừa, và mỗi dòng thêm vào là một dòng nữa cần giữ cho liên quan. Cách chữa là cái thang: công bố tài liệu tham khảo đằng sau các pointer, và chia tách theo nhánh hoặc theo trình tự để mỗi đường đi chỉ mang theo những gì nó cần.

## Các bước và tiêu chí hoàn thành (Steps and completion criteria)

Mỗi bước kết thúc bằng một **tiêu chí hoàn thành (completion criterion)** — điều kiện báo cho agent biết công việc đã xong. Hai đặc tính làm cho nó trở thành một đòn bẩy:

- **Tính rõ ràng (Clarity)** — agent có thể phân biệt được xong với chưa xong không? Một ranh giới mơ hồ ("đã đạt được sự hiểu biết") mời gọi **hoàn thành non (premature completion)**: kết thúc bước trước khi nó thực sự xong, sự chú ý trượt sang việc _cảm thấy đã xong_. Các bước còn nhìn thấy phía trước — các **bước sau-khi-hoàn-thành (post-completion steps)** — cung cấp lực kéo; tính rõ ràng của tiêu chí là lực cản. Hãy phòng thủ theo thứ tự: **mài sắc ranh giới trước** (rẻ và cục bộ); chỉ khi nó vốn dĩ mơ hồ không thể sửa được _và_ bạn quan sát thấy sự vội vàng, hãy giấu các bước sau đi bằng cách chia tách trình tự — và việc giấu chỉ hiệu quả qua một ranh giới ngữ cảnh thực sự (một sự bàn giao hoặc một lần điều phối subagent; một lệnh gọi nội tuyến vẫn để các bước sau trong ngữ cảnh và không xóa bỏ được gì).
- **Mức độ đòi hỏi (Demand)** — nó đòi hỏi bao nhiêu. "Mọi model đã sửa đổi đều được tính đến" buộc phải làm việc kỹ lưỡng trong khi "tạo ra một danh sách thay đổi" thì không. Mức độ đòi hỏi thúc đẩy **legwork** (công sức tra cứu, lùng sục) — việc đào sâu mà agent thực hiện trong quá trình làm việc, tiềm ẩn trong cách diễn đạt hơn là được viết ra như một bước riêng — và nó không chỉ giới hạn trong các bước: "mọi quy tắc đã được áp dụng" ràng buộc một khối tài liệu tham khảo phẳng giống hệt như "mọi bước đã hoàn thành" ràng buộc một trình tự, đó là cách mà một tài liệu toàn-tài-liệu-tham-khảo vẫn mang theo một ngưỡng đòi hỏi sự đầy đủ (exhaustiveness bar).

Các tiêu chí mạnh nhất vừa có thể kiểm chứng được vừa đầy đủ.

## Khi nào nên chia tách (When to split)

Chia một tài liệu thành hai sẽ tiêu tốn một trong hai loại tải, vì vậy chỉ chia tách khi việc cắt đó xứng đáng:

- **Theo trình tự (By sequence)** — chia tách một chuỗi các bước ở nơi các bước sau-khi-hoàn-thành cám dỗ agent vội vàng làm qua loa bước ngay trước mắt nó. Giữ chúng ngoài tầm nhìn thúc đẩy nhiều legwork hơn cho tác vụ hiện tại. Hãy đề phòng chiều ngược lại: gộp các trình tự lại sẽ phơi bày các bước sau của mỗi bước cho những gì theo sau, mời gọi hoàn thành non.
- **Theo cách gọi (By invocation)** — đặc thù cho skill: xem [`SKILL-MECHANICS.md`](SKILL-MECHANICS.md).

## Từ dẫn (Leading words)

Một **từ dẫn (leading word)** là một khái niệm cô đọng đã sẵn có trong quá trình pretraining của model mà agent dùng để suy nghĩ trong khi chạy tài liệu (_lesson_, _fog of war_, _tracer bullets_). Được lặp lại như một token, chứ không phải như một câu, nó tích lũy một định nghĩa phân tán và neo giữ cả một vùng hành vi trong ít token nhất, bằng cách khai thác các prior mà model đã sẵn có. Việc tự đặt ra một từ mới vẫn hiệu quả nếu bạn định nghĩa nó rõ ràng, nhưng một từ tự bịa ra không khai thác được prior nào — bạn phải trả bằng token định nghĩa cho những gì một từ đã-được-pretrain cho không; hãy tìm một từ có sẵn trước.

Nó neo giữ hai lần. Trong phần nội dung chính, đó là _thực thi (execution)_: agent tìm tới cùng một hành vi mỗi lần từ đó xuất hiện, và bên trong tài liệu tham khảo phẳng, nó tập trung sự chú ý vào một lớp sự vật cần tìm kiếm. Trong một pointer, đó là _kích hoạt (invocation)_: khi cùng một từ sống trong các prompt của bạn, tài liệu của bạn, và codebase của bạn, agent liên kết ngôn ngữ dùng chung đó với tài liệu và tiếp cận nó đáng tin cậy hơn.

Hãy săn tìm cơ hội để tái cấu trúc bằng các từ dẫn. Một bộ ba được diễn giải đầy đủ ở ba nơi, một pointer tốn cả một câu để chỉ ra một ý duy nhất — mỗi trường hợp là một đoạn văn đang chờ được nén lại thành một token duy nhất:

- "nhanh, tất định, ít chi phí" (fast, deterministic, low-overhead) → _tight_ (một vòng lặp _tight_).
- "một vòng lặp bạn tin tưởng" (a loop you believe in) → _red_ — một cổng mơ hồ trở thành một trạng thái nhị phân có thể quan sát được (vòng lặp chuyển _red_ khi có bug, hoặc không).

Bạn thắng hai lần: ít token hơn, và một điểm neo sắc bén hơn để agent treo suy nghĩ của nó lên. Hãy giả định rằng mọi tài liệu đều đang mang theo những sự diễn giải lặp lại mà các từ dẫn có thể loại bỏ — hãy đi tìm chúng.

**Phủ định (Negation)** là chế độ thất bại bên cạnh đòn bẩy này: điều hướng bằng cách cấm đoán sẽ kéo hành vi bị cấm vào ngữ cảnh và làm cho nó _dễ xuất hiện hơn_, chứ không phải ít đi. _Đừng nghĩ về một con voi_, và con voi là tất cả những gì còn lại; sự phủ định là một bổ nghĩa yếu mà khái niệm được kích hoạt mạnh sẽ lấn át, vì vậy lệnh cấm nửa-đọc-như một chỉ dẫn để làm chính điều đó. Hãy diễn đạt theo hướng **tích cực** (nêu rõ hành vi mục tiêu — "viết các comment một dòng") để hành vi bị cấm không bao giờ được nhắc tới. Một lệnh cấm chỉ xứng đáng có mặt như một rào chắn cứng (hard guardrail) mà bạn không thể diễn đạt theo hướng tích cực; ngay cả khi đó, hãy đi kèm nó với mục tiêu tích cực để sự chú ý đổ dồn vào việc cần làm.

## Cắt tỉa (Pruning)

- Giữ mỗi ý nghĩa ở một **nguồn chân lý duy nhất (single source of truth)**: một nơi duy nhất có thẩm quyền, để thay đổi hành vi là một chỉnh sửa ở một nơi duy nhất. **Sự trùng lặp (Duplication)** — cùng một ý nghĩa ở nhiều hơn một nơi — tốn chi phí bảo trì và token, và thổi phồng mức độ nổi bật của một ý nghĩa trên cái thang vượt quá thứ hạng thực sự của nó. (Đây là nghịch đảo tình cờ của một từ dẫn, vốn lặp lại một token có chủ đích, không bao giờ lặp lại ý nghĩa.)
- **Môi trường (environment)** cũng là một nguồn chân lý — các script trong `package.json`, các file config, cấu trúc thư mục, output của `--help` — và một tài liệu diễn giải lại nó là một **cache**: một bản sao của một tra cứu, chỉ xứng đáng chịu tải khi việc tra cứu đó tốn kém. Hãy cache những gì agent không thể tự tìm ra bằng cách nhìn: quy ước không được viết ra, lý do đằng sau một lựa chọn, cái bẫy mà không config nào thú nhận. Hãy để những tra cứu một-file, một-lệnh cho môi trường, nơi chúng không thể lỗi thời.
- Kiểm tra mỗi dòng về **tính liên quan (relevance)**: nó có còn liên quan tới những gì tài liệu làm không? Một dòng mất đi tính liên quan bằng cách không bao giờ liên quan tới nhiệm vụ (chỉ là diễn giải, hoặc một nhánh lẽ ra nên được công bố riêng) hoặc bằng cách trở nên lỗi thời khi hành vi hoặc thế giới mà nó mô tả thay đổi. Tài liệu ngắn hơn thì dễ giữ liên quan hơn. Không có kỷ luật cắt tỉa, số phận mặc định là **trầm tích (sediment)**: các lớp lỗi thời lắng đọng lại vì thêm vào có vẻ an toàn còn loại bỏ có vẻ rủi ro, cho đến khi bạn phải khoan xuyên qua chúng để tìm ra thứ vẫn còn sống.
- Săn tìm **no-op** (không-tác-dụng) từng câu một: một chỉ dẫn mà model đã tuân theo mặc định sẽ tốn tải mà không tạo ra tác dụng gì. Phép thử — nó có thay đổi hành vi so với mặc định không? — mang tính tương đối theo model, không phải tương đối theo người đọc: hai người bất đồng về một no-op là đang bất đồng về mặc định, và giải quyết bằng cách chạy tài liệu, không phải bằng tranh luận. Khi một câu thất bại phép thử này, hãy xóa toàn bộ câu đó thay vì cắt bớt từ trong nó. Phép thử này cũng đánh giá các từ dẫn: một từ quá yếu để vượt qua mặc định (_hãy kỹ lưỡng_ khi agent đã kỹ lưỡng sẵn) là một no-op, và cách sửa là một từ mạnh hơn (_không khoan nhượng_), không phải một kỹ thuật khác.
