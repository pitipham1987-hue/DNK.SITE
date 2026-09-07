---
name: implement
description: "Triển khai một phần công việc dựa trên một spec hoặc một tập hợp ticket."
disable-model-invocation: true
---

Triển khai công việc được người dùng mô tả trong spec hoặc các ticket.

Sử dụng /tdd bất cứ khi nào có thể, tại các "seam" (điểm nối) đã được thống nhất trước.

Chạy typechecking thường xuyên, chạy từng file test đơn lẻ thường xuyên, và chạy toàn bộ test suite một lần vào cuối.

Sau khi hoàn tất, sử dụng /code-review để review công việc.

Commit công việc của bạn vào nhánh (branch) hiện tại.
