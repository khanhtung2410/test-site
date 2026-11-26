# BÀN GIAO DỰ ÁN

> **Cập nhật lần cuối:** 2026-11-26
> **Trạng thái:** Mốc 1 — tài liệu thiết kế. Chưa có mã tính năng.
> **Người thực hiện:** chủ dự án (thực tập) + AI hỗ trợ.

Tài liệu này dành cho mentor và người tiếp nhận dự án: biết cái gì đã xong, cái gì còn, chỗ nào cần quyết định và cách kiểm chứng.

---

## 1. Tóm tắt

Repo đã có bộ tài liệu thiết kế cho site thi trắc nghiệm online, dựa trên SRS và brief gốc. Work tree vẫn là khung Next.js 16.4.6 của `create-next-app`; chưa có Prisma, authentication, test hay CI.

Điểm đã chốt quan trọng nhất:

- Luật chấm nhiều đáp án: **đúng hết mới có điểm**, không trừ điểm.
- Bản chụp câu hỏi tại thời điểm bắt đầu; sửa/xóa câu hỏi không đổi điểm cũ.
- Thời gian do server quyết định; hết hạn xử lý lazy.
- Xáo thứ tự bằng seed ở server.
- Phân quyền server-side; truy cập trái phép trả 404.

---

## 2. Đã hoàn thành

| Hạng mục | File | Ghi chú |
|---|---|---|
| Đặc tả sản phẩm | [`SPEC.md`](SPEC.md) | Bài toán, phạm vi, quyết định, luồng, state machine, K1–K8, wireframe, nghiệm thu |
| Yêu cầu chi tiết | [`REQUIREMENTS.md`](REQUIREMENTS.md) | FR-01…FR-27, NFR-01…NFR-13, quy tắc nghiệp vụ, validation, truy vết K |
| Kiến trúc | [`ARCHITECTURE.md`](ARCHITECTURE.md) | Tầng, module, luồng request, transaction, thời gian, snapshot, ADR |
| Mô hình dữ liệu | [`ERD.md`](ERD.md) | Mermaid ERD, ràng buộc, index, xóa/lưu trữ |
| Phân quyền | [`PERMISSIONS.md`](PERMISSIONS.md) | Ma trận quyền, quy tắc bản ghi, test bắt buộc |
| Bảo mật | [`SECURITY.md`](SECURITY.md) | Mô hình đe dọa, kiểm soát, việc còn thiếu |
| Đóng góp | [`CONTRIBUTING.md`](CONTRIBUTING.md) | Nhánh, commit, PR, review, TDD |
| Deploy | [`DEPLOY.md`](DEPLOY.md) | CI/CD, migration, rollback, vệ sinh dữ liệu |
| Hiệu năng | [`PERFORMANCE.md`](PERFORMANCE.md) | Ngưỡng, cách đo, ngân sách |
| Vận hành | [`HUONG_DAN_VAN_HANH.md`](HUONG_DAN_VAN_HANH.md) | Hướng dẫn cho trung tâm/giáo viên/học viên |
| Mẫu review | [`reviews/TEMPLATE.md`](reviews/TEMPLATE.md) | Mẫu ghi phát hiện và quyết định |
| Quy tắc agent | [`../AGENTS.md`](../AGENTS.md) | Superpowers, TDD, bằng chứng, ngôn ngữ |
| README | [`../README.md`](../README.md) | Tổng quan, chạy local, scripts, cấu trúc |
| Nhật ký AI | [`../AI_LOG.md`](../AI_LOG.md) | Entry khởi tạo tài liệu |

---

## 3. Chưa làm / tồn đọng

### 3.1. Mốc 2 — Nền tảng

- [ ] Cài Prisma 7, PostgreSQL 16, Zod, bcryptjs, jose, Vitest, Playwright, Prettier.
- [ ] Tạo `prisma/schema.prisma`, migration đầu tiên, seed demo.
- [ ] Docker Compose cho PostgreSQL local/test/e2e.
- [ ] `ci.yml` với static, test, build, e2e, lighthouse.
- [ ] Branch protection trên `main`.
- [ ] Authentication: session JWT, cookie, rate limit, logout.
- [ ] Phân quyền: `requireRole`, `assertOwn*`, 404.
- [ ] Admin quản lý tài khoản; chặn admin cuối cùng bị khóa/hạ vai trò.

### 3.2. Mốc 3 — Làm bài

- [ ] Ngân hàng câu hỏi: tạo, sửa, lưu trữ, tag, lọc.
- [ ] Tạo/sửa đề; chọn câu; khung giờ; số lượt.
- [ ] Bắt đầu/làm tiếp; snapshot; seed; xáo thứ tự.
- [ ] Màn làm bài: đồng hồ, chọn đáp án, tự lưu, offline indicator.
- [ ] E2E: tải lại, mất mạng, hai tab.

### 3.3. Mốc 4 — Chấm điểm

- [ ] Nộp bài idempotent; hết hạn lazy.
- [ ] Hàm chấm thuần + unit test bảng.
- [ ] Trang kết quả học viên; kết quả theo đề cho giáo viên.
- [ ] E2E quét rò đáp án K1.

### 3.4. Mốc 5 — Hoàn thiện

- [ ] Lighthouse CI đạt ngưỡng.
- [ ] a11y: axe 0 serious/critical; bàn phím; 360 px.
- [ ] `deploy.yml`; deploy production; smoke test; link run.
- [ ] Tài khoản demo 3 vai trò; video demo ≤ 3 phút.
- [ ] Cập nhật `HANDOVER.md` cuối cùng.

