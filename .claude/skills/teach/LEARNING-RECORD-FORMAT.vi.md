# Định dạng Learning Record

Các learning record nằm trong `./learning-records/` và dùng cách đánh số tuần tự: `0001-slug.md`, `0002-slug.md`, v.v. Tạo thư mục này một cách lười biếng (lazily) — chỉ khi record đầu tiên được viết ra.

Chúng là phiên bản tương đương trong giảng dạy của ADR: chúng ghi lại những bài học không hiển nhiên, những insight then chốt, và kiến thức nền đã được người dùng phát biểu, những điều sẽ định hướng cho các phiên học trong tương lai. Chúng được dùng để tính toán zone of proximal development (vùng phát triển gần).

## Mẫu (Template)

```md
# {Tiêu đề ngắn gọn của điều đã học hoặc đã được xác lập}

{1-3 câu: điều gì đã được học (hoặc kiến thức nền nào đã được xác lập), và tại sao nó quan trọng đối với các phiên học trong tương lai.}
```

Đó là toàn bộ định dạng. Một learning record có thể chỉ là một đoạn văn duy nhất. Giá trị nằm ở việc ghi lại _rằng_ điều này giờ đây đã được biết đến và _tại sao_ nó làm thay đổi những gì cần dạy tiếp theo — chứ không nằm ở việc điền đầy đủ các mục.

## Các mục tùy chọn

Chỉ đưa vào những mục này khi chúng thực sự mang lại giá trị. Phần lớn các record sẽ không cần đến chúng.

- **Status** (frontmatter) (`active | superseded by LR-NNNN`) — hữu ích khi một hiểu biết trước đó hóa ra là sai và bị thay thế.
- **Evidence** (Bằng chứng) — cách người dùng thể hiện sự hiểu biết đó (một câu hỏi đã trả lời, một bài tập đã hoàn thành, kinh nghiệm trước đây đã dẫn ra). Hữu ích khi khẳng định đó có thể sẽ được xem xét lại.
- **Implications** (Hệ quả) — điều này mở khóa hoặc loại trừ điều gì cho các phiên học trong tương lai. Đáng ghi lại khi điều đó không hiển nhiên.

## Đánh số

Quét `./learning-records/` để tìm số lớn nhất hiện có và tăng thêm một.

## Khi nào nên viết một learning record

Viết một record khi bất kỳ điều nào sau đây đúng:

1. **Người dùng đã thể hiện sự hiểu biết thực sự về một điều gì đó không tầm thường** — không chỉ là được tiếp xúc, mà là bằng chứng cho thấy họ có thể sử dụng đúng khái niệm đó. Điều này thiết lập một mốc sàn mới cho những gì cần dạy tiếp theo.
2. **Người dùng tiết lộ kiến thức nền đã có** — "Tôi đã biết X rồi." Ghi lại điều này để các phiên học sau không dạy lại nó. Cũng ghi lại _mức độ sâu_ mà họ tự nhận.
3. **Một quan niệm sai đã được sửa** — người dùng trước đây tin vào điều gì đó sai và bây giờ đã hiểu tại sao nó sai. Đây là những ghi chú có giá trị cao: chúng dự đoán những trở ngại trong tương lai đối với các chủ đề liên quan.
4. **Mission đã thay đổi do kết quả của việc học** — người dùng phát hiện ra rằng họ quan tâm đến một điều gì đó khác với những gì họ nghĩ ban đầu. Liên kết chéo (cross-link) tới [[MISSION.md]] và cập nhật nó.

### Điều gì _không_ đủ điều kiện

- Tài liệu chỉ đơn thuần đã được đề cập tới. Việc đề cập không phải là học. Hãy chờ bằng chứng.
- Bất cứ điều gì đã được ghi lại ngắn gọn trong [[GLOSSARY.md]] dưới dạng định nghĩa thuật ngữ. Đừng lặp lại.
- Nhật ký hoạt động theo từng phiên. Learning record không phải là một cuốn nhật ký — chúng là những insight có giá trị quyết định.

## Sự thay thế (Supersession)

Khi một record sau này mâu thuẫn với một record trước đó (sự hiểu biết của người dùng đã sâu hơn hoặc đã được sửa), hãy đánh dấu record cũ là `Status: superseded by LR-NNNN` thay vì xóa nó. Lịch sử về cách hiểu biết đã phát triển như thế nào tự nó cũng là một tín hiệu hữu ích.
