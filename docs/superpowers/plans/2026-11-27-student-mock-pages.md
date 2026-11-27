# Student Mock Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dựng luồng học viên click-through bằng dữ liệu giả, khớp wireframe `SPEC.md` §10 và mockup Figma, theo route tree `ARCHITECTURE.md` §5.

**Architecture:** Route App Router với route groups `(auth)` và `(student)`; mỗi feature tự chứa `mocks/` và component; DTO dùng chung đặt ở `features/shared/domain/types.ts`. Không có auth/Prisma/Server Action; source dữ liệu duy nhất là mock module có type.

**Tech Stack:** Next.js 16.4.6 App Router, React 19, TypeScript 5, Tailwind 4, ESLint 10, Prettier 3.

**Spec:** `docs/superpowers/specs/2026-11-27-student-mock-pages-design.md`

## Global Constraints

- Không cài thêm dependency; script có sẵn: `dev`, `build`, `start`, `lint`, `typecheck`, `format`, `format:check`, `check:language`.
- `npm test` và `npm run test:e2e` chưa có script — ghi "chưa kiểm chứng", không bịa output.
- Không auth thật, không Prisma, không Server Action, không scoring/timer enforcement.
- DTO fields giữ nguyên tên đã chốt trong spec §10 để thay nguồn dữ liệu sau không đổi component.
- Mỗi PR dưới 400 dòng (không tính lockfile); tách đúng 3 PR theo 3 task.
- Mọi câu chữ giao diện là tiếng Việt; chữ cái chỉ Việt/Anh (`npm run check:language`).
- Vùng bấm tối thiểu 44×44px; radio/checkbox giữ ngữ nghĩa; trạng thái có chữ/icon, không chỉ màu.
- `?state` lạ phải fallback về trạng thái mặc định, không crash.

## Review Focus

| Rủi ro | Bài test gắn vào task |
|---|---|
| 360px bị cuộn ngang / nút dưới 44px | Task 1 và 2: `npm run build` + kiểm tra class Tailwind của header/option; Task 3 review ảnh 360px |
| `?state=` không hợp lệ làm crash page | Task 1: test trong `exams-page` fallback; Task 2: test trong `attempt-page` fallback |
| Route thiếu `attemptId` hoặc id không có trong mock | Task 2: `notFound()` khi `getMockAttempt(id)` trả `undefined`; Task 3 tương tự cho result |
| Luật chấm FR-13 bị bỏ sót | Task 1: assertion trong mock exam card render có chuỗi "đúng hết mới có điểm" |
| Multi-answer checkbox và all-or-nothing không được demo | Task 2: mock có 1 câu `type: 'multiple'`; option render `type="checkbox"` |
| `aria-live` đồng hồ đọc mỗi giây | Task 2: chỉ gắn announcement khi remaining <= 300 hoặc <= 60 |

---

### Task 1: Nền tảng DTO/mock, đăng nhập và danh sách đề

**Files:**
- Create: `src/features/shared/domain/types.ts`
- Create: `src/features/auth/mocks/session.ts`
- Create: `src/features/exams/mocks/exams.ts`
- Create: `src/features/shared/components/StudentHeader.tsx`
- Create: `src/features/shared/components/ExamCard.tsx`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(student)/exams/page.tsx`
- Modify: `src/app/page.tsx` (redirect `/login`)
- Modify: `src/app/globals.css` (thêm CSS variable palette)
- Test: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run check:language`, `npm run build`

**Interfaces:**
- Consumes: không có.
- Produces:
  - `User`, `Exam`, `Attempt`, `AttemptQuestion`, `Result` types (spec §10).
  - `mockUser: User`, `getMockExams(): Exam[]`, `getMockExam(id: string): Exam | undefined`. Page tự đọc `searchParams.state` để quyết render empty/error; state lạ fallback về danh sách thường.
  - `StudentHeader({ title, showBack }: { title: string; showBack?: boolean })`.
  - `ExamCard({ exam, onStart, onViewResult }: { exam: Exam; onStart: () => void; onViewResult: () => void })`.

- [ ] **Step 1: Tạo DTO types trong `src/features/shared/domain/types.ts`**

Định nghĩa đúng 5 interface theo spec §10: `User`, `Exam`, `Attempt`, `AttemptQuestion`, `Result`. Không export thêm type nào khác.

