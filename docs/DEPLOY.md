# TRIỂN KHAI VÀ VẬN HÀNH PRODUCTION

> **Trạng thái:** Kế hoạch. Chưa có Vercel project, database production, workflow hay URL.
> **Ngày:** 2026-11-26
> **Liên quan:** [`ARCHITECTURE.md`](ARCHITECTURE.md), [`SECURITY.md`](SECURITY.md), [`PERFORMANCE.md`](PERFORMANCE.md).

Tài liệu này mô tả cách đưa ứng dụng lên production **chỉ qua GitHub Actions**, cách chạy migration, rollback và dọn dữ liệu thử. Không deploy tay từ máy cá nhân.

---

## 1. Môi trường

| Môi trường | Database | Mục đích |
|---|---|---|
| Local | PostgreSQL 16 trong Docker, database `exam_dev` | Phát triển |
| Test | PostgreSQL 16, database `exam_test` | Vitest unit/integration |
| E2E | PostgreSQL 16, database `exam_e2e` | Playwright trên production build |
| Production | PostgreSQL managed (Neon/Prisma Postgres/Vercel Postgres), có SSL | Người dùng thật |

Không dùng SQLite ở bất kỳ môi trường nào: test đồng thời và transaction phải giống production.

---

## 2. Điều kiện trước khi deploy

- [ ] Repo GitHub có quyền admin để đặt branch protection.
- [ ] Vercel project đã tạo và liên kết repo (Git integration **tắt**).
- [ ] PostgreSQL production đã tạo; lấy chuỗi kết nối có SSL.
- [ ] GitHub Environment `production` đã tạo, chứa secret.
- [ ] GitHub Environment `migration-approval` có required reviewer.
- [ ] `AUTH_SECRET` production đã sinh bằng `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`.
- [ ] Tên miền production đã chọn (TBD).

---

## 3. Biến môi trường

| Biến | Bắt buộc | Môi trường | Ghi chú |
|---|---:|---|---|
| `DATABASE_URL` | Có | local, test, e2e, production | Chuỗi kết nối PostgreSQL; production có SSL |
| `DIRECT_URL` | Không | production | Chỉ khi dùng connection pooler; dùng cho migration |
| `AUTH_SECRET` | Có | tất cả | Khóa ký JWT; tối thiểu 32 byte; không commit |
| `SITE_URL` | Có | production | Origin thật, dùng cho metadata và redirect |
| `NODE_ENV` | Tự động | tất cả | `production` trên Vercel |

`.env.example` chỉ chứa tên biến và giá trị mẫu, không chứa secret thật. `.env*` đã nằm trong `.gitignore`.

**GitHub Environment `production`:** `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `DATABASE_URL` (chuỗi dùng cho migration). Không đặt ở cấp repository.

---

## 4. Workflow CI

File dự kiến: `.github/workflows/ci.yml`.

| Job | Việc | Điều kiện xanh |
|---|---|---|
| `static` | `npm ci`, lint, typecheck, format:check, `npm audit --omit=dev --audit-level=high` | Không lỗi |
| `test` | PostgreSQL service, migrate, seed, `npm test` | Toàn bộ unit + integration pass |
| `build` | `npm run build` | Build thành công |
| `e2e` | PostgreSQL service, migrate, seed, `npm run test:e2e` | Toàn bộ E2E pass, gồm 4 tình huống bắt buộc |
| `lighthouse` | `npm run build`, `next start`, `@lhci/cli` | Đạt các ngưỡng trong [`PERFORMANCE.md`](PERFORMANCE.md) PERF-01, PERF-02, PERF-03 |

Branch protection trên `main`: bắt buộc các check trên, cấm force push, yêu cầu PR review.

---

## 5. Workflow deploy

File dự kiến: `.github/workflows/deploy.yml`.

```text
push lên main
  └── chờ CI xanh
        └── kiểm tra migration pending
              ├── không có migration mới → deploy
              └── có migration mới → chờ duyệt (migration-approval)
                    └── prisma migrate deploy
                          └── vercel pull → vercel build --prod → vercel deploy --prebuilt --prod
                                └── smoke test production
