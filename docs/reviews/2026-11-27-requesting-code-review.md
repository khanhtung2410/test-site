# Code review — luồng học viên mock data (2026-11-27)

- **Skill:** requesting-code-review (kèm `subagent-driven-development` cho 3 task review)
- **Phạm vi:** toàn branch `feature/student-mock-pages`, từ `main` ở `1bf29fb` đến `14098da`.
- **Base:** 1bf29fb | **Head:** 14098da
- **Prompt nguyên văn:** xem `AI_LOG.md` mục `2026-11-27 17:13:15 +07:00 - Dựng trang học viên bằng mock data`.

## Phương pháp

Mỗi task trong plan có implementer riêng và reviewer riêng: Task 1 sạch ngay; Task 2 có 1 vòng fix (desktop sidebar + render evidence); Task 3 sạch ngay. Sau 3 task, reviewer whole-branch dùng `requesting-code-review` trả "With fixes" với 3 Important và một số Minor. Một fix subagent duy nhất xử lý toàn bộ findings; scoped re-review xác nhận 6/6 ADDRESSED, không breakage Critical/Important. Không merge theo yêu cầu người dùng.

## Phát hiện và quyết định

| # | Mức độ · file:line | Vấn đề | Quyết định |
|---|---|---|---|
| 1 | Important · `ExamCard.tsx:45-47`, `results.ts:52` | Card e-2/e-3/e-4 dẫn tới result `notFound()` | **Accepted** — fix trong `14098da`: thêm attempt/result mẫu cho e-2/e-3, e-4 disabled; render HTML xác nhận 4 card |
| 2 | Important · `Timer.tsx:33,38` | `aria-live="polite"` trên đồng hồ đổi mỗi giây | **Accepted** — clock `aria-live="off"`, span `sr-only` riêng chỉ đổi ở 300s và 60s |
| 3 | Important · `SubmitDialog.tsx`, `AttemptView.tsx:138-152` | `aria-modal` nhưng không trap focus/Escape/khôi phục focus | **Accepted** — primitive `ModalDialog` dùng chung cho 2 dialog |
| 4 | Minor (nâng bởi controller) · `QuestionNavigator.tsx:29-33` | Đảo màu answered/current so với `MOCKUPS.md:71`, legend thiếu swatch | **Accepted** — sửa trong fix wave |
| 5 | Minor · `ExamCard.tsx:29` | `<h2>` card nằm dưới `<h2>` section | **Accepted** — đổi `<h3>` |
| 6 | Minor · `AttemptView.tsx:83` | Banner offline mâu thuẫn badge "Đã lưu" | **Accepted** — đổi chữ banner |
| 7 | Minor · `attempts.ts:47-49` | Alias `e-1` | **Accepted (defer)** — giữ cho click-through; dọn khi chuyển card sang attempt id thật |
| 8 | Minor · `results.ts:19` | `questionId` chứa text hiển thị | **Accepted (defer)** — DTO đúng shape, cần mở rộng DTO khi wiring server |
| 9 | Minor · `ResultSummary.tsx` | Stats và `canReviewAnswers` hard-code | **Accepted (defer)** — đúng phạm vi mock, là nợ wiring thật |
| 10 | Minor · `page.tsx:15` | `notFound()` client trả HTTP 200 | **Accepted (defer)** — UI not-found đúng |
| 11 | Minor | Chưa click-through browser/axe/360px | **Chưa kiểm chứng** — không có Playwright; chỉ HTML server-render + class + build |

## Không đánh giá

- Auth/Prisma/DB/Server Action/scoring/timer enforcement — loại trừ bởi design §3.
- Luồng giáo viên/admin — scope đã chốt chỉ học viên.
- Deploy/production — không thuộc đợt này.
- Status check CI — chưa có workflow.

## Đối chiếu checklist với bằng chứng

| Tuyên bố | Test hoặc output | Kết quả |
|---|---|---|
| Kiểm chứng đủ bộ check | Output đầy đủ dưới đây | EXIT=0 cả 5 lệnh |
| Click-through 4 card | Render HTML trong `final-fix-report.md` §2.3 | e-1/e-2/e-3 có result, e-4 disabled |
| `?state=bogus` = default | `VISIBLE_TEXT_IDENTICAL=true` trên `/exams` và `/attempts/a-1` | đạt |
| DTO đúng spec §10 | `types.ts:1-52`, reviewer xác nhận field-for-field | đạt |
| Không lộ đáp án đúng lúc làm bài | Không có `isCorrect` trong payload; reviewer xác nhận | đạt |
| `npm test`, `npm run test:e2e` | Script chưa có | chưa kiểm chứng |
| Mentor duyệt Mốc 1 | Không có bằng chứng | chưa kiểm chứng |

## Output kiểm chứng

```text
$ npm run typecheck

> test-site@0.1.0 typecheck
> tsc --noEmit



EXIT=0
$ npm run format:check

> test-site@0.1.0 format:check
> prettier --check .

Checking formatting...
All matched files use Prettier code style!


EXIT=0
$ npm run check:language

> test-site@0.1.0 check:language
> node scripts/check-language.mjs

All tracked text files use Vietnamese and English letters only.


EXIT=0
$ npm run lint

> test-site@0.1.0 lint
> eslint



EXIT=0
$ npm run build

> test-site@0.1.0 build
> next build

▲ Next.js 16.4.6 (Turbopack)
✓ Running next.config.ts took 273ms
- Cache Components enabled
- Partial Prefetching enabled

  Creating an optimized production build ...
✓ Compiled successfully in 1689ms
  Running TypeScript ...
  Finished TypeScript in 2.9s ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/7) ...
  Generating static pages using 7 workers (1/7) ...
  Generating static pages using 7 workers (3/7) ...
  Generating static pages using 7 workers (5/7) ...
✓ Generating static pages using 7 workers (7/7) in 884ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├   /attempts/[attemptId]
│ └ ◐ /attempts/[attemptId]
├   /attempts/[attemptId]/result
│ └ ◐ /attempts/[attemptId]/result
├ ○ /exams
└ ○ /login


○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content



EXIT=0
```

## Giới hạn

- Không chạy browser/axe; không đo trực quan 360px/1440px; không test focus trap bằng bàn phím thật.
- Không merge vào `main` theo yêu cầu người dùng; việc tách PR dưới 400 dòng/PR vẫn phải làm trước khi merge.

Link entry AI_LOG: `AI_LOG.md` mục `2026-11-27 17:13:15 +07:00 - Dựng trang học viên bằng mock data`.
