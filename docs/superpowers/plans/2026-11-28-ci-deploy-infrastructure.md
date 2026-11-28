# CI and Deploy Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thiết lập CI 5 script, test/e2e tối thiểu chạy được, branch protection có required checks, và deploy workflow qua GitHub Actions.

**Architecture:** Workflow CI chạy trên mọi PR/push `main` với 4 job; script `test`/`test:e2e` dùng Vitest/Playwright không cần DB. Deploy workflow chạy sau CI xanh, có environment `production` và migration gate. Branch protection bật cuối cùng khi đã có tên check ổn định.

**Tech Stack:** GitHub Actions, npm 10, Node 22, Next.js 16.4.6, Vitest, Playwright, Vercel CLI (chờ secret).

**Spec:** `docs/superpowers/specs/2026-11-28-ci-deploy-infrastructure-design.md`

## Global Constraints

- Không auth/Prisma/DB thật/code tính năng K1–K8 trong plan này.
- Vitest + Playwright chạy được không cần PostgreSQL.
- Verify từ trạng thái sạch (`rm -rf .next && npm ci`) bằng Node `spawnSync`, UTF-8, `NO_COLOR=1`.
- `npm test` và `npm run test:e2e` phải EXIT=0; các lệnh cũ vẫn EXIT=0.
- PR từ `main` mới nhất, <400 dòng, mỗi PR một việc; chữ Việt/Anh; `check:language` sạch.
- Không tự deploy thật; secret production chưa có thì workflow ghi rõ và bỏ qua deploy an toàn.

## Review Focus

| Rủi ro | Test gắn vào task |
|---|---|
| Tên required check lệch tên job CI → protection vô hiệu | Task 3: so sánh `contexts` API với `jobs` keys trong ci.yml |
| Test/e2e đỏ trên clone sạch | Task 1/2: chạy từ `rm -rf .next && npm ci` |
| Deploy workflow chạy khi chưa có secret | Task 3: guard `if: secrets present`, ghi rõ skip |
| Admin override tiếp tục phá protection | Task 3: không merge bằng `--admin`; nếu bắt buộc phải ghi rõ |
| PR vượt 400 dòng | Mỗi task commit riêng; numstat kiểm chứng |

---

### Task 1: Script test và unit test tối thiểu — đã hoàn thành

**Files:**
- Modify: `package.json` (thêm `test`, `test:watch`)
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `src/features/shared/domain/types.test.ts`
- Create: `src/features/exams/mocks/exams.test.ts`

**Interfaces:**
- Consumes: types và mock hiện có.
- Produces: `npm test` = `vitest run`.

- [x] **Step 1: Cài Vitest**

`npm install -D vitest`, thêm script `test: vitest run`, `test:watch: vitest`, config `vitest.config.ts` dùng môi trường node, include `src/**/*.test.ts`.

- [x] **Step 2: Viết 2 test thật (TDD)**

Test 1: `types.test.ts` khẳng định 5 interface học viên giữ nguyên tên field (`Exam` có `questionCount`, `maxScore`, `maxAttempts`). Test 2: `exams.test.ts` khẳng định `getMockExams()` trả 4 đề, 2 open/2 closed, `getMockExam('unknown')` undefined.

- [x] **Step 3: Chạy `npm test` trước/sau**

Trước: EXIT=1 ( script chưa có hoặc test fail). Sau: EXIT=0, output đầy đủ.

- [x] **Step 4: Bộ check + commit**

`npm ci`, lint, typecheck, format:check, check:language, build, typecheck, `npm test`. Commit `test: add minimal Vitest suite`.

---

### Task 2: Playwright smoke e2e — đã hoàn thành

**Files:**
- Modify: `package.json` (thêm `test:e2e`)
- Create: `playwright.config.ts`
- Create: `e2e/routes.spec.ts`

**Interfaces:**
- Consumes: routes từ mock UI hiện có.
- Produces: `npm run test:e2e` = `playwright test`.

- [x] **Step 1: Cài Playwright**

`npm install -D @playwright/test`; config dùng `webServer: npm run start -- -p 3100`, baseURL `http://127.0.0.1:3100`, retry 0, không cài browser hệ thống nếu không có — dùng chromium đã cài hoặc ghi rõ dependency.

- [x] **Step 2: Viết smoke test**

`/exams`, `/login`, `/teacher/questions`, `/admin/users` trả 200 và có nội dung chữ tiếng Việt; `/attempts/unknown` hiển thị "Không tìm thấy trang".

- [x] **Step 3: Chạy `npm run test:e2e` từ sạch**

Expected EXIT=0; nếu thiếu browser binary, cài `npx playwright install chromium` và ghi output.

- [x] **Step 4: Bộ check + commit**

Commit `test: add playwright route smoke tests`.

---

### Task 3: CI workflow và deploy workflow — đã hoàn thành

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/deploy.yml`
- Modify: `docs/DEPLOY.md`, `docs/HANDOVER.md`

**Interfaces:**
- Consumes: script từ Task 1/2.
- Produces: job names `static`, `test`, `build`, `e2e`; deploy trigger `workflow_run`.

- [x] **Step 1: ci.yml**

Jobs: `static` (npm ci, lint, typecheck, format:check, check:language, audit), `test` (npm ci, npm test), `build` (npm ci, npm run build, upload artifact), `e2e` (npm ci, npm run test:e2e). Dùng Node 22, npm ci, không cache `.next`.

- [x] **Step 2: deploy.yml**

Trigger `workflow_run` CI completed trên `main` và success; environment `production`; guard secret; bước migrate có environment `migration-approval`; deploy Vercel prebuilt; smoke URL; rollback khi fail. Nếu secret chưa có, job skip có comment rõ — không deploy tay.

- [x] **Step 3: Kiểm chứng YAML**

Parse YAML bằng Node (không cài thêm dependency nếu có sẵn) hoặc actionlint nếu có; so sánh tên job với docs.

- [x] **Step 4: Bộ check + commit**

Commit `ci: add workflows for checks and deploy`.

---

### Task 4: Branch protection theo CI — đã hoàn thành

**Files:**
- Chỉ thay đổi cấu hình GitHub qua API; không commit code.
- Ghi output vào `docs/reviews/2026-11-28-ci-deployment.md`.

**Interfaces:**
- Consumes: job names từ Task 3.
- Produces: protection với `contexts` = job names.

- [x] **Step 1: Đọc cấu hình hiện tại**

`gh api repos/khanhtung2410/test-site/branches/main/protection`, lưu output.

- [x] **Step 2: Cập nhật required checks**

PUT với `required_status_checks.contexts` khớp job names, `strict=true`, enforce admins, 1 approval, dismiss stale, conversation resolution, cấm force push/xóa branch.

- [x] **Step 3: Kiểm chứng GET lại**

Output trả contexts đúng; lưu vào file review. Không dùng `--admin` để merge nữa.

- [x] **Step 4: Commit file review**

Commit `docs: record branch protection state`.

---

## Execution Handoff

Execution method: người dùng đã chọn **subagent-driven**. Cả 4 task đã hoàn thành, có implementer + reviewer riêng, final whole-branch review và fix wave; bằng chứng nằm trong `AI_LOG.md` và `docs/reviews/`.
