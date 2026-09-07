# Cơ chế Skill (Skill mechanics)

Nhánh riêng về skill của [`writing-for-agents`](SKILL.md): những gì thay đổi khi tài liệu là một skill — frontmatter, lựa chọn phương thức gọi (invocation choice), và các router skill. Mọi thứ khác về việc viết tài liệu đều nằm trong tài liệu tham khảo chung tại `SKILL.md`.

## Lựa chọn phương thức gọi (Invocation)

Hai lựa chọn, đánh đổi giữa hai loại tải (two loads):

- Một skill được **mô hình gọi (model-invoked)** giữ lại trường `description`, để agent có thể tự động kích hoạt nó — và các skill khác có thể tìm đến nó. Bạn vẫn có thể gõ tên của nó: việc mô hình gọi luôn _bao gồm_ khả năng con người tự gọi; description chỉ thêm tính năng agent tự phát hiện chứ không bao giờ tước đi quyền của con người. Description là con trỏ ngữ cảnh cấp cao nhất của skill, bị buộc phải luôn được tải vào context — chi phí tải ngữ cảnh cố định để đổi lấy khả năng được phát hiện. Một model-invoked skill mà nội dung hoàn toàn là tham chiếu cũng là một nơi lưu giữ tài liệu tham chiếu dùng chung: một skill khác có thể gọi nó, vì vậy tài liệu tham chiếu cần thiết cho nhiều skill có thể sống tại một nơi. Cơ chế: bỏ qua `disable-model-invocation`, và viết một description hướng tới mô hình chứa các nhánh kích hoạt (các quy tắc viết con trỏ trong `SKILL.md` áp dụng đầy đủ).
- Một skill được **người dùng gọi (user-invoked)** sẽ tước bỏ description khỏi tầm với của agent: chỉ có con người gõ tên mới có thể kích hoạt nó, và không skill nào khác có thể gọi nó. Chi phí tải ngữ cảnh bằng 0, nhưng tốn chi phí nhận thức (cognitive load) — bạn chính là mục lục phải ghi nhớ sự tồn tại của nó. Cơ chế: đặt `disable-model-invocation: true`; trường `description` trở nên hướng tới con người — một dòng tóm tắt ngắn gọn, đã lược bỏ danh sách các nhánh kích hoạt.

Chỉ chọn model-invocation khi agent phải tự mình tìm đến skill, hoặc một skill khác phải gọi nó. Nếu nó chỉ được kích hoạt thủ công, hãy biến nó thành user-invoked và không phải trả chi phí tải ngữ cảnh nào.

Tài liệu tham chiếu chung mà hai user-invoked skill cùng cần thì không nên nằm trong skill nào cả — vì không có description, không skill nào có thể kích hoạt skill kia. Hãy đẩy nó ra một file thuần túy nằm ngoài hệ thống skill: tài liệu tham chiếu bên ngoài mà bất kỳ skill nào cũng có thể trỏ tới.

## Chia tách theo phương thức gọi (Splitting by invocation)

Góc độ phương thức gọi của việc chia tách (góc độ chuỗi bước nằm ở `SKILL.md`): chia tách thành một model-invoked skill riêng khi bạn có một từ dẫn dắt (leading word) riêng biệt đủ để tự nó kích hoạt skill đó — một từ kích hoạt mà bạn thực sự sử dụng trong các câu prompt của mình — hoặc khi một skill khác phải tìm tới nó. Bạn trả chi phí tải ngữ cảnh cho description mới luôn-được-tải, vì vậy khả năng truy cập độc lập đó phải xứng đáng với chi phí bỏ ra.

## Router skill

Khi các user-invoked skill nhân lên vượt quá khả năng ghi nhớ của bạn, chi phí nhận thức chất đống đó sẽ được giải quyết bằng một **router skill**: một user-invoked skill đứng ra đặt tên cho các skill khác và chỉ rõ khi nào cần tìm đến từng skill, giúp con người chỉ cần nhớ một skill thay vì nhiều skill. Nó chỉ có thể gợi ý chứ không bao giờ tự kích hoạt chúng: các user-invoked skill không có description, nên không gì ngoài con người có thể kích hoạt chúng.
