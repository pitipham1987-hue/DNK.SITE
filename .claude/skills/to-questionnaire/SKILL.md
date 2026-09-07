---
name: to-questionnaire
description: Biến một quyết định mà bạn không thể tự mình trả lời đầy đủ thành một bảng câu hỏi để người khác điền vào.
disable-model-invocation: true
---

Biến một điều gì đó mà người dùng không thể tự trả lời đơn độc thành một **bảng câu hỏi (questionnaire)** — một tài liệu Markdown mà họ đưa cho một người khác điền bất đồng bộ, hoặc cùng điền trong một cuộc họp. Người nhận nắm giữ kiến thức mà người dùng còn thiếu; bảng câu hỏi sẽ rút kiến thức đó ra từ họ.

**Phỏng vấn việc gửi, không phải chủ đề.** Phỏng vấn người dùng chỉ về việc _gửi_, điều mà họ luôn có thể trả lời: gửi cho ai, và họ cần nhận lại gì. Các câu hỏi trong tài liệu sau đó sẽ nhắm vào **khoảng trống (gap)** giữa những gì người nhận biết và những gì người dùng cần.

1. **Gửi cho ai?** Hỏi, trong một lần trao đổi, vai trò, chuyên môn, và mối quan hệ của người nhận với người dùng. Điều này cố định giọng văn của bảng câu hỏi và lượng ngữ cảnh mà nó phải mang theo. Hoàn tất khi bạn biết người nhận là ai và họ biết điều gì mà người dùng không biết.

2. **Bạn cần nhận lại gì?** Hỏi, trong một lần trao đổi, các quyết định hoặc sự kiện cụ thể mà người dùng không thể tự giải quyết một mình và cần từ người này. Hoàn tất khi bạn có một danh sách cụ thể về những gì người dùng phải bước ra có thể làm hoặc quyết định được.

3. **Viết bảng câu hỏi.** Phác thảo các câu hỏi nhắm vào khoảng trống từ bước 1–2, tuân theo Cấu trúc Tài liệu bên dưới. Viết nó vào `to-questionnaire-<slug>.md` trong thư mục hiện tại (slug từ chủ đề) và thông báo đường dẫn. Hoàn tất khi file tồn tại và mọi mục người dùng nêu tên ở bước 2 đều được bao phủ bởi một câu hỏi.

## Cấu trúc tài liệu

Đóng khung tài liệu dưới dạng một **bảng câu hỏi khám phá (discovery questionnaire)**: người dùng thiếu ngữ cảnh, người nhận nắm giữ nó. Sắp xếp các câu hỏi theo thứ tự quan trọng-nhất-trước — làm việc bất đồng bộ nghĩa là bạn có thể chỉ có một lượt gửi — và nhóm chúng dưới các heading `##` theo chủ đề một khi có nhiều hơn một vài câu hỏi. Viết nó dùng mẫu bên dưới.

<questionnaire-template>

# <Tên bảng câu hỏi>

**Mục đích:** tại sao bảng câu hỏi này tồn tại và quyết định nào phụ thuộc vào nó.

**Từ:** <người dùng> — **Tới:** <người nhận> — **Cách câu trả lời của bạn sẽ được sử dụng:** <chúng đi đâu>

## Ngữ cảnh

Một đoạn văn định hướng cho người nhận không nằm trong đầu của người dùng. Đủ để trả lời tốt, không phải cả một trang.

## Cách trả lời

Hạn chót và công sức ước tính. Các câu trả lời một phần và "tôi không biết" đều có ích — hãy đánh dấu bất kỳ điều gì bạn không chắc chắn thay vì bỏ qua.

## <Heading chủ đề>

Một phần `##` cho mỗi chủ đề. Dưới mỗi phần, các câu hỏi của nó, quan trọng-nhất-trước. Mỗi câu hỏi là một ý — không bao giờ ghép phức hợp — với một khung trả lời ngay bên dưới, và một dòng _tại sao điều này quan trọng_ chỉ ở nơi câu hỏi có thể bị đọc hiểu sai hoặc mời gọi một câu trả lời qua loa.

<question-example>
### Tải mà hệ thống dự kiến sẽ xử lý khi ra mắt là bao nhiêu?

_Tại sao điều này quan trọng: nó quyết định liệu chúng ta nên cấp phát cho lưu lượng đột biến ngay bây giờ hay hoãn lại._

>
</question-example>

## Còn điều gì khác không?

Một câu hỏi chốt cuối cùng mở rộng: có điều gì chúng ta chưa hỏi mà chúng ta nên biết không?

</questionnaire-template>
