# Ranh giới giữa các pha (Phase boundaries)

Một **pha** (phase) là một khối công việc bên trong một phiên làm việc (session) — việc grilling (chất vấn), việc implement (triển khai), việc QA. Định nghĩa này cố tình mơ hồ: một pha kết thúc khi bạn nghĩ *"ok, xong phần đó rồi"*.

**Ranh giới pha** (phase boundary) là khoảng trống giữa hai pha, và đó là nơi duy nhất quyết định này thuộc về. Giữa pha (mid-phase) thì không có quyết định nào để đưa ra — tiếp tục, hoặc chia phần việc còn lại cho các subagent. Compact giữa pha khiến agent mất mạch suy nghĩ.

## Năm lựa chọn

| Lựa chọn       | Nó làm gì                                                    |
| ------------ | --------------------------------------------------------------- |
| **Continue** (Tiếp tục) | Ở lại trong phiên. Không chuyển đổi ngữ cảnh nào cả. |
| **`/clear`** | Xóa sạch cửa sổ ngữ cảnh và bắt đầu lại từ đầu. |
| **`/handoff`** | Ghi ra một file markdown có thể mang theo, dùng để khởi tạo một phiên ở bất kỳ đâu. |
| **Subagent** | Gửi tác vụ sang cửa sổ ngữ cảnh riêng của nó và nhận lại báo cáo. |
| **`/compact`** | Nén ngữ cảnh hiện tại và khởi tạo một phiên mới với bản tóm tắt. |

## Cây quyết định

Xét từ trên xuống dưới tại ranh giới. Câu trả lời **có** đầu tiên sẽ thắng.

**1. Bạn có thể tiếp tục trong phiên này không?** Có hai điều khiến câu trả lời là có: pha tiếp theo cần pha này như một **nguồn sơ cấp (primary source)**, hoặc bạn còn đủ [smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone) (~150k token) để pha tiếp theo vừa vặn. Grilling → implementation là trường hợp "có" tiêu chuẩn: việc implementation cần lý lẽ (reasoning) nguyên văn, chứ không phải bản tóm tắt của nó. Continue không tốn gì và không mất gì, nên hãy loại trừ nó trước tiên.

**2. Ngữ cảnh có liên quan đến việc sắp tới không?** Mọi thứ trong phiên này — việc khám phá, các quyết định, các ngõ cụt — có đều bỏ đi được không? Nếu vậy, dùng **`/clear`**. Đây là nước đi rẻ nhất trên bàn cờ: không tốn thời gian và trả lại toàn bộ cửa sổ. `/clear` cũng không phải là hành động chung cuộc — phiên cũ vẫn có thể resume lại.

Cái giá của việc chọn sai ở đây là một chiều. Clear một ngữ cảnh *có liên quan* thì bạn sẽ mất đi cái **lý do (why)** đằng sau những gì bạn đã xây, và dù có đọc lại diff cũng không lấy lại được.

**3. Bạn có cần bàn giao (hand off) không?** `/handoff` là một công cụ hẹp. Bạn chỉ cần nó khi bạn:

- chuyển sang một **harness mới** (Claude → Codex),
- chuyển sang một **thư mục mới** hoặc repo mới,
- gửi công việc cho một **đồng nghiệp**,
- hoặc tách một nhánh việc phụ mà bạn phát hiện ra **giữa pha** mà không làm lệch hướng việc đang làm.

Danh sách đó là toàn bộ điều kiện. Cái mà `/handoff` mang lại là **tính di động (portability)** — một file có thể di chuyển. Nếu không có gì cần di chuyển, bạn không cần nó.

**4. Tác vụ có thể làm khi vắng mặt (AFK) không?** Nó có được giới hạn đủ chặt để chạy khi bạn rời khỏi bàn phím, không cần chỉ đạo không? Nếu vậy, gửi nó cho một **subagent** và để nguyên phiên này. Review tự động là trường hợp tiêu chuẩn: agent đọc diff và báo cáo, còn bạn không cần thiết trong lúc nó làm việc đó.

**5. Nếu không, dùng `/compact`.** Ngữ cảnh có liên quan, cùng harness, cùng thư mục, và bạn cần theo sát tiến trình — đây là nơi cây quyết định dừng lại, và nó dừng ở đây khá thường xuyên. Đưa cho nó một chỉ dẫn (`/compact we're going to QA this area`) để bản tóm tắt giữ lại những gì pha tiếp theo cần.

`/compact` là **mặc định, không phải lựa chọn đầu tiên**. Nó nằm ở dưới cùng vì bốn câu hỏi phía trên nó đều rẻ hơn hoặc chính xác hơn. Kiểu thất bại khi người ta bắt đầu ngay từ đây là một phiên mới tự tin sai về một quyết định mà bản tóm tắt đã làm phẳng đi.

## Nguồn sơ cấp và nguồn thứ cấp

Mọi động thái ngoại trừ **Continue** đều biến một **nguồn sơ cấp (primary source)** thành một **nguồn thứ cấp (secondary source)** — phiên làm việc như nó đã diễn ra, được thay bằng một bản tóm tắt của nó. Sự đánh đổi luôn có cùng hình dạng:

| Nguồn                            | Thông tin | Nhiễu | Không gian xoay xở |
| --------------------------------- | ----------- | ----- | ------------ |
| Sơ cấp (Continue)                | Đầy đủ        | Nhiều  | Ít |
| Thứ cấp (`/compact`, `/handoff`) | Mất mát (Lossy)        | Ít hơn | Nhiều |

Đây là lý do câu hỏi 1 luôn được đặt ra trước tiên. Bạn chỉ trả giá cho sự mất mát khi việc ở lại tốn kém hơn là tiết kiệm được.

## Đây đều là những phán đoán chủ quan (judgement calls)

Các câu hỏi không mang tính khách quan — mỗi câu hỏi đều mang tính "gu" cá nhân, và cùng một ranh giới có thể được xử lý theo hai cách khác nhau vào hai ngày khác nhau. Giá trị nằm ở việc đặt các câu hỏi này **theo đúng thứ tự**, tại ranh giới chứ không phải giữa chừng công việc.
