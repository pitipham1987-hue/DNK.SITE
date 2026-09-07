---
name: code-review
description: Review các thay đổi kể từ một điểm cố định (commit, branch, tag, hoặc merge-base) theo hai trục — Standards (code có tuân theo tiêu chuẩn coding đã được tài liệu hóa của repo này không?) và Spec (code có khớp với những gì issue/spec gốc yêu cầu không?). Chạy cả hai review song song trong các sub-agent và báo cáo song song với nhau. Dùng khi người dùng muốn review một branch, một PR, các thay đổi đang làm dở, hoặc yêu cầu "review since X".
---

Review hai trục của diff giữa `HEAD` và một điểm cố định do người dùng cung cấp:

- **Standards** — code có tuân theo tiêu chuẩn coding đã được tài liệu hóa của repo này không?
- **Spec** — code có triển khai trung thực issue / spec gốc không?

Cả hai trục đều chạy dưới dạng **sub-agent song song** để không làm nhiễu ngữ cảnh của nhau, sau đó skill này tổng hợp các phát hiện của chúng.

Issue tracker lẽ ra đã được cung cấp cho bạn. Nếu thiếu `docs/agents/issue-tracker.md`, hãy báo người dùng chạy `/setup-matt-pocock-skills`.

## Quy trình

### 1. Cố định điểm mốc (fixed point)

Bất cứ điều gì người dùng nói chính là điểm cố định — một commit SHA, tên branch, tag, `main`, `HEAD~5`, v.v. Nếu họ không chỉ định, hãy hỏi.

Ghi lại lệnh diff một lần: `git diff <fixed-point>...HEAD` (ba dấu chấm, để phép so sánh dựa trên merge-base). Cũng ghi chú danh sách commit qua `git log <fixed-point>..HEAD --oneline`.

Trước khi đi tiếp, xác nhận điểm cố định phân giải được (`git rev-parse <fixed-point>`) và diff không rỗng. Một ref sai hoặc diff rỗng cần thất bại ngay ở đây — không phải bên trong hai sub-agent song song.

### 2. Xác định nguồn spec

Tìm spec gốc, theo thứ tự sau:

1. Các tham chiếu issue trong commit message (`#123`, `Closes #45`, GitLab `!67`, v.v.) — lấy về qua quy trình trong `docs/agents/issue-tracker.md`.
2. Một đường dẫn mà người dùng truyền vào như một tham số.
3. Một file spec dưới `docs/`, `specs/`, hoặc `.scratch/` khớp với tên branch hoặc tên tính năng.
4. Nếu không tìm thấy gì, hỏi người dùng spec ở đâu. Nếu họ nói không có, sub-agent **Spec** sẽ bỏ qua và báo cáo "no spec available" (không có spec).

### 3. Xác định nguồn tiêu chuẩn (standards)

Bất cứ thứ gì trong repo mô tả cách code nên được viết, như `CODING_STANDARDS.md` hoặc `CONTRIBUTING.md`.

Bên cạnh bất cứ điều gì repo tài liệu hóa, trục Standards luôn mang theo **baseline mùi code (smell baseline)** bên dưới — một tập cố định các code smell của Fowler (_Refactoring_, chương 3) áp dụng ngay cả khi một repo không tài liệu hóa gì cả. Hai quy tắc ràng buộc nó:

- **Repo được ưu tiên hơn.** Một tiêu chuẩn đã tài liệu hóa của repo luôn thắng; nơi nó tán thành điều mà baseline sẽ gắn cờ, hãy bỏ qua mùi đó.
- **Luôn là một phán đoán chủ quan.** Mỗi mùi là một heuristic được gắn nhãn ("possible Feature Envy"), không bao giờ là một vi phạm cứng — và, giống như bất kỳ tiêu chuẩn nào ở đây, bỏ qua bất cứ điều gì tooling đã thực thi sẵn.

Mỗi mùi đọc theo dạng *nó là gì* → *cách sửa*; đối chiếu nó với diff:

