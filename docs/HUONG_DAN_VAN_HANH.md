# HƯỚNG DẪN VẬN HÀNH

> **Trạng thái:** Hướng dẫn dự kiến cho phiên bản MVP. Áp dụng sau khi triển khai production.
> **Dành cho:** chủ trung tâm, admin, giáo viên, học viên.
> **Ngày:** 2026-11-26

Tài liệu này hướng dẫn thao tác hằng ngày. Quy định kỹ thuật và phân quyền nằm ở [`PERMISSIONS.md`](PERMISSIONS.md); câu hỏi về phạm vi ở [`SPEC.md`](SPEC.md).

---

## 1. Đăng nhập

1. Mở địa chỉ website của trung tâm (TBD khi deploy).
2. Nhập tên đăng nhập và mật khẩu do admin cấp.
3. Bấm **Đăng nhập**.

Lưu ý:

- Tài khoản do admin tạo; không có tự đăng ký.
- Sai mật khẩu hoặc tài khoản bị khóa hiện cùng một thông báo chung.
- Quên mật khẩu: liên hệ admin để đặt lại. Không có email tự phục vụ.
- Phiên đăng nhập kéo dài 12 giờ; hết phiên thì đăng nhập lại.

---

## 2. Dành cho admin

### 2.1. Tạo tài khoản

1. Vào **Quản lý người dùng**.
2. Bấm **Tạo tài khoản**.
3. Nhập họ tên, tên đăng nhập, mật khẩu ban đầu, chọn vai trò:
   - **Giáo viên**: soạn câu hỏi, tạo đề, xem kết quả đề của mình.
   - **Học viên**: làm đề đang mở, xem điểm của mình.
   - **Admin**: quản lý tài khoản.
4. Bấm **Lưu**.
5. Gửi tên đăng nhập và mật khẩu cho người dùng qua kênh riêng. Khuyến nghị người dùng đổi mật khẩu sau lần đầu (khi tính năng đổi mật khẩu có).

Quy tắc mật khẩu: tối thiểu 8 ký tự, tối đa 72.

### 2.2. Khóa tài khoản

1. Mở **Quản lý người dùng**, tìm tài khoản.
2. Bấm **Khóa** và xác nhận.
3. Người bị khóa không đăng nhập được; phiên đang mở bị từ chối ở request kế tiếp.

Không thể khóa hoặc hạ vai trò admin đang hoạt động cuối cùng. Hệ thống sẽ báo lỗi để tránh mất quyền quản trị.

### 2.3. Đặt lại mật khẩu

1. Mở tài khoản người dùng.
2. Bấm **Đặt lại mật khẩu**, nhập mật khẩu mới.
3. Gửi mật khẩu mới cho người dùng; phiên cũ của họ bị hủy.

### 2.4. Đổi vai trò

1. Mở tài khoản, chọn vai trò mới.
2. Lưu; phiên cũ bị hủy, người dùng phải đăng nhập lại.

Admin không sửa câu hỏi hay đề. Nếu giáo viên nghỉ việc, bàn giao nội dung theo quy trình của trung tâm hoặc tạo tài khoản mới có quyền phù hợp.

---

## 3. Dành cho giáo viên

### 3.1. Tạo câu hỏi

1. Vào **Ngân hàng câu hỏi** → **Tạo câu hỏi**.
2. Nhập nội dung câu hỏi.
3. Chọn loại:
   - **Một đáp án**: đúng một đáp án đúng.
   - **Nhiều đáp án**: một hoặc nhiều đáp án đúng.
4. Nhập 2–6 đáp án, đánh dấu đáp án đúng.
5. Nhập điểm (số nguyên 1–100).
6. Gắn tag chủ đề (tối đa 5) để lọc sau này.
7. Bấm **Lưu**.

Lưu ý:

- Câu nhiều đáp án: học viên phải chọn **đúng tất cả** đáp án mới có điểm; chọn thiếu, thừa hoặc sai đều 0 điểm. Không trừ điểm.
- Không hỗ trợ câu có hình ảnh hoặc công thức trong MVP.

### 3.2. Sửa hoặc lưu trữ câu hỏi

- **Sửa**: mở câu hỏi, đổi nội dung/đáp án/điểm, lưu. Các lượt đã bắt đầu hoặc đã nộp giữ nguyên bản cũ; điểm cũ không đổi.
- **Lưu trữ**: câu biến mất khỏi ngân hàng và không thêm được vào đề mới. Đề đã tạo vẫn dùng được. Không có xóa cứng.

### 3.3. Tạo đề

