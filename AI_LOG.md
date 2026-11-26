## 2026-11-26 15:46:16 +07:00 - Bổ sung quy tắc bằng chứng, quy trình và vận hành vào yêu cầu

### Prompt nguyên văn đã dùng

> Mọi kết luận phải có output chứng minh. Trong PR và file review, câu "đã sửa", "đã tìm ra nguyên nhân", "đạt" phải đi kèm output lệnh, link run hoặc ảnh. Chưa kiểm chứng được thì ghi "chưa kiểm chứng".
> Số liệu chỉ ghi ở một chỗ. Các tài liệu khác chỉ link tới đó, không chép lại.
> Quy trình Superpowers: brainstorming → spec → plan trước mỗi tính năng lớn; TDD cho K2–K7 (commit test đỏ riêng); requesting-code-review trước khi nộp mỗi mốc; file review lưu ở docs/reviews/ theo template.
> Chỉ deploy qua pipeline, không deploy tay từ máy cá nhân. Dữ liệu thử trên production phải dọn sau khi kiểm tra.
> add to requirement
>
> . PR chỉ cập nhật trạng thái review thì gộp vào PR sửa lỗi tương ứng.

Skill đã load: không có skill mới cho thay đổi tài liệu; đây là cập nhật quy tắc, không phải tính năng lớn.

### Đã tự kiểm chứng

- `git pull` báo `Already up to date`, sau đó tạo branch `docs/requirement-evidence-rules` theo quy tắc không làm việc trực tiếp trên `main`.
- Đọc toàn bộ `docs/REQUIREMENTS.md` (187 dòng), `docs/PERFORMANCE.md` (109 dòng) và phần cuối `AGENTS.md` trước khi sửa.
- Kiểm tra `PERFORMANCE.md` đã có sẵn quy tắc "con số chỉ ghi ở file này" và các mục PERF-01…PERF-06; vì vậy đổi NFR-07, NFR-08, NFR-09, NFR-10 thành link tới `PERFORMANCE.md`, NFR-12 và NFR-13 thành link tới `SPEC.md` mục 12.
- Thêm mục 8 với GOV-01…GOV-08 vào `REQUIREMENTS.md` và mục 7 tương ứng vào `AGENTS.md`.
- Quét ký tự trên các file đổi: chỉ chữ Việt và Anh, không có ký tự ngoài bảng chữ cái cho phép.

### AI sai ở đâu

- Ban đầu định chỉ ghi quy tắc vào `AGENTS.md`. Yêu cầu là "add to requirement" nên `docs/REQUIREMENTS.md` mới là file chính; đã sửa file này trước, `AGENTS.md` chỉ để áp dụng cho mọi tác vụ.
- Định chép lại ngưỡng hiệu năng vào quy tắc mới. Đọc `PERFORMANCE.md` thì thấy ngưỡng đã có ở đó, nên sửa các dòng NFR thành liên kết thay vì nhân bản số liệu.
- Suýt mở PR riêng chỉ để cập nhật trạng thái review. Quy tắc GOV-06 yêu cầu gộp vào PR sửa lỗi tương ứng; nội dung review được đưa vào cùng PR này.

### Findings từ review và quyết định

Tự review theo id `superpowers`, lưu tại `docs/reviews/2026-11-26-superpowers.md`. Chấp nhận finding 1 (thay số liệu bằng link trong NFR-07 đến NFR-10) và finding 3 (đính kèm output lint và build kèm `EXIT=`). Từ chối finding 2 (dọn số liệu ở file khác nằm ngoài phạm vi và cần hỏi chủ dự án) và finding 4 (A-01, A-02, A-03 đã kiểm chứng bằng `grep` trong `SPEC.md`). Không mở vòng `requesting-code-review` riêng vì đây là cập nhật tài liệu, không phải mốc triển khai; nội dung review được gộp trong PR này theo GOV-06.

### Limitations

