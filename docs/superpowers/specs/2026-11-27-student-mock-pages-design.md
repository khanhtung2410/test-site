# Thiết kế: trang học viên với dữ liệu giả

- **Trạng thái:** bản thiết kế chờ duyệt.
- **Ngày:** 2026-11-27
- **Nguồn:** `docs/SPEC.md` mục 10 (wireframe), `docs/MOCKUPS.md` (22 frame), `docs/ARCHITECTURE.md` mục 5 (route tree), `docs/REQUIREMENTS.md` (FR-01, FR-14…FR-23).
- **Skill đã dùng:** `brainstorming`.

## 1. Ý định và lý do

Dựng các trang Next.js thật cho **luồng học viên** để có bản click-through đối chiếu wireframe trước khi có auth, Prisma và Server Action. Dữ liệu là mock, nhưng DTO phải đúng shape để giai đoạn sau chỉ thay nguồn dữ liệu, không đổi component.

Đây là bước đầu của Mốc 2 theo `ARCHITECTURE.md`, không phải sản phẩm hoàn chỉnh. Không triển khai K1–K8 ở mức server trong đợt này.

## 2. Mục tiêu

- Các route học viên chạy được bằng `npm run dev`, điều hướng được giữa các màn.
- Giao diện khớp SPEC §10 và các frame mobile/desktop trong MOCKUPS: danh sách đề, làm bài, danh sách câu, xác nhận nộp, kết quả, đăng nhập.
- Có mock cho trạng thái rỗng/lỗi/mất mạng/hết giờ để review giao diện.
- Dùng token màu đã chốt trong `MOCKUPS.md`, không phát minh màu mới.
- Mọi dữ liệu giả nằm trong `src/features/*/mocks/`, không hard-code trong component.

## 3. Không làm / phản mục tiêu

- Không auth thật, không Prisma, không DB, không Server Action mutation.
- Không tính điểm, không enforcing thời gian/phân quyền (K1–K8 chỉ là mock UI).
- Không làm luồng giáo viên/admin; không làm role switcher (scope đã chốt chỉ học viên).
- Không dùng `localStorage`/IndexedDB thật cho hàng đợi offline; chỉ render mock state.
- Không deploy.

## 4. Ràng buộc

- Next.js 16.4.6 App Router, React 19, Tailwind 4, TypeScript strict.
- Tuân thủ route tree trong ARCHITECTURE §5.
- Mỗi PR dưới 400 dòng (không tính lockfile); tách PR nếu vượt.
- TDD bắt buộc khi chạm K2–K7 — đợt này không chạm logic đó, nên không có commit test đỏ.
- `npm run lint`, `typecheck`, `format:check`, `check:language`, `build` phải EXIT=0 trước khi merge.

## 5. Cách tiếp cận

Đã cân nhắc 3 cách (xem hội thoại brainstorming):

1. **Route shells + mock module (chọn)** — tạo route thật theo ARCHITECTURE, component tách theo feature, dữ liệu giả có type. Ưu điểm: đúng cấu trúc, thay server sau dễ; nhược: nhiều file hơn, cần tách PR.
2. **Prototype client đơn trang** — nhanh nhưng bỏ route tree, phải làm lại. Loại.
3. **Tất cả vai trò cùng lúc** — người dùng đã chọn chỉ luồng học viên. Loại theo yêu cầu.

## 6. Quyết định thiết kế (call của người viết)

- Route map:
  - `/login` → `/exams`
  - `/exams` → `/attempts/[attemptId]` (nút "Làm bài") hoặc `/attempts/[attemptId]/result` (nút "Xem kết quả")
  - `/attempts/[attemptId]` → `/attempts/[attemptId]/result` (nộp bài)
  - `/attempts/[attemptId]/result` → `/exams`
- File mock: `features/auth/mocks/session.ts`, `features/exams/mocks/exams.ts`, `features/attempts/mocks/attempts.ts`, `features/shared/domain/types.ts`.
- Demo state qua query param: `?state=empty|error` trên `/exams`, `?state=offline|expired` trên attempt, `?state=locked` trên result. Không tạo route riêng cho từng state.
- Layout dùng route groups `(auth)` và `(student)` theo ARCHITECTURE; student shell có header/trái, attempt có sidebar desktop và sheet mobile.
- Question navigator: component dùng chung,mobile render bottom sheet, desktop render sidebar; 4 trạng thái như MOCKUPS.
- Submit confirmation: dialog dùng chung cho mobile/desktop.
- Token màu: khai báo biến CSS trong `globals.css` theo palette, component chỉ dùng biến/`@apply`.

## 7. Bản đồ màn hình (text sketch)

```text
/login        [Email][Mật khẩu][Ghi nhớ][Quên mật khẩu][Đăng nhập]

/exams        Xin chào, An
              [Đề đang mở]  card x2  -> Làm bài
              [Đã kết thúc] card x2  -> Xem kết quả
              ?state=empty -> "Chưa có đề nào"; ?state=error -> "Không tải được dữ liệu"

/attempts/[id]     Câu 3/30    00:42:13    [icon lưới]  Đã lưu
                   Câu hỏi + 4 đáp án (radio)
                   [Câu trước][Câu sau][Nộp bài]
                   mobile: sheet 30 số + legend; desktop: sidebar phải
                   ?state=offline -> banner; ?state=expired -> dialog hết giờ

/attempts/[id]/result   8/10, Đã nộp, stats 8-2-38:12, bảng chi tiết
                        ?state=locked -> điểm có ngay, đáp án chờ mở
```

