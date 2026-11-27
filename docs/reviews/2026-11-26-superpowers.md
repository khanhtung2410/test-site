# Code review — bổ sung quy tắc bằng chứng và vận hành (2026-11-26)

- **Skill:** superpowers (self-review)
- **Phạm vi:** `docs/REQUIREMENTS.md`, `AGENTS.md`, `AI_LOG.md`
- **Base:** d758694 | **Head:** 1acb3b9 (`docs: add evidence and process rules to requirements`)
- **Prompt nguyên văn:** xem `AI_LOG.md` mục `2026-11-26 15:46:16 +07:00 - Bổ sung quy tắc bằng chứng, quy trình và vận hành vào yêu cầu`.

## Phương pháp

Đọc toàn bộ `docs/REQUIREMENTS.md` (187 dòng), `docs/PERFORMANCE.md` (109 dòng), phần cuối `AGENTS.md` và template review. Chạy `git diff --stat` và `git diff -- docs/REQUIREMENTS.md AGENTS.md` để soi từng dòng đổi. Dùng `grep` trên `docs/SPEC.md` để kiểm tra A-01, A-02, A-03 trước khi ghi link. Quét ký tự trên ba file đổi. Chạy `npm run lint` và `npm run build` bằng Node `spawnSync` với `encoding: utf8` và `NO_COLOR=1`.

## Phát hiện và quyết định

| # | Mức độ · file:line | Cách tái hiện / ảnh hưởng | Quyết định |
|---|---|---|---|
| 1 | Minor · `docs/REQUIREMENTS.md:89` | NFR-07 đến NFR-10 giờ chỉ còn link tới PERF-01, PERF-02, PERF-04, PERF-05; người đọc phải mở `PERFORMANCE.md` để thấy ngưỡng. | **Accepted (sửa trong PR này)** — đúng yêu cầu GOV-02: số liệu chỉ ghi ở một chỗ. |
| 2 | Minor · `docs/REQUIREMENTS.md:198` | GOV-02 được nêu là quy tắc repo-wide nhưng PR này chỉ dọn số liệu trong `REQUIREMENTS.md`; các file khác chưa kiểm tra. | **Rejected** — nằm ngoài phạm vi cập nhật quy tắc; AGENTS.md rule 9 cấm sửa nội dung lịch sử chỉ để ép quy tắc khi chưa hỏi chủ dự án. |
| 3 | Minor · `AGENTS.md:110` (nay là `:112`) | Rule yêu cầu mọi kết luận có bằng chứng, nhưng docs-only change không có link CI run. | **Accepted (sửa trong PR này)** — đính kèm output `lint` và `build` kèm `EXIT=` trong PR và ngay file review này. |
| 4 | Minor · `docs/REQUIREMENTS.md:95` | NFR-13 link tới A-03; nếu A-03 không phải uptime thì link sai. | **Rejected** — đã kiểm chứng bằng `grep` trong `docs/SPEC.md`: A-03 là "Uptime trong khung giờ thi", A-01 là số học viên đồng thời, A-02 là p95 lưu đáp án. |

## Không đánh giá

- Hành vi ứng dụng: PR không đổi code ứng dụng, chỉ tài liệu.
- Deploy và dữ liệu production: không có quyền và không có run deploy trong phạm vi PR này; ghi "chưa kiểm chứng".
- Hiệu năng thực tế: không có artifact Lighthouse; mọi ngưỡng đều là mục tiêu, ghi "chưa kiểm chứng".

## Đối chiếu checklist với bằng chứng

| Tuyên bố | Test hoặc output | Kết quả |
|---|---|---|
| Chữ Việt và Anh trong file đổi | Quét Unicode trên `docs/REQUIREMENTS.md`, `AGENTS.md`, `AI_LOG.md` | OK |
| `npm run lint` | Node `spawnSync`, `NO_COLOR=1`, output bên dưới (lịch sử tại PR #2) | EXIT=0, 8 warning từ `figma-plugin/code.js`; PR #3 đã ignore thư mục này nên không còn warning |
| `npm run build` | Node `spawnSync`, `NO_COLOR=1`, output bên dưới | EXIT=0 |
| `npm run typecheck` | Tại PR #2 script chưa có | chưa kiểm chứng lúc đó; PR #3 thêm script và chạy `EXIT=0` |
| `npm test` | Script chưa có trong `package.json` | chưa kiểm chứng |
| `npm run format:check` | Tại PR #2 script chưa có | chưa kiểm chứng lúc đó; PR #3 thêm script và chạy `EXIT=0` |
| `npm run check:language` | Tại PR #2 script chưa có; đã quét thủ công | chưa kiểm chứng bằng script lúc đó; PR #3 thêm script, sửa lỗi path trên Windows và chạy `EXIT=0` |
| `npm run test:e2e` | Script chưa có; không đổi hành vi | chưa kiểm chứng |

## Output kiểm chứng

```text
$ npm run lint (lịch sử tại PR #2)
✖ 8 problems (0 errors, 8 warnings) -- tất cả từ figma-plugin/code.js (đã nằm trong .gitignore)
EXIT=0

$ npm run build
✓ Compiled successfully
✓ Generating static pages using 5 workers (4/4)
○ (Static) prerendered as static content
EXIT=0
```

Output đầy đủ của cả hai lệnh nằm trong PR #2 mục Testing.

## Giới hạn

- Chỉ tự review; chưa có reviewer độc lập.
- Không có CI run link cho PR này vì chưa push branch.
- Không kiểm chứng được GOV-07 và GOV-08 trên thực tế.

Link entry AI_LOG: `AI_LOG.md` mục `2026-11-26 15:46:16 +07:00 - Bổ sung quy tắc bằng chứng, quy trình và vận hành vào yêu cầu`.