- Chưa deploy và chưa đụng dữ liệu production; quy tắc GOV-07 và GOV-08 chỉ được ghi nhận, chưa kiểm chứng trên thực tế.
- `package.json` mới có `dev`, `build`, `start`, `lint`; các script `typecheck`, `test`, `format:check`, `check:language`, `test:e2e` chưa tồn tại nên không chạy được bộ check đầy đủ.
- Không có bằng chứng CI hay artifact hiệu năng trong PR này; mọi nhận định về hiệu năng vẫn ghi "chưa kiểm chứng".

---

## 2026-11-26 14:36:19 +07:00 - Mockup Figma, danh sách câu, xác nhận nộp bài, desktop, login và trạng thái

### Prompt nguyên văn đã dùng

> some note to fix:
> student need list to quickly navigate between question
> add some pop over like confirm nop bai (turn in) - you can copy the ui below
> computer layout for all site
> add trạng thái lỗi/empty, hoặc màn hình phụ
>
> student can get question list in test (first note)
>
> add login
>
> https://github.com/AlexZai007/figma-unlimited-mcp/blob/main/docs/TOOLS.md
>
> continue
>
> add result if test have student caant see result or not out of time yet
>
> https://www.figma.com/design/WAj9m3ZxAJY8AewIoUc535/Exam-App---Mobile-Mockup?node-id=0-1&p=f&t=2lKJfttTLhsdwX2K-0
> commit to main, update docs file
>
> pull first
>
> add git .ignore
>
> ignore figma

Skill đã load: `brainstorming`, `figma-generate-design`, `figma-use`, `ui-ux-pro-max`.

### Đã tự kiểm chứng

- Đọc `docs/SPEC.md` mục 10 và các ghi chú giao diện: điều kiện hỏi xác nhận khi còn câu trống, banner mất mạng, đồng hồ `aria-live`, vùng bấm tối thiểu 44 px.
- Kiểm tra gói `figma-unlimited-mcp` trên npm và GitHub: 19 tool cho sticky/shape/table/code block, manifest có `editorType: ["figjam"]`; không tạo được frame hay auto-layout trong Figma Design.
- Xác nhận hạn mức Figma MCP: Starter/View 20 lượt gọi mỗi tháng, đã hết trong phiên; `whoami` trả về tài khoản `khanhtungdaoduy2410@gmail.com`, plan `starter`.
- Chạy `node --check` cho `figma-plugin/code.js` sau mỗi lần sửa; kết quả `SYNTAX OK`.
- Kiểm tra `git status`, `git log`, diff của `README.md` và `AGENTS.md`; `git pull` fast-forward từ `10d17a3` sang `c5c8ba3` sau khi dọn xung đột.
- Đối chiếu 22 frame giữa Figma và mô tả trong `docs/MOCKUPS.md`; thư mục plugin nằm ngoài repo vì đã thêm `/figma-plugin/` vào `.gitignore`.

### AI sai ở đâu

- Nghĩ `figma-unlimited-mcp` thay thế được Figma MCP. Đọc `TOOLS.md` và manifest thì server chỉ chạy FigJam; đã chuyển sang plugin Design chạy local.
- Dùng `figma.currentPage = page` với `documentAccess: dynamic-page` → Figma báo lỗi `set_currentPage`. Đã đổi sang `figma.setCurrentPageAsync` và nạp page bằng `loadAllPagesAsync`.
- Gán `textStyleId`, `fillStyleId`, `strokeStyleId`, `effectStyleId` dạng đồng bộ → Figma báo lỗi `set_textStyleId`. Đã đổi sang ghi trực tiếp `fontName`, `fontSize`, `lineHeight`, `fills`, `strokes`, `effects`.
- Gán `node.width = 400` → Figma báo `no setter for property` vì `width` là thuộc tính chỉ đọc. Đã đổi sang `resize()` kèm thiết lập sizing mode.
- Đặt frame `02c` tại `(400, 1800)` trùng khu vực desktop. Plugin đã dời về `(400, 900)` và xóa nhãn cũ.
- Định commit README bản `create-next-app` và các file scaffold chưa track, đè lên tài liệu từ `origin`. Đã discard README local, xóa `AGENTS.md` bản do `next dev` sinh, pull trước, rồi chỉ giữ phần docs và `.gitignore`.

