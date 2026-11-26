# Code review — bổ sung quy tắc bằng chứng và vận hành (2026-11-26)

- **Skill:** superpowers (self-review)
- **Phạm vi:** `docs/REQUIREMENTS.md`, `AGENTS.md`, `AI_LOG.md`
- **Base:** d758694 | **Head:** working tree trước commit
- **Prompt nguyên văn:** xem `AI_LOG.md` mục `2026-11-26 15:46:16 +07:00 - Bổ sung quy tắc bằng chứng, quy trình và vận hành vào yêu cầu`.

## Phương pháp

Đọc toàn bộ `docs/REQUIREMENTS.md` (187 dòng), `docs/PERFORMANCE.md` (109 dòng), phần cuối `AGENTS.md` và template review. Chạy `git diff --stat` và `git diff -- docs/REQUIREMENTS.md AGENTS.md` để soi từng dòng đổi. Dùng `grep` trên `docs/SPEC.md` để kiểm tra A-01, A-02, A-03 trước khi ghi link. Quét ký tự trên ba file đổi. Chạy `npm run lint` và `npm run build` bằng Node `spawnSync` với `encoding: utf8` và `NO_COLOR=1`.

## Phát hiện và quyết định

| # | Mức độ · file:line | Cách tái hiện / ảnh hưởng | Quyết định |
|---|---|---|---|
| 1 | Minor · `docs/REQUIREMENTS.md:89` | NFR-07 đến NFR-10 giờ chỉ còn link tới PERF-01, PERF-02, PERF-04, PERF-05; người đọc phải mở `PERFORMANCE.md` để thấy ngưỡng. | **Accepted (sửa trong PR này)** — đúng yêu cầu GOV-02: số liệu chỉ ghi ở một chỗ. |
| 2 | Minor · `docs/REQUIREMENTS.md:200` | GOV-02 được nêu là quy tắc repo-wide nhưng PR này chỉ dọn số liệu trong `REQUIREMENTS.md`; các file khác chưa kiểm tra. | **Rejected** — nằm ngoài phạm vi cập nhật quy tắc; AGENTS.md rule 9 cấm sửa nội dung lịch sử chỉ để ép quy tắc khi chưa hỏi chủ dự án. |
| 3 | Minor · `AGENTS.md:110` | Rule yêu cầu mọi kết luận có bằng chứng, nhưng docs-only change không có link CI run. | **Accepted (sửa trong PR này)** — đính kèm output `lint` và `build` kèm `EXIT=` trong PR và ngay file review này. |
| 4 | Minor · `docs/REQUIREMENTS.md:94` | NFR-13 link tới A-03; nếu A-03 không phải uptime thì link sai. | **Rejected** — đã kiểm chứng bằng `grep` trong `docs/SPEC.md`: A-03 là "Uptime trong khung giờ thi", A-01 là số học viên đồng thời, A-02 là p95 lưu đáp án. |

## Không đánh giá

- Hành vi ứng dụng: PR không đổi code ứng dụng, chỉ tài liệu.
- Deploy và dữ liệu production: không có quyền và không có run deploy trong phạm vi PR này; ghi "chưa kiểm chứng".
- Hiệu năng thực tế: không có artifact Lighthouse; mọi ngưỡng đều là mục tiêu, ghi "chưa kiểm chứng".

## Đối chiếu checklist với bằng chứng

| Tuyên bố | Test hoặc output | Kết quả |
|---|---|---|
| Chữ Việt và Anh trong file đổi | Quét Unicode trên `docs/REQUIREMENTS.md`, `AGENTS.md`, `AI_LOG.md` | OK |
| `npm run lint` | Node `spawnSync`, `NO_COLOR=1`, output bên dưới | EXIT=0, 8 warning từ `figma-plugin/code.js` (file đã nằm trong `.gitignore`) |
| `npm run build` | Node `spawnSync`, `NO_COLOR=1`, output bên dưới | EXIT=0 |
| `npm run typecheck` | Script chưa có trong `package.json` | chưa kiểm chứng |
| `npm test` | Script chưa có trong `package.json` | chưa kiểm chứng |
| `npm run format:check` | Script chưa có trong `package.json` | chưa kiểm chứng |
| `npm run check:language` | Script chưa có trong `package.json`; đã quét thủ công | chưa kiểm chứng bằng script |
| `npm run test:e2e` | Script chưa có; không đổi hành vi | chưa kiểm chứng |

## Output kiểm chứng

```text
$ npm run lint

> test-site@0.1.0 lint
> eslint


D:\thuc tap\test-site\figma-plugin\code.js
  159:55  warning  'e' is defined but never used                          @typescript-eslint/no-unused-vars
  163:53  warning  'e' is defined but never used                          @typescript-eslint/no-unused-vars
  193:16  warning  'e' is defined but never used                          @typescript-eslint/no-unused-vars
  685:9   warning  'questionTypePill' is assigned a value but never used  @typescript-eslint/no-unused-vars
  718:11  warning  'c1' is assigned a value but never used                @typescript-eslint/no-unused-vars
  728:11  warning  'c2' is assigned a value but never used                @typescript-eslint/no-unused-vars
  750:11  warning  'c3' is assigned a value but never used                @typescript-eslint/no-unused-vars
  760:11  warning  'c4' is assigned a value but never used                @typescript-eslint/no-unused-vars

✖ 8 problems (0 errors, 8 warnings)



EXIT=0
$ npm run build

> test-site@0.1.0 build
> next build

▲ Next.js 16.4.6 (Turbopack)
✓ Running next.config.ts took 275ms
- Cache Components enabled
- Partial Prefetching enabled

  Creating an optimized production build ...
✓ Compiled successfully in 2.3s
  Running TypeScript ...
  Finished TypeScript in 5.0s ...
  Collecting page data using 5 workers ...
  Generating static pages using 5 workers (0/4) ...
  Generating static pages using 5 workers (1/4) ...
  Generating static pages using 5 workers (2/4) ...
  Generating static pages using 5 workers (3/4) ...
✓ Generating static pages using 5 workers (4/4) in 1714ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
└ ○ /_not-found


○  (Static)  prerendered as static content



EXIT=0
```

## Giới hạn

- Chỉ tự review; chưa có reviewer độc lập.
- Không có CI run link cho PR này vì chưa push branch.
- Không kiểm chứng được GOV-07 và GOV-08 trên thực tế.

Link entry AI_LOG: `AI_LOG.md` mục `2026-11-26 15:46:16 +07:00 - Bổ sung quy tắc bằng chứng, quy trình và vận hành vào yêu cầu`.
