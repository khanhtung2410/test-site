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