- [ ] **Step 2: Chạy `npm run typecheck`**

Expected: EXIT=0 (file type-only, chưa ai import).

- [ ] **Step 3: Tạo mock module**

`mockUser` có `role: 'STUDENT'`; `getMockExams()` trả 4 đề: 2 `status: 'open'` (có `attemptsUsed` 0 và 1), 2 `status: 'closed'`. `getMockExam` trả `undefined` cho id lạ. Không tạo state trong mock; page đọc query param.

- [ ] **Step 4: Tạo `StudentHeader` và `ExamCard`**

`StudentHeader` nhận `title`, `showBack`; render nav "Đề thi"/"Kết quả", avatar. `ExamCard` nhận exam + 2 callback; hiển thị `durationMinutes`, `questionCount`, `maxScore`, badge lượt, và chuỗi luật chấm "Câu nhiều đáp án: đúng hết mới có điểm, không trừ điểm" trước nút "Làm bài". Nút `type="button"`, `min-h-[44px]`.

- [ ] **Step 5: Tạo trang `/login`**

Form Email/Mật khẩu, checkbox "Ghi nhớ đăng nhập", link "Quên mật khẩu?", nút "Đăng nhập" `router.push('/exams')`. Không có Google/đăng nhập mạng xã hội.

- [ ] **Step 6: Tạo trang `/exams`**

Header "Xin chào, An"; grid card 2 cột desktop, 1 cột mobile. `?state=empty` render "Chưa có đề nào" + "Tải lại"; `?state=error` render "Không tải được dữ liệu" + "Thử lại" (chỉ UI); giá trị `state` khác hai giá trị trên hoặc thiếu thì render danh sách thường. Card "Làm bài" → `/attempts/{id}`, "Xem kết quả" → `/attempts/{id}/result`. Mỗi card có chuỗi luật chấm đúng hết mới có điểm.

- [ ] **Step 7: Redirect `/` → `/login`**

`src/app/page.tsx` dùng `redirect('/login')` từ `next/navigation`.

- [ ] **Step 8: Thêm CSS variable palette**

Trong `globals.css`, khai báo `--color-primary`, `--color-secondary`, `--color-success`, `--color-error`, `--color-warning`, `--color-neutral-*` theo `MOCKUPS.md`. Component dùng biến, không hex rải rác.

- [ ] **Step 9: Chạy bộ check**

`npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run check:language`, `npm run build` — tất cả EXIT=0.

- [ ] **Step 10: Commit**

`git commit -m "feat(student): add mock exams and login pages"`

---

### Task 2: Trang làm bài, navigator và confirm nộp

