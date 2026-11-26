# Code review — <phạm vi> (YYYY-MM-DD)

- **Skill:** <id chính xác, ví dụ requesting-code-review>
- **Phạm vi:** <những gì được review>
- **Base:** <commit> | **Head:** <commit>
- **Prompt nguyên văn:** xem `AI_LOG.md` mục `<tiêu đề entry>`.

## Phương pháp

<Review độc lập hay tự review; skill đã load bằng id; những file đã đọc lại từ source thật; cách tái hiện.>

## Phát hiện và quyết định

| # | Mức độ · file:line | Cách tái hiện / ảnh hưởng | Quyết định |
|---|---|---|---|
| <id> | <Critical / Important / Minor> · `<file>:<line>` | <bước cụ thể> | **Accepted (sửa trong <PR/nhánh>)** hoặc **Rejected (<lý do cụ thể>)** |

## Không đánh giá

- <mục>: <lý do ngoài phạm vi, đã chốt trước, hoặc thiếu bằng chứng>.

## Đối chiếu checklist với bằng chứng

| Tuyên bố | Test hoặc output | Kết quả |
|---|---|---|
| <mục trong checklist của mentor hoặc dự án> | <lệnh, tên test, hoặc output đã lưu> | <đạt/pass hoặc không có bằng chứng> |

## Output kiểm chứng

<Toàn bộ stdout/stderr kèm mã thoát của bộ lệnh kiểm tra. Dán nguyên văn; không chỉ ghi exit 0.>

## Giới hạn

- <những gì chưa kiểm tra và vì sao>.

Link entry AI_LOG: `AI_LOG.md` mục `<tiêu đề entry>`.
