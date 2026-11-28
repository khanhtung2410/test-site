# HƯỚNG DẪN ĐÓNG GÓP

Cảm ơn bạn đã quan tâm đóng góp cho **Site thi trắc nghiệm online**.
Tài liệu này mô tả quy trình làm việc, quy tắc code, commit, pull request và review.

> Đọc [`README.md`](../README.md) trước để hiểu project làm gì và cách chạy local.
> Đọc [`SPEC.md`](SPEC.md) để biết quyết định sản phẩm; [`REQUIREMENTS.md`](REQUIREMENTS.md) để biết phạm vi.

---

## 1. Quy trình làm việc

Mô hình **GitHub Flow**: làm việc trên nhánh riêng rồi mở Pull Request về `main`.

```text
main        ← nhánh chính, luôn xanh
feature/*   ← tính năng
fix/*       ← sửa lỗi
chore/*     ← cấu hình, dependency, CI
docs/*      ← chỉ tài liệu
test/*      ← chỉ test
```

**Các bước:**

1. Cập nhật `main`:

   ```bash
   git switch main
   git pull --ff-only origin main
   ```

2. Tạo nhánh từ `main`:

   ```bash
   git switch -c feature/question-bank
   ```

3. Code theo TDD cho K2–K7 (xem mục 2.6), chạy kiểm tra, commit.

4. Push và mở PR:

   ```bash
   git push -u origin feature/question-bank
   gh pr create --base main --title "feat(questions): add question bank" --body-file pr-body.md
   ```

5. Chờ CI xanh và review. Không tự merge PR của mình, trừ hotfix khẩn cấp có báo trước.

**Đặt tên nhánh:** `<type>/<kebab-case-mô-tả-ngắn>`, chỉ ASCII, chữ số và dấu gạch ngang. Ví dụ: `feature/exam-attempt`, `fix/save-after-expiry`, `chore/ci-postgres`.

---

## 2. Quy tắc code

### 2.1. Nguyên tắc chung

- **TypeScript strict**, không dùng `any`, không `@ts-ignore` trừ khi có comment giải thích và lý do.
- Không commit code chết: không `console.log`, không code comment-out, không file `.bak`.
- Không commit secret. `AUTH_SECRET`, `DATABASE_URL` nằm trong `.env` (đã gitignore).
- Một hàm làm một việc. Hàm quá 50 dòng nên tách.
- Tên biến/hàm nói đúng ý nghĩa: `scoreAttempt` tốt hơn `calc`.
- Ưu tiên dễ đọc hơn thông minh.

### 2.2. Cấu trúc file

```text
src/app/          ← route, page, layout, route handler
src/features/     ← domain: components/, actions/, queries/, lib/, mocks/
src/constants/    ← role, trạng thái, nhãn
prisma/           ← schema, migrations, seed (not-yet, kế hoạch giai đoạn 2)
public/           ← static assets
docs/             ← tài liệu dự án
```

Alias `@/*` trỏ về `src/*`. Đặt code gần route hoặc domain đang dùng; chỉ tạo thư mục dùng chung khi có ít nhất hai nơi thật sự cần.

### 2.3. Server và Client Component

- Mặc định là Server Component. Chỉ thêm `"use client"` khi cần `useState`, `useEffect`, event handler hoặc browser API.
- Màn làm bài cần Client Component cho phần chọn đáp án, đồng hồ và trạng thái lưu; dữ liệu vẫn do server truyền xuống.
- Không import Prisma hoặc module server-only trong file `"use client"`.
- Không truyền Prisma object qua ranh giới server → client. Luôn map sang DTO.

### 2.4. Truy cập dữ liệu

- Đọc bằng Server Components + query function trong `src/features/*/queries/`.
- Ghi bằng Server Actions trong `src/features/*/actions/`.
- Route Handler chỉ cho health check, cron nội bộ hoặc tệp tải xuống. Không tạo REST API riêng.
- Mọi query/action phải kiểm tra quyền trước khi đọc/ghi. Không tin `userId` từ client.
- Không viết SQL thô trong MVP. Nếu buộc phải dùng, dùng parameterized query, không nối chuỗi.

### 2.5. Validation

- Validate mọi input không tin cậy ở server bằng **Zod**: `FormData`, query param, body action.
- Schema đặt gần action hoặc module nghiệp vụ dùng nó.
- Lỗi trả về theo từng trường để form hiển thị.
- Giới hạn độ dài theo `REQUIREMENTS.md` mục 5.

### 2.6. Kiểm thử và TDD

**TDD bắt buộc cho K2–K7.** Quy trình:

1. Viết test đỏ, chạy và lưu output (`EXIT=1`).
2. Commit test đỏ riêng, bắt buộc, trước khi sửa implementation; không gộp vào commit code.
3. Viết code tối thiểu cho test xanh.
4. Refactor khi xanh.

