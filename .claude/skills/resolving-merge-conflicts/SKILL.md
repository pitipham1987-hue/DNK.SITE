---
name: resolving-merge-conflicts
description: "Dùng khi bạn cần giải quyết xung đột (conflict) git merge/rebase đang diễn ra."
---

1. **Xem trạng thái hiện tại** của đợt merge/rebase. Kiểm tra git history, và các file bị xung đột.

2. **Tìm các nguồn sơ cấp (primary sources)** cho mỗi xung đột. Hiểu sâu sắc lý do tại sao từng thay đổi được thực hiện, và ý định ban đầu là gì. Đọc các commit message, kiểm tra các PR, kiểm tra các issue/ticket gốc.

3. **Giải quyết từng hunk xung đột.** Bảo tồn cả hai ý định khi có thể. Nơi mâu thuẫn không thể dung hòa, hãy chọn ý định phù hợp với mục tiêu đã nêu của đợt merge và ghi chú lại sự đánh đổi. **Không** tự bịa ra hành vi mới. Luôn luôn giải quyết; không bao giờ dùng `--abort`.

4. Tìm các **kiểm tra tự động (automated checks)** của dự án và chạy chúng — thường là typecheck, sau đó là test, rồi đến format. Sửa bất kỳ điều gì mà đợt merge làm hỏng.

5. **Hoàn tất việc merge/rebase.** Stage tất cả và commit. Nếu đang rebase, tiếp tục quy trình rebase cho đến khi mọi commit đều đã được rebase.
