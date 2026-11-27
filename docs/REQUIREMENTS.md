# ĐẶC TẢ YÊU CẦU — SITE THI TRẮC NGHIỆM ONLINE

> **Trạng thái:** Bản nháp Mốc 1, chờ mentor duyệt.
> **Ngày:** 2026-11-26
> **Nguồn:** nội dung đã trích trong tài liệu này từ SRS v0.1 và brief; file gốc không nằm trong repo nên không kiểm chứng được đối chiếu trực tiếp.
> **Quyết định sản phẩm:** xem [`SPEC.md`](SPEC.md) mục 3. Tài liệu này chỉ liệt kê yêu cầu và tiêu chí nghiệm thu, không lặp lại lý do quyết định.

## Quy ước

- **Must** là bắt buộc cho MVP. **Should** chỉ làm sau khi toàn bộ Must đạt tiêu chí nghiệm thu. **Out** là không làm.
- Mã FR/NFR được trích trong file này; vì bản SRS gốc không nằm trong repo, không khẳng định đối chiếu được mã với bản gốc.
- "404" nghĩa là trả trang không tìm thấy, không tiết lộ bản ghi có tồn tại hay không.
- "Chưa đăng nhập" khác "không có quyền": chưa đăng nhập thì chuyển về trang đăng nhập; đã đăng nhập nhưng không có quyền thì 404.
- Thời gian lưu UTC, hiển thị `Asia/Ho_Chi_Minh`.

## Vai trò

| Vai trò | Mô tả |
|---|---|
| Admin | Tạo tài khoản, gán vai trò, khóa tài khoản, đặt lại mật khẩu. Không sửa nội dung thi. |
| Giáo viên | Tạo và quản lý câu hỏi, đề của mình; xem kết quả đề của mình. |
| Học viên | Làm đề đang mở, xem điểm và lượt làm của mình. |

---

## 1. Yêu cầu chức năng

### 1.1. Tài khoản và truy cập

| ID | Mô tả | Input | Output | Trước | Sau | Tiêu chí nghiệm thu |
|---|---|---|---|---|---|---|
| FR-01 | Đăng nhập. | Tên đăng nhập, mật khẩu | Phiên đăng nhập | Tài khoản tồn tại và không bị khóa | Phiên được thiết lập | Thông tin đúng mở trang chủ theo vai trò. Sai thông tin hoặc tài khoản bị khóa trả cùng một lỗi chung, không phân biệt. |
| FR-02 | Đăng xuất. | Thao tác đăng xuất | Phiên kết thúc | Đã đăng nhập | Phiên bị hủy | Sau đăng xuất, trang bảo vệ chuyển về đăng nhập. |
| FR-03 | Admin tạo tài khoản và gán vai trò. | Họ tên, tên đăng nhập, mật khẩu ban đầu, vai trò | Tài khoản mới | Admin đã đăng nhập | Tài khoản được lưu | Tài khoản mới đăng nhập được đúng vai trò. Tên đăng nhập trùng bị từ chối. Vai trò không hợp lệ bị từ chối. |
| FR-04 | Admin khóa tài khoản. | ID người dùng | Tài khoản bị khóa | Admin đã đăng nhập; tài khoản tồn tại | Người bị khóa không đăng nhập hoặc thao tác được | Đăng nhập của người bị khóa thất bại. Phiên đang có bị từ chối ở request kế tiếp. |
| FR-05 | Phân quyền server-side trên mọi action và route (K8). | Mọi request | Được phép hoặc 404 | Không | Không có dữ liệu bị đổi khi bị từ chối | Học viên chỉ thấy đề mở cho mình và chỉ xem lượt của mình. Giáo viên chỉ sửa câu/đề do mình tạo. Truy cập bản ghi không có quyền trả 404. Gọi thẳng Server Action bằng tài khoản sai quyền bị từ chối (test tự động, bỏ qua UI). |

### 1.2. Ngân hàng câu hỏi và đề (giáo viên)