**Các tầng test:**

| Tầng | Công cụ | Phạm vi |
|---|---|---|
| Unit | Vitest | Hàm chấm điểm, xáo trộn, validate, permission, format thời gian |
| Integration | Vitest + PostgreSQL thật | Bắt đầu/nộp song song, lưu sau hạn, snapshot, session revocation, last admin |
| E2E | Playwright | Luồng thường, tải lại, offline, hết giờ, quét rò đáp án, bàn phím, axe |

**Quy tắc:**

- Test đặt cạnh code: `src/**/*.test.ts(x)`.
- Không mock database cho test đồng thời K3; phải dùng PostgreSQL thật.
- Không dùng `--force-reset` với Prisma (Prisma 7 chặn AI agent); dùng database test riêng và migrate/seed sạch.
- E2E chạy trên production build (`next build && next start`), không chạy dev server.
- Test phải tái hiện được trên máy khác, không phụ thuộc giờ hệ thống; dùng fake timer khi kiểm tra hạn.
- Với thay đổi UI, kiểm tra thủ công luồng bị ảnh hưởng và ghi rõ trong PR.

### 2.7. Accessibility

- Không bỏ qua a11y vì spec không nhắc. Nếu một hành vi a11y bắt buộc chưa rõ, hỏi chủ dự án trước khi đóng.
- Màn làm bài phải hoàn thành được bằng bàn phím.
- Không cuộn ngang ở 360 px.
- Trạng thái "đã lưu/chưa lưu" có cả chữ và màu.
- Đồng hồ không đọc mỗi giây qua `aria-live`; chỉ đọc mốc 5 phút và 1 phút.

### 2.8. Hiệu năng

- Ngưỡng và cách đo chỉ ghi ở [`PERFORMANCE.md`](PERFORMANCE.md). Không chép số vào README hay PR khác; chỉ link.
- Không thêm thư viện UI lớn nếu HTML + Tailwind đủ.
- Không polling; đồng hồ dùng `setInterval` 1 giây và đồng bộ lại khi focus.

### 2.9. Định dạng và lint

```bash
npm run lint
npm run lint -- --fix
npm run typecheck
npm run format
npm run format:check
```

Chưa cấu hình Husky pre-commit. CI chạy các lệnh trên.

---

## 3. Quy tắc commit

Áp dụng **Conventional Commits**.

```text
<type>(<scope>): <mô tả ngắn ở thể mệnh lệnh>

[body — giải thích WHY]

[footer — ticket, breaking change]
```

### Type

| Type | Ý nghĩa |
|---|---|
| `feat` | Tính năng mới |
| `fix` | Sửa lỗi |
| `docs` | Chỉ tài liệu |
| `style` | Format, dấu chấm phẩy |
| `refactor` | Tái cấu trúc, không đổi hành vi |
| `perf` | Cải thiện hiệu năng |
| `test` | Thêm/sửa test |
| `chore` | Build, CI, dependency |

### Scope

`auth`, `users`, `questions`, `exams`, `attempts`, `scoring`, `ui`, `config`, `ci`, `deploy`, `docs`.

### Ví dụ

```text
feat(attempts): snapshot questions when an attempt starts

fix(attempts): reject answer saves after the server expiry

test(scoring): cover all multi-answer cases

docs(spec): record the all-or-nothing scoring rule
```

### Quy tắc viết

- Dòng tiêu đề ≤ 72 ký tự, không viết hoa đầu câu, không dấu chấm cuối.
- Dùng thể mệnh lệnh tiếng Anh: `add`, không `added`.
- Body giải thích **tại sao**, không phải **cái gì**.
- Mỗi commit là một thay đổi logic hoàn chỉnh, build được, test pass.
- Chỉ dùng chữ cái tiếng Việt hoặc tiếng Anh trong file văn bản; chữ Hán, Hangul, Cyrillic hoặc mojibake là lỗi. Kiểm tra bằng `npm run check:language` khi script có.
- Breaking change: thêm `!` sau type và ghi rõ trong footer.

---

## 4. Quy trình Pull Request

### 4.1. Trước khi mở PR

- [ ] Đã cập nhật từ `main` mới nhất và giải quyết conflict.
- [ ] `npm run lint` pass.
- [ ] `npm run typecheck` pass.
- [ ] `npm test` pass.
- [ ] `npm run format:check` pass.
- [ ] `npm run build` thành công.
- [ ] `npm run test:e2e` pass (nếu thay đổi hành vi).
- [ ] Đã cập nhật tài liệu nếu hành vi hoặc cấu hình đổi.
- [ ] Đã thêm entry `AI_LOG.md` nếu dùng AI.
- [ ] Đã tự review diff.

