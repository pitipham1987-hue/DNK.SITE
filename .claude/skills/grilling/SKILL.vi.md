---
name: grilling
description: Chất vấn người dùng không khoan nhượng về một kế hoạch, quyết định, hoặc ý tưởng. Dùng khi người dùng muốn kiểm tra độ vững chắc của suy nghĩ của họ, hoặc dùng bất kỳ cụm từ kích hoạt 'grill' nào.
---

Phỏng vấn người dùng không khoan nhượng cho đến khi đạt được sự hiểu biết chung. Ánh xạ việc này như một **cây quyết định thiết kế (design tree)**: mỗi quyết định phân nhánh thành các quyết định phụ thuộc vào nó.

Làm việc trên cây theo từng **vòng (rounds)**. **Đường biên (frontier)** là mọi quyết định mà các điều kiện tiên quyết của nó đã được chốt: những câu hỏi bạn có thể hỏi *ngay bây giờ* mà không cần đoán mò các câu trả lời bạn chưa nghe. Hỏi toàn bộ đường biên trong một vòng: đánh số từng câu hỏi và đưa ra câu trả lời bạn đề xuất. Sau đó chờ câu trả lời của người dùng trước khi sang vòng tiếp theo.

Mỗi câu hỏi nên được định dạng như sau:

```
❓ **Q1** - **<tiêu đề câu hỏi>**: <nội dung câu hỏi, có thể gồm nhiều đoạn, bao gồm nhiều lựa chọn>

➡️ <câu trả lời bạn đề xuất>
```

Mỗi vòng, các câu trả lời của người dùng sẽ định hình lại cây quyết định: các quyết định đã chốt sẽ đẩy đường biên ra xa hơn và mở khóa các câu hỏi từng phụ thuộc vào chúng. Tính lại đường biên và hỏi vòng tiếp theo. Một câu hỏi mà câu trả lời của nó phụ thuộc vào một câu hỏi khác vẫn còn bỏ ngỏ trong vòng này thì thuộc về một vòng *sau*, không phải vòng này.

Tìm ra các *sự kiện (facts)* là công việc của bạn, không bao giờ là của người dùng. Khi một câu hỏi ở đường biên cần một sự kiện từ môi trường (hệ thống tệp, công cụ, v.v.), hãy triển khai một sub-agent để tìm nó; đừng hỏi người dùng bất cứ điều gì mà bạn có thể tự tra cứu. Đừng chặn tiến trình vì việc đó: một quá trình khám phá đang chạy là một điều kiện tiên quyết chưa được chốt, vì vậy chỉ những câu hỏi phụ thuộc vào nó mới phải chờ sub-agent báo cáo; hãy hỏi phần còn lại của đường biên ngay bây giờ. Các *quyết định* là của người dùng: đưa từng cái cho họ và chờ đợi.

Phiên làm việc kết thúc khi đường biên trống rỗng: mọi nhánh của cây quyết định thiết kế đã được xem xét, không có gì bị âm thầm giả định. Không hành động dựa trên nó cho đến khi người dùng xác nhận rằng bạn đã đạt được sự hiểu biết chung.