| ID | Mô tả | Input | Output | Trước | Sau | Tiêu chí nghiệm thu |
|---|---|---|---|---|---|---|
| FR-06 | Tạo câu hỏi. | Nội dung, loại (một/nhiều đáp án), 2–6 đáp án, đáp án đúng, điểm, tag chủ đề | Câu hỏi mới | Giáo viên đã đăng nhập | Câu hỏi được lưu | Câu một đáp án phải có đúng một đáp án đúng. Câu nhiều đáp án phải có ít nhất một. Dưới 2 đáp án hoặc nội dung rỗng bị từ chối kèm lỗi từng trường. |
| FR-07 | Liệt kê và lọc câu hỏi theo tag. | Tag tùy chọn | Danh sách câu hỏi | Giáo viên đã đăng nhập | Không | Chỉ câu của giáo viên được liệt kê. Lọc trả đúng câu mang tag. Câu đã lưu trữ không hiện. |
| FR-08 | Sửa câu hỏi. | ID câu hỏi, các trường thay đổi | Câu hỏi đã sửa | Giáo viên sở hữu câu hỏi | Thay đổi được lưu; lượt làm hiện có không đổi | Sau khi đổi đáp án đúng, điểm của bài đã nộp và nội dung lượt đang làm giữ nguyên (K5). |
| FR-09 | Lưu trữ câu hỏi. | ID câu hỏi | Câu hỏi bị lưu trữ | Giáo viên sở hữu câu hỏi | Câu biến mất khỏi ngân hàng; đề đã tạo và lượt làm giữ nguyên | Câu đã lưu trữ không thêm được vào đề mới. Đề cũ vẫn mở và chấm được. Không xóa cứng dữ liệu lượt làm. |
| FR-10 | Tạo đề. | Tiêu đề, câu hỏi được chọn, thời gian (phút), số lượt tối đa, khung giờ mở/đóng | Đề mới | Giáo viên đã đăng nhập; có câu hỏi được chọn | Đề được lưu | Thời gian và số lượt là số nguyên dương. Giờ đóng sau giờ mở. Đề không có câu hỏi bị từ chối. Số câu chọn không vượt số câu đang có trong ngân hàng của giáo viên; vượt bị từ chối kèm lỗi. |
| FR-11 | Sửa đề. | ID đề, các trường thay đổi | Đề đã sửa | Giáo viên sở hữu đề | Thay đổi được lưu | Sửa đề không làm đổi lượt đã bắt đầu. Đề của giáo viên khác trả 404. |
| FR-12 | Xem kết quả theo đề. | ID đề | Danh sách lượt theo học viên, trạng thái, điểm | Giáo viên sở hữu đề | Không | Mỗi lượt hiện học viên, trạng thái, điểm, thời điểm nộp. Đề chưa có lượt hiện trạng thái rỗng. |
| FR-13 | Hiển thị luật chấm trước khi bắt đầu. | ID đề | Thời lượng, số lượt, luật chấm | Học viên thấy được đề | Không | Luật K7 được hiển thị trước nút Bắt đầu. |

### 1.3. Làm bài (học viên)

