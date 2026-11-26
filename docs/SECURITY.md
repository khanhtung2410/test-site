# BẢO MẬT

> **Trạng thái:** Thiết kế cho Mốc 1. Chưa có code bảo mật, chưa chạy scan nào.
> **Ngày:** 2026-11-26
> **Liên quan:** [`SPEC.md`](SPEC.md) mục 9, [`PERMISSIONS.md`](PERMISSIONS.md), [`ARCHITECTURE.md`](ARCHITECTURE.md) mục 7 và 10.

Tài liệu này mô tả mối đe dọa, kiểm soát và bằng chứng cần có. Không ghi "đã bảo mật" nếu chưa có output test hoặc scan tương ứng.

## 1. Mô hình mối đe dọa

| ID | Mối đe dọa | Ảnh hưởng | Kiểm soát | Bằng chứng |
|---|---|---|---|---|
| T-01 | Học viên xem đáp án đúng trong HTML, RSC payload hoặc response mạng (K1) | Gian lận điểm tuyệt đối | DTO lượt làm không chứa `isCorrect`; query chỉ select trường được phép; action lưu không trả đáp án; không có endpoint kiểm tra đáp án | E2E quét HTML, RSC payload, mọi response trong lúc làm bài |
| T-02 | Đổi giờ máy, sửa JS hoặc gửi request sau hạn để kéo dài thời gian (K2) | Làm bài quá thời gian | `expiresAt` do server đặt; kiểm tra hạn trong transaction; client chỉ hiển thị | Test fake timer: lưu sau hạn bị từ chối; lượt quá hạn chuyển `EXPIRED` |
| T-03 | Nộp hai lần / hai tab / bắt đầu song song để tạo điểm trùng hoặc vượt lượt (K3) | Sai điểm, vượt số lượt | `updateMany` có điều kiện `status`; unique `(examId, studentId, attemptNumber)`; transaction | Test DB thật với `Promise.all` |
| T-04 | Mất đáp án khi mạng chập chờn (K4) | Học viên mất điểm oan | Lưu ngay mỗi lần chọn; upsert idempotent; chỉ báo câu chưa lưu; retry khi online | E2E `setOffline(true)` rồi tải lại |
| T-05 | Sửa/xóa câu hỏi làm đổi đề đang làm hoặc điểm đã nộp (K5) | Sai điểm, mất công bằng | Snapshot câu/đáp án/điểm; chấm từ snapshot; không regrade | Test sửa đáp án sau khi nộp; điểm không đổi |
| T-06 | Đoán thứ tự câu/đáp án hoặc xáo ở client (K6) | Chia sẻ đáp án theo vị trí | Seed 128-bit ở server; Fisher–Yates thuần; thứ tự ổn định khi tải lại | Test hai lượt khác thứ tự; tải lại không đổi |
| T-07 | Lợi dụng luật chấm nhiều đáp án (K7) | Điểm không công bằng | All-or-nothing, không trừ điểm; hiển thị luật trước khi làm; hàm chấm thuần | Unit test bảng đủ trường hợp |
| T-08 | IDOR: học viên xem lượt người khác, giáo viên sửa đề người khác (K8) | Lộ dữ liệu, sửa nội dung trái phép | `requireRole` + kiểm tra sở hữu trong query/action; 404 khi sai | Test gọi thẳng action và test quyền sở hữu |
| T-09 | Brute force / credential stuffing | Chiếm tài khoản | Rate limit theo username và IP; lỗi đăng nhập chung; bcrypt cost 12 | Test rate limit; log `LoginAttempt` |
| T-10 | Đánh cắp hoặc cố định phiên | Chiếm phiên giáo viên/admin | Cookie `httpOnly`, `secure`, `sameSite=lax`; JWT ký; `sessionVersion` thu hồi | Test session revocation khi khóa/đổi vai trò/đặt lại mật khẩu |
| T-11 | XSS qua nội dung câu hỏi/đáp án | Chiếm phiên, phá trang | Render dạng text, không `dangerouslySetInnerHTML`, không markdown; React escape mặc định | Test component với chuỗi chứa `<script>` |
| T-12 | CSRF trên Server Action | Thao tác trái phép | Next.js kiểm tra Origin cho Server Action; cookie `sameSite=lax`; không có GET mutation | Test gọi action từ origin khác (nếu khả thi) |
| T-13 | SQL injection | Lộ/sửa dữ liệu | Prisma parameterized; không nối chuỗi SQL; không raw query trong MVP | Review code + test input độc hại |
| T-14 | CSV injection khi import (Should) | Mở file CSV nguy hiểm | Bỏ tiền tố `=`, `+`, `-`, `@`; giới hạn kích thước; báo lỗi theo dòng | Test import với ô bắt đầu bằng `=` |
| T-15 | Lộ secret trong repo/log | Chiếm hệ thống | `.env*` trong `.gitignore`; chỉ commit `.env.example`; không log token/mật khẩu | `git grep` secret trước merge; review log |
| T-16 | Dependency có lỗ hổng | Tùy mức độ | Dependabot, `npm audit --omit=dev --audit-level=high`, CodeQL | Output CI; ghi ngoại lệ vào mục 3 |
| T-17 | Gửi payload lớn / spam lưu đáp án | Tốn tài nguyên | Giới hạn độ dài input bằng Zod; giới hạn số đáp án chọn; rate limit theo phiên (Should) | Test validation; theo dõi log |
| T-18 | Dò tài khoản qua thông báo lỗi | Lộ danh sách tài khoản | Cùng một lỗi cho sai mật khẩu và tài khoản bị khóa/không tồn tại | Test message |

