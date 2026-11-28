# Teacher and Admin Mock Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dựng 6 route giáo viên/admin bằng dữ liệu giả, nối tiếp luồng học viên đang có, theo `ARCHITECTURE.md` §5 và mockup D4/D5/04/05.

**Architecture:** Route App Router với route groups `(teacher)` và `(admin)`; mỗi feature có `mocks/` riêng; type mới đặt cạnh type học viên nhưng không sửa type cũ. Page là server component đọc `params`/`searchParams`, truyền value thường cho client view; dùng lại pattern `instant = false` từ nhánh học viên. Shared header được thêm switch demo để đổi vai trò.

**Tech Stack:** Next.js 16.4.6, React 19.3.1, TypeScript 5, Tailwind 4, ESLint 9.

**Spec:** `docs/superpowers/specs/2026-11-27-teacher-admin-mock-pages-design.md`

## Global Constraints

- Scripts: `dev`, `build`, `start`, `lint`, `typecheck` (`next typegen && tsc --noEmit`), `format`, `format:check`, `check:language`. Không có `npm test`/`test:e2e` — ghi "chưa kiểm chứng", không bịa output.
- Verify từ trạng thái sạch: `rm -rf .next && npm ci` rồi chạy lint, typecheck, format:check, check:language, build, typecheck.
- Không auth thật, Prisma, Server Action, scoring, timer enforcement, K8 check.
- Type học viên hiện có không đổi. Type mới đặt tên field theo `ERD.md`: `opensAt`/`closesAt`, `SINGLE`/`MULTI`.
- 6 route; **không** tạo `/teacher/exams/new`. Form tạo đề render tại `/teacher/exams?mode=create`.
- 404 generic dùng chung cho id lạ; không mô phỏng ownership.
- Action mock có local state visible: khóa/mở khóa, lưu trữ, tạo tài khoản. Sửa/đặt lại mật khẩu chỉ confirmation/toast.
- Switch demo nằm trong shared header (`StudentHeader`, `TeacherShell`, `AdminShell`), `router.push`, không lưu session.
- Chữ Việt/Anh; `npm run check:language` sạch. Touch target >=44px; radio/checkbox native; state có chữ/icon.
- Mỗi PR <400 dòng (không tính lockfile); PR tạo từ `main` mới nhất, không stack.

## Review Focus

| Rủi ro | Test gắn vào task |
|---|---|
| Switch vai trò không xuất hiện trên student page | Task 1: render HTML `/exams` chứa 3 option và link teacher/admin |
| `/teacher/exams?mode=create` fallback sai khi giá trị lạ | Task 2: render `?mode=bogus` so với default bằng visible text |
| id lạ hoặc bản ghi không thuộc role cho 403 thay vì 404 generic | Task 1/2/3: render `/teacher/questions/unknown`, `/teacher/exams/unknown`, `/admin/users/unknown` cùng chuỗi "Không tìm thấy trang" |
| Role switch dùng auth/session giả | Task 1 reviewer: grep không có `localStorage`/`sessionStorage` trong header |
| Action mock không có feedback | Task 1/3: render HTML chứa state sau click giả lập bằng client component; nếu không chạy được browser thì ghi chưa kiểm chứng |

---

### Task 1: Nền tảng teacher + ngân hàng câu hỏi

**Files:**
- Modify: `src/features/shared/domain/types.ts`
- Create: `src/features/questions/mocks/questions.ts`
- Create: `src/features/shared/components/RoleSwitch.tsx`
- Modify: `src/features/shared/components/StudentHeader.tsx`
- Create: `src/features/teacher/components/TeacherShell.tsx`
- Create: `src/app/(teacher)/teacher/layout.tsx`
- Create: `src/app/(teacher)/teacher/questions/page.tsx`
- Create: `src/app/(teacher)/teacher/questions/[questionId]/page.tsx`
- Test: `npm run typecheck`, `lint`, `format:check`, `check:language`, `build`

**Interfaces:**
- Consumes: `StudentHeader({ title, showBack? })` hiện có; CSS `--color-*`.
- Produces:
  - `Question`, `QuestionOption` types (field: `id`, `prompt`, `type: 'SINGLE'|'MULTI'`, `points`, `tags`, `options`, `archived`).
  - `RoleSwitch({ current: 'student' | 'teacher' | 'admin' })`.
  - `getMockQuestions(state?: string): Question[]`, `getMockQuestion(id: string): Question | undefined`.
  - `TeacherShell({ children, title }: { children: React.ReactNode; title: string })`.

- [ ] **Step 1: Thêm type mới mà không sửa type cũ**

Trong `types.ts` export thêm `Question` và `QuestionOption`; giữ nguyên 5 interface học viên.

- [ ] **Step 2: Chạy `npm run typecheck`**

Expected: EXIT=0.

- [ ] **Step 3: Mock questions**

`getMockQuestions()` trả 6 câu, 1 archived, 1 `MULTI`, tag `dia-ly`/`on-tap`; `getMockQuestion('unknown')` trả `undefined`. `state='empty'` trả `[]`; `state='error'` trả `[]` và page render thông báo lỗi; state lạ fallback.

- [ ] **Step 4: `RoleSwitch` + tích hợp vào `StudentHeader`**

`RoleSwitch` render 3 nút/link tới `/exams`, `/teacher/questions`, `/admin/users`; mark option hiện tại bằng `aria-current`. Thêm vào cuối `StudentHeader`, không đổi props signature. Không dùng storage/auth.