## 8. Tiêu chí nghiệm thu

- Chạy `npm run dev`, click-through hết luồng học viên không lỗi console.
- 360px: không cuộn ngang; 1440px: sidebar attempt hiển thị đúng.
- Các nút có vùng bấm >=44px; radio/checkbox giữ ngữ nghĩa; trạng thái có chữ/icon, không chỉ màu.
- `npm run lint/typecheck/format:check/check:language/build` EXIT=0.
- Diff PR dưới 400 dòng mỗi phần.

## 9. Việc còn lại cho builder

- Chọn chia PR cụ thể (gợi ý: PR1 auth + exams + shell; PR2 attempt + navigator + dialog; PR3 result + states).
- Quyết định component primitives đặt ở `src/components/` hay `features/shared/components/`; người viết để builder tự chọn nhưng phải nhất quán.
- Không tự ý thêm auth thật hoặc server action.

## 10. Bổ sung sau builder check

Các quyết định dưới đây là của người viết thiết kế, builder không cần hỏi lại:

- **Layout:** không dùng student layout có header cố định cho mọi trang. Mỗi page render header component riêng: `StudentHeader` cho `/exams` và result, `AttemptHeader` cho attempt. Route group vẫn giữ theo ARCHITECTURE §5.
- **Link chưa có route:** "Kết quả", "Xem tất cả", "Xem lại bài làm" trỏ tới `/exams` hoặc `/attempts/[attemptId]/result` khi có `attemptId`; nếu không có thì render dạng nút không hoạt động. Không tạo route mới.
- **Timer:** component đếm ngược thật phía client, chỉ hiển thị, không enforce; thêm `?state=near` để demo mốc 5 phút/1 phút. Đồng hồ dùng `aria-live="off"`; một `role="status"` riêng chỉ đổi nội dung khi vượt mốc 300 giây và 60 giây.
- **Offline:** khi `?state=offline`, chọn đáp án đổi indicator từ "Đã lưu" sang "Chưa lưu"; quay lại online đổi ngược. Không lưu IndexedDB thật.
- **Câu hỏi:** mock gồm 1 câu nhiều đáp án để component hỗ trợ cả radio lẫn checkbox. Nơi hiển thị luật chấm chờ quyết định ở mục 11.
- **Font:** chỉ dùng fallback stack trong CSS (`system-ui`, `Segoe UI`, sans-serif), không `next/font/google`; chấp nhận khác biệt nhỏ so với Lexend/Source Sans 3 trong mockup.
- **Entry point:** `/` redirect tới `/login`.

DTO tối thiểu các mock phải export (đặt trong `src/features/shared/domain/types.ts`, mock import từ đây):

```ts
User { id: string; name: string; role: 'STUDENT' }
Exam { id: string; title: string; durationMinutes: number; questionCount: number; maxScore: number; maxAttempts: number; attemptsUsed: number; openAt: string; closeAt: string; status: 'open' | 'closed' }
Attempt { id: string; examId: string; status: 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED'; expiresAt: string; serverNow: string; currentQuestionIndex: number; answers: Record<string, string[]>; savedAt: Record<string, string> }
AttemptQuestion { id: string; index: number; type: 'single' | 'multiple'; prompt: string; points: number; options: { id: string; label: string }[] }
Result { attemptId: string; score: number; maxScore: number; submittedAt: string; breakdown: { questionId: string; chosen: string[]; correct: boolean; awarded: number }[]; canReviewAnswers: boolean }
```

## 11. Quyết định đã chốt với người dùng

1. **Luật chấm:** hiện ngay trên card đề trước nút "Làm bài" (không thêm dialog/route mới). Chấp nhận lệch nhẹ so với D1.
2. **Dữ liệu kết quả:** giữ đề 30 câu / 10 điểm; `8 đúng`, `2 sai` là số câu được chấm, bảng D3 chỉ hiển thị 5 dòng mẫu khớp wireframe. Không đổi đề thành 10 câu.

## 12. Bổ sung sau review cuối (2026-11-27)

- **Đích nút "Xem kết quả":** `e-1`, `e-2`, `e-3` đều có attempt/kết quả mẫu trong mock; `getMockAttempt` và `getMockResult` nhận cả id đề lẫn id attempt cho các đề này. `e-4` (đóng, chưa làm) hiển thị nút "Xem kết quả" ở trạng thái `disabled`, không điều hướng, đúng wireframe SPEC §10.1.
- **Dialog:** `SubmitDialog` và dialog hết giờ dùng chung `ModalDialog`: focus phần tử điều khiển đầu tiên khi mở, giữ Tab/Shift+Tab trong dialog, Escape đóng dialog xác nhận nộp và khôi phục focus về nút đã mở. Dialog hết giờ có `aria-describedby` tới đoạn giải thích.
- **Navigator:** ô đang làm dùng nền xanh nhạt + viền xanh; ô đã trả lời dùng nền xanh đặc; chú giải có ô màu và ký hiệu tương ứng, khớp MOCKUPS §Hành vi chính.
- **Banner offline:** giữ đáp án đã chọn, thông báo "Thay đổi tiếp theo sẽ chưa được lưu" để không mâu thuẫn với badge "Đã lưu" lúc vào trang.
- **Heading:** tiêu đề card đề là `<h3>` vì nằm trong section có `<h2>`; không đổi cấu trúc trang.
