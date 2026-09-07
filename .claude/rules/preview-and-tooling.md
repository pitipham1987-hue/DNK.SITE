# Chạy, xem trước & tooling

## Chạy site

```bash
python -m http.server 8000    # rồi mở http://localhost:8000
```

- Luôn mở qua HTTP server. **Không** mở file trực tiếp (`file://`) — đường dẫn tương đối + Google Fonts sẽ lệch.
- Ưu tiên skill `run` hoặc `browser-automation` để khởi chạy và chụp screenshot khi xác minh UI.
- Trước khi báo hoàn thành một tính năng UI, mở trang trong trình duyệt để kiểm tra thực tế thay vì chỉ đọc code.

## Đường dẫn asset theo vị trí file

- `index.html` (ở gốc) dùng `assets/...`
- Trang trong `pages/` dùng `../assets/...`

## Hooks trong `.claude/` (best-effort, nuốt lỗi, không chặn tool call)

- `PreToolUse` Write|Edit → `backup-file.js` tạo `<file>.bak` (đã gitignore).
- `PreToolUse`/`PostToolUse` `.*` → `audit-log.js` ghi `.claude/logs/<session>.jsonl` (đã gitignore).
- `PostToolUse` Write|Edit → `format-file.js` chạy Prettier (`npx prettier --write`, dùng default, không có file config). Không cần format thủ công; giữ style khớp Prettier default (2 space, double quote).
- `Stop` → `notify-done.ps1` thông báo khi xong.