| ID | Mô tả | Input | Output | Trước | Sau | Tiêu chí nghiệm thu |
|---|---|---|---|---|---|---|
| FR-14 | Liệt kê đề đang mở. | Request | Đề đang mở, số lượt đã dùng và còn lại | Học viên đã đăng nhập | Không | Chỉ đề trong khung giờ và dành cho học viên được liệt kê. Đề đã đóng hoặc chưa mở không hiện. |
| FR-15 | Bắt đầu lượt làm (K2, K3, K5, K6). | ID đề | Lượt mới ở `IN_PROGRESS` | Đề đang mở; số lượt đã dùng dưới tối đa | Lượt lưu snapshot, seed xáo thứ tự, `expiresAt` do server đặt | Hai request Bắt đầu đồng thời (test DB thật với `Promise.all`) không vượt số lượt tối đa. Hai lượt của cùng đề có thứ tự khác nhau. Nếu đang có lượt dở, trả về lượt đó thay vì tạo mới. |
| FR-16 | Hiển thị lượt làm không có đáp án đúng (K1, K6). | ID lượt | Câu hỏi và đáp án theo thứ tự đã lưu; thời gian còn lại | Lượt `IN_PROGRESS`; thuộc học viên | Không | Trong lúc làm, đáp án đúng không có trong HTML, RSC payload hoặc bất kỳ response mạng nào (E2E quét). Thứ tự không đổi sau khi tải lại. |
| FR-17 | Lưu đáp án (K2, K4). | ID lượt, ID câu, (các) ID đáp án đã chọn | Xác nhận đã lưu | Lượt `IN_PROGRESS` và trước hạn | Đáp án được lưu ở server | Lưu sau hạn bị từ chối, kể cả khi đổi giờ máy hoặc gửi request giả (test fake timer). Chọn lại ghi đè đáp án cũ. |
| FR-18 | Làm tiếp lượt dở (K4). | ID lượt | Đáp án đã lưu và thời gian còn lại đúng | Lượt `IN_PROGRESS` | Không | Sau khi tải lại hoặc đóng/mở tab, đáp án đã chọn và thời gian do server tính được khôi phục. |
| FR-19 | Báo câu chưa lưu khi mất mạng (K4). | Mất kết nối | Chỉ báo từng câu chưa lưu | Lượt `IN_PROGRESS` | Đáp án được giữ và lưu lại khi có mạng | Khi offline, UI đánh dấu câu chưa lưu. Sau khi có mạng và tải lại, đáp án đã chọn vẫn còn (E2E `setOffline`). |
| FR-20 | Nộp bài (K3). | ID lượt | Điểm cuối | Lượt `IN_PROGRESS` | `SUBMITTED`; chấm đúng một lần | Nộp lặp hoặc nộp ở hai tab cùng lúc (`Promise.all`) chỉ tạo một bản ghi điểm. Nộp trên lượt `SUBMITTED`/`EXPIRED` không tạo điểm mới. |
| FR-21 | Hết hạn lượt làm (K2, K3). | Thời gian server | Lượt `EXPIRED` | Lượt `IN_PROGRESS` quá `expiresAt` | Chỉ đáp án lưu trước hạn được chấm | Lượt quá hạn chuyển `EXPIRED` ở lần truy cập kế tiếp và được chấm theo đáp án đã lưu. Chỉ có chuyển `IN_PROGRESS` → `SUBMITTED` hoặc `EXPIRED`. |
| FR-22 | Chấm điểm lượt làm (K5, K7). | Snapshot và đáp án đã lưu | Điểm | Lượt đã nộp hoặc hết hạn | Điểm được lưu trên lượt | Chấm là hàm thuần dùng snapshot, không bị ảnh hưởng bởi sửa câu hỏi sau đó. Unit test bảng phủ: không chọn, đúng hết, thiếu đáp án đúng, thừa đáp án sai, sai hết. Luật nhiều đáp án: đúng hết mới có điểm, không trừ điểm. |
| FR-23 | Xem điểm sau khi nộp. | ID lượt | Điểm và trạng thái | Lượt `SUBMITTED` hoặc `EXPIRED`; thuộc học viên | Không | Điểm hiện ngay sau khi nộp. Học viên không xem được lượt của người khác (404). |

### 1.4. Should-have

| ID | Mô tả | Input | Output | Trước | Sau | Tiêu chí nghiệm thu |
|---|---|---|---|---|---|---|
| FR-24 | (Should) Import câu hỏi từ CSV. | Tệp CSV | Câu hỏi được tạo và báo lỗi | Giáo viên đã đăng nhập | Dòng hợp lệ được lưu | Dòng hợp lệ tạo câu hỏi. Dòng lỗi được báo kèm số dòng và không lưu. Định dạng cột: chốt trước khi làm. |
| FR-25 | (Should) Thống kê từng câu. | ID đề | Tỉ lệ trả lời đúng; đáp án sai bị chọn nhiều nhất | Giáo viên sở hữu đề; có lượt | Không | Số liệu khớp với các lượt đã chấm, tính từ snapshot. |
| FR-26 | (Should) Xem lại bài kèm đáp án đúng từ snapshot `AttemptOption.isCorrect`. | ID lượt | Bài làm kèm đáp án đúng | Đề cho phép xem lại, đã đóng và bật `allowReview`; lượt thuộc học viên | Không | Đáp án đúng chỉ hiện sau khi đề đóng và chỉ khi đề bật `allowReview`; không đọc từ câu hỏi hiện tại đã sửa. |
| FR-27 | (Should) Gán lớp. | ID học viên, lớp, đề | Thành viên lớp; đề giới hạn theo lớp | Admin hoặc giáo viên đã đăng nhập | Được lưu | Đề giới hạn theo lớp chỉ hiện với thành viên lớp đó. Ai được giới hạn đề: chốt trước khi làm. |