### 3.5. Should (sau Must)

- [ ] Import CSV (FR-24).
- [ ] Thống kê từng câu (FR-25).
- [ ] Xem lại bài kèm đáp án (FR-26).
- [ ] Gán lớp (FR-27).
- [ ] `mustChangePassword` bắt buộc đổi mật khẩu lần đầu.
- [ ] Cron quét hết hạn nền.

---

## 4. Quyết định cần chủ dự án xác nhận

Các mục dưới đây đã có giá trị mặc định trong tài liệu; nếu chủ dự án đổi, cập nhật nơi ghi gốc.

| Mã | Nội dung | Giá trị đang dùng | Ghi ở |
|---|---|---|---|
| A-01 | Số học viên đồng thời | 300 | `SPEC.md` mục 12 |
| A-02 | p95 lưu đáp án | ≤ 500 ms | `PERFORMANCE.md` |
| A-03 | Uptime khung thi | 99,9% | `REQUIREMENTS.md` |
| A-04 | Trình duyệt hỗ trợ | 2 bản mới nhất; iOS 16+ | `SPEC.md` mục 12 |
| A-05 | Vùng database | Singapore | `SPEC.md` mục 12 |
| A-06 | Tên miền production | TBD | `DEPLOY.md` |
| A-07 | Số câu tối đa/đề | 100 | `SPEC.md` mục 12 |
| A-08 | Số đáp án tối đa/câu | 6 | `SPEC.md` mục 12 |

Ngoài ra:

- Ai được gán đề cho lớp (FR-27): admin hay giáo viên?
- Có cần bắt buộc đổi mật khẩu lần đầu không?
- Có cần cron quét hết hạn nền không, hay lazy sweep đủ?

---

## 5. Rủi ro

| Rủi ro | Mức | Cách giảm |
|---|---|---|
| Lộ đáp án qua DTO hoặc RSC payload | Cao | Không spread Prisma object; DTO tường minh; E2E quét payload |
| Race khi bắt đầu/nộp | Cao | Unique constraint + transaction + test `Promise.all` trên PostgreSQL thật |
| Mất đáp án khi mạng yếu | Cao | Lưu ngay, upsert, retry, chỉ báo câu chưa lưu, E2E offline |
| Lệch giờ server/client | Trung bình | Chỉ server quyết định; đồng bộ lại khi focus |
| Migration production làm hỏng dữ liệu | Trung bình | Migration tương thích ngược; gate duyệt; backup trước |
| Quá 12 PR | Trung bình | Gộp việc nhỏ; không làm Should trước Must |
| Thiếu bằng chứng khi báo cáo | Trung bình | Quy tắc "output trước, kết luận sau" trong AGENTS và CONTRIBUTING |
| Vercel Cron cần gói trả phí | Thấp | MVP dùng lazy sweep |

---

## 6. Kịch bản demo (dự kiến, ≤ 3 phút)

1. Đăng nhập giáo viên, mở ngân hàng câu hỏi, tạo một câu nhiều đáp án.
2. Tạo đề 2 câu, 2 phút, 1 lượt, mở ngay.
3. Đăng xuất, đăng nhập học viên, mở đề.
4. Chọn đáp án câu 1, tải lại trang → đáp án còn.
5. Tắt mạng, chọn câu 2 → UI báo chưa lưu; bật mạng → lưu lại.
6. Nộp bài → điểm hiện ngay.
7. Mở hai tab, bấm nộp đồng thời → chỉ một điểm.
8. Đăng nhập giáo viên, xem kết quả theo đề.
9. (Nếu có) để hết giờ ở một lượt khác → trạng thái `EXPIRED`, điểm theo đáp án đã lưu.

Khi demo trên production, dọn toàn bộ dữ liệu thử sau khi quay video.

---

## 7. Cách kiểm chứng tài liệu này

- Đọc `SPEC.md` mục 3: mọi quyết định có lý do và mã liên quan.
- Đọc `REQUIREMENTS.md` mục 6: mỗi K có FR/NFR và bằng chứng.
- Đọc `ERD.md`: mọi ràng buộc K3/K5 có unique/FK tương ứng.
- Đọc `PERMISSIONS.md`: mọi hành động có vai trò và quy tắc bản ghi.
- Đọc `SECURITY.md` mục 3: biết cái gì chưa chạy, không có tuyên bố quá mức.
- Đọc `AGENTS.md`: quy trình Superpowers và quy tắc bằng chứng.

Tài liệu chưa được mentor duyệt. Khi mentor góp ý, sửa trực tiếp và ghi thay đổi vào `AI_LOG.md`.

---

## 8. Đề xuất phiên bản sau

1. **Import CSV** chuẩn hóa để giáo viên chuyển ngân hàng câu hỏi từ Excel.
2. **Thống kê câu hỏi** để phát hiện câu quá dễ/quá khó.
3. **Lớp học** để mở đề theo lớp thay vì toàn trung tâm.
4. **Xem lại bài** sau khi đề đóng, có kiểm soát.
5. **Cron hết hạn nền** nếu số lượt bỏ dở nhiều.
6. **Nhật ký thao tác admin** (audit log) khi có nhiều admin.
7. **Đa ngôn ngữ** nếu trung tâm có học viên nước ngoài.
8. **Câu hỏi có hình ảnh** nếu chủ dự án mở rộng phạm vi (hiện là Out).

---

## 9. Liên hệ

- Chủ dự án: điền tên và kênh liên hệ trước khi bàn giao.
- Mentor: điền tên và kênh liên hệ.
- Báo cáo bảo mật: xem `SECURITY.md` mục 5.
