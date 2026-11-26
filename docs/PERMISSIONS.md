# MA TRẬN PHÂN QUYỀN

> **Trạng thái:** Thiết kế cho Mốc 1. Chưa có code phân quyền trong work tree.
> **Ngày:** 2026-11-26
> **Liên quan:** [`SPEC.md`](SPEC.md) mục 3 (D-02, D-09, D-15), [`ARCHITECTURE.md`](ARCHITECTURE.md) mục 7.

Tài liệu này là nguồn sự thật cho quyền. Mọi thay đổi quyền phải cập nhật bảng dưới đây và test tương ứng.

## Vai trò

| Vai trò | Mô tả |
|---|---|
| `ADMIN` | Quản lý tài khoản: tạo, đổi vai trò, khóa, đặt lại mật khẩu. Không sửa nội dung thi. |
| `TEACHER` | Quản lý câu hỏi và đề do mình tạo; xem kết quả đề của mình. |
| `STUDENT` | Làm đề đang mở; xem lượt làm và điểm của mình. |

## Ma trận quyền

| Hành động | `ADMIN` | `TEACHER` | `STUDENT` | Ghi chú |
|---|:---:|:---:|:---:|---|
| Đăng nhập / đăng xuất | Có | Có | Có | Tài khoản bị khóa không đăng nhập được |
| Xem hồ sơ của mình | Có | Có | Có | Chỉ tên, vai trò, tên đăng nhập |
| Tạo tài khoản | Có | Không | Không | Admin only |
| Đổi vai trò tài khoản | Có | Không | Không | Không hạ vai trò admin cuối cùng |
| Khóa / mở khóa tài khoản | Có | Không | Không | Không khóa admin cuối cùng |
| Đặt lại mật khẩu người khác | Có | Không | Không | Tăng `sessionVersion` |
| Xem danh sách người dùng | Có | Không | Không | Admin only |
| Xem ngân hàng câu hỏi | Không | Có (của mình) | Không | Giáo viên khác nhận 404 |
| Tạo câu hỏi | Không | Có | Không | |
| Sửa câu hỏi | Không | Có (của mình) | Không | Câu của giáo viên khác nhận 404 |
| Lưu trữ câu hỏi | Không | Có (của mình) | Không | Không xóa cứng |
| Xem danh sách đề (giáo viên) | Không | Có (của mình) | Không | |
| Tạo đề | Không | Có | Không | Chỉ dùng câu của mình |
| Sửa đề | Không | Có (của mình) | Không | Đề giáo viên khác nhận 404 |
| Xem kết quả theo đề | Không | Có (đề của mình) | Không | |
| Xem danh sách đề đang mở | Không | Không | Có | Chỉ đề trong khung giờ, còn lượt |
| Bắt đầu / làm tiếp lượt | Không | Không | Có (của mình) | Không vượt `maxAttempts` |
| Lưu đáp án | Không | Không | Có (lượt của mình) | Lượt phải `IN_PROGRESS`, trước hạn |
| Nộp bài | Không | Không | Có (lượt của mình) | Idempotent |
| Xem điểm | Không | Có (đề của mình) | Có (lượt của mình) | |
| Xem lại đáp án đúng | Không | Có (đề của mình, sau khi đóng) | Có (lượt của mình, nếu đề cho phép) | Should |
| Quản lý lớp học | Có (Should) | Có (Should) | Không | Should, chưa làm |

## Quy tắc theo bản ghi

1. **Giáo viên chỉ thấy nội dung của mình.** Truy vấn luôn có `authorId = session.userId`. Bản ghi của giáo viên khác trả 404, không trả 403.
2. **Học viên chỉ thấy lượt của mình.** Truy vấn `Attempt` luôn có `studentId = session.userId`. Lượt của người khác trả 404.
3. **Học viên chỉ thấy đề đang mở.** Điều kiện: `opensAt <= now < closesAt`, còn lượt, và (nếu có lớp) thuộc lớp được giao.
4. **Admin không đọc nội dung thi.** Admin chỉ truy cập module người dùng. Nếu cần hỗ trợ sự cố, phải có quyết định mới và ghi vào tài liệu này.
5. **Chưa đăng nhập** → chuyển về `/login`. **Đã đăng nhập nhưng không có quyền** → 404.
6. **Tài khoản bị khóa** không đăng nhập được; phiên đang có bị từ chối ở request kế tiếp vì `getSession()` đọc lại `User`.
7. **Đổi vai trò hoặc đặt lại mật khẩu** tăng `sessionVersion`, hủy mọi phiên cũ.
8. **Admin cuối cùng** không được khóa hoặc hạ vai trò. Kiểm tra trong cùng transaction với thao tác cập nhật.

## Thực thi

- `src/features/auth/session.ts` — `getSession()`: xác minh JWT, đọc lại `User`, kiểm tra `locked`, `role`, `sessionVersion`.
- `src/features/auth/require-role.ts` — `requireRole(...roles)`: chưa đăng nhập → redirect; sai vai trò → `notFound()`.
- `src/features/shared/lib/ownership.ts` — `assertOwnQuestion`, `assertOwnExam`, `assertOwnAttempt`: kiểm tra `authorId`/`studentId`, sai → `notFound()`.
- `src/proxy.ts` — **chỉ** kiểm tra hình thức cookie để chuyển hướng sớm. Không phải lớp phân quyền. Mọi page và Server Action phải tự gọi `requireRole`/`assertOwn*`.
- Ẩn nút trên UI **không** phải phân quyền. Test gọi thẳng Server Action phải chứng minh điều này.

## Kiểm thử bắt buộc

| Test | Nội dung |
|---|---|
| `permissions.test.ts` | Bảng quyền thuần: vai trò nào được hành động nào |
| `action-authorization.test.ts` | Gọi thẳng từng Server Action bằng tài khoản sai vai trò; tất cả bị từ chối |
| `ownership.test.ts` | Giáo viên A không sửa được câu/đề của B; học viên A không xem được lượt của B |
| `session-revocation.test.ts` | Khóa tài khoản/đổi vai trò/đặt lại mật khẩu làm phiên cũ hết hiệu lực ở request kế tiếp |
| `last-admin.test.ts` | Không khóa/hạ vai trò admin cuối cùng |

## Điều chưa chốt

- Ai được gán đề cho lớp (admin hay giáo viên) — chờ quyết định khi làm FR-27.
- Admin có được xem danh sách đề để hỗ trợ vận hành không — mặc định **không**; nếu chủ dự án yêu cầu, thêm quyền chỉ-đọc và ghi vào đây.
