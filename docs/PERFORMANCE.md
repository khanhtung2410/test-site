# HIỆU NĂNG VÀ TRẢI NGHIỆM

> **Trạng thái:** Mục tiêu cho Mốc 1. Chưa đo lần nào.
> **Ngày:** 2026-11-26
> **Quy tắc:** Mọi con số hiệu năng chỉ ghi ở file này. Tài liệu khác và PR chỉ link tới đây, không chép lại.

---

## 1. Mục tiêu

| Mã | Chỉ số | Ngưỡng | Cách đo |
|---|---|---|---|
| PERF-01 | Lighthouse mobile Performance — màn làm bài | ≥ 85 | Lighthouse CI, mobile, production build, median 3 lần |
| PERF-02 | Lighthouse mobile Accessibility — màn làm bài | ≥ 90 | Lighthouse CI + axe, 0 lỗi serious/critical |
| PERF-03 | Cumulative Layout Shift (CLS) — mọi màn chính | ≤ 0,1 | Lighthouse CI |
| PERF-04 | p95 lưu đáp án trên 4G | ≤ 500 ms | Đo trong E2E/APM; ghi rõ môi trường |
| PERF-05 | Cuộn ngang ở 360 px | 0 màn | Playwright viewport 360 × 800 |
| PERF-06 | Làm bài bằng bàn phím | Hoàn thành 100% | E2E chỉ dùng Tab/Enter/Space |

Các ngưỡng này là giả định A-01…A-04 trong [`SPEC.md`](SPEC.md) mục 12; nếu chủ dự án đổi, cập nhật tại đây trước.

---

## 2. Phạm vi đo

Năm màn chính:

1. `/login`
2. `/exams` (danh sách đề của học viên)
3. `/attempts/[attemptId]` (màn làm bài)
4. `/teacher/questions` (ngân hàng câu hỏi)
5. `/teacher/exams` (tạo đề)

Màn làm bài là quan trọng nhất: học viên chủ yếu dùng điện thoại, mạng có thể chậm.

---

## 3. Cách đo

### 3.1. Lighthouse CI

- Chạy trên production build (`next build && next start`), không chạy dev server.
- Cấu hình mobile mặc định của Lighthouse (Moto G Power, 4G throttle).
- Mỗi URL chạy 3 lần, lấy median; lưu artifact JSON, không commit vào repo.
- Assert: Performance ≥ 0,85; Accessibility ≥ 0,90; CLS ≤ 0,10.
- Chạy trong job `lighthouse` của CI sau khi `build` xanh.

Lệnh dự kiến:

```bash
npm run build
npm run start &
npx lhci autorun --collect.url=http://127.0.0.1:3000/login
```

### 3.2. Đo thủ công khi cần điều tra

- Dùng Chrome DevTools, CPU throttle 4x, network Slow 4G.
- Ghi lại: URL, thời điểm, commit, môi trường, ảnh chụp hoặc JSON.
- Không dùng số đo trên máy cá nhân để tuyên bố đạt; chỉ dùng để tìm nguyên nhân.

---

## 4. Ngân sách kỹ thuật

| Hạng mục | Ngân sách | Lý do |
|---|---|---|
| JavaScript của màn làm bài | ≤ 200 KB gzip | Điện thoại phổ thông, mạng trường học |
| Font | ≤ 2 họ, preload font chính | Tránh nhấp nháy và tải nặng |
| Ảnh | Không có ảnh trong MVP | Câu hỏi chỉ text |
| Thư viện UI | 0 thư viện lớn | Tailwind + HTML gốc |
| Request khi đang làm bài | Chỉ request lưu đáp án và đồng bộ giờ | Không polling, không prefetch nội dung đề khác |

Ngân sách là mục tiêu thiết kế, không phải số đo. Khi vượt, ghi lý do và cách xử lý trong PR.

---

## 5. Quy tắc tránh hồi quy

- Màn làm bài không thêm client component lớn nếu không cần.
- Không dùng `useEffect` để tải dữ liệu đã có thể render ở server.
- Đồng hồ dùng một `setInterval` 1 giây, dọn dẹp khi unmount.
- Không render lại toàn bộ danh sách câu khi một đáp án đổi; tách component theo câu.
- Trạng thái lưu đáp án dùng optimistic UI, không chặn thao tác chọn.
- Không đặt `aria-live` trên đồng hồ mỗi giây.
- Không dùng layout shift do ảnh/font; đặt kích thước cố định.

---

## 6. Chính sách lưu báo cáo

- Báo cáo Lighthouse không commit vào repo.
- Chỉ lưu artifact của lần đo mới nhất trong CI; link trong PR.
- Nếu cần baseline, lưu một bộ tối thiểu trong `docs/lighthouse/` dạng `.json.gz` và ghi ngày đo.
- Số trong tài liệu này phải khớp với artifact gần nhất; nếu lệch, sửa tài liệu trước khi merge.

---

## 7. Trạng thái hiện tại

| Hạng mục | Trạng thái |
|---|---|
| Lighthouse CI | Chưa cấu hình |
| Đo màn làm bài | Chưa có |
| Đo 360 px | Chưa có |
| Đo bàn phím | Chưa có |
| p95 lưu đáp án | Chưa có |

Khi có kết quả, thêm bảng "Kết quả đo" bên dưới với ngày, commit, môi trường và median. Không ghi "đạt" nếu chưa có artifact.
