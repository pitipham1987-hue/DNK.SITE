# Prototype Logic (Bản mẫu logic)

Một file HTML tự chứa (self-contained) duy nhất — một **bản demo có thể chia sẻ** — cho phép bất kỳ ai điều khiển một state model bằng cách bấm nút. Dùng cách này khi câu hỏi liên quan đến **business logic, chuyển trạng thái (state transitions), hoặc hình dạng dữ liệu (data shape)** — kiểu thứ trông có vẻ hợp lý trên giấy nhưng chỉ cảm thấy sai khi đưa nó qua các trường hợp thực tế.

Vì nó là một file duy nhất không cần cài đặt gì, bạn có thể đưa nó cho một người không phải developer — một designer, một PM, một chuyên gia domain — và để họ tự cảm nhận model. Vì vậy nó nói ngôn ngữ của họ, không phải ngôn ngữ của code.

## Khi nào đây là hình dạng đúng

- "Tôi không chắc liệu state machine này có xử lý được trường hợp biên khi X rồi đến Y hay không."
- "Liệu data model này có thực sự cho phép tôi biểu diễn trường hợp mà..."
- "Tôi muốn cảm nhận xem API nên trông như thế nào trước khi viết nó."
- Bất cứ điều gì mà ai đó muốn **bấm nút và xem trạng thái thay đổi**.

Nếu câu hỏi là "cái này nên trông như thế nào" — sai nhánh rồi. Dùng [UI.md](UI.md).

## Quy trình

### 1. Nêu rõ câu hỏi

Trước khi viết code, hãy viết ra bạn đang làm prototype cho state model nào và câu hỏi nào. Một đoạn văn, ở đầu bản demo (trong một phần giới thiệu hiển thị rõ ràng, không chỉ là comment). Một prototype logic trả lời sai câu hỏi là lãng phí thuần túy — hãy làm rõ câu hỏi để nó có thể được kiểm tra lại sau này, dù người dùng đang theo dõi ngay lúc đó hay quay lại xem sau khi vắng mặt (AFK).

### 2. Cô lập logic vào một module có thể mang đi (portable module)

Đặt logic thực sự — phần đang trả lời câu hỏi — vào một khối `<script>` duy nhất được viết như một module nhỏ, thuần túy (pure) có thể được lấy ra và đặt vào codebase thật sau này. Phần trang xung quanh nó là đồ bỏ (throwaway); module này thì không.

Hình dạng phù hợp phụ thuộc vào câu hỏi:

- **Một reducer thuần túy** — `(state, action) => state`. Tốt khi các action là các sự kiện rời rạc và state là một giá trị duy nhất.
- **Một state machine** — các trạng thái và chuyển tiếp (transition) rõ ràng. Tốt khi "hành động nào hiện đang hợp lệ" là một phần của câu hỏi.
- **Một tập hợp nhỏ các hàm thuần túy (pure function)** trên một kiểu dữ liệu đơn giản. Tốt khi không có trạng thái hiện tại ngầm định — chỉ có các phép biến đổi (transformation).
- **Một class hoặc module với bề mặt phương thức (method surface) rõ ràng** khi logic thực sự sở hữu trạng thái nội bộ đang diễn ra liên tục.

Chọn bất kỳ hình dạng nào phù hợp nhất với câu hỏi đang được đặt ra, *không phải* hình dạng nào dễ nối (wire) vào trang nhất. Giữ nó thuần túy: không DOM, không `document`, không có button handler chạm vào bên trong nó. Trang gọi vào module; không có luồng nào chạy theo chiều ngược lại. Đây là điều làm cho prototype hữu ích ngoài vòng đời của chính nó: một khi câu hỏi được trả lời, reducer / machine / tập hàm đã được xác thực sẽ tự nó được nâng cấp (lift) vào module thật.

### 3. Xây dựng file HTML có thể chia sẻ

Một file, HTML/CSS/JS thuần, không framework, không bundler, không server, mọi thứ đều inline để nó mở được bằng double-click và sống sót khi được gửi qua email cho người khác. Bất kỳ ai cũng nên có thể chạy nó bằng cách mở nó lên.

Viết nó cho một người không phải developer. Mỗi nhãn (label) đều bằng **ngôn ngữ domain**, không phải code — các nút và trạng thái đọc lên như nghiệp vụ, không phải như reducer. Giải thích bằng lời đơn giản điều gì đang xảy ra.

