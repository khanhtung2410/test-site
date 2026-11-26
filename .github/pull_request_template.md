## What

<!-- Tóm tắt ngắn gọn thay đổi. 1-2 câu. -->

## Why

<!-- Lý do / mã yêu cầu (FR, K1–K8). Link tới issue nếu có. -->

## How

<!-- Cách tiếp cận chính và điểm cần lưu ý khi review. -->

## Verification

Dán output đầy đủ của các lệnh dưới đây vào code block (không chỉ ghi "pass"):

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run format:check`
- [ ] `npm run build`
- [ ] `npm run test:e2e` (nếu thay đổi hành vi)
- [ ] Kiểm tra thủ công (nếu cần), nêu môi trường và kết quả

```text
# Output đầy đủ, kèm EXIT=... cho từng lệnh
```

## Screenshots (nếu là UI)

Ảnh chụp từ Playwright sau khi trang tải xong; ghi `BASE_URL` và thời điểm.

| Trước | Sau |
|---|---|
|  |  |

## Checklist

- [ ] Đã cập nhật từ `main` mới nhất và giải quyết conflict nếu có
- [ ] Lint, typecheck, test, format:check và build pass
- [ ] E2E pass (nếu thay đổi hành vi)
- [ ] Không có breaking change (hoặc đã ghi rõ ở footer commit)
- [ ] Đã cập nhật README / docs nếu thay đổi hành vi, cấu hình hoặc quyết định
- [ ] Đã cập nhật `AI_LOG.md` nếu dùng AI
- [ ] Đã lưu review vào `docs/reviews/` nếu có review round
- [ ] Không có đáp án đúng, token, mật khẩu hoặc `AUTH_SECRET` trong log/ảnh
- [ ] K1–K8 vẫn đúng nếu thay đổi chạm vào attempt, thời gian, chấm điểm hoặc phân quyền