**Files:**
- Create: `src/features/attempts/mocks/attempts.ts`
- Create: `src/features/attempts/components/AttemptHeader.tsx`
- Create: `src/features/attempts/components/QuestionOptions.tsx`
- Create: `src/features/attempts/components/QuestionNavigator.tsx`
- Create: `src/features/attempts/components/SubmitDialog.tsx`
- Create: `src/features/attempts/components/Timer.tsx`
- Create: `src/app/(student)/attempts/[attemptId]/page.tsx`
- Test: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run check:language`, `npm run build`

**Interfaces:**
- Consumes: `Attempt`, `AttemptQuestion`, `getMockExam` từ Task 1.
- Produces:
  - `getMockAttempt(id: string): Attempt | undefined`
  - `getMockQuestions(attempt: Attempt): AttemptQuestion[]`
  - `QuestionNavigator({ questions: AttemptQuestion[]; currentIndex: number; flagged: number[]; onSelect: (index: number) => void })`.
  - `SubmitDialog({ unansweredCount: number; onCancel: () => void; onSubmit: () => void })`.
  - `Timer({ expiresAt: string; serverNow: string; state?: string })`.

- [ ] **Step 1: Tạo mock attempts/questions**

Mock 30 câu cho attempt `a-1`; 1 câu `type: 'multiple'`. `answers` mặc định có 28 câu đã lưu, thiếu câu 7 và 12; `savedAt` tương ứng. `getMockAttempt` trả `undefined` cho id lạ.

- [ ] **Step 2: Chạy `npm run typecheck`**

Expected: EXIT=0.

- [ ] **Step 3: `AttemptHeader`**

Render back, tiêu đề đề, timer, badge "Đã lưu"/"Chưa lưu", "Lưu & thoát", "Nộp bài". Không dùng `StudentHeader`.

- [ ] **Step 4: `Timer`**

Đếm ngược từ `expiresAt - serverNow`, chỉ hiển thị. `aria-live="polite"` chỉ khi remaining <= 300 hoặc <= 60; mọi giây khác không announce. `?state=near` đặt remaining ở 5 phút.

- [ ] **Step 5: `QuestionOptions`**

Câu `single` render radio, `multiple` render checkbox; label đi kèm input; mỗi option tối thiểu 44px cao. State selected lấy từ `attempt.answers[questionId]`.

- [ ] **Step 6: `QuestionNavigator`**

Grid 30 ô, 4 trạng thái (answered/current/unanswered/flagged) kèm legend có chữ. Mobile: bottom sheet mở từ icon lưới trong header; desktop: sidebar phải. `onSelect(index)` đổi `currentQuestionIndex`.

- [ ] **Step 7: `SubmitDialog`**

Render "Nộp bài?", danh sách câu chưa trả lời, cảnh báo, 2 nút "Làm tiếp"/"Nộp bài". Chỉ mở khi bấm "Nộp bài".

- [ ] **Step 8: Trang attempt**

Đọc `params.attemptId`; nếu `getMockAttempt` trả `undefined` → `notFound()`. Render header, câu hỏi theo `currentQuestionIndex`, navigator, footer "Câu trước"/"Câu sau", dialog. `?state=offline`: banner kèm nút "Thử lại"; chọn đáp án đổi indicator sang "Chưa lưu", bấm "Thử lại" đổi ngược sang "Đã lưu". `?state=expired`: render dialog hết giờ. `?state` lạ fallback mặc định; kiểm chứng bằng cách render `?state=bogus` và so với bản mặc định.

- [ ] **Step 9: Chạy bộ check**

Expected: tất cả EXIT=0.

- [ ] **Step 10: Commit**

`git commit -m "feat(student): add attempt page with navigator and submit dialog"`

---

### Task 3: Trang kết quả và state pages

**Files:**
- Create: `src/features/attempts/mocks/results.ts`
- Create: `src/features/attempts/components/ResultSummary.tsx`
- Create: `src/features/attempts/components/ResultTable.tsx`
- Create: `src/app/(student)/attempts/[attemptId]/result/page.tsx`
- Test: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run check:language`, `npm run build`

**Interfaces:**
- Consumes: `Result`, `getMockAttempt` từ Task 2.
- Produces:
  - `getMockResult(attemptId: string): Result | undefined`
  - `ResultSummary({ result, locked }: { result: Result; locked: boolean })`
  - `ResultTable({ result }: { result: Result })`.

- [ ] **Step 1: Mock result**

`getMockResult('a-1')` trả `score: 8`, `maxScore: 10`, `submittedAt` cố định, `breakdown` 5 dòng mẫu (khớp D3), `canReviewAnswers: false`. id lạ → `undefined`.

- [ ] **Step 2: `ResultSummary`**

Hiển thị `8/10`, badge "Đã nộp", stats 8 đúng / 2 sai / 38:12. Nút "Về danh sách đề" → `/exams`. Khi `locked=true`: giữ điểm, thay badge thành "Điểm đã có · Chờ mở đáp án" (D-19).

- [ ] **Step 3: `ResultTable`**

Bảng 5 cột mẫu: câu hỏi, đáp án đã chọn, kết quả đúng/sai có chữ + màu. Không hiển thị đáp án đúng.

- [ ] **Step 4: Trang result**

`notFound()` nếu attempt/result không tồn tại. `?state=locked` → `locked=true`. Header dùng `StudentHeader`.

- [ ] **Step 5: Chạy bộ check**

Expected: tất cả EXIT=0. Ghi rõ `npm test`/`test:e2e` = "chưa kiểm chứng".

- [ ] **Step 6: Commit**

`git commit -m "feat(student): add result page with locked state"`

---

## Execution Handoff

Sau khi plan được duyệt, dùng `executing-plans` (native) hoặc `subagent-driven-development`. Mình khuyến nghị **native**: 3 task dính nhau qua DTO chung, ngữ cảnh nhỏ, và plan đã chốt interface.
