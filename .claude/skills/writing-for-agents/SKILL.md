---
name: writing-for-agents
description: Viết tài liệu cho agent. Sử dụng khi tạo hoặc chỉnh sửa skill, hoặc sửa đổi AGENTS.md hoặc CLAUDE.md.
---

Tài liệu tham khảo cho việc viết bất kỳ tài liệu nào mà agent tiêu thụ — một skill, một file `AGENTS.md` / `CLAUDE.md`, một tài liệu được tiếp cận thông qua một con trỏ ngữ cảnh. Cách đóng gói có thể khác nhau; cách viết thì không: cùng những đòn bẩy làm cho mỗi tài liệu trở nên có thể dự đoán được — agent thực hiện cùng một _quy trình_ trong mọi lần chạy, chứ không phải tạo ra cùng một đầu ra.

Khi tài liệu bạn đang viết là một skill, hãy đọc [`SKILL-MECHANICS.md`](SKILL-MECHANICS.md) để biết về frontmatter, lựa chọn phương thức gọi, và các router skill.

## Con trỏ ngữ cảnh (Context pointers)

Một **con trỏ ngữ cảnh (context pointer)** là một tham chiếu nằm trong ngữ cảnh của agent chỉ định một tài liệu nằm ngoài ngữ cảnh và mã hóa điều kiện để tìm tới nó. Trường description của một skill là một con trỏ như vậy; một dòng trong `AGENTS.md` chỉ định một tài liệu cũng là cùng một đối tượng. _Cách diễn đạt_ của con trỏ, chứ không phải mục tiêu của nó, sẽ quyết định khi nào agent tìm tới tài liệu — và mức độ tin cậy ra sao. Một mục tiêu bắt buộc phải có nằm sau một con trỏ diễn đạt yếu là một lỗi biến thể (variance bug): hãy làm sắc nét cách diễn đạt trước, và chỉ nhúng trực tiếp tài liệu vào context khi việc làm sắc nét thất bại.

Một con trỏ thực hiện hai nhiệm vụ — nêu rõ tài liệu đó là gì, và liệt kê các **nhánh (branches)** sẽ kích hoạt việc tìm tới nó (một nhánh là một trường hợp riêng biệt mà tài liệu xử lý, để các lần chạy khác nhau đi theo các con đường khác nhau qua nó). Mỗi từ của một con trỏ luôn-được-tải đều tốn chi phí trên mọi lượt (turn), nên nó đòi hỏi phải được cắt gọt nghiêm ngặt hơn cả phần thân:

- **Đưa từ dẫn dắt (leading word) lên đầu** — con trỏ là nơi nó thực hiện công việc kích hoạt.
- **Một trigger cho mỗi nhánh.** Các từ đồng nghĩa gọi lại cùng một nhánh là một nhánh được viết hai lần; hãy thu gọn chúng và chỉ giữ lại các nhánh thực sự riêng biệt.
- **Cắt bỏ phần định danh mà phần thân đã mang.**

## Hai loại tải (The two loads)

Mỗi tài liệu và con trỏ bạn thêm vào sẽ tiêu tốn một trong hai ngân sách:

- **Tải ngữ cảnh (Context load)** — chi phí của tài liệu luôn-được-tải nằm trên cửa sổ của agent: một dòng trong `AGENTS.md`, một description của skill, bất kỳ thứ gì nằm trong context mỗi lượt, tiêu tốn token và sự chú ý dù nó có được kích hoạt hay không.
- **Tải nhận thức (Cognitive load)** — chi phí đặt lên con người: tài liệu nào tồn tại và khi nào cần tìm tới từng tài liệu. Con người chính là mục lục. Đây không phải chi phí cần giảm thiểu tối đa — đó là cái giá của sự chủ động của con người; hãy chi tiêu nó ở nơi sự phán đoán của con người có ý nghĩa, và loại bỏ nó ở nơi không cần thiết.

Tài liệu chỉ được tiếp cận thông qua con trỏ sẽ thoát khỏi chi phí tải ngữ cảnh bằng cái giá của chính dòng con trỏ đó; tài liệu không có con trỏ nào sẽ hoàn toàn phụ thuộc vào tải nhận thức.

## Phân cấp thông tin (Information hierarchy)

