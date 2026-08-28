# Cơ chế của skill (Skill mechanics)

Nhánh đặc thù-cho-skill của [`writing-for-agents`](SKILL.md): điều gì thay đổi khi tài liệu đó là một skill — frontmatter, lựa chọn cách gọi (invocation), và các router skill. Mọi thứ khác về việc viết nó là tài liệu tham khảo phổ quát trong `SKILL.md`.

## Cách gọi (Invocation)

Hai lựa chọn, đánh đổi giữa hai loại tải (load):

- Một skill **model-invoked** (do model tự gọi) giữ lại một `description`, để agent có thể tự kích hoạt nó — và các skill khác có thể tiếp cận nó. Bạn vẫn có thể gõ tên nó: model-invocation luôn _bao gồm_ khả năng tiếp cận của người dùng; một description chỉ bao giờ thêm khả năng khám phá của agent, chứ không bao giờ lấy đi khả năng tiếp cận của con người. Description là context pointer cấp cao nhất của skill, bị buộc phải luôn được nạp — chi phí tải ngữ cảnh thường trực để đổi lấy khả năng được khám phá. Một skill model-invoked mà nội dung của nó toàn là tài liệu tham khảo cũng là một nơi lưu trữ tài liệu tham khảo dùng chung: skill khác có thể gọi nó, vì vậy tài liệu tham khảo cần cho nhiều skill sẽ sống ở một nơi duy nhất. Cơ chế: bỏ qua `disable-model-invocation`, và viết một description hướng-tới-model mang các nhánh kích hoạt (trigger branch) (các quy tắc viết pointer trong `SKILL.md` áp dụng đầy đủ).
- Một skill **user-invoked** (do người dùng tự gọi) tước bỏ description khỏi tầm với của agent: chỉ con người gõ tên nó mới có thể gọi nó, và không skill nào khác có thể gọi nó. Không tốn tải ngữ cảnh, nhưng tốn tải nhận thức (cognitive load) — bạn chính là chỉ mục phải nhớ rằng nó tồn tại. Cơ chế: đặt `disable-model-invocation: true`; `description` trở thành hướng-tới-con-người — một bản tóm tắt một dòng, các danh sách trigger bị loại bỏ.

Chỉ chọn model-invocation khi agent phải tự tiếp cận skill này, hoặc một skill khác phải tiếp cận nó. Nếu nó chỉ bao giờ được gọi bằng tay, hãy làm nó user-invoked và không phải trả tải ngữ cảnh nào.

Tài liệu tham khảo dùng chung mà hai skill user-invoked đều cần không thể sống trong cả hai — vì không có description, không skill nào có thể gọi skill kia. Hãy đẩy nó ra một file thuần túy bên ngoài hệ thống skill: tài liệu tham khảo bên ngoài mà bất kỳ skill nào cũng có thể trỏ tới.

## Chia tách theo cách gọi (Splitting by invocation)

Lát cắt theo cách gọi của việc chia tách (lát cắt theo trình tự sống trong `SKILL.md`): hãy tách ra một skill model-invoked khi bạn có một từ dẫn (leading word) khác biệt mà nên tự nó kích hoạt nó — một từ trigger mà bạn thực sự dùng trong các prompt của mình — hoặc khi một skill khác phải tiếp cận nó. Bạn phải trả tải ngữ cảnh cho description luôn-được-nạp mới, vì vậy khả năng tiếp cận độc lập đó phải đáng giá.

## Router skill

Khi các skill user-invoked nhân lên vượt quá những gì bạn có thể nhớ, gánh nặng tải nhận thức chồng chất đó được chữa trị bằng một **router skill**: một skill user-invoked duy nhất nêu tên các skill khác và khi nào nên dùng mỗi cái, để con người chỉ cần nhớ một skill thay vì nhiều skill. Nó chỉ có thể gợi ý, không bao giờ có thể tự gọi chúng: các skill user-invoked không có description, nên không gì ngoài con người có thể tiếp cận chúng.
