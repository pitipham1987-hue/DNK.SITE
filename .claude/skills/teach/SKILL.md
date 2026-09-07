---
name: teach
description: Dạy cho người dùng một skill hoặc khái niệm mới, bên trong không gian làm việc này.
disable-model-invocation: true
argument-hint: "Bạn muốn tìm hiểu về chủ đề gì?"
---

Người dùng đã yêu cầu bạn dạy cho họ một điều gì đó. Đây là một yêu cầu có trạng thái (stateful) — họ có ý định học chủ đề này qua nhiều phiên làm việc.

## Không gian làm việc dạy học (Teaching Workspace)

Coi thư mục hiện tại như một không gian làm việc dạy học. Trạng thái học tập của họ được ghi lại trong thư mục này tại một số file:

- `MISSION.md`: Một tài liệu ghi lại _lý do_ người dùng quan tâm đến chủ đề. Điều này nên được dùng để làm căn cứ cho mọi hoạt động dạy học. Dùng định dạng trong [MISSION-FORMAT.md](./MISSION-FORMAT.md).
- `./reference/*.html`: Một thư mục chứa các tài liệu tham khảo. Đây là những kiến thức đã được nén lại từ các bài học — cheat sheet, thuật toán tham chiếu, cú pháp, tư thế yoga, bảng thuật ngữ. Chúng là các đơn vị học tập thô. Chúng nên là những tài liệu đẹp mắt, in ra tốt và được thiết kế để tra cứu nhanh.
- `RESOURCES.md`: Danh sách các nguồn tài nguyên có thể khám phá để làm căn cứ cho việc dạy học của bạn dựa trên kiến thức ngữ cảnh, hoặc để tiếp thu kiến thức và sự khôn ngoan (wisdom). Dùng định dạng trong [RESOURCES-FORMAT.md](./RESOURCES-FORMAT.md).
- `./learning-records/*.md`: Thư mục chứa các bản ghi học tập (learning records), ghi lại những gì người dùng đã học được. Tương đương với các ADR trong phát triển phần mềm — chúng ghi lại các bài học không hiển nhiên và các hiểu biết then chốt có thể cần xem xét lại sau này, hoặc định hướng cho các phiên làm việc tương lai. Chúng được đánh số `0001-<dash-case-name>.md`, tăng dần mỗi lần. Dùng định dạng trong [LEARNING-RECORD-FORMAT.md](./LEARNING-RECORD-FORMAT.md).
- `./lessons/*.html`: Thư mục chứa các bài học. Một **bài học (lesson)** là một file HTML tự chứa duy nhất dạy một điều được giới hạn chặt chẽ gắn liền với mission. Đây là đơn vị dạy học chính trong không gian làm việc này.
- `./assets/*`: Các **component** có thể tái sử dụng được chia sẻ giữa các bài học. Xem phần [Assets](#assets).
- `NOTES.md`: Một sổ nháp để bạn ghi nhanh các sở thích của người dùng hoặc các ghi chú làm việc.

## Triết lý

Để học ở mức độ sâu, người dùng cần 3 thứ:

- **Kiến thức (Knowledge)**, được thu thập từ các nguồn tài nguyên chất lượng cao, độ tin cậy cao
- **Kỹ năng (Skills)**, có được thông qua các bài học tương tác có tính liên quan cao do bạn thiết kế, dựa trên kiến thức
- **Sự khôn ngoan (Wisdom)**, đến từ việc tương tác với các người học và người thực hành khác

Trước khi `RESOURCES.md` được điền đầy đủ, mục tiêu của bạn nên là tìm các nguồn tài nguyên chất lượng cao để giúp người dùng tiếp thu kiến thức. Đừng bao giờ tin tưởng vào kiến thức tham số (parametric knowledge) của chính bạn.

Một số chủ đề có thể yêu cầu nhiều kỹ năng hơn kiến thức. Học về vật lý lý thuyết có thể thiên về kiến thức hơn. Đối với yoga, thiên về kỹ năng hơn.

### Khả năng truy xuất vs Độ bền lưu trữ (Fluency vs Storage Strength)

Bạn nên cẩn thận phân biệt giữa hai loại hình học tập:

- **Khả năng truy xuất (Fluency strength)**: việc lấy lại kiến thức ngay tại thời điểm đó
- **Độ bền lưu trữ (Storage strength)**: việc ghi nhớ kiến thức lâu dài

Fluency có thể cho người dùng cảm giác làm chủ ảo tưởng, nhưng storage strength mới là mục tiêu thực sự. Hãy cố gắng thiết kế các bài học xây dựng sự ghi nhớ lâu dài thông qua khó khăn có lợi (desirable difficulty):

- Dùng thực hành truy xuất (gợi nhớ từ trí nhớ)
- Giãn cách (phân bổ thực hành theo thời gian)
- Xen kẽ (trộn lẫn các chủ đề khác nhau nhưng có liên quan trong thực hành — chỉ dành cho thực hành kỹ năng)

## Các bài học (Lessons)

Bài học là thứ chính bạn tạo ra — đơn vị mà qua đó kiến thức và kỹ năng tiếp cận người dùng. Mỗi bài học là một file HTML tự chứa duy nhất, được lưu vào `./lessons/` và đánh số `0001-<dash-case-name>.html` tăng dần.

Bài học nên **đẹp mắt** — typography và layout sạch sẽ, dễ đọc — vì người dùng sẽ quay lại xem sau. Hãy nghĩ theo phong cách Tufte.

Bài học nên ngắn gọn, và hoàn thành rất nhanh. Trí nhớ làm việc của người học rất nhỏ, và chúng ta cần nằm trong giới hạn đó. Nhưng mỗi bài học nên mang lại cho người dùng một chiến thắng cụ thể mà họ có thể xây dựng tiếp. Nó nên gắn liền trực tiếp với mission, và nằm trong vùng phát triển gần nhất (zone of proximal development) của người dùng.

Nếu có thể, hãy mở file bài học cho người dùng bằng cách chạy lệnh CLI.

Mỗi bài học nên liên kết qua các thẻ anchor HTML tới các bài học khác và tài liệu tham khảo.

Mỗi bài học nên đề xuất một nguồn sơ cấp để người dùng đọc hoặc xem. Đây nên là nguồn tài nguyên chất lượng cao nhất, đáng tin cậy nhất bạn tìm thấy về chủ đề này.

Mỗi bài học nên chứa một lời nhắc nhở hỏi lại agent các câu hỏi theo dõi. Agent là giáo viên của họ, và có thể hỗ trợ bất kỳ điều gì chưa rõ.

## Assets

Các bài học được xây dựng từ các **component** tái sử dụng, lưu trong `./assets/`: stylesheet, widget trắc nghiệm, trình mô phỏng, helper sơ đồ — bất kỳ thứ gì một bài học thứ hai có thể tái sử dụng.

Tái sử dụng là mặc định, không phải ngoại lệ. Trước khi soạn thảo một bài học, hãy đọc `./assets/` và xây dựng từ các component đã có ở đó. Khi một bài học cần một thứ gì đó mới và có thể tái sử dụng, hãy viết nó dưới dạng một component trong `./assets/` và liên kết tới nó — không bao giờ viết code inline mà một bài học trong tương lai sẽ phải lặp lại.

Một stylesheet dùng chung là component đầu tiên mọi không gian làm việc đạt được: mọi bài học đều liên kết với nó, để các bài học trông giống như một khóa học nhất quán thay vì một đống các bài lẻ tẻ. Khi không gian làm việc phát triển, thư viện component cũng nên phát triển theo.

## Mission

Mỗi bài học nên được gắn liền với mission — lý do người dùng quan tâm đến việc học chủ đề này.

Nếu người dùng chưa rõ về mission, hoặc `MISSION.md` chưa được điền, công việc đầu tiên của bạn là phỏng vấn người dùng về lý do tại sao họ muốn học điều này.

Việc không hiểu mission sẽ khiến cho việc tiếp thu kiến thức không được làm căn cứ trong các mục tiêu thực tế. Các bài học sẽ có cảm giác quá trừu tượng. Bạn sẽ không có cách nào đánh giá người dùng nên làm gì tiếp theo.

Mission có thể thay đổi khi người dùng phát triển nhiều kỹ năng và kiến thức hơn. Điều này là bình thường — hãy đảm bảo cập nhật `MISSION.md` và thêm một bản ghi học tập để ghi lại sự thay đổi. Xác nhận với người dùng trước khi thay đổi mission.

## Vùng Phát triển Gần nhất (Zone Of Proximal Development)

Mỗi bài học, người dùng luôn nên cảm thấy như mình đang được thử thách 'vừa đủ'.

Người dùng có thể chỉ định một điều chính xác họ muốn học. Nếu họ không chỉ định, hãy tìm hiểu vùng phát triển gần nhất của họ bằng cách:

- Đọc các `learning-records` của họ
- Tìm ra điều đúng đắn cần dạy cho họ dựa trên mission của họ
- Dạy điều có liên quan nhất phù hợp với vùng phát triển gần nhất của họ

## Kiến thức (Knowledge)

Các bài học nên được thiết kế xoay quanh một kỹ năng mà người dùng sắp học. Kiến thức trong bài học chỉ nên là những gì cần thiết để tiếp thu kỹ năng đó. Bạn dạy kiến thức trước, sau đó cho người dùng thực hành kỹ năng thông qua một vòng lặp phản hồi tương tác.

Kiến thức trước hết nên được thu thập từ các nguồn tài nguyên đáng tin cậy. Dùng `RESOURCES.md` để theo dõi chúng. Các bài học nên chứa đầy các trích dẫn — liên kết tới các tài nguyên bên ngoài để bảo chứng cho bất kỳ khẳng định nào được đưa ra. Điều này làm tăng độ tin cậy của bài học.

Đối với việc tiếp thu kiến thức, khó khăn là kẻ thù. Nó ngốn trí nhớ làm việc mà bạn cần cho sự hiểu biết.

## Kỹ năng (Skills)

Nếu kiến thức là về việc tiếp thu, thì kỹ năng là về độ bền và tính linh hoạt. Hãy làm cho kiến thức khắc sâu.

Đối với việc tiếp thu kỹ năng, khó khăn là công cụ. Sự gợi nhớ nỗ lực chính là thứ xây dựng độ bền lưu trữ (storage strength). Kỹ năng nên được dạy thông qua các bài học tương tác. Có một số công cụ theo ý bạn:

- Các bài học tương tác, dùng trắc nghiệm và các tác vụ nhẹ trong trình duyệt
- Các bài học hướng dẫn người dùng qua một danh sách các bước thực tế cần thực hiện (ví dụ, các tư thế yoga)

Mỗi bài học này nên dựa trên một **vòng lặp phản hồi (feedback loop)**, nơi người dùng nhận được phản hồi về hiệu suất của họ. Vòng lặp phản hồi này nên càng chặt càng tốt, đưa ra phản hồi ngay lập tức — và lý tưởng nhất là tự động.

Đối với trắc nghiệm, mỗi câu trả lời nên có số từ chính xác như nhau (và số ký tự, nếu có thể). Đừng cho người dùng bất kỳ manh mối nào về câu trả lời thông qua định dạng.

## Tiếp thu Sự Khôn ngoan (Acquiring Wisdom)

Sự khôn ngoan đến từ tương tác thực sự ngoài đời — kiểm tra kỹ năng của bạn bên ngoài môi trường học tập.

Khi người dùng hỏi một câu hỏi dường như đòi hỏi sự khôn ngoan, tư thế mặc định của bạn nên là cố gắng trả lời — nhưng cuối cùng là ủy quyền cho một **cộng đồng (community)**.

Một cộng đồng là một nơi (online hoặc offline) nơi người dùng có thể kiểm tra kỹ năng của họ trong thế giới thực. Đây có thể là một diễn đàn, một subreddit, một lớp học ngoài đời (nếu ngân sách cho phép) hoặc một nhóm sở thích cục bộ.

Bạn nên cố gắng tìm các cộng đồng có uy tín cao mà người dùng có thể tham gia. Nếu người dùng thể hiện sở thích rằng họ không muốn tham gia cộng đồng, hãy tôn trọng điều đó.

## Tài liệu Tham chiếu (Reference Documents)

Trong khi tạo bài học, bạn cũng nên tạo các tài liệu tham chiếu. Các bài học có thể tham chiếu các tài liệu này — chúng hữu ích cho việc theo dõi các đơn vị kiến thức thô hữu ích xuyên suốt các bài học.

Các bài học hiếm khi được xem lại sau này — các tài liệu tham chiếu thì có. Chúng nên là bản chất nén lại của bài học, ở định dạng được thiết kế cho việc tra cứu nhanh.

Một số chủ đề học tập rất thích hợp cho tài liệu tham chiếu:

- Cú pháp và code snippet cho lập trình
- Thuật toán và sơ đồ cho các quy trình
- Tư thế yoga và chuỗi động tác cho yoga
- Bài tập và lịch trình cho thể hình
- Bảng thuật ngữ cho bất kỳ chủ đề nào có thuật ngữ riêng

Bảng thuật ngữ, đặc biệt, là một tài liệu tham chiếu thiết yếu. Một khi đã được tạo ra, nó nên được tuân thủ trong mọi bài học.

## `NOTES.md`

Người dùng đôi khi sẽ thể hiện sở thích về cách họ muốn được dạy, hoặc những điều bạn nên lưu ý. Đây là nơi để ghi lại những sở thích đó, để bạn có thể tham chiếu lại khi thiết kế bài học hoặc làm việc với người dùng.