Một tài liệu được xây dựng từ hai loại nội dung — **các bước (steps)** (các hành động có thứ tự mà agent thực hiện) và **tham chiếu (reference)** (định nghĩa, quy tắc, thực tế được tham khảo khi có nhu cầu) — được trộn lẫn tự do: toàn bộ là các bước (một công thức), toàn bộ là tham chiếu (các quy tắc của một cuộc review, skill này), hoặc cả hai. Quyết định cốt lõi là từng mảnh thông tin nằm ở đâu trên **thang phân cấp thông tin**, một nấc thang được xếp hạng theo mức độ cấp thiết mà agent cần tài liệu đó:

1. **Bước trong file (In-file step)** — tầng cấp 1: những gì agent làm, theo thứ tự.
2. **Tham chiếu trong file (In-file reference)** — được tham khảo khi có nhu cầu. Thường là một tập hợp các quy tắc ngang hàng chính đáng (mọi quy tắc review nằm trên một nấc) — một sự sắp xếp tốt, không phải điểm xấu.
3. **Tham chiếu tiết lộ dần (Disclosed reference)** — được đẩy ra một file riêng, tiếp cận qua một con trỏ ngữ cảnh, chỉ được tải khi con trỏ kích hoạt. Bao quát một file anh em trong cùng thư mục cho đến tài liệu tham chiếu hoàn toàn bên ngoài sống ở bất kỳ đâu và bất kỳ tài liệu nào cũng có thể trỏ tới.

Đẩy quá ít xuống dưới sẽ làm phần đỉnh bị phình to; đẩy quá nhiều sẽ giấu đi tài liệu mà agent thực sự cần. Sự giằng co đó chính là toàn bộ quyết định.

**Tiết lộ tiệm tiến (Progressive disclosure)** là bước đi xuống thang — ra khỏi file chính và nằm sau một con trỏ — để phần đỉnh luôn dễ đọc. Đây không chủ yếu là tối ưu hóa token: đó là cách bảo vệ hệ thống phân cấp. Phân nhánh là bài kiểm tra tiết lộ sạch sẽ nhất: nhúng trực tiếp những gì mọi nhánh đều cần, và đẩy vào sau con trỏ những gì chỉ một số nhánh tìm tới. Khi một tài liệu có các bước, tài liệu tham chiếu trong file lẽ ra nên được tiết lộ dần sẽ vùi lấp các bước đó và biến việc chú ý đến chúng thành một trò tung đồng xu — một đòn bẩy gây biến thể, chứ không chỉ là vấn đề dễ đọc.

**Đặt cùng vị trí (Co-location)** là người bạn đồng hành trong cùng file: nơi nấc thang quyết định một mảnh thông tin nằm _sâu đến mức nào_, việc đặt cùng vị trí quyết định _những gì nằm bên cạnh nó_ khi ở đó. Giữ định nghĩa, quy tắc và lưu ý của một khái niệm dưới một tiêu đề thay vì rải rác, để khi đọc một phần sẽ kéo theo các phần lân cận của nó. Bài kiểm tra: tài liệu phải đọc giống như tài liệu được viết cho agent — nội dung được gom nhóm sẽ đọc theo cách đó; nội dung rải rác thì không. (Khác với sự trùng lặp: sự trùng lặp lặp lại một ý nghĩa ở hai nơi; sự rải rác phân mảnh một ý nghĩa ra nhiều nơi.)

**Sự tràn lan (Sprawl)** là chế độ thất bại ở đây: một tài liệu quá dài, ngay cả khi mọi dòng đều hoạt động và duy nhất. Sự chú ý bị mỏng đi trên phần dư thừa, và mỗi dòng thừa là một dòng nữa phải giữ cho có liên quan. Phao cứu sinh là nấc thang: tiết lộ tài liệu tham chiếu sau các con trỏ, và chia tách theo nhánh hoặc chuỗi để mỗi con đường chỉ mang những gì nó cần.

## Các bước và tiêu chí hoàn thành (Steps and completion criteria)

Mỗi bước đều kết thúc bằng một **tiêu chí hoàn thành (completion criterion)** — điều kiện báo cho agent biết công việc đã xong. Hai tính chất biến nó thành đòn bẩy:

- **Độ rõ ràng (Clarity)** — agent có thể phân biệt được xong và chưa xong hay không? Một ranh giới mơ hồ ("đạt được sự hiểu biết") dẫn đến **hoàn thành sớm (premature completion)**: kết thúc bước trước khi nó thực sự hoàn tất, sự chú ý trượt sang _việc đã hoàn thành_. Các bước hiển thị vẫn ở phía trước — **các bước sau hoàn thành (post-completion steps)** — tạo ra lực kéo; độ rõ ràng của tiêu chí chính là lực cản. Hãy phòng thủ theo thứ tự: **làm sắc nét ranh giới trước** (cục bộ và rẻ); chỉ khi nó mờ nhạt không thể giảm bớt _và_ bạn quan sát thấy sự vội vã, hãy giấu các bước sau bằng cách chia tách chuỗi — và việc giấu chỉ có tác dụng qua một ranh giới ngữ cảnh thực sự (bàn giao hoặc kích hoạt subagent; một lời gọi inline giữ các bước sau trong ngữ cảnh và không xóa được gì).
- **Yêu cầu (Demand)** — mức độ đòi hỏi của nó. "Mọi model bị chỉnh sửa đều được giải trình" bắt buộc công việc phải triệt để trong khi "tạo danh sách thay đổi" thì không. Yêu cầu thúc đẩy **công việc chuẩn bị (legwork)** — sự đào sâu mà agent thực hiện trong công việc, tiềm ẩn trong cách diễn đạt chứ không phải được viết thành một bước riêng — và nó không bị giới hạn bởi bước: "mọi quy tắc được áp dụng" ràng buộc một tập hợp tham chiếu phẳng giống như "mọi bước được hoàn thành" ràng buộc một chuỗi, đó là cách một tài liệu toàn tham chiếu vẫn mang một thanh tiêu chuẩn về tính triệt để.

Các tiêu chí mạnh nhất là các tiêu chí vừa có thể kiểm tra được vừa mang tính triệt để.

## Khi nào nên chia tách (When to split)

Chia tách một tài liệu thành hai sẽ tiêu tốn một trong hai loại tải, vì vậy chỉ chia tách khi đường cắt mang lại giá trị:

- **Theo chuỗi bước (By sequence)** — chia tách một chuỗi các bước nơi các bước sau hoàn thành cám dỗ agent vội vã vượt qua bước phía trước. Giữ chúng ngoài tầm mắt sẽ thúc đẩy nhiều công việc chuẩn bị hơn cho nhiệm vụ hiện tại. Hãy cẩn trọng với điều ngược lại: gộp các chuỗi bước làm lộ các bước sau của mỗi bước cho những gì tiếp theo, dẫn đến hoàn thành sớm.
- **Theo phương thức gọi (By invocation)** — dành riêng cho skill: xem [`SKILL-MECHANICS.md`](SKILL-MECHANICS.md).

## Từ dẫn dắt (Leading words)

Một **từ dẫn dắt (leading word)** là một khái niệm cô đọng đã tồn tại sẵn trong quá trình pretraining của mô hình mà agent dùng để suy nghĩ trong khi chạy tài liệu (_lesson_, _fog of war_, _tracer bullets_). Được lặp lại dưới dạng một token, không bao giờ là một câu, nó tích lũy một định nghĩa phân tán và neo giữ toàn bộ một vùng hành vi trong số lượng token ít nhất, bằng cách huy động các tri thức có sẵn (priors) mà mô hình đã nắm giữ. Việc tự đặt ra từ riêng sẽ hoạt động nếu bạn định nghĩa nó rõ ràng, nhưng một từ tự bịa không huy động được tri thức có sẵn nào — bạn trả giá bằng các token định nghĩa cho những gì một từ pretraining cung cấp miễn phí; hãy tìm một từ có sẵn trước.

Nó neo giữ hai lần. Trong phần thân, _sự thực thi_: agent tìm đến cùng một hành vi mỗi khi từ đó xuất hiện, và bên trong tài liệu tham chiếu phẳng nó tập trung sự chú ý vào một nhóm đối tượng cần tìm kiếm. Trong một con trỏ, _sự kích hoạt_: khi cùng một từ sống trong prompt, tài liệu và codebase của bạn, agent sẽ liên kết ngôn ngữ chung đó với tài liệu và tìm tới nó một cách tin cậy hơn.

Hãy săn tìm cơ hội để refactor bằng các từ dẫn dắt. Một bộ ba được diễn giải ở ba nơi, một con trỏ tốn một câu để chỉ vào một ý tưởng — mỗi nơi là một đoạn văn đang xin được thu gọn thành một token duy nhất:

- "nhanh, xác định, chi phí thấp" → _tight_ (một vòng lặp _tight_).
- "một vòng lặp bạn tin tưởng" → _red_ — một cổng mơ hồ trở thành một trạng thái quan sát được dạng nhị phân (vòng lặp chuyển sang màu _red_ khi gặp bug, hoặc không).