---

## 2. Yêu cầu phi chức năng

Các ràng buộc C-01…C-05 của SRS áp dụng cho toàn bộ yêu cầu dưới đây.

| ID | Nhóm | Mô tả | Mục tiêu đo được |
|---|---|---|---|
| NFR-01 | Bảo mật | Đáp án đúng không bao giờ đến trình duyệt trong lúc làm bài. | 0 lần xuất hiện trong HTML, RSC payload hoặc response mạng, kiểm bằng E2E. |
| NFR-02 | Bảo mật | Giới hạn thời gian chỉ do server quyết định. | 100% lần lưu sau hạn bị từ chối, kiểm bằng fake timer. |
| NFR-03 | Bảo mật | Mọi Server Action và route kiểm tra quyền. | 100% action từ chối người gọi sai vai trò, kiểm bằng test gọi thẳng. |
| NFR-04 | Độ tin cậy | Nộp và bắt đầu đồng thời an toàn. | 1 điểm cho mỗi lượt; số lượt không vượt tối đa, kiểm bằng test song song trên DB thật. |
| NFR-05 | Độ tin cậy | Không mất đáp án khi tải lại, đóng tab hoặc mất mạng. | Mọi đáp án đã chọn trước khi gián đoạn còn sau khi khôi phục. |
| NFR-06 | Toàn vẹn dữ liệu | Điểm đã nộp bất biến với sửa/xóa câu hỏi. | 0 thay đổi điểm sau khi sửa hoặc xóa câu hỏi. |
| NFR-07 | Hiệu năng | Màn làm bài chạy tốt trên mobile. | Xem [`PERFORMANCE.md`](PERFORMANCE.md) PERF-01. |
| NFR-08 | Khả năng truy cập | Làm bài hoàn toàn bằng bàn phím. | Xem [`PERFORMANCE.md`](PERFORMANCE.md) PERF-06; E2E hoàn thành bài bằng bàn phím. |
| NFR-09 | Khả dụng | Bố cục dùng được trên điện thoại nhỏ. | Xem [`PERFORMANCE.md`](PERFORMANCE.md) PERF-05 cho năm màn chính. |
| NFR-10 | Hiệu năng | Lưu đáp án phản hồi nhanh. | Xem [`PERFORMANCE.md`](PERFORMANCE.md) PERF-04 (giả định A-02, cần xác nhận). |
| NFR-11 | Khả năng kiểm thử | Hành vi bắt buộc có test tự động. | Unit test bảng cho chấm điểm; E2E cho luồng thường, tải lại, offline, hết giờ; tất cả pass trong CI trước merge. |
| NFR-12 | Dung lượng | Chịu được số học viên làm bài đồng thời. | Xem [`SPEC.md`](SPEC.md) mục 12, giả định A-01 (cần xác nhận). |
| NFR-13 | Sẵn sàng | Uptime trong khung giờ thi. | Xem [`SPEC.md`](SPEC.md) mục 12, giả định A-03 (cần xác nhận). |

---

## 3. Giao diện ngoài

### 3.1. Giao diện người dùng

Mobile-first, responsive. Năm màn chính: danh sách đề, làm bài, kết quả, ngân hàng câu hỏi, tạo đề. Màn bổ sung: đăng nhập, quản lý tài khoản admin, kết quả theo đề của giáo viên. Tài nguyên không tồn tại hoặc truy cập không có quyền hiện trang 404.

Wireframe bản trình duyệt, chờ mentor duyệt, nằm ở [`SPEC.md`](SPEC.md) mục 10.

### 3.2. Giao diện phần cứng

Không có.

### 3.3. Giao diện phần mềm