1. Vào **Đề thi** → **Tạo đề**.
2. Nhập tiêu đề.
3. Chọn thời gian làm bài (phút) và số lượt tối đa.
4. Chọn khung giờ mở/đóng. Giờ đóng phải sau giờ mở.
5. Chọn câu hỏi từ ngân hàng. Chỉ thấy câu của mình; câu đã lưu trữ không hiện.
6. Kiểm tra tổng số câu và tổng điểm.
7. Bấm **Lưu đề**.

Lưu ý:

- Học viên chỉ bắt đầu được trong khung giờ mở/đóng. Đã bắt đầu trước giờ đóng thì vẫn có đủ thời lượng.
- Sửa đề không làm đổi các lượt đã bắt đầu.
- Không có xóa đề trong MVP; muốn đóng thì đặt giờ đóng đã qua.

### 3.4. Xem kết quả

1. Vào **Đề thi**, mở đề, chọn **Kết quả**.
2. Xem từng học viên: trạng thái (`Đã nộp` / `Hết giờ` / `Đang làm`), điểm, thời điểm nộp.
3. Đề chưa có lượt hiện trạng thái rỗng.

Không có chấm lại. Nếu phát hiện câu hỏi sai, sửa câu hỏi cho các đề sau; điểm đã nộp giữ nguyên. Muốn xử lý ngoại lệ, ghi nhận thủ công theo quy trình của trung tâm.

---

## 4. Dành cho học viên

### 4.1. Làm bài

1. Đăng nhập, xem **Đề đang mở**.
2. Chọn đề, đọc thời lượng, số lượt còn lại và luật chấm.
3. Bấm **Làm bài** (hoặc **Làm tiếp** nếu có lượt dở).
4. Chọn đáp án. Mỗi lần chọn được lưu ngay; biểu tượng **Đã lưu** xác nhận.
5. Dùng **Câu trước** / **Câu sau** để chuyển câu.
6. Bấm **Nộp bài** khi xong; xác nhận nếu còn câu chưa trả lời.
7. Điểm hiện ngay sau khi nộp.

### 4.2. Khi mất mạng

- Giao diện hiện **Mất mạng — câu X chưa lưu**.
- Đáp án đã chọn được giữ tạm trong IndexedDB theo `attemptId`, cùng vị trí câu hiện tại (`currentQuestionIndex`) (D-21).
- Khi có mạng lại, hệ thống tự gửi hàng đợi; nếu tải lại trang khi vẫn offline, đáp án và câu đang xem được khôi phục từ IndexedDB.
- Không xóa dữ liệu site trong trình duyệt khi đang có cảnh báo chưa lưu.

### 4.3. Khi hết giờ

- Đồng hồ do server quyết định; đổi giờ máy không kéo dài thời gian.
- Hết giờ, bài tự chuyển **Hết giờ** và chỉ chấm các đáp án đã lưu trước hạn.
- Đáp án gửi sau hạn bị từ chối.

### 4.4. Xem điểm

- Vào đề đã làm, chọn **Xem kết quả**.
- Chỉ xem được lượt của mình.
- Đáp án đúng chỉ hiện nếu đề cho phép và đề đã đóng (tính năng Should).

---

## 5. Xử lý sự cố

| Tình huống | Cách xử lý |
|---|---|
| Không đăng nhập được | Kiểm tra tên đăng nhập; liên hệ admin kiểm tra khóa/mật khẩu |
| Không thấy đề | Đề chưa mở, đã đóng, hết lượt hoặc chưa được giao |
| Không bấm được Làm bài | Đang có lượt dở → bấm **Làm tiếp**; hoặc đã hết lượt |
| Câu trả lời không lưu | Kiểm tra mạng; chờ biểu tượng **Đã lưu**; tải lại trang |
| Nộp bài báo lỗi | Có thể lượt đã hết hạn hoặc đã nộp ở tab khác; mở lại kết quả để xem điểm |
| Điểm bất thường | Kiểm tra luật chấm (đúng hết mới có điểm); liên hệ giáo viên, không tự sửa dữ liệu |
| Tài khoản bị khóa | Liên hệ admin |

---

## 6. Lưu ý an toàn

- Không chia sẻ mật khẩu; mỗi người một tài khoản.
- Không dùng tài khoản demo trên production cho việc thật.
- Không gửi đáp án đúng cho học viên trong lúc đề còn mở.
- Khi kiểm tra production, dọn dữ liệu thử ngay sau đó.
- Báo lỗ hổng theo [`SECURITY.md`](SECURITY.md), không đăng công khai.
