# Thiết kế: trang giáo viên và admin với dữ liệu giả

- **Trạng thái:** bản thiết kế chờ duyệt.
- **Ngày:** 2026-11-27
- **Nguồn:** `docs/ARCHITECTURE.md` §5, `docs/MOCKUPS.md` (D4/D5, 04/05), `docs/REQUIREMENTS.md` FR-03…FR-12, FR-27, `docs/SPEC.md` §10.
- **Skill đã dùng:** `brainstorming`.

## 1. Ý định và lý do

Nối tiếp luồng học viên đã dựng (`/login`, `/exams`, `/attempts/[id]`, `/attempts/[id]/result`) bằng các trang giáo viên và admin để có bản click-through đầy đủ 3 vai trò trước khi có auth, Prisma và Server Action. Dữ liệu là mock nhưng DTO phải đúng shape để sau này chỉ thay nguồn.

## 2. Mục tiêu

- Dựng đúng 6 route trong ARCHITECTURE §5:
  - `/teacher/questions`, `/teacher/questions/[questionId]`, `/teacher/exams`, `/teacher/exams/[examId]`, `/teacher/exams/[examId]/results`, `/admin/users`.
- Điều hướng được từ luồng học viên sang teacher/admin bằng một cơ chế demo (không auth thật).
- Khớp mockup D4/D5 desktop và 04/05 mobile cho ngân hàng câu hỏi và tạo đề.
- Trang admin không có Figma; thiết kế bảng quản lý tài khoản từ FR-03/04/05 và ghi rõ là quyết định của thiết kế này.
- Mock cho trạng thái rỗng/lỗi và id không tồn tại; 404 dùng chung cho mọi trường hợp không có quyền.
- Dùng token màu `MOCKUPS.md`, component dùng biến CSS `--color-*`.

## 3. Không làm

- Auth thật, Prisma, DB, Server Action, mutation thật.
- Kiểm tra quyền server-side (K8) – chỉ render mock UI.
- Scoring, timer enforcement, lưu bài thật (K1–K7).
- Deploy.

## 4. Ràng buộc

- Next.js 16.4.6, React 19.3.1, TypeScript 5, ESLint 9, Tailwind 4.
- `typecheck = next typegen && tsc --noEmit`; phải chạy từ clone sạch (`rm -rf .next && npm ci`).
- `npm test`/`test:e2e` chưa có script — ghi "chưa kiểm chứng".
- Mỗi PR dưới 400 dòng (không tính lockfile); tách thành 2 PR: teacher và admin.
- Chữ Việt/Anh, `npm run check:language` sạch.
- Touch target >=44px, radio/checkbox native, trạng thái có chữ/icon, không chỉ màu.
- PR tạo từ `main` mới nhất, không stack vào nhánh đã merge.

## 5. Cách tiếp cận

1. **Tất cả route teacher + admin (chọn)** — đúng ARCHITECTURE §5, đủ 3 vai trò để review; admin tự thiết kế từ FR. Nhược: admin không có Figma đối chiếu.
2. Chỉ trang có mockup — nhỏ hơn nhưng thiếu 3 route teacher và admin mà người dùng yêu cầu.
3. Prototype client đơn trang — nhanh nhưng bỏ route tree, phải làm lại.

## 6. Quyết định thiết kế