- **Mysterious Name** (Tên bí ẩn) — một hàm, biến, hoặc kiểu có tên không tiết lộ nó làm gì hoặc chứa gì. → đổi tên nó; nếu không tìm ra tên trung thực nào, thiết kế đang mù mờ.
- **Duplicated Code** (Code trùng lặp) — cùng một hình dạng logic xuất hiện trong nhiều hơn một hunk hoặc file trong thay đổi. → trích xuất hình dạng chung, gọi nó từ cả hai nơi.
- **Feature Envy** (Ghen tị tính năng) — một phương thức truy cập vào dữ liệu của một đối tượng khác nhiều hơn dữ liệu của chính nó. → di chuyển phương thức đó sang dữ liệu mà nó "ghen tị".
- **Data Clumps** (Cụm dữ liệu) — cùng vài trường hoặc tham số liên tục đi cùng nhau (một kiểu đang muốn được sinh ra). → gộp chúng vào một kiểu, truyền kiểu đó.
- **Primitive Obsession** (Ám ảnh kiểu nguyên thủy) — một kiểu nguyên thủy hoặc chuỗi đứng thay cho một khái niệm nghiệp vụ đáng có kiểu riêng của nó. → cho khái niệm đó một kiểu nhỏ riêng.
- **Repeated Switches** (Switch lặp lại) — cùng một `switch`/chuỗi `if` trên cùng một kiểu lặp lại xuyên suốt thay đổi. → thay bằng đa hình (polymorphism), hoặc một map dùng chung ở cả hai nơi.
- **Shotgun Surgery** (Phẫu thuật súng hoa cải) — một thay đổi logic buộc phải sửa rải rác ở nhiều file trong diff. → gom những gì thay đổi cùng nhau vào một module.
- **Divergent Change** (Thay đổi phân kỳ) — một file hoặc module bị sửa vì nhiều lý do không liên quan. → tách ra để mỗi module thay đổi chỉ vì một lý do.
- **Speculative Generality** (Tổng quát hóa suy đoán) — trừu tượng hóa, tham số, hoặc hook được thêm vào cho những nhu cầu mà spec không có. → xóa nó; inline lại cho đến khi có nhu cầu thực sự xuất hiện.
- **Message Chains** (Chuỗi thông điệp) — chuỗi điều hướng dài `a.b().c().d()` mà caller không nên phụ thuộc vào. → giấu chuỗi đi phía sau một phương thức trên đối tượng đầu tiên.
- **Middle Man** (Người trung gian) — một class hoặc hàm chủ yếu chỉ ủy quyền tiếp. → cắt nó, gọi trực tiếp đích thật.
- **Refused Bequest** (Từ chối kế thừa) — một subclass hoặc lớp triển khai bỏ qua hoặc ghi đè phần lớn những gì nó kế thừa. → bỏ kế thừa, dùng composition.

### 4. Sinh cả hai sub-agent song song

**Prompt cho sub-agent Standards** — bao gồm:

- Lệnh diff đầy đủ và danh sách commit.
- Danh sách các file nguồn tiêu chuẩn bạn tìm được ở bước 3, **cộng với smell baseline từ bước 3** dán nguyên văn vào — sub-agent không có cách nào khác để truy cập nó.
- Nhiệm vụ: "Báo cáo — theo từng file/hunk nếu liên quan — (a) mọi nơi diff vi phạm một tiêu chuẩn đã tài liệu hóa: trích dẫn tiêu chuẩn (file + quy tắc); và (b) bất kỳ mùi baseline nào bạn phát hiện: đặt tên nó và trích dẫn hunk. Phân biệt vi phạm cứng với phán đoán chủ quan — vi phạm tiêu chuẩn đã tài liệu hóa có thể là cứng, nhưng mùi baseline luôn là phán đoán chủ quan, và một tiêu chuẩn repo đã tài liệu hóa sẽ ưu tiên hơn baseline. Bỏ qua bất cứ điều gì tooling đã thực thi. Dưới 400 từ."

**Prompt cho sub-agent Spec** — bao gồm:

- Lệnh diff và danh sách commit.
- Đường dẫn hoặc nội dung đã lấy về của spec.
- Nhiệm vụ: "Báo cáo: (a) các yêu cầu spec đã yêu cầu nhưng bị thiếu hoặc chỉ làm một phần; (b) hành vi trong diff không được yêu cầu (scope creep — lấn phạm vi); (c) các yêu cầu trông như đã triển khai nhưng cách triển khai trông có vẻ sai. Trích dẫn dòng spec cho mỗi phát hiện. Dưới 400 từ."

Nếu thiếu spec, bỏ qua sub-agent Spec và ghi chú điều này trong báo cáo cuối cùng.

### 5. Tổng hợp

Trình bày hai báo cáo dưới các heading `## Standards` và `## Spec`, nguyên văn hoặc chỉnh sửa nhẹ. **Không** gộp hoặc xếp hạng lại các phát hiện — hai trục cố tình được tách biệt (xem _Vì sao hai trục_).

Kết thúc bằng một dòng tóm tắt: tổng số phát hiện theo mỗi trục, và vấn đề tệ nhất _trong từng trục_ (nếu có). Đừng chọn một người thắng duy nhất giữa các trục — đó chính là việc xếp hạng lại mà sự tách biệt này tồn tại để ngăn chặn.

## Vì sao hai trục

Một thay đổi có thể đạt trục này nhưng trượt trục kia:

- Code tuân theo mọi tiêu chuẩn nhưng triển khai sai thứ → **Standards đạt, Spec trượt.**
- Code làm đúng chính xác những gì issue yêu cầu nhưng phá vỡ các quy ước của dự án → **Spec đạt, Standards trượt.**

Báo cáo chúng riêng biệt ngăn một trục che khuất trục kia.
