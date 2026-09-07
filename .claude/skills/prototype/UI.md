# UI Prototype

Tạo ra **nhiều biến thể UI khác biệt triệt để** trên một route duy nhất, có thể chuyển đổi qua một thanh nổi ở đáy màn hình. Người dùng lật qua các biến thể trong trình duyệt, chọn một cái (hoặc nhặt các chi tiết từ mỗi cái), sau đó vứt bỏ phần còn lại.

Nếu câu hỏi xoay quanh logic/trạng thái hơn là giao diện trông như thế nào — sai nhánh. Hãy dùng [LOGIC.md](LOGIC.md).

## Khi nào đây là hình dạng phù hợp

- "Trang này nên trông như thế nào?"
- "Tôi muốn xem một vài phương án cho dashboard này trước khi cam kết triển khai."
- "Thử một bố cục khác cho màn hình cài đặt."
- Bất kỳ khi nào người dùng nếu không làm vậy sẽ phải dành cả ngày để chọn giữa ba bản mockup mơ hồ trong đầu họ.

## Hai hình dạng phụ — cực kỳ ưu tiên hình dạng phụ A

Một UI prototype dễ đánh giá hơn nhiều khi nó **đặt cạnh phần còn lại của ứng dụng** — header thật, sidebar thật, dữ liệu thật, mật độ thật. Một route dùng-một-lần-rồi-bỏ nằm một mình là một môi trường chân không: mọi biến thể trông đều ổn khi đứng cô lập. Hãy mặc định chọn hình dạng phụ A bất cứ khi nào có một trang hiện có hợp lý để chứa các biến thể. Chỉ chọn hình dạng phụ B nếu prototype thực sự không có ngôi nhà nào gần đó.

### Hình dạng phụ A — điều chỉnh một trang hiện có (ưu tiên)

Route đã tồn tại. Các biến thể được render **trên cùng route**, được kiểm soát bởi tham số tìm kiếm URL `?variant=`. Việc lấy dữ liệu hiện có, các param, và auth đều giữ nguyên — chỉ có phần rendering được hoán đổi. Đây là mặc định; hãy chọn nó trừ khi có lý do đặc biệt để không chọn.

Nếu prototype dành cho một thứ chưa có trang nhưng *nằm trong một trang hiện có một cách tự nhiên* (một phần mới của dashboard, một card mới trên màn hình cài đặt, một bước mới trong một luồng hiện có) — đó vẫn là hình dạng phụ A. Gắn các biến thể bên trong trang chủ (host page).

### Hình dạng phụ B — một trang mới (lựa chọn cuối cùng)

Chỉ dùng cách này khi thứ đang làm prototype thực sự không có trang hiện có nào để sống bên trong — ví dụ một bề mặt cấp cao nhất hoàn toàn mới, hoặc một luồng không thể nhúng vào đâu một cách hợp lý.

Tạo một **route dùng-một-lần-rồi-bỏ** tuân theo bất kỳ quy ước routing nào dự án đang dùng — không tự bịa ra cấu trúc cấp cao nhất mới. Đặt tên sao cho rõ ràng là một prototype (ví dụ đưa từ `prototype` vào path hoặc filename). Cùng mô hình `?variant=`.

Trước khi chọn hình dạng phụ B, hãy kiểm tra lại: thực sự không có trang hiện có nào có thể nhúng cái này vào sao? Một route trống rỗng sẽ giấu đi các vấn đề thiết kế mà một route có dữ liệu sẽ bộc lộ.

Trong cả hai hình dạng phụ, thanh công cụ nổi ở đáy màn hình là giống hệt nhau.

## Quy trình

### 1. Nêu rõ câu hỏi và chọn N

Mặc định là **3 biến thể**. Nhiều hơn 5 biến thể sẽ không còn là khác biệt triệt để mà bắt đầu trở thành nhiễu — hãy giới hạn ở đó.

Ghi lại kế hoạch bằng một dòng, tại vị trí của prototype hoặc một comment ở đầu file:

> "Three variants of the settings page, switchable via `?variant=`, on the existing `/settings` route."

Cách này hoạt động dù người dùng có ở đây để phản hồi hay không.

### 2. Tạo ra các biến thể khác biệt triệt me

Phác thảo từng biến thể. Giữ từng cái tuân theo:

- Mục đích của trang và dữ liệu mà nó có quyền truy cập.
- Thư viện component / hệ thống style của dự án (TailwindCSS, shadcn, MUI, plain CSS, bất cứ thứ gì).
- Một tên component được export rõ ràng, ví dụ `VariantA`, `VariantB`, `VariantC`.

Các biến thể phải **khác biệt về cấu trúc** — layout khác nhau, hệ thống phân cấp thông tin khác nhau, yếu tố tương tác chính khác nhau, không chỉ là màu sắc khác nhau. Ba lưới card được chỉnh sửa nhẹ không phải là một UI prototype, đó là giấy dán tường. Nếu hai bản phác thảo ra quá giống nhau, hãy làm lại một cái với hướng dẫn rõ ràng "không dùng lưới card".