## 2. Kiểm soát bắt buộc

### 2.1. Bí mật và cấu hình

- `AUTH_SECRET` tối thiểu 32 byte ngẫu nhiên; không commit; đặt trong GitHub Environment `production` và Vercel.
- `DATABASE_URL` production dùng chuỗi kết nối có SSL; không đặt ở cấp repository.
- `.env`, `.env.local`, `.env.production.local` nằm trong `.gitignore`; chỉ `.env.example` được commit.
- Không log mật khẩu, token, cookie, `AUTH_SECRET`, nội dung đáp án đúng.

### 2.2. Header và cookie

Kế hoạch cấu hình trong `next.config.ts`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Cookie phiên: `httpOnly`, `secure` (production), `sameSite=lax`, `path=/`, 12 giờ.

CSP đầy đủ chưa đặt trong MVP vì Next.js cần nonce cho inline script; nếu thêm, làm ở PR riêng, bật report-only trước rồi mới chặn.

### 2.3. Validate và render

- Mọi input không tin cậy validate bằng Zod ở server: `FormData`, query param, body của action.
- Nội dung câu hỏi/đáp án/tên người dùng render dạng text; không HTML, không markdown, không `dangerouslySetInnerHTML`.
- Giới hạn: câu hỏi 2000 ký tự, đáp án 500 ký tự, 2–6 đáp án, 1–100 câu/đề.
- Không trả stack trace hay thông báo Prisma cho client.

### 2.4. Phân quyền

Xem [`PERMISSIONS.md`](PERMISSIONS.md). Tóm tắt: mọi page và Server Action gọi `requireRole`/`assertOwn*`; 404 khi không có quyền; proxy chỉ là UX, không phải authorization.

## 3. Kiểm tra tự động

| Kiểm tra | Công cụ | Trạng thái |
|---|---|---|
| Unit + integration | Vitest, PostgreSQL test | Kế hoạch |
| E2E + quét rò đáp án | Playwright | Kế hoạch |
| Accessibility | `@axe-core/playwright` | Kế hoạch |
| Dependency audit | `npm audit --omit=dev --audit-level=high` | Kế hoạch |
| Static analysis | CodeQL (JavaScript/TypeScript) | Kế hoạch |
| Cập nhật dependency | Dependabot (npm + GitHub Actions) | Kế hoạch |
| Secret scan | `git grep` + review trước merge | Kế hoạch |

Chưa chạy scan nào tại thời điểm viết tài liệu. Khi có kết quả, ghi output/link vào PR; không ghi "đạt" nếu không có bằng chứng.

## 4. Ngoại lệ advisory

Chưa có ngoại lệ nào. Nếu một advisory không thể vá ngay:

- Ghi mã advisory, package, phiên bản, lý do chấp nhận tạm, ngày xem lại, người chịu trách nhiệm.
- Chỉ chấp nhận khi không có đường khai thác trong phạm vi ứng dụng.
- Mỗi lần review dependency phải kiểm tra lại mục này.

## 5. Báo cáo lỗ hổng

- Không mở issue công khai cho lỗ hổng chưa vá.
- Gửi email tới địa chỉ bảo mật của chủ dự án (TBD — điền trước khi deploy production) kèm mô tả, bước tái hiện, mức ảnh hưởng.
- Mục tiêu phản hồi: 48 giờ.

## 6. Việc còn thiếu trước production

- [ ] Điền địa chỉ báo cáo bảo mật.
- [ ] Chạy `npm audit` và CodeQL, ghi kết quả.
- [ ] Thêm header bảo mật trong `next.config.ts`.
- [ ] Kiểm tra `AUTH_SECRET` đủ mạnh và chỉ nằm trong secret store.
- [ ] Chạy E2E quét rò đáp án trên bản production.
- [ ] Kiểm tra rate limit hoạt động trên Vercel (nhiều instance).
- [ ] Xác nhận không có tài khoản demo dùng mật khẩu yếu trên production.
