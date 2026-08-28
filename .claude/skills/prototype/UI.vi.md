# Prototype UI

Tạo ra **nhiều biến thể UI khác nhau hoàn toàn (radically different)** trên cùng một route, có thể chuyển đổi từ một thanh nổi ở dưới cùng (floating bottom bar). Người dùng chuyển qua lại giữa các biến thể trong trình duyệt, chọn một cái (hoặc lấy các phần từ mỗi cái), rồi bỏ phần còn lại đi.

Nếu câu hỏi là về logic/state hơn là về hình thức trông như thế nào — sai nhánh rồi. Dùng [LOGIC.md](LOGIC.md).

## Khi nào đây là hình dạng đúng

- "Trang này nên trông như thế nào?"
- "Tôi muốn xem một vài lựa chọn cho dashboard này trước khi quyết định."
- "Thử một layout khác cho màn hình settings."
- Bất kỳ lúc nào người dùng nếu không sẽ mất cả ngày để chọn giữa ba bản mockup mơ hồ trong đầu.

## Hai dạng con — ưu tiên mạnh cho dạng con A

Một UI prototype dễ đánh giá hơn nhiều khi nó **nằm cạnh phần còn lại của app** — header thật, sidebar thật, dữ liệu thật, mật độ thật. Một route throwaway đứng riêng lẻ là một khoảng chân không: mọi biến thể đều trông ổn khi đứng một mình. Mặc định chọn dạng con A bất cứ khi nào có một trang hiện có khả dĩ để chứa các biến thể. Chỉ dùng dạng con B khi prototype thực sự không có nơi nào gần gũi để ở.

### Dạng con A — điều chỉnh trên một trang hiện có (ưu tiên)

Route đã tồn tại sẵn. Các biến thể được render **trên cùng route đó**, được kiểm soát bởi một tham số tìm kiếm URL `?variant=`. Việc lấy dữ liệu, params, và auth hiện có đều giữ nguyên — chỉ có phần render là thay đổi. Đây là mặc định; chọn nó trừ khi có lý do cụ thể để không làm vậy.

Nếu prototype dành cho thứ gì đó chưa có trang riêng nhưng *đáng lẽ nên nằm trong một trang* (một phần mới của dashboard, một card mới trên màn hình settings, một bước mới trong một luồng hiện có) — đó vẫn là dạng con A. Gắn các biến thể vào bên trong trang chủ (host page).

### Dạng con B — một trang mới (phương án cuối cùng)

Chỉ dùng cách này khi thứ đang được làm prototype thực sự không có trang hiện có nào để ở trong đó — ví dụ: một bề mặt top-level hoàn toàn mới, hoặc một luồng không thể nhúng vào bất cứ đâu hợp lý.

Tạo một **route throwaway** theo bất kỳ quy ước routing nào mà dự án đã có sẵn — đừng phát minh ra một cấu trúc top-level mới. Đặt tên sao cho rõ ràng đó là một prototype (ví dụ: bao gồm từ `prototype` trong đường dẫn hoặc tên file). Vẫn dùng mẫu `?variant=`.

Trước khi cam kết dùng dạng con B, hãy kiểm tra lại: liệu có thực sự không có trang hiện có nào để nhúng cái này vào không? Một route trống che giấu các vấn đề thiết kế mà một route có dữ liệu thật sẽ phơi bày ra.

Ở cả hai dạng con, thanh nổi ở dưới cùng đều giống hệt nhau.

## Quy trình

### 1. Nêu rõ câu hỏi và chọn N

Mặc định là **3 biến thể**. Hơn 5 thì không còn là "khác nhau hoàn toàn" nữa mà trở thành nhiễu — giới hạn ở đó.

Viết ra kế hoạch trong một dòng, tại vị trí của prototype hoặc một comment ở đầu file:

> "Ba biến thể của trang settings, chuyển đổi qua `?variant=`, trên route `/settings` hiện có."

Cách này hoạt động dù người dùng có mặt để phản hồi hay không.

### 2. Tạo ra các biến thể khác nhau hoàn toàn

Phác thảo từng biến thể. Giữ mỗi biến thể tuân theo:

- Mục đích của trang và dữ liệu mà nó có quyền truy cập.
- Thư viện component / hệ thống styling của dự án (TailwindCSS, shadcn, MUI, CSS thuần, bất cứ thứ gì).
- Một tên component export rõ ràng, ví dụ `VariantA`, `VariantB`, `VariantC`.

