# Logic Prototype

Một file HTML đơn lẻ, tự chứa — một **bản demo có thể chia sẻ** — cho phép bất kỳ ai điều khiển một mô hình trạng thái bằng cách nhấp vào các nút bấm. Sử dụng cách này khi câu hỏi xoay quanh **logic nghiệp vụ, chuyển đổi trạng thái, hoặc hình dạng dữ liệu** — những thứ trông có vẻ hợp lý trên giấy nhưng chỉ thấy sai khi bạn đẩy nó qua các trường hợp thực tế.

Vì đây là một file duy nhất không cần cài đặt gì, bạn có thể đưa nó cho một người không phải developer — một designer, một PM, một chuyên gia nghiệp vụ — và để họ tự mình cảm nhận mô hình. Vì vậy nó nói ngôn ngữ của họ, không phải ngôn ngữ của code.

## Khi nào đây là hình dạng phù hợp

- "Tôi không chắc liệu state machine này có xử lý được edge case nơi X rồi đến Y hay không."
- "Mô hình dữ liệu này có thực sự cho phép tôi biểu diễn trường hợp nơi mà..."
- "Tôi muốn cảm nhận API sẽ trông như thế nào trước khi viết nó."
- Bất kỳ trường hợp nào mà ai đó muốn **nhấn nút và xem trạng thái thay đổi**.

Nếu câu hỏi là "cái này nên trông như thế nào" — sai nhánh. Hãy dùng [UI.md](UI.md).

## Quy trình

### 1. Nêu rõ câu hỏi

Trước khi viết code, hãy ghi lại mô hình trạng thái nào và câu hỏi nào bạn đang làm prototype. Một đoạn văn, ở đầu bản demo (trong phần giới thiệu hiển thị được, không chỉ là một comment). Một logic prototype trả lời sai câu hỏi là hoàn toàn lãng phí — hãy làm cho câu hỏi rõ ràng để có thể kiểm tra sau, dù người dùng đang theo dõi ngay bây giờ hay quay lại sau (AFK).

### 2. Cô lập logic trong một module có thể di chuyển

Đặt logic thực sự — phần trả lời câu hỏi — trong một khối `<script>` duy nhất được viết như một module nhỏ, thuần túy có thể nhấc ra và thả vào codebase thật sau này. Trang xung quanh nó là dùng-một-lần-rồi-bỏ; module này thì không.

Hình dạng phù hợp phụ thuộc vào câu hỏi:

- **Một reducer thuần túy** — `(state, action) => state`. Tốt khi các hành động là các sự kiện rời rạc và trạng thái là một giá trị duy nhất.
- **Một state machine** — các trạng thái và chuyển đổi rõ ràng. Tốt khi "hành động nào hợp lệ ngay lúc này" là một phần của câu hỏi.
- **Một tập hợp nhỏ các hàm thuần túy** trên một kiểu dữ liệu đơn giản. Tốt khi không có trạng thái hiện tại ngầm định — chỉ có các phép biến đổi.
- **Một class hoặc module với bề mặt phương thức rõ ràng** khi logic thực sự sở hữu trạng thái nội bộ đang diễn ra.

Chọn hình dạng nào phù hợp nhất với câu hỏi được hỏi, *không phải* hình dạng nào dễ nối với trang nhất. Giữ cho nó thuần túy: không DOM, không `document`, không button handler nào chui vào bên trong nó. Trang gọi vào nó; không có gì đi theo chiều ngược lại. Đây là điều làm cho prototype có ích vượt quá vòng đời của chính nó: một khi câu hỏi được trả lời, reducer / machine / tập hàm đã xác minh được nhấc vào module thật một cách độc lập.

### 3. Dựng file HTML có thể chia sẻ

Một file, HTML/CSS/JS thuần — không framework, không bundler, không server, mọi thứ inline để nó mở được bằng nhấp đôi chuột và sống sót khi được gửi qua email. Bất kỳ ai cũng có thể chạy nó bằng cách mở nó lên.

Viết nó cho một người không phải developer. Mọi nhãn đều bằng **ngôn ngữ nghiệp vụ (domain language)**, không phải code — các nút bấm và trạng thái đọc như nghiệp vụ, không phải reducer. Giải thích bằng từ ngữ đơn giản những gì đang diễn ra.

Bố trí nó với một hệ thống phân cấp sạch sẽ, từ trên xuống dưới:

1. **Tiêu đề và giải thích một dòng** về những gì bản demo này cho phép bạn khám phá (câu hỏi từ bước 1).
2. **Trạng thái hiện tại** — toàn bộ trạng thái liên quan, được hiển thị dưới dạng một panel dễ đọc (các trường có nhãn, không phải JSON thô), được hiển thị lại sau mỗi lần click để thay đổi được nhìn thấy rõ ràng. Nơi nào giúp người không phải developer theo dõi, hãy nêu rõ điều gì vừa thay đổi.
3. **Các nút bấm tự do (Free-play buttons)** — một nút cho mỗi hành động, luôn có sẵn, để bất kỳ ai cũng có thể chọc vào mô hình theo bất kỳ thứ tự nào. Mỗi lần click sẽ dispatch hành động của nó và render lại trạng thái.
4. **Hướng dẫn theo kịch bản (Guided walkthroughs)** — một tập hợp các **kịch bản (scenarios)**, một kịch bản cho mỗi tab. Mỗi tab giữ một mô tả bằng ngôn ngữ đơn giản ngắn gọn về kịch bản — tình huống nó đặt ra và những gì cần theo dõi — và bên dưới nó, các **nút cần bấm** theo thứ tự cho kịch bản đó. Mỗi bước là một nút thật: click vào nó sẽ thực hiện hành động đó và chuyển sang bước tiếp theo. Bắt đầu một walkthrough sẽ reset về trạng thái ban đầu đã biết để kịch bản chạy cùng một cách mỗi lần.

Chọn các kịch bản minh họa những trường hợp oái ăm — con đường hạnh phúc (happy path), một edge case lắt léo, một nỗ lực làm điều gì đó lẽ ra phải bất hợp lệ — những trường hợp khó suy luận trên giấy.

Giữ cho nó đẹp nhưng kiềm chế: typography sạch sẽ, khoảng cách rộng rãi, một màu nhấn duy nhất. Không animation, không chiêu trò — không có gì cạnh tranh với trạng thái và các nút bấm.

### 4. Bàn giao

Gửi cho họ file đó, hoặc mở nó cho họ. Họ sẽ click qua các walkthrough và tự do thử nghiệm bất cứ khi nào họ rảnh; những khoảnh khắc thú vị là khi họ nói "khoan, điều đó lẽ ra không thể xảy ra" hoặc "ồ, tôi cứ tưởng X sẽ khác" — đó chính là các con bug trong _ý tưởng_, đó là toàn bộ mục tiêu. Nếu họ muốn các hành động mới hoặc một kịch bản mới, hãy thêm chúng vào. Prototype tiến hóa.

### 5. Ghi lại câu trả lời và prototype

Một khi prototype đã trả lời câu hỏi của nó, hãy ghi lại câu trả lời, sau đó ghi lại prototype theo cách mà [SKILL](SKILL.md) mô tả. Ánh xạ đặc thù cho logic: reducer / machine / tập hàm đã xác minh nhấc vào module thật (quyết định được hấp thụ); vỏ HTML đi cùng sang branch dùng-một-lần-rồi-bỏ giữ prototype như một nguồn sơ cấp — và là một file tự chứa duy nhất, nó vẫn dễ dàng chạy lại được ở đó.

## Mẫu chống lại (Anti-patterns)

- **Đừng thêm test.** Một prototype cần test thì không còn là prototype nữa.
- **Đừng nối nó vào cơ sở dữ liệu thật.** Dùng trạng thái trong bộ nhớ trừ khi câu hỏi đặc biệt xoay quanh việc lưu trữ dữ liệu.
- **Đừng tổng quát hóa.** Không "nếu chúng ta muốn hỗ trợ X sau này thì sao". Prototype trả lời một câu hỏi.
- **Đừng làm mờ ranh giới giữa logic và trang.** Nếu module thuần túy tham chiếu tới DOM, `document`, hoặc các button handler, nó không còn nhấc ra được nữa. Giữ trang như một vỏ mỏng trên một module thuần túy.
- **Đừng tìm đến framework, bundler, hoặc server.** Một file người nhận nhấp đôi chuột vào; một app React hoặc dev server sẽ đánh bại tính "có thể chia sẻ".
- **Đừng đưa vỏ HTML vào production.** Trang được tối ưu hóa cho việc được nhấp qua bằng tay. Module logic đằng sau nó mới là phần đáng giữ lại.
