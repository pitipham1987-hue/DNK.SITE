---
name: diagnosing-bugs
description: Vòng lặp chẩn đoán cho các bug khó và các hồi quy hiệu năng (performance regression). Dùng khi người dùng nói "diagnose"/"debug this", hoặc báo cáo có gì đó bị hỏng/ném lỗi/thất bại/chậm.
---

# Chẩn đoán Bug (Diagnosing Bugs)

Một kỷ luật cho các bug khó. Chỉ bỏ qua các pha khi có lý do rõ ràng.

Khi khám phá codebase, đọc `CONTEXT.md` (nếu có) để có một mô hình tư duy rõ ràng về các module liên quan, và kiểm tra các ADR trong khu vực bạn đang động tới.

## Che (Redact)

Skill này yêu cầu bạn hiển thị các lệnh, output và các artifact đã thu thập. **Hãy che mọi bí mật trước tiên** — viết `<REDACTED>` vào chỗ đó. Xây các vòng lặp dựa trên biến môi trường, để credential nằm trong môi trường thay vì trong những gì bạn hiển thị. Các artifact đã thu thập mang theo auth header: chỉ trích dẫn các dòng mang tín hiệu cần thiết.

Nếu output đã che vẫn không đủ để chẩn đoán bug, hãy nói rõ điều đó và hỏi người dùng.

## Pha 1 — Xây dựng một vòng phản hồi (feedback loop)

**Đây chính là skill.** Mọi thứ khác chỉ là máy móc. Nếu bạn có một tín hiệu pass/fail **chặt (tight)** cho bug — một tín hiệu báo đỏ trên _chính_ bug này — bạn sẽ tìm ra nguyên nhân; bisection, kiểm định giả thuyết, và instrumentation đều chỉ tiêu thụ tín hiệu đó. Nếu bạn không có nó, dù có nhìn chằm chằm vào code bao lâu cũng không cứu được bạn.

Hãy dồn nỗ lực không cân xứng vào đây. **Hãy quyết liệt. Hãy sáng tạo. Từ chối bỏ cuộc.**

### Các cách xây dựng một vòng lặp — thử theo thứ tự tương đối sau

1. **Failing test** tại bất kỳ seam nào chạm tới bug — unit, integration, e2e.
2. **Script Curl / HTTP** nhắm vào một dev server đang chạy.
3. **Lệnh gọi CLI** với một input fixture, so sánh (diff) stdout với một snapshot đã biết là đúng.
4. **Script trình duyệt headless** (Playwright / Puppeteer) — điều khiển UI, khẳng định (assert) trên DOM/console/network.
5. **Phát lại một trace đã ghi lại.** Lưu một request mạng thực / payload / event log thực xuống đĩa; phát lại nó qua đường dẫn code một cách cô lập.
6. **Harness dùng-một-lần-rồi-bỏ.** Khởi động một tập con tối thiểu của hệ thống (một service, các dependency được mock) chạy đường dẫn code chứa bug qua một lệnh gọi hàm duy nhất.
7. **Vòng lặp property / fuzz.** Nếu bug là "đôi khi output sai", chạy 1000 input ngẫu nhiên và tìm kiểu thất bại (failure mode).
8. **Harness bisection.** Nếu bug xuất hiện giữa hai trạng thái đã biết (commit, dataset, version), tự động hóa "khởi động ở trạng thái X, kiểm tra, lặp lại" để bạn có thể `git bisect run` nó.
9. **Vòng lặp so sánh khác biệt (differential loop).** Chạy cùng một input qua phiên bản cũ vs phiên bản mới (hoặc hai cấu hình) và diff output.
10. **Script bash HITL (Human-in-the-loop).** Phương án cuối cùng. Nếu một con người phải click, hãy điều khiển _họ_ bằng `scripts/hitl-loop.template.sh` để vòng lặp vẫn có cấu trúc. Output đã thu thập được đưa trở lại cho bạn.

Xây dựng đúng vòng phản hồi, và bug đã được sửa 90%.

### Thắt chặt vòng lặp

Đối xử với vòng lặp như một sản phẩm. Một khi bạn có _một_ vòng lặp, hãy **thắt chặt** nó:

- Tôi có thể làm nó nhanh hơn không? (Cache setup, bỏ qua init không liên quan, thu hẹp phạm vi test.)
- Tôi có thể làm tín hiệu sắc bén hơn không? (Khẳng định trên triệu chứng cụ thể, không phải "không crash".)
- Tôi có thể làm nó có tính xác định (deterministic) hơn không? (Cố định thời gian, seed cho RNG, cô lập filesystem, đóng băng network.)

Một vòng lặp chập chờn 30 giây gần như không tốt hơn không có vòng lặp nào; một vòng lặp có tính xác định 2 giây là chặt — một siêu năng lực debug.

### Các bug không xác định (non-deterministic)

Mục tiêu không phải là một repro sạch mà là một **tỷ lệ tái tạo cao hơn**. Lặp lại yếu tố kích hoạt 100 lần, chạy song song, thêm áp lực (stress), thu hẹp cửa sổ thời gian, tiêm sleep. Một bug flake 50% là debug được; 1% thì không — hãy tiếp tục nâng tỷ lệ cho đến khi debug được.

### Khi bạn thực sự không thể xây dựng một vòng lặp

Dừng lại và nói rõ điều đó. Liệt kê những gì bạn đã thử. Hỏi người dùng: (a) quyền truy cập vào bất kỳ môi trường nào tái tạo được nó, (b) một artifact đã thu thập và che (file HAR, log dump, core dump, bản ghi màn hình có timestamp), hoặc (c) quyền thêm instrumentation tạm thời vào production. **Không** tiến hành đưa ra giả thuyết mà không có vòng lặp.

### Tiêu chí hoàn thành — một vòng lặp chặt báo đỏ được

Pha 1 hoàn tất khi vòng lặp **chặt** và **có khả năng báo đỏ**: bạn có thể nêu tên **một lệnh** — một đường dẫn script, một lệnh gọi test, một curl — mà bạn **đã chạy ít nhất một lần** (hiển thị lệnh gọi và output của nó, đã che), và lệnh đó:

- [ ] **Có khả năng báo đỏ** — nó chạy qua đường dẫn code chứa bug thực sự và khẳng định trên **triệu chứng chính xác của người dùng**, để nó có thể báo đỏ trên bug này và báo xanh khi đã sửa. Không phải "chạy không lỗi" — nó phải có khả năng _bắt được đúng bug cụ thể này_.
- [ ] **Có tính xác định** — cùng một kết quả mỗi lần chạy (đối với bug không xác định: một tỷ lệ tái tạo cao, đã cố định, theo mục trên).
- [ ] **Nhanh** — vài giây, không phải vài phút.
- [ ] **Agent chạy được** — bạn có thể chạy nó không cần giám sát; con người tham gia chỉ qua `scripts/hitl-loop.template.sh`.

Nếu bạn bắt gặp mình đang đọc code để xây dựng một lý thuyết trước khi lệnh này tồn tại, **dừng lại — nhảy thẳng đến một giả thuyết chính là kiểu thất bại mà skill này ngăn chặn.** Không có lệnh có khả năng báo đỏ, không có Pha 2.

## Pha 2 — Tái tạo + thu gọn (Reproduce + minimise)

Chạy vòng lặp. Xem nó báo đỏ — bug xuất hiện.

Xác nhận:

- [ ] Vòng lặp tạo ra đúng kiểu thất bại mà **người dùng** mô tả — không phải một thất bại khác vô tình gần giống. Sai bug = sai bản sửa.
- [ ] Thất bại có thể tái tạo qua nhiều lần chạy (hoặc, đối với bug không xác định, tái tạo được ở tỷ lệ đủ cao để debug).
- [ ] Bạn đã ghi lại chính xác triệu chứng (thông báo lỗi, output sai, thời gian chậm) để các pha sau có thể xác minh bản sửa thực sự giải quyết được nó.

### Thu gọn (Minimise)

Một khi nó báo đỏ, hãy thu nhỏ repro xuống **kịch bản nhỏ nhất vẫn còn báo đỏ**. Cắt bớt input, caller, config, dữ liệu, và các bước **từng cái một**, chạy lại vòng lặp sau mỗi lần cắt — chỉ giữ lại những gì thực sự cần thiết cho thất bại.

Tại sao cần làm vậy: một repro tối thiểu thu hẹp không gian giả thuyết ở Pha 3 (ít yếu tố di động hơn để nghi ngờ) và trở thành regression test sạch ở Pha 5.

Hoàn tất khi **mọi phần tử còn lại đều thực sự cần thiết** — loại bỏ bất kỳ cái nào trong số đó khiến vòng lặp báo xanh.

