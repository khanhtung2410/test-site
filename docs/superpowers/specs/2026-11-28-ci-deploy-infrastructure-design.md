# Thiết kế: hạ tầng repo, CI, branch protection và deploy

- **Trạng thái:** chờ duyệt.
- **Ngày:** 2026-11-28
- **Nguồn:** `docs/DEPLOY.md`, `docs/CONTRIBUTING.md`, `AGENTS.md` §8, `SPEC.md` §11, `README.md`.
- **Skill:** `brainstorming`.

## 1. Ý định

Đưa repo từ trạng thái "mock UI chạy được local" sang trạng thái có CI xanh trên mọi PR,branch protection chặn merge khi check đỏ, và deploy production **chỉ qua GitHub Actions**. Thêm script `test` và `test:e2e` tối thiểu để mọi lệnh trong checklist có output thật, không cần PostgreSQL.

## 2. Mục tiêu

- `.github/workflows/ci.yml`: job `static` (npm ci, lint, typecheck, format:check, check:language, audit), `test` (Vitest), `build`, `e2e` (Playwright build + smoke route).
- `npm test` (Vitest) kiểm tra DTO/mock contract và vài route render; `npm run test:e2e` (Playwright) kiểm tra route chính load không lỗi.
- Branch protection `main`: 1 approval, dismiss stale, conversation resolution, require CI checks, cấm force push/xóa branch, `enforce_admins=true`.
- `.github/workflows/deploy.yml`: trigger sau CI xanh trên `main`, migration gate có reviewer, deploy Vercel prebuilt, smoke test, rollback khi smoke fail.
- `README.md`/`DEPLOY.md` mô tả đúng trạng thái sau khi thiết lập.

## 3. Không làm

- Auth/K8, Prisma schema, PostgreSQL migration thật, question bank thật — các PR sau.
- Cấu hình secret thật, tạo Vercel project, domain production — dùng placeholder/secret name, ghi "chưa kiểm chứng".
- Chạy deploy thử trên production.

## 4. Ràng buộc

- Mọi bài test chạy được không cần DB; Vitest + Playwright cài từ npm.
- Kiểm chứng từ trạng thái sạch (`rm -rf .next && npm ci`) với Node `spawnSync`, UTF-8, `NO_COLOR=1`.
- PR tạo từ `main` mới nhất, <400 dòng, mỗi PR một việc; tách CI/test và deploy/protection nếu vượt.
- Chữ Việt/Anh; `npm run check:language` sạch.
- Không merge bằng admin override nữa; protection phải có hiệu lực thật.

## 5. Cách tiếp cận

1. **Hạ tầng + test tối thiểu (chọn)** — CI 4 job, test smoke, protection, deploy workflow. Ưu: output thật cho mọi check; nhược: chưa cover K1–K8.
2. Chỉ lint/typecheck/build — nhanh nhưng `test`/`test:e2e` vẫn "chưa kiểm chứng", sai SPEC §11. Loại.
3. Prisma + PostgreSQL + test K1–K8 ngay — đúng đề nhưng kéo scope code, vượt ngưỡng PR. Để PR sau.

## 6. Quyết định

- Vitest test đặt `src/**/*.test.ts` cạnh code; Playwright spec đặt `e2e/*.spec.ts`.
- `npm test` = `vitest run`; `npm run test:e2e` = `playwright test --config playwright.config.ts`.
- CI dùng `npm ci` ở mọi job; cache `.next` không dùng; artifact build truyền giữa job.
- Deploy workflow trigger `workflow_run` sau CI thành công trên `main`, environment `production`, có `migration-approval` gate. Không tự deploy khi secrets chưa có — ghi rõ.
- Branch protection bật sau cùng, khi CI đã xanh; required checks dùng tên job của `ci.yml`.

## 7. Tiêu chí nghiệm thu

- `npm test`, `npm run test:e2e` EXIT=0 từ clone sạch.
- 5 lệnh cũ vẫn EXIT=0.
- `gh api .../branches/main/protection` trả đúng required checks.
- Workflow files parse được YAML; comment rõ secret cần thiết.

## 8. Việc còn lại cho builder

- Tên job trong `ci.yml` phải khớp `required_status_checks.contexts`; nếu lệch thì protection vô hiệu.
- Chọn test cụ thể: tối thiểu 2 unit + 2 e2e route; không cần DB.