Repo hiện có script `lint`, `typecheck`, `format:check`, `check:language` và `build`; `npm test` cùng `npm run test:e2e` chưa có, ghi "chưa kiểm chứng" cho đến khi thêm script. Output kiểm chứng được dán nguyên văn vào PR, kèm `EXIT=`.

### 4.2. Tiêu đề PR

Cùng format Conventional Commits:

```text
feat(attempts): save each answer immediately
fix(auth): invalidate sessions when an account is locked
```

### 4.3. Mô tả PR

```markdown
## What
Tóm tắt 1–2 câu.

## Why
Lý do / mã yêu cầu (FR, K1–K8). Link issue nếu có.

## How
Cách tiếp cận chính, điểm cần reviewer chú ý.

## Testing
Dán đầy đủ output của từng lệnh, kèm EXIT=... Không thay bằng link hoặc tóm tắt.

- [ ] npm run lint
- [ ] npm run typecheck
- [ ] npm test
- [ ] npm run format:check
- [ ] npm run build
- [ ] npm run test:e2e
- [ ] Kiểm tra thủ công (nếu cần), nêu môi trường và kết quả

## Screenshots (nếu là UI)
Ảnh chụp từ Playwright sau khi trang tải xong, ghi BASE_URL và thời điểm.

## Checklist
- [ ] Không có breaking change (hoặc đã ghi ở footer)
- [ ] Đã cập nhật docs
- [ ] Đã cập nhật AI_LOG
```

**Quy tắc bằng chứng:** mọi câu "đã sửa", "đã tìm ra nguyên nhân", "đạt" phải đi kèm output lệnh, link run CI hoặc ảnh. Chưa kiểm chứng được thì ghi "chưa kiểm chứng". Không dùng kết quả của lần chạy trước.

### 4.4. Kích thước PR

- Mục tiêu **dưới 400 dòng** (không tính lockfile).
- PR trên 800 dòng nên tách; reviewer dễ bỏ sót.
- Nếu buộc phải lớn (migration, schema), ghi rõ chỗ cần soi kỹ.
- Cả dự án tối đa khoảng **12 PR**, mỗi PR một việc.

### 4.5. Review

- Sau **mỗi lượt review**, lưu kết quả vào `docs/reviews/YYYY-MM-DD-<skill>.md` theo [`reviews/TEMPLATE.md`](reviews/TEMPLATE.md). `<skill>` là id cụ thể đã dùng (`requesting-code-review`, `receiving-code-review`, `systematic-debugging`, `superpowers` nếu tự review).
- Mỗi phát hiện phải có `file:line`, mức độ (`Critical` / `Important` / `Minor`), cách tái hiện và quyết định **Accepted** (kèm PR/nhánh) hoặc **Rejected** (kèm lý do cụ thể).
- Không bỏ im lặng phát hiện nào. Không chấp nhận gợi ý của AI mà chưa đọc lại source thật.
- Nếu lượt review không tìm được gì ngoài checklist của mentor, ghi rõ điều đó thay vì trình bày checklist như kết quả mới.
- Trước khi sửa một giá trị xuyên module (khóa, URL, token), `grep` mọi consumer và viết test cho cả luồng, không chỉ unit test.
- Thêm entry `AI_LOG.md`: prompt nguyên văn, phát hiện nhận/bác, link review file.

**Prefix comment:**

| Prefix | Ý nghĩa | Bắt buộc sửa? |
|---|---|---|
| `[blocking]` | Phải sửa trước khi merge | Có |
| `[question]` | Cần giải thích | Trả lời |
| `[nit]` | Nhỏ, tùy | Không |
| `[suggestion]` | Đề xuất | Không |

### 4.6. Merge

- Ưu tiên **Squash and merge** để lịch sử `main` gọn.
- Xóa nhánh sau khi merge.
- Nếu phát hiện lỗi sau merge, mở PR `fix/...` mới; không revert trừ khi nghiêm trọng.

---

## 5. Báo cáo bug / đề xuất

### Bug

```markdown
**Môi trường:** Chrome 131, Windows 11 / local dev
**Bước tái hiện:**
1. Đăng nhập học viên, mở đề A.
2. Chọn đáp án câu 3, tắt mạng, bật lại, tải lại trang.
**Kết quả mong đợi:** Đáp án câu 3 còn.
**Kết quả thực tế:** Câu 3 trống.
**Ảnh / log:** <đính kèm>
```

### Feature request

Mô tả vấn đề trước, giải pháp sau. Ghi rõ thuộc Must hay Should và lý do.

### Bảo mật

Không mở issue công khai. Gửi email theo [`SECURITY.md`](SECURITY.md) mục 5.

---

## 6. Câu hỏi

- Mở discussion trên GitHub.
- Maintainer: chủ dự án (điền handle khi có).
