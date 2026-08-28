---
name: resolving-merge-conflicts
description: "Dùng khi bạn cần giải quyết một xung đột (conflict) git merge/rebase đang diễn ra."
---

1. **Xem trạng thái hiện tại** của quá trình merge/rebase. Kiểm tra lịch sử git, và các file đang xung đột.

2. **Tìm các nguồn chính (primary sources)** cho từng xung đột. Hiểu sâu lý do vì sao mỗi thay đổi được thực hiện, và ý định ban đầu là gì. Đọc các commit message, kiểm tra các PR, kiểm tra các issue/ticket gốc.

3. **Giải quyết từng hunk.** Bảo toàn cả hai ý định nếu có thể. Khi không tương thích, chọn phương án phù hợp với mục tiêu đã nêu của merge và ghi chú lại sự đánh đổi (trade-off). **Không** bịa ra hành vi mới. Luôn giải quyết đến cùng; không bao giờ `--abort`.

4. Tìm hiểu các **kiểm tra tự động (automated checks)** của dự án và chạy chúng — thường là typecheck, sau đó là test, rồi đến format. Sửa mọi thứ mà merge đã làm hỏng.

5. **Hoàn tất quá trình merge/rebase.** Stage tất cả và commit. Nếu đang rebase, tiếp tục quá trình rebase cho đến khi tất cả các commit đã được rebase.