Không tiến hành cho đến khi bạn đã tái tạo **và** thu gọn.

## Pha 3 — Đưa ra giả thuyết (Hypothesise)

Sinh ra **3–5 giả thuyết được xếp hạng** trước khi kiểm định bất kỳ cái nào. Sinh một giả thuyết duy nhất sẽ khiến bạn neo vào ý tưởng khả dĩ đầu tiên.

Mỗi giả thuyết phải **có thể bị bác bỏ (falsifiable)**: nêu rõ dự đoán mà nó đưa ra.

> Định dạng: "Nếu <X> là nguyên nhân, thì <thay đổi Y> sẽ khiến bug biến mất / <thay đổi Z> sẽ khiến nó tệ hơn."

Nếu bạn không thể nêu ra dự đoán, giả thuyết đó chỉ là cảm tính — hãy loại bỏ hoặc mài sắc nó.

**Cho người dùng xem danh sách đã xếp hạng trước khi kiểm định.** Họ thường có kiến thức nghiệp vụ để xếp hạng lại ngay lập tức ("chúng tôi vừa triển khai một thay đổi cho #3"), hoặc biết những giả thuyết họ đã loại trừ rồi. Một điểm kiểm tra rẻ, tiết kiệm nhiều thời gian. Đừng chặn lại chờ đợi — tiến hành với thứ hạng của bạn nếu người dùng vắng mặt.

## Pha 4 — Đo lường (Instrument)

Mỗi phép dò (probe) phải khớp với một dự đoán cụ thể từ Pha 3. **Thay đổi một biến tại một thời điểm.**

Ưu tiên công cụ:

1. **Debugger / kiểm tra REPL** nếu môi trường hỗ trợ. Một breakpoint đáng giá hơn mười dòng log.
2. **Log có mục tiêu** tại các ranh giới phân biệt các giả thuyết.
3. Không bao giờ "log mọi thứ rồi grep".

**Gắn thẻ mọi debug log** với một tiền tố duy nhất, ví dụ `[DEBUG-a4f2]`. Việc dọn dẹp cuối cùng trở thành một lệnh grep duy nhất. Log không gắn thẻ sẽ tồn tại sót lại; log có gắn thẻ sẽ bị xóa.

**Nhánh hiệu năng (Perf branch).** Đối với các hồi quy hiệu năng, log thường sai lầm. Thay vào đó: thiết lập một phép đo baseline (harness đo thời gian, `performance.now()`, profiler, query plan), rồi bisect. Đo trước, sửa sau.

## Pha 5 — Sửa + regression test

Viết regression test **trước khi sửa** — nhưng chỉ khi có một **seam đúng** cho nó.

Một seam đúng là nơi test chạy qua **mẫu bug thực sự (real bug pattern)** đúng như nó xảy ra tại điểm gọi. Nếu seam duy nhất có sẵn quá nông (test một-caller khi bug cần nhiều caller, unit test không thể tái tạo chuỗi đã kích hoạt bug), một regression test ở đó chỉ mang lại sự tự tin giả tạo.

**Nếu không có seam đúng nào tồn tại, chính điều đó là phát hiện.** Ghi chú lại. Kiến trúc codebase đang ngăn cản việc khóa chặt bug này. Đánh dấu điều này cho pha tiếp theo.

Nếu một seam đúng tồn tại:

1. Biến repro đã thu gọn thành một failing test tại seam đó.
2. Xem nó thất bại.
3. Áp dụng bản sửa.
4. Xem nó thành công.
5. Chạy lại vòng phản hồi ở Pha 1 đối với kịch bản gốc (chưa thu gọn).

## Pha 6 — Dọn dẹp (Cleanup)

Bắt buộc trước khi tuyên bố hoàn thành:

- [ ] Repro gốc không còn tái tạo được nữa (chạy lại vòng lặp Pha 1)
- [ ] Regression test thành công (hoặc việc thiếu seam đã được tài liệu hóa)
- [ ] Mọi instrumentation `[DEBUG-...]` đã bị xóa (`grep` tiền tố đó)
- [ ] Các prototype dùng-một-lần-rồi-bỏ đã bị xóa (hoặc chuyển tới một vị trí debug được đánh dấu rõ ràng)
- [ ] Giả thuyết hóa ra đúng được nêu rõ trong commit / PR message — để người debug tiếp theo học được từ đó
