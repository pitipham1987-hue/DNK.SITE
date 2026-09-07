---
name: to-spec
description: Biến cuộc hội thoại hiện tại thành một bản spec và xuất bản nó lên issue tracker của dự án — không phỏng vấn, chỉ tổng hợp lại những gì bạn đã thảo luận.
disable-model-invocation: true
---

Skill này lấy ngữ cảnh hội thoại hiện tại và hiểu biết về codebase để tạo ra một bản spec. Đừng phỏng vấn người dùng — chỉ tổng hợp lại những gì bạn đã biết.

Từ vựng nhãn triage và issue tracker lẽ ra đã được cung cấp cho bạn. Nếu chưa, hãy báo người dùng chạy `/setup-matt-pocock-skills`.

## Quy trình

1. Khám phá repo để hiểu trạng thái hiện tại của codebase, nếu bạn chưa làm việc đó. Sử dụng từ vựng trong bảng thuật ngữ domain của dự án xuyên suốt bản spec, và tôn trọng bất kỳ ADR nào trong khu vực bạn đang chạm vào.

2. Phác thảo các seam mà bạn sẽ test tính năng tại đó. Nên ưu tiên các seam hiện có hơn các seam mới. Sử dụng seam ở cấp cao nhất có thể. Nếu cần các seam mới, hãy đề xuất chúng tại điểm cao nhất bạn có thể. Càng ít seam xuyên suốt codebase càng tốt - số lượng lý tưởng là một.

Kiểm tra với người dùng xem các seam này có khớp với kỳ vọng của họ không.

3. Viết spec dùng mẫu bên dưới, sau đó xuất bản lên issue tracker của dự án. Áp dụng nhãn triage `ready-for-agent` - không cần triage bổ sung.

<spec-template>

## Problem Statement

Vấn đề mà người dùng đang gặp phải, dưới góc nhìn của người dùng.

## Solution

Giải pháp cho vấn đề, dưới góc nhìn của người dùng.

## User Stories

Một danh sách DÀI các user story được đánh số. Mỗi user story nên theo định dạng:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

Danh sách các user story này nên cực kỳ sâu rộng và bao phủ mọi khía cạnh của tính năng.

## Implementation Decisions

Danh sách các quyết định triển khai đã được đưa ra. Điều này có thể bao gồm:

- Các module sẽ được dựng/sửa đổi
- Các interface của các module đó sẽ được sửa đổi
- Các làm rõ về mặt kỹ thuật từ developer
- Các quyết định về mặt kiến trúc
- Các thay đổi về schema
- Các hợp đồng API
- Các tương tác cụ thể

Đừng đưa vào các đường dẫn file cụ thể hoặc các code snippet. Chúng có thể trở nên lỗi thời rất nhanh.

Ngoại lệ: nếu một prototype tạo ra một snippet mã hóa một quyết định chính xác hơn văn xuôi có thể làm (state machine, reducer, schema, type shape), hãy đưa nó vào nội tuyến bên trong quyết định liên quan và ghi chú ngắn gọn rằng nó đến từ một prototype. Cắt gọt còn lại các phần giàu quyết định — không phải một bản demo đang chạy, chỉ là các phần quan trọng.

## Testing Decisions

Danh sách các quyết định kiểm thử đã được đưa ra. Bao gồm:

- Mô tả về điều gì tạo nên một test tốt (chỉ test hành vi bên ngoài, không test chi tiết triển khai)
- Những module nào sẽ được test
- Tiền lệ (prior art) cho các test (tức là các kiểu test tương tự trong codebase)

## Out of Scope

Mô tả về những thứ nằm ngoài phạm vi cho spec này.

## Further Notes

Bất kỳ ghi chú bổ sung nào về tính năng.

</spec-template>
