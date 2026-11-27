# Code review — trang giáo viên và admin bằng mock data (2026-11-28)

- **Skill:** requesting-code-review + subagent-driven-development (3 task review + final whole-branch review)
- **Phạm vi:** `feature/student-mock-pages` sau khi merge `origin/main`; review code, không đánh giá tính năng server.
- **Base:** 3e7099d (main sau PR #16) | **Head:** e6f6b30 (`fix(a11y): enlarge inline links and add table column scopes`)
- **Prompt nguyên văn:** xem `AI_LOG.md` mục `2026-11-28 00:44:11 +07:00 - Dựng trang giáo viên và admin bằng mock data`.

## Phương pháp

Mỗi task có implementer và reviewer riêng: Task 1 sạch; Task 2 có 1 vòng fix (link tiêu đề 44px); Task 3 sạch. Final whole-branch review trả "With fixes" với 2 Important và 1 Minor nâng cấp; một fix wave duy nhất xử lý, scoped re-review xác nhận cả 3 finding xong, không breakage mới. Output kiểm chứng do implementer chạy từ trạng thái sạch, reviewer đọc diff và source chứ không tự chạy lại.

## Phát hiện và quyết định

| # | Mức độ · file:line | Vấn đề | Quyết định |
|---|---|---|---|
| 1 | Important · `QuestionBank.tsx:92,110`, `QuestionDetail.tsx:37`, `ExamTable.tsx:48`, `not-found.tsx:10` | 5 `<Link>` inline có `min-h-[44px]` nhưng không áp dụng (non-replaced inline) | **Accepted** — fix `inline-flex items-center` trong `e6f6b30` |
| 2 | Important · governance | Thiếu AI_LOG entry, file review template, full check output trong PR body | **Accepted** — entry AI_LOG và file này được tạo ngay đây |
| 3 | Minor nâng · `ExamTable.tsx:62`, `results/page.tsx:34`, `QuestionBank.tsx:82` | `<th>` thiếu `scope="col"` | **Accepted** — fix trong `e6f6b30` |
| 4 | Optional · `ExamCreateForm.tsx:58` | Hint VR-02…VR-09 chưa có `aria-describedby` | **Deferred** — controller chấp nhận, ghi rõ ở đây |
| 5 | Minor · `QuestionBank.tsx:20` | Search phân biệt hoa/thường và dấu | **Deferred** — mock-only filter |
| 6 | Minor · `UsersTable.tsx:44-46` | id từ `length + 1`, chấp nhận username khoảng trắng | **Deferred** — mock không có persistence |
| 7 | Minor · `UsersTable.tsx:16`, `[userId]/page.tsx:16-17` | roleLabel trùng | **Deferred** — cosmetic |
| 8 | Minor · `teacher-exams.ts` vs `exams.ts` | Cùng id `e-1`…`e-4` nhưng status/maxScore/questionCount khác nhau | **Deferred với ghi chú** — hai fixture là tập dữ liệu demo độc lập, không phải nguồn sự thật chung |
| 9 | Minor · `questions.ts:68` vs `attempts.ts:71` | Hai `getMockQuestions` khác contract | **Deferred với ghi chú** — đổi tên khi wiring server thật |
| 10 | Minor · `[userId]/page.tsx` | Route thứ 7 ngoài "6 route" | **Accepted** — controller ruling ở Task 3 |

## Không đánh giá

- Auth/Prisma/Server Action/storage/scoring/timer/K8 — design §3 loại trừ.
- CI/deploy — chưa có workflow.
- Trang admin không có Figma — thiết kế từ FR-03/04/05, ghi nhận limitations.

## Đối chiếu checklist với bằng chứng

| Tuyên bố | Bằng chứng | Kết quả |
|---|---|---|
| 6 route teacher/admin + 1 detail route được chốt | Diff reviewer, HEAD e6f6b30 | ✅ |
| 5 link có inline-flex + min-h-[44px] | `ALL_FIVE_LINKS_OK=true` trong final fix report | ✅ |
| 3 bảng có scope="col" | `ALL_THREE_TABLES_SCOPED=true` | ✅ |
| Bộ check sạch | Output đầy đủ dưới đây | EXIT=0 cả 7 lệnh |
| `npm test`, `test:e2e` | Script chưa có | chưa kiểm chứng |
| Browser/axe/360px | Không automation | chưa kiểm chứng |

## Output kiểm chứng

```text
$ npm ci        (sau rm -rf .next)   EXIT=0
$ npm run lint                       EXIT=0
$ npm run typecheck                  EXIT=0
$ npm run format:check               EXIT=0
$ npm run check:language             EXIT=0
$ npm run build                      EXIT=0
$ npm run typecheck (sau build)      EXIT=0
```

## Giới hạn

- Reviewer không tự chạy lại bộ check theo task-scoped gate; output là của implementer, đã đối chiếu câu lệnh và `EXIT=` trong report.
- Không merge; chưa có lệnh tạo PR từ người dùng.
- Các finding deferred ở trên phải được xử lý khi wiring server thật.