### 3. Nối chúng lại với nhau

Tạo một component switcher duy nhất trên route:

```tsx
// pseudo-code — điều chỉnh theo framework của dự án
const variant = searchParams.get('variant') ?? 'A';
return (
  <>
    {variant === 'A' && <VariantA {...data} />}
    {variant === 'B' && <VariantB {...data} />}
    {variant === 'C' && <VariantC {...data} />}
    <PrototypeSwitcher variants={['A','B','C']} current={variant} />
  </>
);
```

Đối với hình dạng phụ A (trang hiện có): giữ tất cả logic lấy dữ liệu hiện có ở phía trên switcher; chỉ có cây component được render thay đổi theo từng biến thể.

Đối với hình dạng phụ B (trang mới): route dùng-một-lần-rồi-bỏ dưới `/prototype/<name>` gắn cùng một switcher.

### 4. Dựng thanh switcher nổi

Một thanh nhỏ cố định vị trí ở giữa đáy màn hình với ba phần:

- **Mũi tên trái** — chuyển sang biến thể trước (quay vòng).
- **Nhãn biến thể** — hiển thị key của biến thể hiện tại và, nếu biến thể export một tên, hiển thị cả tên đó. Ví dụ `B — Sidebar layout`.
- **Mũi tên phải** — chuyển sang biến thể tiếp theo (quay vòng).

Hành vi:

- Click vào mũi tên sẽ cập nhật tham số tìm kiếm URL (dùng router của framework — `router.replace` trên Next, `navigate` trên React Router, v.v.) để biến thể có thể chia sẻ được và giữ nguyên khi reload.
- Bàn phím: phím mũi tên `←` và `→` cũng thực hiện quay vòng. Đừng chặn phím mũi tên khi một `<input>`, `<textarea>`, hoặc `[contenteditable]` đang được focus.
- Trực quan khác biệt so với trang (ví dụ pill độ tương phản cao, bóng mờ nhẹ) để rõ ràng không phải là một phần của thiết kế đang được đánh giá.
- Ẩn trong các bản build production — kiểm tra dựa trên `process.env.NODE_ENV !== 'production'` hoặc kiểm tra tương đương, để một đợt merge prototype vô tình không đưa thanh này tới người dùng cuối.

Đặt switcher trong một component dùng chung duy nhất để cả hai hình dạng phụ đều có thể tái sử dụng. Đặt nó ở bất kỳ đâu UI dùng chung sống trong dự án.

### 5. Bàn giao

Cung cấp URL (và các key `?variant=`). Người dùng sẽ lật qua bất cứ khi nào họ rảnh. Phản hồi thú vị nhất thường là **"Tôi muốn header của B với sidebar của C"** — đó chính là thiết kế thực sự họ muốn.

### 6. Ghi lại câu trả lời và dọn dẹp

Một khi một biến thể đã thắng, hãy ghi lại câu trả lời — biến thể nào và tại sao — sau đó ghi lại prototype theo cách mà [SKILL](SKILL.md) mô tả. Gấp biến thể thắng vào code thật và chuyển phần còn lại sang branch dùng-một-lần-rồi-bỏ, không đưa vào main:

- **Hình dạng phụ A** — gấp biến thể thắng vào trang hiện có; bỏ các biến thể thua và switcher khỏi main.
- **Hình dạng phụ B** — nâng cấp biến thể thắng thành một route thật; bỏ route dùng-một-lần-rồi-bỏ và switcher khỏi main.

Toàn bộ tập hợp biến thể là nguồn sơ cấp, nên nó nằm trên branch dùng-một-lần-rồi-bỏ, không phải thùng rác — các component biến thể và switcher còn lại trong branch main sẽ nhanh chóng thối rữa và làm rối người đọc tiếp theo.

## Mẫu chống lại (Anti-patterns)

- **Các biến thể chỉ khác nhau về màu sắc hoặc văn bản.** Đó là chỉnh sửa nhỏ, không phải prototype. Các biến thể thực sự bất đồng về cấu trúc.
- **Chia sẻ quá nhiều code giữa các biến thể.** Một `<Header>` dùng chung thì ổn; một `<Layout>` dùng chung sẽ đánh bại mục tiêu. Mỗi biến thể nên tự do vứt bỏ layout.
- **Nối các biến thể với các mutation thật.** Prototype chỉ đọc (read-only) là ổn. Nếu một biến thể cần mutate, hãy trỏ nó vào một stub — câu hỏi là "cái này nên trông như thế nào", không phải "backend có chạy không".
- **Nâng cấp trực tiếp prototype lên production.** Code biến thể được viết dưới các ràng buộc prototype (không test, xử lý lỗi tối thiểu). Hãy viết lại nó một cách đàng hoàng khi bạn gấp nó vào.