PostgreSQL truy cập qua Prisma. Pipeline GitHub Actions cho CI và deploy. Không có backend REST riêng; đọc bằng Server Components, ghi bằng Server Actions.

### 3.4. Giao diện truyền thông

HTTPS giữa trình duyệt và server. Không có tích hợp email, SMS hay thanh toán.

---

## 4. Quy tắc nghiệp vụ

| ID | Quy tắc |
|---|---|
| BR-01 | Số lượt đã dùng = số bản ghi `Attempt` của cặp (đề, học viên), gồm `SUBMITTED` và `EXPIRED`. |
| BR-02 | Đang có lượt `IN_PROGRESS` thì Bắt đầu trả về lượt đó; không tạo lượt mới, không tính thêm lượt. |
| BR-03 | `closesAt` chỉ chặn bắt đầu. Lượt đã bắt đầu có đủ `durationMinutes`. |
| BR-04 | `expiresAt = startedAt + durationMinutes`, do server đặt. Hết hạn xử lý lazy khi truy cập. |
| BR-05 | Nội dung câu, đáp án, điểm và thứ tự được chụp vào lượt làm khi bắt đầu. Chấm điểm dùng bản chụp. |
| BR-06 | Xóa câu hỏi là lưu trữ. Câu lưu trữ không vào đề mới; đề cũ vẫn dùng. |
| BR-07 | Không chấm lại bài đã nộp. Sửa câu hỏi không đổi điểm cũ. |
| BR-08 | Câu nhiều đáp án: đúng hết mới có điểm, không trừ điểm. |
| BR-09 | Truy cập bản ghi không có quyền trả 404; chưa đăng nhập chuyển về đăng nhập. |
| BR-10 | Không được khóa hoặc hạ vai trò admin đang hoạt động cuối cùng. |
| BR-11 | Mật khẩu tối thiểu 8 ký tự, tối đa 72 (giới hạn bcrypt). Admin đặt lại mật khẩu; không có email tự phục vụ. |
| BR-12 | Lưu UTC; hiển thị `Asia/Ho_Chi_Minh`. |
| BR-13 | Không có tự đăng ký. Mọi tài khoản do admin tạo. |
| BR-14 | Một câu hỏi thuộc một giáo viên. Một đề thuộc một giáo viên. |
| BR-15 | Điểm hiển thị ngay sau khi nộp; không hiện đáp án đúng trong lúc làm. |

---

## 5. Quy tắc kiểm tra dữ liệu

| ID | Trường | Quy tắc |
|---|---|---|
| VR-01 | Nội dung câu hỏi | 1–2000 ký tự sau khi trim; không rỗng. |
| VR-02 | Đáp án | 2–6 đáp án; mỗi đáp án 1–500 ký tự; không trùng nội dung trong cùng câu. |
| VR-03 | Đáp án đúng | Câu một đáp án: đúng 1. Câu nhiều đáp án: 1 đến số đáp án. |
| VR-04 | Điểm | Số nguyên 1–100. |
| VR-05 | Tag | 0–5 tag; mỗi tag 1–30 ký tự; chuẩn hóa lowercase, trim, bỏ khoảng trắng thừa. |
| VR-06 | Thời lượng đề | Số nguyên 1–480 phút. |
| VR-07 | Số lượt tối đa | Số nguyên 1–10. |
| VR-08 | Khung giờ | `closesAt > opensAt`; `opensAt` được phép ở quá khứ. |
| VR-09 | Câu trong đề | 1–100 câu; không trùng câu trong cùng đề; không vượt số câu đang có trong ngân hàng của giáo viên. |
| VR-10 | Tên đăng nhập | 3–32 ký tự, chữ thường `a-z`, số, `.`, `_`, `-`; duy nhất; lưu lowercase. |
| VR-11 | Họ tên | 1–100 ký tự. |
| VR-12 | Mật khẩu | 8–72 ký tự. |
| VR-13 | Đáp án đã chọn | Mọi ID phải thuộc đúng câu hỏi của lượt làm; số đáp án chọn không vượt số đáp án của câu; câu một đáp án chỉ nhận 1. |

---

## 6. Truy vết K1–K8