Các biến thể phải **khác nhau về cấu trúc (structurally different)** — layout khác nhau, hệ thống phân cấp thông tin khác nhau, affordance chính khác nhau, không chỉ là màu sắc khác nhau. Ba lưới card (card grid) hơi khác nhau một chút không phải là một UI prototype, đó là giấy dán tường. Nếu hai bản phác thảo ra quá giống nhau, làm lại một cái với hướng dẫn rõ ràng "không dùng card grid."

### 3. Nối chúng lại với nhau

Tạo một component chuyển đổi (switcher) duy nhất trên route:

```tsx
// pseudo-code — adapt to the project's framework
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

Với dạng con A (trang hiện có): giữ toàn bộ việc lấy dữ liệu hiện có phía trên switcher; chỉ có cây (subtree) được render theo từng biến thể mới thay đổi.

Với dạng con B (trang mới): route throwaway dưới `/prototype/<name>` gắn cùng switcher đó.

### 4. Xây dựng thanh chuyển đổi nổi (floating switcher)

Một thanh nhỏ định vị cố định (fixed-position) ở giữa-dưới màn hình với ba phần:

- **Mũi tên trái** — chuyển sang biến thể trước đó (quay vòng — wraps around).
- **Nhãn biến thể** — hiển thị key của biến thể hiện tại và, nếu biến thể có export tên, cả tên đó nữa. Ví dụ: `B — Sidebar layout`.
- **Mũi tên phải** — chuyển tiếp (quay vòng — wraps around).

Hành vi:

- Click vào một mũi tên sẽ cập nhật tham số tìm kiếm URL (dùng router của framework — `router.replace` trên Next, `navigate` trên React Router, v.v.) để biến thể có thể chia sẻ được và ổn định khi reload.
- Bàn phím: phím mũi tên `←` và `→` cũng chuyển đổi được. Đừng chặn phím mũi tên khi một `<input>`, `<textarea>`, hoặc `[contenteditable]` đang được focus.
- Nổi bật rõ ràng so với trang (ví dụ: viên thuốc (pill) tương phản cao, bóng đổ nhẹ) để rõ ràng nó không phải là một phần của thiết kế đang được đánh giá.
- Ẩn trong các bản build production — gate bằng `process.env.NODE_ENV !== 'production'` hoặc kiểm tra tương đương, để một lần merge prototype lạc đường không thể đưa thanh này ra cho người dùng thật.

Đặt switcher trong một component dùng chung duy nhất để cả hai dạng con có thể tái sử dụng. Đặt nó ở bất cứ đâu mà UI dùng chung của dự án đang sống.

### 5. Bàn giao

Đưa ra URL (và các key `?variant=`). Người dùng sẽ chuyển qua lại bất cứ khi nào họ có thời gian. Phản hồi thú vị thường là **"Tôi muốn header từ B với sidebar từ C"** — đó chính là thiết kế thực sự mà họ muốn.

### 6. Ghi lại câu trả lời và dọn dẹp

Khi một biến thể đã thắng, ghi lại câu trả lời — biến thể nào và tại sao — sau đó ghi lại bản prototype theo cách [SKILL](SKILL.md) mô tả. Gấp phiên bản thắng vào code thật và chuyển phần còn lại sang nhánh throwaway, không phải vào main:

- **Dạng con A** — gấp phiên bản thắng vào trang hiện có; loại bỏ các biến thể thua và switcher khỏi main.
- **Dạng con B** — nâng cấp biến thể thắng thành một route thật; loại bỏ route throwaway và switcher khỏi main.

Toàn bộ tập hợp các biến thể là nguồn chính (primary source), vì vậy nó nên nằm trên nhánh throwaway, không phải thùng rác — các component biến thể và switcher bị bỏ lại trong nhánh main sẽ nhanh chóng mục nát và gây bối rối cho người đọc tiếp theo.

## Các anti-pattern

- **Các biến thể chỉ khác nhau về màu sắc hoặc nội dung chữ (copy).** Đó là một điều chỉnh (tweak), không phải một prototype. Các biến thể thật sự phải bất đồng về cấu trúc.
- **Chia sẻ quá nhiều code giữa các biến thể.** Một `<Header>` dùng chung thì ổn; một `<Layout>` dùng chung thì phá vỡ mục đích. Mỗi biến thể nên được tự do vứt bỏ layout.
- **Nối các biến thể với các mutation thật.** Prototype chỉ đọc (read-only) thì ổn. Nếu một biến thể cần mutate, trỏ nó vào một stub — câu hỏi là "cái này nên trông như thế nào," không phải "backend có hoạt động không."
- **Đưa prototype trực tiếp lên production.** Code biến thể được viết dưới các ràng buộc của prototype (không test, xử lý lỗi tối thiểu). Viết lại đúng cách khi gấp nó vào.
