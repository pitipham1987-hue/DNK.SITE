---
name: handoff
description: Nén cuộc hội thoại hiện tại thành một tài liệu bàn giao để agent khác tiếp tục.
argument-hint: "Phiên làm việc tiếp theo sẽ được dùng để làm gì?"
disable-model-invocation: true
---

Viết một tài liệu bàn giao tóm tắt cuộc hội thoại hiện tại để một agent mới có thể tiếp tục công việc. Lưu vào thư mục tạm (temporary directory) của hệ điều hành của người dùng - không phải workspace hiện tại.

Bao gồm một mục "kỹ năng đề xuất" (suggested skills) trong tài liệu, nêu tên những skill mà agent tiếp theo nên gọi qua tool Skill.

Không lặp lại nội dung đã được ghi lại trong các artifact khác (specs, plans, ADR, issues, commits, diffs). Thay vào đó, hãy tham chiếu chúng bằng đường dẫn hoặc URL.

Ẩn (redact) mọi thông tin nhạy cảm, chẳng hạn như API keys, mật khẩu, hoặc thông tin định danh cá nhân.

Nếu người dùng truyền vào tham số (arguments), hãy coi đó là mô tả về những gì phiên làm việc tiếp theo sẽ tập trung vào và điều chỉnh tài liệu cho phù hợp.
