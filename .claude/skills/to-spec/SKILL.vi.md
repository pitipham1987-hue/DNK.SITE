---
name: to-spec
description: Biến cuộc hội thoại hiện tại thành một spec và xuất bản nó lên issue tracker của project — không phỏng vấn, chỉ tổng hợp lại những gì đã được thảo luận.
disable-model-invocation: true
---

Skill này lấy ngữ cảnh của cuộc hội thoại hiện tại và sự hiểu biết về codebase để tạo ra một spec. ĐỪNG phỏng vấn người dùng — chỉ tổng hợp lại những gì bạn đã biết.

Issue tracker và bộ từ vựng triage label lẽ ra đã được cung cấp cho bạn. Nếu chưa, hãy bảo người dùng chạy `/setup-matt-pocock-skills`.

## Quy trình

1. Khám phá repo để hiểu trạng thái hiện tại của codebase, nếu bạn chưa làm việc này. Sử dụng bộ từ vựng domain glossary của project xuyên suốt spec, và tôn trọng mọi ADR trong khu vực bạn đang động đến.

2. Phác thảo các seam (điểm nối/ranh giới kiểm thử) mà bạn sẽ dùng để test tính năng. Nên ưu tiên các seam đã có sẵn hơn là tạo seam mới. Dùng seam ở vị trí cao nhất có thể. Nếu cần seam mới, hãy đề xuất chúng ở điểm cao nhất có thể. Càng ít seam trên toàn bộ codebase càng tốt - con số lý tưởng là một.

Kiểm tra lại với người dùng rằng các seam này khớp với kỳ vọng của họ.

3. Viết spec theo mẫu bên dưới, sau đó xuất bản nó lên issue tracker của project. Áp dụng triage label `ready-for-agent` - không cần triage thêm.

<spec-template>

## Problem Statement

Vấn đề mà người dùng đang gặp phải, từ góc nhìn của người dùng.

## Solution

Giải pháp cho vấn đề, từ góc nhìn của người dùng.

## User Stories

Một danh sách DÀI, có đánh số, các user story. Mỗi user story nên theo định dạng:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

Danh sách user story này nên cực kỳ đầy đủ và bao quát mọi khía cạnh của tính năng.

## Implementation Decisions

Một danh sách các quyết định triển khai (implementation decision) đã được đưa ra. Có thể bao gồm:

- Các module sẽ được xây dựng/sửa đổi
- Interface của các module đó sẽ được sửa đổi
- Các làm rõ kỹ thuật từ developer
- Các quyết định kiến trúc
- Các thay đổi schema
- Các API contract
- Các tương tác cụ thể

ĐỪNG bao gồm các đường dẫn file cụ thể hoặc đoạn code. Chúng có thể trở nên lỗi thời rất nhanh.

Ngoại lệ: nếu một prototype tạo ra một đoạn code mã hóa một quyết định chính xác hơn văn xuôi có thể diễn đạt (state machine, reducer, schema, type shape), hãy chèn nó trực tiếp vào trong quyết định liên quan và ghi chú ngắn gọn rằng nó đến từ một prototype. Cắt gọn xuống chỉ những phần chứa quyết định — không phải một bản demo hoạt động đầy đủ, chỉ những phần quan trọng.

## Testing Decisions

Một danh sách các quyết định về kiểm thử đã được đưa ra. Bao gồm:

- Mô tả điều gì tạo nên một test tốt (chỉ test hành vi bên ngoài, không phải chi tiết triển khai)
- Những module nào sẽ được test
- Tiền lệ (prior art) cho các test (tức là các loại test tương tự trong codebase)

## Out of Scope

Mô tả những điều nằm ngoài phạm vi của spec này.

## Further Notes

Bất kỳ ghi chú thêm nào về tính năng này.

</spec-template>