Bạn thắng hai lần: ít token hơn, và một cái móc sắc nét hơn để agent treo tư duy của nó lên đó. Hãy giả định mọi tài liệu đều mang những lời diễn giải lại mà các từ dẫn dắt có thể thay thế — hãy đi tìm chúng.

**Sự phủ định (Negation)** là chế độ thất bại bên cạnh đòn bẩy này: điều hướng bằng sự cấm đoán sẽ kéo hành vi bị cấm vào ngữ cảnh và làm cho nó _dễ xuất hiện hơn_, chứ không ít đi. _Đừng nghĩ về một con voi_, và con voi là tất cả những gì tồn tại; sự phủ định là một từ bổ nghĩa yếu mà khái niệm được kích hoạt mạnh mẽ sẽ lấn át, nên lời cấm bị đọc một nửa như một hướng dẫn thực hiện điều đó. Hãy prompt tính **khẳng định** — nêu rõ hành vi mục tiêu ("viết comment một dòng") để hành vi bị cấm không bao giờ được nhắc đến. Một lời cấm chỉ có vị trí khi là một rào chắn cứng mà bạn không thể diễn đạt một cách khẳng định; ngay cả khi đó, hãy ghép nó với mục tiêu khẳng định để sự chú ý rơi vào những gì cần làm.

## Cắt gọt (Pruning)

- Giữ mỗi ý nghĩa trong **một nguồn sự thật duy nhất (single source of truth)**: một nơi có thẩm quyền, để việc thay đổi hành vi là một chỉnh sửa tại một nơi. **Sự trùng lặp (Duplication)** — cùng một ý nghĩa ở nhiều hơn một nơi — tiêu tốn chi phí bảo trì và token, đồng thời thổi phồng sự nổi bật của một ý nghĩa trên nấc thang vượt quá thứ hạng thực sự của nó. (Trường hợp ngược lại vô tình của một từ dẫn dắt, vốn lặp lại một token cố ý, chứ không bao giờ lặp lại ý nghĩa.)
- **Môi trường (Environment)** cũng là một nguồn sự thật — các script trong `package.json`, file cấu hình, bố cục thư mục, đầu ra của `--help` — và một tài liệu diễn giải lại nó là một **bản lưu tạm (cache)**: một bản sao của một lần tra cứu, chỉ xứng đáng với tải của nó khi việc tra cứu đắt đỏ. Hãy lưu tạm những gì agent không thể tìm thấy bằng cách quan sát: quy ước chưa viết, lý do đằng sau một lựa chọn, bài học ẩn mà không cấu hình nào thú nhận. Hãy để các cuộc tra cứu một file, một lệnh cho môi trường, nơi chúng không thể bị lỗi thời.
- Kiểm tra từng dòng về **tính liên quan (relevance)**: nó có còn tác động đến những gì tài liệu làm hay không? Một dòng mất đi tính liên quan do không bao giờ tác động đến nhiệm vụ (chỉ là phần diễn giải thuần túy, hoặc một nhánh lẽ ra nên được tiết lộ) hoặc do trở nên lỗi thời khi hành vi hoặc thế giới mà nó mô tả thay đổi. Tài liệu ngắn hơn thì dễ giữ cho có liên quan hơn. Nếu không có tính kỷ luật cắt gọt, số phận mặc định là **lớp trầm tích (sediment)**: các lớp lỗi thời lắng xuống vì thêm vào cảm thấy an toàn còn xóa đi cảm thấy rủi ro, cho đến khi bạn phải khoan sâu qua chúng để tìm những gì vẫn còn hoạt động.
- Săn tìm **no-op** từng câu một: một hướng dẫn mà mô hình mặc định đã tuân theo sẽ trả chi phí tải để nói một điều vô ích. Bài kiểm tra — nó có thay đổi hành vi so với mặc định hay không? — mang tính tương đối với mô hình, chứ không tương đối với người đọc: hai người bất đồng về một no-op là bất đồng về mặc định, và giải quyết bằng cách chạy tài liệu, chứ không phải bằng tranh luận. Khi một câu thất bại, hãy xóa toàn bộ câu đó thay vì tỉa tót các từ trong đó. Bài kiểm tra cũng đánh giá các từ dẫn dắt: một từ quá yếu không thể đánh bại mặc định (_be thorough_ khi agent đã tương đối cẩn thận) là một no-op, và cách khắc phục là một từ mạnh hơn (_relentless_), chứ không phải một kỹ thuật khác.