| Mã | Yêu cầu chức năng | Yêu cầu phi chức năng | Bằng chứng |
|---|---|---|---|
| K1 | FR-16 | NFR-01 | E2E quét HTML, RSC payload và network response |
| K2 | FR-15, FR-17, FR-21 | NFR-02 | Test fake timer: lưu sau hạn bị từ chối; quá hạn chuyển `EXPIRED` và chấm phần đã lưu |
| K3 | FR-15, FR-20, FR-21 | NFR-04 | Test DB thật với `Promise.all` cho bắt đầu và nộp |
| K4 | FR-17, FR-18, FR-19 | NFR-05 | E2E `setOffline(true)`, tải lại, đóng/mở tab |
| K5 | FR-08, FR-09, FR-15, FR-22 | NFR-06 | Test sửa/xóa câu hỏi sau khi nộp; điểm không đổi |
| K6 | FR-15, FR-16 | NFR-11 | Test hai lượt khác thứ tự; tải lại không đổi; chấm đúng sau xáo |
| K7 | FR-13, FR-22 | NFR-11 | Unit test bảng `it.each` đủ trường hợp |
| K8 | FR-05 | NFR-03 | Test gọi thẳng Server Action bằng tài khoản sai quyền |

---

## 7. Ngoài phạm vi

- Câu tự luận, chấm tay, câu có hình ảnh hoặc công thức.
- Giám sát camera, chống chụp màn hình, phát hiện chuyển tab.
- Đăng ký tự do, đăng nhập mạng xã hội, thanh toán.
- Email, SMS, thông báo đẩy.
- Chấm lại bài đã nộp.
- Xóa cứng đề hoặc lượt làm.
- API công khai cho hệ thống khác.
- Đa ngôn ngữ giao diện (MVP chỉ tiếng Việt).

---

## 8. Quy tắc bằng chứng, quy trình và vận hành

Các quy tắc này áp dụng cho mọi PR, file review và báo cáo. Vi phạm là khiến kết luận không được chấp nhận, kể cả khi code đúng.

| ID | Quy tắc | Bằng chứng bắt buộc |
|---|---|---|
| GOV-01 | Mọi kết luận phải có output chứng minh. Trong PR và file review, câu "đã sửa", "đã tìm ra nguyên nhân", "đạt" phải đi kèm output lệnh, link run hoặc ảnh. Nếu chưa kiểm chứng được thì ghi rõ "chưa kiểm chứng". | Output lệnh kèm `EXIT=`, link CI run hoặc ảnh ngay dưới kết luận. |
| GOV-02 | Số liệu chỉ ghi tại [`PERFORMANCE.md`](PERFORMANCE.md). Tài liệu khác, PR và review chỉ link tới đó, không chép lại. | Đường dẫn tới mục tương ứng trong `PERFORMANCE.md`. |
| GOV-03 | Trước mỗi tính năng lớn chạy quy trình Superpowers: `brainstorming` → spec thiết kế → plan, rồi mới implement. | File spec và plan trong `docs/superpowers/`, id skill được ghi trong review. |
| GOV-04 | K2–K7 làm theo TDD với commit test đỏ riêng, trước khi sửa implementation. | Commit test đỏ tách biệt; output test trước và sau trong PR. |
| GOV-05 | Trước khi nộp mỗi mốc chạy `requesting-code-review`; kết quả lưu tại `docs/reviews/YYYY-MM-DD-<skill>.md` theo [`TEMPLATE.md`](reviews/TEMPLATE.md). | File review tồn tại; mỗi finding có `file:line`, severity và quyết định rõ ràng. |
| GOV-06 | PR chỉ cập nhật trạng thái review thì gộp vào PR sửa lỗi tương ứng, không mở PR riêng. | PR chứa cả thay đổi và nội dung review; không có PR review-only. |
| GOV-07 | Deploy chỉ qua pipeline `.github/workflows/deploy.yml` (not-yet: file chưa có); không deploy tay từ máy cá nhân. | Link run deploy trong PR hoặc bản ghi release. |
| GOV-08 | Dữ liệu thử trên production phải được dọn sau khi kiểm tra. | Output lệnh dọn hoặc bản ghi xác nhận trong PR hoặc review. |
