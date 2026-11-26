# Mockup ứng dụng Trắc nghiệm (Figma Design)

**File Figma:** https://www.figma.com/design/WAj9m3ZxAJY8AewIoUc535/Exam-App---Mobile-Mockup?node-id=0-1

Tài liệu này mô tả các mockup được dựng theo `docs/SPEC.md` mục 10 (wireframe mobile-first), mở rộng sang desktop, kèm trạng thái lỗi/empty và màn hình đăng nhập.

## Phạm vi

Tổng 22 frame trên page `Exam App · Mobile`:

| Nhóm | Frame | Kích thước |
|---|---|---|
| Mobile (dựng qua Figma MCP) | `01 · Danh sách đề`, `02 · Làm bài`, `03 · Kết quả`, `04 · Ngân hàng câu hỏi`, `05 · Tạo đề` | 360×800 |
| Overlay mobile | `02b · Danh sách câu`, `02c · Xác nhận nộp bài` | 360×800 |
| Desktop học viên | `D1 · Danh sách đề`, `D2 · Làm bài + danh sách câu`, `D3 · Kết quả`, `D6 · Kết quả chưa công bố` | 1440×900 |
| Desktop giáo viên | `D4 · Ngân hàng câu hỏi`, `D5 · Tạo đề` | 1440×900 |
| Đăng nhập | `L1 · Đăng nhập (desktop)`, `L2 · Đăng nhập (mobile)` | 1440×900 / 360×800 |
| Trạng thái/phụ | `S1`–`S7` | 360×800 |

## Hành vi chính

- **Điều hướng nhanh giữa các câu:** trên mobile mở bottom sheet từ nút lưới trên thanh làm bài; trên desktop là sidebar phải luôn hiển thị. Grid 30 nút 44×44, 4 trạng thái: đã trả lời (xanh đặc), đang xem (viền xanh + nền xanh nhạt), chưa trả lời (xám), đánh dấu (chấm cam).
- **Nộp bài:** nút Nộp bài mở dialog xác nhận, cảnh báo "Còn 2 câu chưa trả lời (Câu 7 và Câu 12)" với hai lựa chọn "Làm tiếp" / "Nộp bài". Theo SPEC, confirmation chỉ bắt buộc khi còn câu trống.
- **Kết quả chưa công bố:** `D6` / `S7` — học viên đã nộp nhưng đề chưa đóng, nên chưa xem được điểm. Hiện trạng thái "Đã nộp · Chờ công bố" và thời gian công bố (17:00, 26/11/2026).
- **Trạng thái còn lại:** danh sách đề trống, ngân hàng trống, lỗi tải + Thử lại, mất mạng (SPEC §10.2: "Mất mạng — câu 3 chưa lưu. Đáp án đã chọn vẫn được giữ."), hết giờ tự nộp, 403 không có quyền.

## Design tokens

| Nhóm | Giá trị |
|---|---|
| Primary / hover / soft | `#2563EB` / `#1D4ED8` / `#EFF6FF` |
| Background / surface / border | `#F8FAFC` / `#FFFFFF` / `#E2E8F0` |
| Foreground / muted | `#0F172A` / `#475569` |
| Success / danger / warning (+ soft) | `#047857` / `#B91C1C` / `#B45309` |
| Accent | `#EA580C` |
| Heading | Lexend (Display 44/56, H1 24/32, H2 18/26, H3 16/24) |
| Body | Source Sans 3 (14/22, 13/20, 12/18, 11/16) |
| Elevation | `Exam/Card Shadow` — shadow 2 lớp cho card |

17 paint styles, 14 text styles và 1 effect style được tạo trong file. Do chế độ `documentAccess: dynamic-page` của plugin, các node dùng **giá trị thuộc tính trực tiếp** (`fills`, `strokes`, `fontName`, `effects`) thay vì liên kết style; style vẫn có sẵn trong file để dùng lại.

## Khả năng tiếp cận (theo SPEC §10)

- Vùng bấm tối thiểu 44×44 px; radio/checkbox giữ ngữ nghĩa gốc.
- Không cuộn ngang ở 360 px; thao tác bằng bàn phím đầy đủ.
- Đồng hồ dùng `aria-live="polite"`, chỉ đọc khi còn 5 phút và 1 phút.
- Trạng thái "Đã lưu"/"Chưa lưu" có cả màu và chữ, không chỉ dựa vào màu.

## Tái tạo mockup

Các frame desktop/login/states được dựng bằng Figma plugin local (không tốn quota MCP):

1. Mở file Figma trong **Figma desktop app**.
2. `Plugins → Development → Import plugin from manifest…` → chọn `figma-plugin/manifest.json`.
3. `Plugins → Development → Exam Mockup Builder`.

Plugin tự xóa các frame do nó tạo ở lần trước rồi dựng lại; không đụng 7 frame mobile gốc. Chi tiết trong `figma-plugin/README.md`.

**Lưu ý:** tài khoản Figma Starter có hạn mức 20 lượt gọi MCP/tháng nên đã hết quota trong phiên làm việc; `figma-unlimited-mcp` chỉ hỗ trợ FigJam (`editorType: ["figjam"]`), không thay thế được việc dựng frame Design.