```

Các bước chính:

1. `actions/checkout`.
2. Cài Node 22 và `npm ci`.
3. `npx prisma migrate status` với `DATABASE_URL` production; nếu có migration pending, dừng và chờ duyệt.
4. `npx prisma migrate deploy`.
5. `npx vercel pull --yes --environment=production --token=$VERCEL_TOKEN`.
6. `npx vercel build --prod --token=$VERCEL_TOKEN`.
7. `npx vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN`.
8. Chạy smoke test chỉ đọc với `BASE_URL` production.

`vercel.json` đặt `"git": { "deploymentEnabled": false }` để Vercel không tự deploy khi push. Mọi deploy đi qua workflow.

**Bằng chứng:** mỗi lần deploy phải lưu link run GitHub Actions và output smoke test. Không ghi "đã deploy" nếu không có link.

---

## 6. Migration

### 6.1. Quy tắc

- Mọi thay đổi schema phải có migration trong `prisma/migrations/`.
- Không sửa database production bằng tay; không dùng `prisma db push` cho production.
- Migration phải **tương thích ngược** với bản đang chạy: thêm cột nullable hoặc có default trước, backfill, rồi mới thêm ràng buộc.
- Migration phá vỡ tương thích phải chia thành nhiều PR và có kế hoạch rollback.
- Không dùng `--force-reset` (Prisma 7 chặn AI agent và có thể xóa dữ liệu).

### 6.2. Lệnh dự kiến

```bash
npm run db:migrate:dev        # local: tạo migration mới
npm run db:migrate:deploy     # production: áp dụng migration
npm run db:migrate:status     # kiểm tra trạng thái
npm run db:generate           # generate Prisma Client
npm run db:seed               # dữ liệu demo local/test
npm run db:create-admin       # tạo admin đầu tiên cho production
```

Các script này chưa có trong `package.json`; sẽ thêm ở Mốc 2.

---

## 7. Smoke test production

Chỉ đọc, không tạo dữ liệu:

- `GET /api/health` trả 200 và `{ status: "ok" }`.
- `GET /login` trả 200, có form đăng nhập.
- Đăng nhập bằng tài khoản demo học viên (nếu có) và mở danh sách đề.
- Trang không tồn tại trả 404.
- Header bảo mật có mặt.
- Không có lỗi 500 trong log Vercel trong 5 phút sau deploy.

Nếu smoke fail: dừng, không thông báo hoàn thành; rollback theo mục 8.

---

## 8. Rollback

1. Xác định deployment production đang lỗi trên Vercel Dashboard.
2. Chọn deployment trước đó còn tốt, bấm **Promote to Production** (hoặc dùng Vercel API với `VERCEL_TOKEN`).
3. Nếu lỗi do migration: **không** chạy down migration tự động. Đánh giá migration có phá dữ liệu không; nếu có, khôi phục backup và mở PR sửa.
4. Ghi lại thời điểm, deployment ID, lý do và kết quả vào PR/issue tương ứng.
5. Chạy lại smoke test sau rollback.

Không rollback bằng cách revert commit rồi deploy lại nếu migration đã chạy; ưu tiên promote deployment cũ.

---

## 9. Vệ sinh dữ liệu thử trên production

Mọi dữ liệu tạo khi kiểm tra production phải được xóa ngay sau khi kiểm tra:

- Tài khoản tạm, câu hỏi tạm, đề tạm, lượt làm tạm.
- Nếu cần giữ một bản ghi làm bằng chứng, ghi rõ trong PR đó là bản ghi nào và ai chịu trách nhiệm xóa.
- Không để lại mật khẩu demo yếu trên production.
- Kiểm tra lại bằng truy vấn đếm trước khi kết thúc kiểm tra.

---

## 10. Trạng thái hiện tại

| Hạng mục | Trạng thái |
|---|---|
| Vercel project | Chưa tạo |
| Database production | Chưa tạo |
| `ci.yml` | Chưa có |
| `deploy.yml` | Chưa có |
| `vercel.json` | Chưa có |
| URL production | TBD |
| Lần deploy đầu tiên | Chưa có |

Khi có thông tin thật, cập nhật bảng này và link run deploy cuối cùng. Không ghi URL giả.

---

## 11. Xử lý sự cố thường gặp

| Triệu chứng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| Build báo `PrismaClientInitializationError` | Chưa `prisma generate` hoặc thiếu `DATABASE_URL` | Kiểm tra bước generate trong build; kiểm tra env |
| Build báo bảng không tồn tại (`P2021`) | Chưa chạy migration | Chạy `prisma migrate deploy` trước/sau deploy theo quy trình |
| Học viên không lưu được đáp án | Lượt đã hết hạn hoặc mất mạng | Kiểm tra `expiresAt`, log action, trạng thái mạng |
| Nộp bài báo lỗi nhưng đã có điểm | Request thua trong race | Đọc lại lượt; không tạo điểm mới |
| Đăng nhập đúng nhưng bị đăng xuất | `sessionVersion` đổi do khóa/đổi vai trò/đặt lại mật khẩu | Đăng nhập lại; kiểm tra log admin |
| Rate limit chặn nhầm | Nhiều người dùng chung IP (Wi-Fi trường) | Điều chỉnh ngưỡng IP; ưu tiên đếm theo username |