### Findings từ review và quyết định

Chưa có review độc lập cho phiên này. Các lỗi plugin được phát hiện qua toast của Figma và sửa trực tiếp; không tạo file review riêng.

### Limitations

- Không tự chụp hay kiểm tra trực quan 15 frame do plugin tạo vì quota Figma MCP đã hết; cần người dùng xác nhận bằng ảnh trong Figma.
- Plugin ghi thuộc tính trực tiếp nên node không liên kết style; style vẫn có trong file để tái sử dụng.
- `figma-unlimited` đã thêm vào config OpenCode nhưng chỉ dùng được cho FigJam, không phải Design.
- Chạy được `npm run lint` và `npm run build`; các script `typecheck`, `test`, `format:check`, `check:language`, `test:e2e` chưa có trong `package.json`.

---

## 2026-11-26 11:13:01 +07:00 - Khởi tạo bộ tài liệu dự án từ SRS và brief

### Prompt nguyên văn đã dùng

> use this to update agent skill, write readme and other md file, put in docs/folder readme put in src
> import superpower skill
>
> Attached file: `C:\Users\Hello\Desktop\Software Requirements Specification Online Multiple-Choice Exam Site.md`
> Attached file: `C:\Users\Hello\Downloads\Telegram Desktop\de-bai-site-trac-nghiem.html`
> Attached file: `D:\thuc tap\ant-jewelry\AGENTS.md`
> Attached file: `D:\thuc tap\ant-jewelry\AI_LOG.md`
> Attached file: `D:\thuc tap\ant-jewelry\docs\ARCHITECTURE.md`
> Attached file: `D:\thuc tap\ant-jewelry\docs\CONTRIBUTING.md`
> Attached file: `D:\thuc tap\ant-jewelry\docs\DEPLOY.md`
> Attached file: `D:\thuc tap\ant-jewelry\docs\ERD.md`
> Attached file: `D:\thuc tap\ant-jewelry\docs\HUONG_DAN_VAN_HANH.md`
> Attached file: `D:\thuc tap\ant-jewelry\docs\PERFORMANCE.md`
> Attached file: `D:\thuc tap\ant-jewelry\docs\PERMISSIONS.md`
> Attached file: `D:\thuc tap\ant-jewelry\docs\REQUIREMENTS.md`
> Attached file: `D:\thuc tap\ant-jewelry\docs\SECURITY.md`
> Attached file: `D:\thuc tap\ant-jewelry\.github\dependabot.yml`
> Attached file: `D:\thuc tap\ant-jewelry\.github\pull_request_template.md`
> Attached file: `D:\thuc tap\ant-jewelry\.github\workflows\ci.yml`
> Attached file: `D:\thuc tap\ant-jewelry\.github\workflows\codeql.yml`
> Attached file: `D:\thuc tap\ant-jewelry\.github\workflows\deploy.yml`

Làm rõ trong hội thoại:

- README đặt ở **root** (không đặt trong `src/`).
- Tài liệu dùng **tiếng Việt, giữ thuật ngữ kỹ thuật tiếng Anh**.
- Skill đã load: `brainstorming`.

### Đã tự kiểm chứng

