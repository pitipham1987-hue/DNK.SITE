# Định dạng ADR

ADR sống trong `docs/adr/` và dùng đánh số tuần tự: `0001-slug.md`, `0002-slug.md`, v.v.

Tạo thư mục `docs/adr/` một cách lười (lazily) — chỉ khi ADR đầu tiên cần thiết.

## Mẫu (Template)

```md
# {Tiêu đề ngắn gọn của quyết định}

{1-3 câu: ngữ cảnh là gì, chúng ta đã quyết định gì, và tại sao.}
```

Vậy là xong. Một ADR có thể chỉ là một đoạn văn duy nhất. Giá trị nằm ở việc ghi lại *rằng* một quyết định đã được đưa ra và *tại sao* — không phải ở việc điền đầy các mục.

## Các mục tùy chọn

Chỉ đưa vào những mục này khi chúng mang lại giá trị thực sự. Hầu hết ADR sẽ không cần chúng.

- **Status** frontmatter (`proposed | accepted | deprecated | superseded by ADR-NNNN`) — hữu ích khi các quyết định được xem xét lại
- **Considered Options** (Các phương án đã xem xét) — chỉ khi các phương án bị loại bỏ đáng để ghi nhớ
- **Consequences** (Hệ quả) — chỉ khi các hệ quả dây chuyền không rõ ràng cần được nêu rõ

## Đánh số

Quét `docs/adr/` để tìm số hiện có cao nhất và tăng lên một.

## Khi nào nên đề xuất một ADR

Cả ba điều sau đều phải đúng:

1. **Khó đảo ngược** — chi phí thay đổi quyết định sau này là đáng kể
2. **Gây ngạc nhiên nếu không có ngữ cảnh** — một người đọc trong tương lai sẽ nhìn vào code và tự hỏi "sao trời lại làm theo cách này?"
3. **Kết quả của một sự đánh đổi thực sự** — có những phương án thay thế thực sự và bạn chọn một vì những lý do cụ thể

Nếu một quyết định dễ đảo ngược, hãy bỏ qua nó — bạn sẽ chỉ đảo ngược nó thôi. Nếu nó không gây ngạc nhiên, sẽ không ai thắc mắc tại sao. Nếu không có phương án thay thế thực sự, không có gì để ghi lại ngoài "chúng tôi đã làm điều hiển nhiên."

### Những gì đủ điều kiện

- **Hình dạng kiến trúc.** "Chúng tôi đang dùng một monorepo." "Write model được event-sourced, read model được chiếu (projected) vào Postgres."
- **Các mẫu tích hợp giữa các context.** "Ordering và Billing giao tiếp qua domain event, không phải HTTP đồng bộ."
- **Các lựa chọn công nghệ mang tính khóa chặt (lock-in).** Database, message bus, auth provider, deployment target. Không phải mọi thư viện — chỉ những cái mà việc thay thế sẽ mất cả một quý.
- **Các quyết định về ranh giới và phạm vi.** "Dữ liệu khách hàng thuộc sở hữu của context Customer; các context khác chỉ tham chiếu nó qua ID." Những cái "không" rõ ràng cũng có giá trị như những cái "có".
- **Những sai lệch có chủ đích khỏi con đường hiển nhiên.** "Chúng tôi dùng SQL thủ công thay vì ORM vì X." Bất cứ điều gì mà một người đọc hợp lý sẽ giả định điều ngược lại. Những cái này ngăn kỹ sư tiếp theo "sửa" một thứ vốn dĩ là có chủ đích.
- **Các ràng buộc không thấy được trong code.** "Chúng tôi không thể dùng AWS vì yêu cầu tuân thủ (compliance)." "Thời gian phản hồi phải dưới 200ms vì hợp đồng API với đối tác."
- **Các phương án bị loại bỏ khi việc loại bỏ đó không hiển nhiên.** Nếu bạn đã cân nhắc GraphQL và chọn REST vì những lý do tinh tế, hãy ghi lại — nếu không sáu tháng sau ai đó sẽ lại đề xuất GraphQL.