- [ ] **Step 5: `TeacherShell` + layout**

Sidebar trái 5 mục theo route teacher, top bar có `RoleSwitch`. `(teacher)/layout.tsx` render shell quanh children.

- [ ] **Step 6: Trang questions**

Server page await `searchParams`, whitelist `state`, truyền value thường cho client view. Mobile card, desktop bảng; filter search/tag; action "Sửa" (toast) và "Lưu trữ" (local state đổi badge); unknown `questionId` → 404 generic.

- [ ] **Step 7: Trang question detail**

Read-only: prompt, options (đánh dấu đáp án đúng bằng chữ/icon), tag, điểm; nút "Sửa" mock. Unknown id → 404 generic.

- [ ] **Step 8: Chạy bộ check từ trạng thái sạch**

`rm -rf .next && npm ci` rồi 5 lệnh + typecheck sau build; tất cả EXIT=0. `npm test`/`test:e2e` = chưa kiểm chứng.

- [ ] **Step 9: Commit**

`git commit -m "feat(teacher): add question bank and role switch"`

---

### Task 2: Đề thi giáo viên

**Files:**
- Modify: `src/features/shared/domain/types.ts` (thêm `ExamDetail`, `ResultRow`)
- Create: `src/features/exams/mocks/teacher-exams.ts`
- Create: `src/features/teacher/components/ExamTable.tsx`
- Create: `src/features/teacher/components/ExamCreateForm.tsx`
- Create: `src/app/(teacher)/teacher/exams/page.tsx`
- Create: `src/app/(teacher)/teacher/exams/[examId]/page.tsx`
- Create: `src/app/(teacher)/teacher/exams/[examId]/results/page.tsx`
- Test: cùng bộ check Task 1

**Interfaces:**
- Consumes: `Question`, `getMockQuestions`, `TeacherShell`, `RoleSwitch` từ Task 1.
- Produces:
  - `getMockTeacherExams(state?: string): ExamDetail[]`, `getMockExamDetail(id: string): ExamDetail | undefined`.
  - `getMockResultRows(examId: string): ResultRow[]`.
  - `ExamCreateForm({ questions: Question[] })` — client component, local state.

- [ ] **Step 1: Type+mock đề**

`ExamDetail` dùng `opensAt`/`closesAt`; `ResultRow` có `studentName`, `status`, `score`, `submittedAt`. Mock 4 đề, 1 chưa có lượt; id lạ → `undefined`.

- [ ] **Step 2: Chạy `npm run typecheck`**

Expected: EXIT=0.

- [ ] **Step 3: `ExamTable` + list page**

Desktop bảng, mobile card. `?mode=create` render `ExamCreateForm`; `?mode=bogus` fallback list. `?state=empty|error` render state tương ứng.

- [ ] **Step 4: `ExamCreateForm`**

Form 2 cột như D5/05; nhãn giới hạn từ VR-02…VR-09; picker checkbox; local state tổng số câu/điểm; không vượt số câu mock; submit chỉ toast.

- [ ] **Step 5: Exam detail + results**

Detail read-only + nút "Sửa đề" toast. Results bảng `ResultRow`; đề chưa có lượt → empty state; id lạ → 404 generic.

- [ ] **Step 6: Kiểm chứng render**

So sánh visible text `/teacher/exams?mode=bogus` với default; render 4 id đề + unknown; 3 route con không lỗi.

- [ ] **Step 7: Bộ check sạch + commit**

`git commit -m "feat(teacher): add exam pages and results"`

---

### Task 3: Admin users

**Files:**
- Modify: `src/features/shared/domain/types.ts` (thêm `UserAccount`)
- Create: `src/features/users/mocks/users.ts`
- Create: `src/features/admin/components/AdminShell.tsx`
- Create: `src/app/(admin)/admin/layout.tsx`
- Create: `src/app/(admin)/admin/users/page.tsx`
- Test: cùng bộ check

**Interfaces:**
- Consumes: `RoleSwitch`; không dùng type `User` của học viên.
- Produces:
  - `UserAccount { id; name; username; role: 'ADMIN'|'TEACHER'|'STUDENT'; locked: boolean }`.
  - `getMockUsers(state?: string): UserAccount[]`, `getMockUser(id: string): UserAccount | undefined`.

- [ ] **Step 1: Type+mock users**

4 accounts gồm 1 locked; username unique; `state=empty|error` tương ứng; id lạ → `undefined`.

- [ ] **Step 2: `AdminShell` + role switch**

Sidebar "Người dùng", top bar có `RoleSwitch`; `(admin)/layout.tsx` render shell.

- [ ] **Step 3: Trang users**

Bảng cột Họ tên / Username / Vai trò / Trạng thái / Thao tác; mobile card; "Khóa/Mở khóa" local state đổi badge; "Tạo tài khoản" thêm row mock; "Đặt lại mật khẩu" toast; id lạ → 404 generic. Không có mock Figma — ghi rõ trong review file.

- [ ] **Step 4: Kiểm chứng render visible text cho default, empty, error, unknown**

- [ ] **Step 5: Bộ check sạch + commit**

`git commit -m "feat(admin): add user management mock page"`

---

## Execution Handoff

Execution method đã được người dùng cung cấp: **subagent-driven**. Sau khi plan được duyệt, dùng `subagent-driven-development`, mỗi task một implementer + reviewer, rồi final whole-branch review. Không merge khi chưa có lệnh.
