# SITE THI TRẮC NGHIỆM ONLINE

Website cho trung tâm đào tạo tổ chức thi trắc nghiệm online. Giáo viên soạn câu hỏi một lần và dùng lại cho nhiều đề; học viên làm bài có giới hạn thời gian trên điện thoại hoặc máy tính; hệ thống tự chấm ngay khi nộp và thống kê kết quả theo đề.

Repo: <https://github.com/khanhtung2410/test-site>

> **Trạng thái:** Mốc 1 — tài liệu thiết kế. Work tree hiện có khung Next.js 16.4.6 của `create-next-app`; chưa có Prisma, authentication, test hay CI. Các lệnh đánh dấu `*` sẽ được thêm ở Mốc 2. Xem [`docs/HANDOVER.md`](docs/HANDOVER.md) để biết việc còn lại.

---

## 1. Bài toán

Trung tâm đang thi trên giấy: in đề, chấm tay, nhập Excel. Mỗi đợt mất 2–3 ngày mới có kết quả và không biết câu nào quá dễ hay quá khó.

Ba việc website phải làm:

1. Giáo viên soạn câu hỏi một lần, dùng lại cho nhiều đề.
2. Học viên làm bài online có giới hạn thời gian, trên điện thoại hoặc máy tính.
3. Hệ thống tự chấm ngay khi nộp và thống kê kết quả theo đề, theo câu hỏi.

Điều trung tâm lo nhất là **gian lận** (xem đáp án, kéo dài thời gian, làm lại quá số lần) và **mất bài** khi mạng chập chờn. Vì vậy K1–K4 trong [`docs/SPEC.md`](docs/SPEC.md) là ràng buộc không thể thương lượng.

---

## 2. Vai trò

| Vai trò | Việc chính |
|---|---|
| Admin | Tạo tài khoản, gán vai trò, khóa tài khoản, đặt lại mật khẩu |
| Giáo viên | Ngân hàng câu hỏi, tạo đề, xem kết quả đề của mình |
| Học viên | Làm đề đang mở, tự lưu, nộp bài, xem điểm của mình |

Không có tự đăng ký, thanh toán, đăng nhập mạng xã hội, câu tự luận, câu có hình/công thức, giám sát camera hay chống chụp màn hình.

---

## 3. Công nghệ

| Thành phần | Hiện có | Kế hoạch |
|---|---|---|
| Framework | Next.js 16.4.6 (App Router) | Giữ nguyên |
| UI | React 19.3.0, Tailwind CSS 4.3.3 | Thiết kế mobile-first |
| Ngôn ngữ | TypeScript 5.x strict | Giữ nguyên |
| Database / ORM | — | Prisma 7 + PostgreSQL 16 |
| Validation | — | Zod 4 |
| Authentication | — | JWT HS256 trong cookie `httpOnly`, bcryptjs |
| Test | — | Vitest (unit/integration), Playwright (E2E), axe, Lighthouse CI |
| Lint / Format | ESLint 9 | Thêm Prettier 3 |