- **Role switch demo:** thanh trên có switch "Học viên / Giáo viên / Admin" bằng `router.push` tới route tương ứng, không lưu session, không kiểm tra quyền.
- **Layout:** `(teacher)/layout.tsx` render `TeacherShell` (sidebar trái + top bar); `(admin)/layout.tsx` render `AdminShell`. Student layout giữ nguyên, không sửa.
- **Mock modules:** `features/questions/mocks/questions.ts`, `features/exams/mocks/exams.ts` (mở rộng không phá student), `features/users/mocks/users.ts`. DTO dùng chung ở `features/shared/domain/types.ts`, thêm type mới nhưng không đổi type cũ.
- **Question bank:** bảng + filter search/tag, badge trạng thái, action Sửa/Lưu trữ dạng mock; mobile dạng card như `04`, desktop bảng như `D4`.
- **Question detail:** trang read-only hiện nội dung, đáp án (có đấu chỉ đáp án đúng), tag, điểm; nút "Sửa" dạng mock.
- **Exam list/create:** desktop `D5` form 2 cột + picker câu hỏi; mobile `05`; nhãn giới hạn lấy từ VR-02…VR-09; số câu chọn không vượt số câu trong ngân hàng.
- **Exam detail:** read-only thông tin đề + danh sách câu đã chọn; nút "Sửa đề" mock.
- **Exam results:** bảng lượt làm theo học viên (tên, trạng thái, điểm, thời điểm nộp); empty state khi chưa có lượt (FR-12).
- **Admin users:** bảng tài khoản (họ tên, username, role, trạng thái khóa), action "Khóa/Mở khóa", "Đặt lại mật khẩu", nút "Tạo tài khoản" mở form mock; thiết kế từ FR-03/04/05.
- **404:** id lạ hoặc bản ghi không thuộc vai trò hiện tại → cùng một màn generic "Không tìm thấy trang", không tiết lộ lý do (A-R1 của mentor).
- **State demo:** `?state=empty|error` trên question bank, exam list, users. Giá trị lạ fallback.

## 7. Bản đồ màn hình (text sketch)

```text
/teacher/questions      [Tìm kiếm][Tag] + bảng/card câu hỏi → /teacher/questions/{id}
/teacher/questions/{id}  Nội dung, đáp án, tag, điểm; [Sửa]

/teacher/exams           Danh sách đề + [Tạo đề]
/teacher/exams/{id}      Thông tin đề + câu đã chọn; [Sửa đề]
/teacher/exams/{id}/results  Bảng lượt: học viên, trạng thái, điểm, nộp lúc
/teacher/exams/new       Form + picker câu hỏi (D5/05)

/admin/users             Bảng tài khoản + [Tạo tài khoản], [Khóa], [Đặt lại mật khẩu]
```

## 8. Tiêu chí nghiệm thu

- Click-through từ `/login` sang cả 3 vai trò không lỗi console.
- 6 route render được bằng mock; id lạ cho 404 generic.
- Khớp D4/D5/04/05 về bố cục và token màu.
- `npm ci`, `lint`, `typecheck`, `format:check`, `check:language`, `build` EXIT=0 từ trạng thái sạch.
- Mỗi PR <400 dòng; reviewer độc lập cho từng task.

## 9. Việc còn lại cho builder

- Quyết định component primitives đặt ở `features/shared/components/` hay `src/components/`; phải nhất quán với feature đã có.
- Chia PR: PR1 teacher questions/detail, PR2 teacher exams/results/create, PR3 admin users. Có thể gộp PR1+PR2 nếu tổng <400.
- Không tự thêm auth/server logic.

## 10. Bổ sung sau builder check

Builder check bằng skill `brainstorming` ghi 5 câu hỏi. Bốn câu đã có căn cứ trong tài liệu, mình chốt như sau (builder không cần hỏi lại):

- **Route tạo đề:** giữ đúng 6 route, **không** thêm `/teacher/exams/new`. Form D5/05 render trên `/teacher/exams?mode=create`. Sketch §7 chỉ là mô tả nội dung, không phải route thứ 7.
- **DTO mới:** type cũ của học viên giữ nguyên, không sửa. Type mới (`Question`, `UserAccount`, `ExamDetail`, `ResultRow`) đặt cạnh `features/shared/domain/types.ts`, đặt tên field theo `ERD.md` (`opensAt`/`closesAt`, `SINGLE`/`MULTI`) để sau này thay nguồn không đổi component. Không tạo type song song cho cùng một khái niệm.
- **Phân quyền mock:** không mô phỏng "bản ghi của người khác". Chỉ id lạ → 404 generic dùng chung. Không thêm logic ownership giả (K8 vẫn là việc của server ở mốc sau).
- **Action mock:** "Khóa/Mở khóa", "Lưu trữ" và "Tạo tài khoản" đổi local state trong client child để người dùng thấy kết quả ngay; page vẫn là server component. "Sửa", "Đặt lại mật khẩu" có confirmation/toast, không mutation thật.

Vị trí switch vai trò đã chốt: thêm switch demo vào **shared header** dùng chung (`StudentHeader`, `TeacherShell`, `AdminShell`) để mọi trang đều đổi được vai trò. Chấp nhận chạm vào component học viên; không auth, không lưu session.
