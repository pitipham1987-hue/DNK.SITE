---
name: to-questionnaire
description: Biến một quyết định mà bạn không thể tự trả lời đầy đủ thành một bảng câu hỏi (questionnaire) để người khác điền vào.
disable-model-invocation: true
---

Biến một điều mà người dùng không thể tự trả lời thành một **questionnaire** — một tài liệu Markdown mà họ đưa cho một người để điền không đồng bộ (async), hoặc điền cùng nhau trong một cuộc họp. Người nhận nắm giữ kiến thức mà người dùng thiếu; questionnaire sẽ khai thác kiến thức đó từ họ.

**Chất vấn (grill) về việc gửi, không phải về chủ đề.** Chỉ phỏng vấn người dùng về việc _gửi_, vì họ luôn có thể trả lời điều đó: gửi cho ai, và họ cần nhận lại điều gì. Các câu hỏi trong tài liệu sau đó nhắm vào **khoảng trống (gap)** giữa những gì người nhận biết và những gì người dùng cần.

1. **Nó sẽ được gửi cho ai?** Hỏi, trong một lượt trao đổi, về vai trò, chuyên môn, và mối quan hệ của người nhận với người dùng. Điều này xác định tông giọng của questionnaire và lượng ngữ cảnh nó cần mang theo. Hoàn thành khi bạn biết người nhận là ai và họ biết điều gì mà người dùng không biết.

2. **Bạn cần nhận lại điều gì?** Hỏi, trong một lượt trao đổi, về các quyết định hoặc sự kiện cụ thể mà người dùng không thể tự giải quyết và cần từ người này. Hoàn thành khi bạn có một danh sách cụ thể về những gì người dùng phải có được để có thể làm hoặc quyết định.

3. **Viết questionnaire.** Soạn các câu hỏi nhắm vào khoảng trống từ bước 1–2, theo cấu trúc Document bên dưới. Viết nó vào file `to-questionnaire-<slug>.md` trong thư mục hiện tại (slug lấy từ chủ đề) và báo cáo đường dẫn. Hoàn thành khi file tồn tại và mọi mục người dùng nêu ra ở bước 2 đều được một câu hỏi bao quát.

## Cấu trúc tài liệu

Đóng khung tài liệu như một **questionnaire khám phá (discovery questionnaire)**: người dùng thiếu ngữ cảnh, người nhận nắm giữ nó. Sắp xếp câu hỏi theo thứ tự quan trọng nhất trước — vì đây là async nên bạn có thể chỉ có một lượt duy nhất — và nhóm chúng dưới các tiêu đề `##` theo chủ đề khi có nhiều hơn vài câu. Viết nó theo mẫu bên dưới.

<questionnaire-template>

# <Tiêu đề Questionnaire>

**Purpose:** lý do questionnaire này tồn tại và quyết định phụ thuộc vào nó.

**From:** <người dùng> — **To:** <người nhận> — **How your answers will be used:** <câu trả lời sẽ được dùng vào đâu>

## Context

Một đoạn văn định hướng cho người nhận, người không ở trong đầu người dùng. Đủ để trả lời tốt, không phải cả một trang.

## How to answer

Deadline và mức nỗ lực ước tính. Các câu trả lời một phần và "tôi không biết" đều hữu ích — hãy đánh dấu bất cứ điều gì bạn không chắc chắn thay vì bỏ qua nó.

## <Tiêu đề chủ đề>

Một mục `##` cho mỗi chủ đề. Dưới mỗi mục, các câu hỏi của nó, theo thứ tự quan trọng nhất trước. Mỗi câu hỏi là một ý duy nhất — không bao giờ ghép nhiều ý — với một chỗ trống để trả lời ngay bên dưới, và một dòng _tại sao điều này quan trọng_ chỉ khi câu hỏi có thể bị hiểu sai hoặc dẫn đến một câu trả lời qua loa.

<question-example>
### What load is the system expected to handle at launch?

_Why this matters: it decides whether we provision for burst traffic now or defer it._

>
</question-example>

## Anything else?

Một mục hỏi tổng hợp khép lại: có điều gì chúng tôi chưa hỏi mà chúng tôi nên biết không?

</questionnaire-template>