Ứng dụng là **một Next.js project duy nhất**: Server Components cho phần đọc, Server Actions cho mutation. Không có backend REST riêng. Kiến trúc chi tiết ở [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 4. Chạy local từ clone mới

Yêu cầu: **Node.js 22**, **npm 10 trở lên**, **Git**, **Docker** (cho PostgreSQL).

```bash
git clone https://github.com/khanhtung2410/test-site.git
cd test-site
npm install
```

### 4.1. Database local

```bash
docker run --name exam-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=exam_dev \
  -p 5432:5432 \
  -d postgres:16
```

Nếu đã có PostgreSQL cài sẵn, tạo database `exam_dev` và bỏ qua Docker.

### 4.2. Tạo file môi trường

```bash
cp .env.example .env
```

Điền tối thiểu:

```dotenv
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/exam_dev?schema=public"
AUTH_SECRET="<chuỗi random>"
SITE_URL="http://localhost:3000"
```

Tạo `AUTH_SECRET`:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

`.env` và `.env.local` đã nằm trong `.gitignore`; chỉ `.env.example` được commit.

### 4.3. Khởi tạo schema và dữ liệu mẫu

Các lệnh dưới đây sẽ có ở Mốc 2:

```bash
npm run db:migrate:dev   # tạo/áp dụng migration local
npm run db:generate      # generate Prisma Client
npm run db:seed          # nạp dữ liệu demo
```

### 4.4. Chạy dev server

```bash
npm run dev
```

Mở <http://localhost:3000>.

### 4.5. Chạy bản production tại máy local

```bash
npm run build
npm run start
```

---

## 5. Tài khoản demo

Sau khi chạy `npm run db:seed` (Mốc 2), các tài khoản demo:

| Vai trò | Tên đăng nhập | Mật khẩu |
|---|---|---|
| Admin | `admin` | `Demo@12345` |
| Giáo viên | `teacher` | `Demo@12345` |
| Học viên | `student` | `Demo@12345` |

Đây là tài khoản demo cho local/test, **không dùng cho production**. Khi deploy, tạo tài khoản thật bằng script quản trị và đổi mật khẩu.

---

## 6. Scripts

| Lệnh | Trạng thái | Mục đích |
|---|---|---|
| `npm run dev` | Có | Dev server có hot reload |
| `npm run build` | Có | Build production |
| `npm run start` | Có | Chạy bản build |
| `npm run lint` | Có | ESLint |
| `npm run typecheck` | Kế hoạch | `tsc --noEmit` |
| `npm test` | Kế hoạch | Vitest unit + integration |
| `npm run test:watch` | Kế hoạch | Vitest watch |
| `npm run test:e2e` | Kế hoạch | Playwright trên production build |
| `npm run format` / `format:check` | Kế hoạch | Prettier ghi / kiểm tra |
| `npm run db:migrate:dev` | Kế hoạch | Tạo migration local |
| `npm run db:migrate:deploy` | Kế hoạch | Áp dụng migration production |
| `npm run db:generate` | Kế hoạch | Generate Prisma Client |
| `npm run db:seed` | Kế hoạch | Dữ liệu demo local/test |
| `npm run db:create-admin` | Kế hoạch | Tạo admin đầu tiên cho production |
| `npm run check:language` | Kế hoạch | Kiểm tra quy tắc chữ Việt/Anh |
| `npm run audit:production` | Kế hoạch | `npm audit --omit=dev --audit-level=high` |

---

## 7. Cấu trúc dự án (đích đến)

```text
test-site/
├── src/
│   ├── app/
│   │   ├── (auth)/login/          # Đăng nhập
│   │   ├── (student)/exams/       # Danh sách đề, làm bài, kết quả
│   │   ├── (teacher)/teacher/     # Câu hỏi, đề, kết quả
│   │   ├── (admin)/admin/users/   # Quản lý tài khoản
│   │   └── api/health/            # Health check
│   ├── features/
│   │   ├── auth/                  # Session, login, rate limit
│   │   ├── users/                 # Quản lý tài khoản
│   │   ├── questions/             # Ngân hàng câu hỏi, tag
│   │   ├── exams/                 # Tạo/sửa đề, danh sách đề
│   │   ├── attempts/              # Bắt đầu, lưu, nộp, hết hạn
│   │   ├── scoring/               # Hàm chấm thuần, thống kê
│   │   └── shared/                # DB, domain, validation, format
│   ├── constants/                 # Role, trạng thái, nhãn
│   └── proxy.ts                   # Chuyển hướng UX, không phải phân quyền
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── e2e/                           # Playwright specs
├── docs/                          # Tài liệu dự án
├── public/                        # Static assets
└── package.json
```

Mỗi feature tự chứa `components/`, `actions/`, `queries/`, `lib/`, test đặt cạnh code. Trang trong `src/app` chủ yếu compose feature, không gọi Prisma trực tiếp.

---

## 8. Database

- PostgreSQL 16 cho local, test, e2e và production. Không dùng SQLite.
- Local: `exam_dev`; test: `exam_test`; e2e: `exam_e2e`.
- Schema dự kiến: [`docs/ERD.md`](docs/ERD.md).
- Migration nằm trong `prisma/migrations/`; không sửa database production bằng tay.
- Chi tiết deploy và rollback: [`docs/DEPLOY.md`](docs/DEPLOY.md).

---

## 9. Kiểm thử

```bash
npm run lint
npm run typecheck
npm test
npm run format:check
npm run build
npm run test:e2e
```

- **Unit:** hàm chấm điểm, xáo trộn, validate, permission, format thời gian.
- **Integration:** bắt đầu/nộp song song, lưu sau hạn, snapshot, session revocation — dùng PostgreSQL thật.
- **E2E:** luồng thường, tải lại, mất mạng, hết giờ, quét rò đáp án, bàn phím, axe.

TDD bắt buộc cho K2–K7; chi tiết ở [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md).

---

## 10. Deploy

Production deploy **chỉ qua GitHub Actions**, không deploy tay:

- CI: lint, typecheck, test, build, e2e, Lighthouse.
- Deploy: migration gate → Vercel prebuilt → smoke test → rollback nếu smoke fail.
- URL production: TBD.

Quy trình, biến môi trường và rollback: [`docs/DEPLOY.md`](docs/DEPLOY.md).

---

## 11. Tài liệu

| File | Nội dung |
|---|---|
| [`docs/SPEC.md`](docs/SPEC.md) | Đặc tả sản phẩm, quyết định, luồng, state machine, wireframe, nghiệm thu |
| [`docs/MOCKUPS.md`](docs/MOCKUPS.md) | Mockup Figma: 22 frame mobile/desktop, design token, trạng thái, plugin local |
| [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) | FR-01…FR-27, NFR, quy tắc nghiệp vụ, validation, truy vết K |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Kiến trúc, module, luồng request, transaction, ADR |
| [`docs/ERD.md`](docs/ERD.md) | Mô hình dữ liệu, ràng buộc, index |
| [`docs/PERMISSIONS.md`](docs/PERMISSIONS.md) | Ma trận quyền, quy tắc bản ghi |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Mô hình đe dọa, kiểm soát, việc còn thiếu |
| [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) | Nhánh, commit, PR, review, TDD |
| [`docs/DEPLOY.md`](docs/DEPLOY.md) | CI/CD, migration, rollback, vệ sinh dữ liệu |
| [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md) | Ngưỡng hiệu năng và cách đo |
| [`docs/HUONG_DAN_VAN_HANH.md`](docs/HUONG_DAN_VAN_HANH.md) | Hướng dẫn cho admin, giáo viên, học viên |
| [`docs/HANDOVER.md`](docs/HANDOVER.md) | Trạng thái, việc còn lại, quyết định, rủi ro |
| [`docs/reviews/TEMPLATE.md`](docs/reviews/TEMPLATE.md) | Mẫu ghi review |
| [`AGENTS.md`](AGENTS.md) | Quy tắc cho coding agent, Superpowers, K1–K8 |
| [`AI_LOG.md`](AI_LOG.md) | Nhật ký sử dụng AI |

Ngôn ngữ tài liệu: tiếng Việt, giữ nguyên thuật ngữ kỹ thuật và identifier tiếng Anh. `AGENTS.md` và `ERD.md` dùng tiếng Anh để chính xác.

---

## 12. License

Repository chưa có file `LICENSE`; loại license đang để TBD.