- Đọc toàn bộ SRS 162 dòng và brief 183 dòng; đối chiếu K1–K8, tiêu chí nghiệm thu và giới hạn 12 PR.
- Đọc mẫu tài liệu AntJewelry: `AGENTS.md`, `README.md`, `docs/CONTRIBUTING.md`, `docs/ERD.md`, `docs/PERMISSIONS.md`, `docs/reviews/TEMPLATE.md`, phần đầu `AI_LOG.md`, và tiêu đề các file `ARCHITECTURE.md`, `REQUIREMENTS.md`, `DEPLOY.md`, `PERFORMANCE.md`, `SECURITY.md`, `HUONG_DAN_VAN_HANH.md`.
- Đọc `.github/workflows/ci.yml`, `deploy.yml`, `codeql.yml`, `dependabot.yml`, `pull_request_template.md` để lấy mô hình pipeline.
- Kiểm tra work tree: chỉ có `README.md` từ initial commit; chưa có `package.json`, `src/`, `docs/`. Work tree chính `D:\thuc tap\test-site` có khung `create-next-app` chưa track: Next.js 16.4.6, React 19.3.0, Tailwind 4.3.3, TypeScript strict, ESLint 9.
- Đối chiếu chéo: mọi K1–K8 trong `SPEC.md` mục 9 đều có FR/NFR tương ứng ở `REQUIREMENTS.md` mục 6; mọi ràng buộc K3/K5 ở `ERD.md` có unique/FK tương ứng; ma trận quyền khớp `ARCHITECTURE.md` mục 7.
- Không chạy test, lint hay build: đây là thay đổi tài liệu, work tree chưa có script. Không có tuyên bố "đạt" nào trong tài liệu.

### AI sai ở đâu

- **Hiểu sai vị trí README.** Câu "readme put in src" bị hiểu là tạo `src/README.md`. Đã hỏi lại và sửa thành README ở root. Nếu không hỏi, repo sẽ có README sai chỗ và GitHub không hiển thị.
- **Định bật CI/deploy ngay.** Ban đầu định chép `.github/workflows/ci.yml` và `deploy.yml` vào repo mới. Kiểm tra lại thì work tree chưa có `package.json`, `npm test`, `npm run typecheck`, `format:check`, Prisma hay database; bật workflow sẽ làm `main` đỏ ngay lần push đầu. Đã giữ chúng làm mô hình trong `DEPLOY.md` và để việc bật workflow ở Mốc 2.
- **Định dùng SQLite cho local/test** theo mô hình AntJewelry. Nhưng K3 yêu cầu test `Promise.all` trên database thật với transaction/unique constraint; SQLite không phản ánh đúng hành vi PostgreSQL. Đã chốt PostgreSQL 16 cho mọi môi trường.
- **Định giữ các mục TBD của SRS.** SRS để ngỏ K7, K8, regrade, auto-save, credentials. Nếu giữ TBD thì không thể viết test hay wireframe. Đã ra quyết định D-01…D-18 kèm lý do, đồng thời đánh dấu các giả định số liệu (A-01…A-08) là cần chủ dự án xác nhận thay vì tự nhận là yêu cầu đã chốt.
- **Suýt ghi số hiệu năng vào nhiều file.** Đã gom ngưỡng vào `PERFORMANCE.md` và cho các file khác link tới, theo quy tắc "số liệu chỉ ghi ở một chỗ" của brief.

### Findings từ review và quyết định

Chưa có review độc lập cho bộ tài liệu này. Đây là bản nháp Mốc 1; mentor review sẽ được ghi thành file riêng trong `docs/reviews/` theo `TEMPLATE.md`.

### Limitations

- Tài liệu mô tả **trạng thái đích**, không phải code đã có. Chưa có Prisma schema, authentication, test, CI hay deploy.
- Các giả định A-01…A-08 (300 người đồng thời, p95 500 ms, uptime 99,9%, trình duyệt, vùng database, tên miền, 100 câu/đề, 6 đáp án/câu) chưa được chủ dự án xác nhận.
- Tài khoản demo và URL production trong README/DEPLOY là kế hoạch, chưa tồn tại.
- Wireframe là ASCII, chưa phải ảnh; chưa có bản so sánh giao diện thật.
- Chưa có script `check:language`; quy tắc chữ Việt/Anh mới được kiểm tra thủ công.
- Không có bằng chứng test/lint/build vì work tree chưa có script; mọi mục "kế hoạch" phải được kiểm chứng lại ở Mốc 2.

---