Bố cục nó với một hệ thống phân cấp rõ ràng, từ trên xuống dưới:

1. **Tiêu đề và giải thích một dòng** về những gì bản demo này cho phép bạn khám phá (câu hỏi từ bước 1).
2. **Trạng thái hiện tại (Current state)** — toàn bộ state liên quan, được render dưới dạng một panel dễ đọc (các trường có nhãn, không phải một bản dump JSON thô), được render lại sau mỗi lần bấm để thay đổi được nhìn thấy rõ. Ở những nơi giúp ích cho người không phải developer theo dõi, hãy nêu rõ điều gì vừa thay đổi.
3. **Các nút chơi tự do (Free-play buttons)** — một nút cho mỗi action, luôn khả dụng, để bất kỳ ai cũng có thể thử nghiệm model theo bất kỳ thứ tự nào. Mỗi lần bấm sẽ dispatch action của nó và render lại state.
4. **Hướng dẫn có kịch bản (Guided walkthroughs)** — một tập hợp các **kịch bản (scenarios)**, mỗi kịch bản một tab. Mỗi tab chứa một mô tả ngắn bằng ngôn ngữ thường về kịch bản đó — tình huống mà nó thiết lập và điều cần chú ý — và bên dưới nó, các **nút cần bấm** theo thứ tự cho kịch bản đó. Mỗi bước là một nút thật: bấm nó sẽ thực hiện action đó và chuyển sang bước tiếp theo. Bắt đầu một walkthrough sẽ reset về một trạng thái ban đầu đã biết để kịch bản chạy giống hệt nhau mỗi lần.

Chọn các kịch bản thể hiện các trường hợp khó xử — happy path, một trường hợp biên hóc búa, một nỗ lực làm điều gì đó lẽ ra phải bất hợp lệ — những trường hợp khó suy luận trên giấy.

Giữ nó đẹp nhưng tiết chế: kiểu chữ sạch sẽ, khoảng cách rộng rãi, một màu nhấn. Không hoạt ảnh, không mánh khóe — không có gì cạnh tranh với state và các nút.

### 4. Bàn giao

Gửi file cho họ, hoặc mở nó cho họ. Họ sẽ click qua các walkthrough và chơi tự do bất cứ khi nào họ có thời gian; những khoảnh khắc thú vị là khi họ nói "khoan, cái này không nên xảy ra được chứ" hoặc "ồ, tôi tưởng X sẽ khác" — đó là các bug trong _ý tưởng (idea)_, chính là mục đích của toàn bộ việc này. Nếu họ muốn các action mới hoặc một kịch bản mới, hãy thêm vào. Prototype tiến hóa dần.

### 5. Ghi lại câu trả lời và bản prototype

Khi prototype đã trả lời được câu hỏi của nó, hãy ghi lại câu trả lời, sau đó ghi lại bản prototype theo cách mà [SKILL](SKILL.md) mô tả. Ánh xạ cụ thể cho logic: reducer / machine / tập hàm đã được xác thực sẽ được nâng cấp (lift) vào module thật (quyết định, đã được hấp thụ); phần vỏ HTML sẽ đi kèm vào nhánh throwaway giữ prototype như một nguồn chính (primary source) — và vì là một file tự chứa duy nhất, nó vẫn có thể chạy lại một cách tầm thường ở đó.

## Các anti-pattern

- **Đừng thêm test.** Một prototype cần test thì không còn là prototype nữa.
- **Đừng nối nó với database thật.** Dùng in-memory state trừ khi câu hỏi cụ thể là về persistence.
- **Đừng tổng quát hóa.** Không có "nếu sau này chúng ta muốn hỗ trợ X." Prototype trả lời một câu hỏi duy nhất.
- **Đừng làm nhòe ranh giới giữa logic và trang.** Nếu module thuần túy tham chiếu đến DOM, `document`, hoặc các button handler, nó không còn có thể lift ra được nữa. Giữ trang như một lớp vỏ mỏng (thin shell) trên một module thuần túy.
- **Đừng dùng đến framework, bundler, hoặc server.** Một file mà người nhận double-click; một app React hoặc dev server sẽ phá vỡ tính "có thể chia sẻ."
- **Đừng đưa lớp vỏ HTML vào production.** Trang này được tối ưu hóa để được click qua bằng tay. Module logic đứng sau nó mới là thứ đáng giữ lại.
