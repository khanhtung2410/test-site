# Code review — Mốc 1, đối chiếu tài liệu sau phản hồi (2026-11-26)

- **Skill:** requesting-code-review
- **Phạm vi:** thay đổi tài liệu trên nhánh `docs/requirement-evidence-rules`, so với base `d758694`
- **Base:** d758694 | **Head:** working tree sau khi sửa
- **Prompt nguyên văn:** xem `AI_LOG.md` mục `2026-11-26 15:46:16 +07:00 - Bổ sung quy tắc bằng chứng, quy trình và vận hành vào yêu cầu` và entry mới nhất.

## Phương pháp

Dispatch reviewer subagent với context riêng, không dùng lịch sử session. Reviewer đọc toàn bộ file, chạy `git diff`, `git status`, `git check-ignore`, kiểm tra file trên disk và `git show` để đối chiếu base. Reviewer KHÔNG chạy lại npm; output lint/build trong file này là output đã lưu ở `docs/reviews/2026-11-26-superpowers.md`, không phải kết quả tự kiểm chứng của reviewer.

## Phát hiện và quyết định

| # | Mức độ · file:line | Cách tái hiện / ảnh hưởng | Quyết định |
|---|---|---|---|
| 1 | Important · `docs/REQUIREMENTS.md:105` | `grep "đã duyệt"` trả dòng wireframe đã duyệt, mâu thuẫn với `SPEC.md` mục 10 và `HANDOVER.md` "chờ mentor duyệt". | **Accepted (sửa trong PR này)** — đổi thành "bản trình duyệt, chờ mentor duyệt". |
| 2 | Important · `README.md:7`, `README.md:209`, `docs/ARCHITECTURE.md:3,13`, `docs/HANDOVER.md:13` | `git status --short` cho thấy scaffold untracked tồn tại trên disk; câu "Repo chưa có" sai với working tree dù đúng với HEAD. | **Accepted (sửa trong PR này)** — dùng "HEAD chưa có" và ghi rõ scaffold untracked không phải artifact repo; làm rõ `lint`/`build` chỉ có trên máy tác giả. |
| 3 | Important · `README.md:58-62`, `README.md:108-121` | Mục 4 và 5 đưa lệnh npm không kèm điều kiện, mâu thuẫn với mục 6 và 9. | **Accepted (sửa trong PR này)** — thêm điều kiện "khi có `package.json` (Mốc 2)" ở đầu mục 4. |
| 4 | Minor · `docs/reviews/2026-11-26-superpowers.md:19` | Finding cũ ghi `REQUIREMENTS.md:94`, trong khi NFR-13 nằm ở dòng 95. | **Accepted (sửa trong PR này)** — đổi thành `:95`. |
| 5 | Minor · `docs/MOCKUPS.md:20` | Cụm "đã chốt" vẫn ngụ ý wireframe đã duyệt. | **Accepted (sửa trong PR này)** — đổi thành "bản trình duyệt, chờ mentor duyệt". |
| 6 | Minor · `docs/SPEC.md:85` | D-19 đổi hành vi Must nhưng chưa có bằng chứng mentor duyệt. | **Accepted (ghi nhận trong PR này)** — thêm "Chờ mentor xác nhận" vào D-19; không tuyên bố đã chốt. |
| 7 | Important · lịch sử PR #1 và commit `d758694` | PR #1 gồm 2880 dòng/17 file, vượt ngưỡng < 400 dòng; `d758694` đẩy thẳng vào `main`, trái AGENTS.md rule 1. | **Accepted (ghi nhận trong entry AI_LOG mới)** — không rewrite history; từ Mốc 2 dùng branch + PR, mỗi PR một việc. |

## Không đánh giá

- Code ứng dụng: không đổi; tại thời điểm review này HEAD là `d758694` và chưa có scaffold. PR #3 sau đó đã commit scaffold.
- Deploy và production: không có pipeline, không có bằng chứng chạy; ghi "chưa kiểm chứng".

## Đối chiếu checklist với bằng chứng

| Tuyên bố | Test hoặc output | Kết quả |
|---|---|---|
| `.env.example` không bị ignore | `git check-ignore .env.example` không in gì, `EXIT=1`; `git check-ignore -v .env.example` chỉ ra `.gitignore:35:!.env.example`; `git status` hiện `?? .env.example` | đạt |
| Không còn "đã duyệt" | `grep` sau khi sửa | đã sửa theo finding 1 và 5 |
| Số liệu chỉ một chỗ | `git diff d758694`; các dòng ngưỡng trong `SPEC.md`, `REQUIREMENTS.md`, `DEPLOY.md` đã thành link | đã sửa |
| `npm run lint` | output trong `docs/reviews/2026-11-26-superpowers.md` | EXIT=0 |
| `npm run build` | output trong `docs/reviews/2026-11-26-superpowers.md` | EXIT=0 |
| `typecheck`, `test`, `format:check`, `check:language`, `test:e2e` | tại HEAD `d758694` các script chưa có | chưa kiểm chứng lúc đó; PR #3 sau đó thêm `typecheck`, `format:check`, `check:language` |

## Output kiểm chứng

```text
$ git check-ignore .env.example
PLAIN_EXIT=1

$ git check-ignore -v .env.example
.gitignore:35:!.env.example	.env.example
NOINDEX_EXIT=0

$ git diff --stat d758694 (trước khi thêm review file này)
15 files changed, 240 insertions(+), 64 deletions(-)
```

## Giới hạn

- Reviewer không chạy lại npm; output lint/build được trích từ file review trước, không phải lần chạy mới.
- Không có CI run link cho PR này.
- D-19 chờ mentor xác nhận; mockup D6/S7 phản ánh hướng đề xuất, không phải quyết định đã duyệt.

Link entry AI_LOG: `AI_LOG.md` mục mới nhất `2026-11-26 ... - Xử lý phản hồi review Mốc 1 A1-A15`.
