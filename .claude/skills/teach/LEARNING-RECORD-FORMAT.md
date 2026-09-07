# Định dạng Bản ghi Học tập (Learning Record Format)

Các bản ghi học tập sống trong `./learning-records/` và dùng đánh số tuần tự: `0001-slug.md`, `0002-slug.md`, v.v. Tạo thư mục một cách lười — chỉ khi bản ghi đầu tiên được viết.

Chúng là phiên bản dạy học tương đương với ADR: ghi lại các bài học không hiển nhiên, các hiểu biết then chốt, và kiến thức đã có được tuyên bố sẽ định hướng các phiên làm việc tương lai. Chúng được dùng để tính toán vùng phát triển gần nhất.

## Mẫu (Template)

```md
# {Tiêu đề ngắn gọn về những gì đã học được hoặc chốt được}

{1-3 câu: những gì đã học được (hoặc kiến thức đã có nào đã được xác định), và tại sao nó quan trọng cho các phiên tương lai.}
```

Đó là toàn bộ định dạng. Một bản ghi học tập có thể chỉ là một đoạn văn duy nhất. Giá trị nằm ở việc ghi lại *rằng* điều này giờ đây đã được biết và *tại sao* nó làm thay đổi điều cần dạy tiếp theo — không phải ở việc điền đầy các mục.

## Các mục tùy chọn

Chỉ đưa vào những mục này khi chúng mang lại giá trị thực sự. Hầu hết các bản ghi sẽ không cần chúng.

- **Status** frontmatter (`active | superseded by LR-NNNN`) — hữu ích khi một sự hiểu biết trước đó hóa ra sai và được thay thế.
- **Evidence** — cách người dùng thể hiện sự hiểu biết (một câu hỏi đã trả lời, một bài tập đã hoàn thành, kinh nghiệm trước đó được trích dẫn). Hữu ích khi khẳng định có thể được xem xét lại.
- **Implications** — những gì điều này mở ra hoặc loại trừ cho các phiên tương lai. Đáng ghi lại khi không hiển nhiên.

## Đánh số

Quét `./learning-records/` để tìm số hiện có cao nhất và tăng lên một.

## Khi nào nên viết một bản ghi học tập

Viết một bản ghi khi bất kỳ điều nào sau đây là đúng:

1. **Người dùng thể hiện sự hiểu biết thực sự về một điều gì đó không vô nghĩa** — không chỉ là tiếp xúc, mà là bằng chứng cho thấy họ có thể sử dụng khái niệm chính xác. Điều này thiết lập một sàn mới cho những gì cần dạy tiếp theo.
2. **Người dùng tiết lộ kiến thức đã có** — "Tôi đã biết X rồi." Ghi lại để các phiên tương lai không dạy lại. Cũng ghi lại *độ sâu* được tuyên bố.
3. **Một hiểu lầm đã được sửa chữa** — người dùng trước đây tin vào một điều sai và giờ đây thấy tại sao. Những điều này có giá trị cao: chúng dự đoán các chướng ngại vật tương lai cho các chủ đề có liên quan.
4. **Mission thay đổi để phản hồi lại việc học** — người dùng phát hiện ra họ quan tâm đến một điều gì đó khác với những gì họ nghĩ. Liên kết chéo tới [[MISSION.md]] và cập nhật nó.

### Những gì *không* đủ điều kiện

- Tài liệu chỉ đơn thuần được đi qua. Đi qua không phải là học tập. Hãy chờ bằng chứng.
- Bất kỳ điều gì đã được ghi lại một cách ngắn gọn trong [[GLOSSARY.md]] dưới dạng định nghĩa thuật ngữ. Đừng trùng lặp.
- Nhật ký hoạt động từng phiên. Các bản ghi học tập không phải nhật ký — chúng là các hiểu biết cấp quyết định.

## Thay thế (Supersession)

Khi một bản ghi sau mâu thuẫn với một bản ghi trước (sự hiểu biết của người dùng sâu sắc hơn hoặc được sửa lại), hãy đánh dấu bản ghi cũ `Status: superseded by LR-NNNN` thay vì xóa nó. Lịch sử về cách sự hiểu biết tiến hóa chính là một tín hiệu hữu ích.
