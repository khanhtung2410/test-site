## 2026-11-27 16:58:12 +07:00 - Sửa findings review cuối nhánh student mock pages

### Prompt nguyên văn đã dùng

> You are a subagent spawned by another session.
> You are the single fix agent for the final whole-branch review of the student mock-pages branch. Work from D:\thuc tap\test-site on branch `feature/student-mock-pages` (HEAD 86d6b33). Do NOT merge to main, do NOT push to a shared branch, do NOT dispatch subagents.
>
> ## Findings to fix (from final reviewer, verbatim where marked)
>
> Important 1 — dead-end "Xem kết quả":
> `src/features/shared/components/ExamCard.tsx:45-47`, `src/app/(student)/attempts/[attemptId]/result/page.tsx:20-23`, `src/features/attempts/mocks/results.ts:52`. Condition `(exam.attemptsUsed > 0 || !canStart)` renders "Xem kết quả" for e-2 (open, used 1/1), e-3 (closed, 1/1), e-4 (closed, 0/1). Only `a-1` and alias `e-1` exist in getMockAttempt/getMockResult, so those cards lead to notFound(). Fix: make getMockAttempt/getMockResult return a sample result for e-2 and e-3; keep e-4 as a disabled/non-functional "Xem kết quả" button per SPEC §10. Add a render-based check (server-rendered HTML) clicking all four cards' destinations.
>
> Important 2 — timer a11y:
> `src/features/attempts/components/Timer.tsx:33,38`. `const announce = remaining <= 300` puts `aria-live="polite"` on the `<span role="timer">` containing a string that changes every second. Fix: `aria-live="off"` on the visible clock; add a separate `<span className="sr-only" role="status">` whose text changes only when crossing 300s ("Còn 5 phút") and 60s ("Còn 1 phút"), staying constant in between.
>
> Important 3 — dialog a11y:
> `src/features/attempts/components/SubmitDialog.tsx:17-19,40` and `src/features/attempts/components/AttemptView.tsx:138-152`. Both declare `aria-modal="true"` but do not trap focus; submit has no Escape; expired dialog has no autofocus/describedby. Fix: shared dialog primitive or equivalent — focus first control on open, trap Tab/Shift+Tab, Escape closes submit dialog, restore focus to trigger on close; give expired dialog an accessible description.
>
> Also fix (controller-promoted from Minor, cheap and spec-explicit):
> - `src/features/attempts/components/QuestionNavigator.tsx:29-33,40-44,49-52`: swap mapping to match MOCKUPS.md:71 — answered = solid primary, current = primary-soft fill + primary border; add visible swatches/icons to the legend.
> - `src/features/shared/components/ExamCard.tsx:29`: card title `<h2>` under section `<h2>` → `<h3>`.
> - `src/features/attempts/components/AttemptView.tsx:77-83`: offline banner text "Đáp án chưa được lưu." contradicts badge "Đã lưu" on entry → "Thay đổi tiếp theo sẽ chưa được lưu".
>
> Leave deferred (do not change): e-1 alias, questionId holding display text, hard-coded stats/canReviewAnswers, client-side notFound HTTP 200, browser/axe verification (record as chưa kiểm chứng).
>
> ## Verification
>
> Run the full check set with Node `spawnSync` (`encoding: utf8`, `NO_COLOR=1`): typecheck, lint, format:check, check:language, build. Paste full output with EXIT codes. Record render-based evidence for the four card destinations and `?state=bogus` vs default using real server-rendered HTML (no Playwright installs). `npm test`/`test:e2e` = chưa kiểm chứng.
>
> ## Report
>
> Append your full fix report to D:\thuc tap\test-site\.superpowers\sdd\2026-11-27-student-mock-pages\final-fix-report.md, then commit the fixes.
>
> Return ONLY: Status, commit SHA + subject, one-line test/render summary, concerns, report path.

### Đã tự kiểm chứng

- Đọc toàn bộ các file liên quan trước khi sửa: `ExamCard.tsx`, hai route page, `mocks/attempts.ts`, `mocks/results.ts`, `Timer.tsx`, `SubmitDialog.tsx`, `AttemptView.tsx`, `QuestionNavigator.tsx`, `ResultSummary.tsx`, `ResultTable.tsx`, `AttemptHeader.tsx`, `exams/page.tsx`, DTO, `SPEC.md` §10, `MOCKUPS.md` §Hành vi chính.
- Thêm attempt/kết quả mẫu `a-2`/`a-3` và alias id đề `e-2`/`e-3`; `ExamCard` nhận `hasResult` nên `e-4` render nút `disabled`.
- Timer tách thông báo thành node `role="status"` riêng, đồng hồ `aria-live="off"`; `ModalDialog` dùng chung cho hai dialog, có focus đầu, bẫy Tab/Shift+Tab, Escape và khôi phục focus.
- Chạy bộ check bằng Node `spawnSync` với `encoding: utf8`, `NO_COLOR=1`; output đầy đủ và EXIT nằm trong `final-fix-report.md`.
- Kiểm chứng HTML do server render: bốn đích nút "Xem kết quả" và so sánh `?state=bogus` với mặc định; chi tiết trong `final-fix-report.md`.

### AI sai ở đâu

- Ban đầu định chỉ đổi `getMockResult` để trả kết quả cho `e-2`/`e-3`, nhưng result page gọi `getMockAttempt` trước; nếu không thêm attempt tương ứng thì vẫn `notFound()`. Đã đọc lại luồng page và sửa cả hai mock.
- Dự định dùng khóa `e-4` làm alias attempt; đối chiếu `exams.ts` thì `e-4` có `attemptsUsed: 0` và không có kết quả, nên phải giữ nút vô hiệu thay vì tạo kết quả giả.
- Nếu gắn `onDismiss` inline vào effect có dependency thì effect chạy lại, focus bị giật về nút đầu mỗi lần render; đã dùng ref cập nhật trong effect riêng để effect bẫy phím chỉ chạy một lần.

### Findings từ review và quyết định

Review: `.superpowers/sdd/2026-11-27-student-mock-pages/task-final-review.md`. Báo cáo sửa: `.superpowers/sdd/2026-11-27-student-mock-pages/final-fix-report.md`.

- Accepted (đã sửa trong nhánh `feature/student-mock-pages`, commit tiếp theo sau entry này): Important 1 dead-end "Xem kết quả", Important 2 timer a11y, Important 3 dialog a11y, ba mục controller-promoted (ánh xạ navigator, `<h3>` trên card, chữ banner offline).
- Rejected / deferred theo chỉ thị: alias `e-1`, `questionId` chứa nội dung hiển thị, số liệu cố định và `canReviewAnswers`, `notFound()` phía client trả HTTP 200, kiểm chứng browser/axe. Lý do: nằm ngoài phạm vi fix cuối và được giữ nguyên có chủ đích; browser/axe ghi "chưa kiểm chứng".

### Limitations

- `npm test` và `npm run test:e2e` chưa có script trong repo: ghi "chưa kiểm chứng".
- Kiểm chứng bằng HTML server-render, không cài Playwright; hành vi focus/bẫy phím được kiểm tra bằng mã nguồn và build, chưa kiểm chứng bằng axe/trình duyệt thật.

---

## 2026-11-27 14:17:34 +07:00 - Xóa file template create-next-app

### Prompt nguyên văn đã dùng

> delete all of template uneeded file that come with create next js project

### Đã tự kiểm chứng

- Grep toàn repo: 5 file SVG trong `public/` và `src/app/favicon.ico` không có tham chiếu nào.
- Kiểm tra `src/app/layout.tsx` vẫn import Geist/Geist_Mono và metadata "Create Next App"; `globals.css` vẫn chứa biến theme/dark mode mặc định.
- Xóa 6 file template, thay layout bằng metadata dự án, html `lang="vi"`, không font Google; CSS chỉ giữ import Tailwind và nền/chữ tối thiểu.

### AI sai ở đâu

- Ban đầu định chỉ xóa SVG mà giữ `favicon.ico`; kiểm tra thì đây cũng là asset mặc định của `create-next-app`, đã xóa luôn.
- Để nguyên metadata "Create Next App" sau các PR trước; đã đổi sang tên/description dự án.

### Findings từ review và quyết định

Không có vòng review riêng; thay đổi nằm trong một PR, output kiểm chứng dán đầy đủ.

### Limitations

- `public/` sau khi xóa không còn file; không commit thư mục rỗng.
- Chưa kiểm chứng trong browser; chỉ có kết quả lint/typecheck/build.

---

## 2026-11-27 10:35:07 +07:00 - Đưa TypeScript về 5 sau khi merge Dependabot

### Prompt nguyên văn đã dùng

> PR mới đưa typescript về ^5 (giữ eslint 10, @types/node 26), regenerate lockfile, merge — lint xanh lại.
> tam thoi khong nang len 7 nua

### Đã tự kiểm chứng

- Chạy bộ check sau khi merge #9–#13: `typecheck`, `format:check`, `check:language`, `build` EXIT=0; `lint` EXIT=2 với lỗi `typescript-eslint does not support TS 7.0`.
- Tạo branch `fix/typescript-5` từ `main`, đổi `typescript` từ `^7` sang `^5`, giữ `eslint ^10` và `@types/node ^26`, chạy `npm install` để regenerate lockfile.
- Chạy lại bộ check: cả 5 lệnh EXIT=0. Output đầy đủ dán trong PR.

### AI sai ở đâu

- Merge PR #11 (TypeScript 7) mà không kiểm chứng tương thích với `typescript-eslint` bundled trong `eslint-config-next@16.4.6`; hậu quả `npm run lint` EXIT=2. Đã khắc phục bằng cách hạ về `^5`.

### Findings từ review và quyết định

Không có vòng review riêng; đây là sửa lỗi sau merge, gộp trong một PR đúng quy tắc GOV-06.

### Limitations

- Vẫn có npm peer warnings khi cài eslint 10 với `eslint-config-next@16.4.6` (eslint-plugin-import/jsx-a11y/react chỉ hỗ trợ đến eslint 9), nhưng lệnh chạy EXIT=0. Chưa kiểm chứng CI/deploy.

---

## 2026-11-27 10:06:34 +07:00 - Rà soát mâu thuẫn docs và giới hạn trên của đề thi

### Prompt nguyên văn đã dùng

> any mismatch between docs files
> add rom restriction for uperlimit about test (time,questions,...)
>
> no more question in test than in bank

### Đã tự kiểm chứng

- Dispatch reviewer subagent đọc toàn bộ 16 file docs và 3 file review; trả về 9 phát hiện thật, không có xung đột giá trị giới hạn (2–6 đáp án, 1–100 điểm, 0–5 tag, 1–480 phút, 1–10 lượt, 1–100 câu, seed 128-bit, session 12 giờ đều nhất quán).
- Kiểm chứng A-02/A-07/A-08 bị lặp số giữa `SPEC.md` và `PERFORMANCE.md`/`REQUIREMENTS.md`; đã đổi SPEC thành link tới nguồn duy nhất.
- `node --check figma-plugin/code.js` trả `SYNTAX OK` sau khi thêm nhãn giới hạn vào D5.

### AI sai ở đâu

- Ban đầu định chép lại số giới hạn vào `SPEC.md`; reviewer chỉ ra GOV-02, đã đổi sang link tới `REQUIREMENTS.md` mục 5.
- Bỏ sót ràng buộc "số câu trong đề không vượt số câu trong ngân hàng"; đã thêm vào FR-10, VR-09, SPEC §12.1 và D5.

### Findings từ review và quyết định

Chấp nhận cả 9 finding của reviewer: cập nhật HANDOVER (branch protection), PERFORMANCE (năm màn chính), SPEC (nguồn số liệu + acceptance not-yet), ERD (seed production), và 2 file review (line ref/stale note). Không có finding bị từ chối.

### Limitations

- Chưa chạy lại Figma builder/exporter để thấy nhãn D5 mới; chưa kiểm chứng trực quan.
- Không chạy test/CI; PR này chỉ đổi tài liệu.

---

## 2026-11-26 22:15:46 +07:00 - Đính ảnh mockup vào docs và dọn input lạc

### Prompt nguyên văn đã dùng

> get img and put in mockup file
> there is a stray input at danmh sachs ddeef frame

### Đã tự kiểm chứng

- Đọc `figma-plugin/export/out/index.json`, sao chép 30 ảnh hiện tại (bỏ 3 bản tên cũ) sang `docs/mockups/`.
- Thêm bảng ảnh vào `docs/MOCKUPS.md` cho mobile, desktop, trạng thái và board color palette.
- `npm run check:language` trả `EXIT=0`.

### AI sai ở đâu

- Lần đầu only copy ảnh vào thư mục bị gitignore; người clone không thấy. Đã chuyển sang `docs/mockups/` được track.

### Findings từ review và quyết định

Không có vòng review riêng. Lỗi input lạc do hàm `input()` cũ tạo frame rồi quên đưa vào field; đã thêm dọn ở builder và plugin `clean-stray` một lần.

### Limitations

- Chưa tự chạy plugin Figma desktop để xác nhận input lạc đã biến mất; cần người dùng chạy `Clean Stray Inputs` rồi export lại.

---

## 2026-11-26 21:43:08 +07:00 - Áp dụng palette 60 shade vào mockup

### Prompt nguyên văn đã dùng

> this is my color pllet, its already exist in figma, fix export to also include it
> read it and add it to the build plugin
> applied it to color change within frames
>
> 1. Recommended palette
> I recommend a blue-led palette with violet secondary actions and distinct green, red, and amber feedback colors. It gives students clear state recognition without making the interface feel overly playful.
> Add one supporting token: color-white: #FFFFFF.

Phần còn lại của prompt là bảng 60 token, bảng ánh xạ trạng thái và kết quả contrast; đã đọc toàn bộ trước khi áp dụng.

### Đã tự kiểm chứng

- Đối chiếu bảng token trong prompt với board **Student test / Color palette** trong Figma: khớp 60 shade và `color-white`.
- `node --check` cho `figma-plugin/code.js`, `figma-plugin/recolor/code.js`, `figma-plugin/export/code.js` đều trả `SYNTAX OK`.

### AI sai ở đâu

- Ban đầu chỉ đổi vài mã màu semantic; đọc kỹ bảng trạng thái thì thấy cần đổi cả viền đáp án, nền đáp án đã chọn, track thanh tiến độ, nút phụ và thông báo. Đã bổ sung ánh xạ tương ứng.

### Findings từ review và quyết định

Không có vòng review riêng; thay đổi nằm trong plugin local và `docs/MOCKUPS.md`.

### Limitations

- Chưa chạy lại plugin trên Figma desktop; chưa có ảnh export sau khi đổi màu để kiểm chứng trực quan.
- Không chép lại bảng tỉ lệ contrast vào docs; chỉ link tới board palette.

---

## 2026-11-26 20:04:50 +07:00 - Kiểm tra thiết kế K1-K8 trong tài liệu

### Prompt nguyên văn đã dùng

> B. Thiết kế K1 – K8 trong tài liệu
> Đợt này chỉ kiểm tra quyết định và cách chứng minh dự kiến đã được ghi trong spec chưa. Không chạy test, không đánh giá code — việc chạy test thuộc các mốc sau.
> K1 — Không lộ đáp án. SPEC.md:218, SECURITY.md:13 đã ghi DTO không có isCorrect, query select tường minh, action lưu chỉ trả savedAt, không có endpoint "check answer", và dự kiến E2E quét HTML/RSC payload/network. Cần giải thích trong spec vì sao ẩn bằng CSS hoặc kiểm tra ở client là không đủ.
> K2 — Thời gian do server quyết định. SPEC.md:143-153 ghi expiresAt do server đặt, kiểm tra trong transaction, hết hạn lazy, client chỉ hiển thị; REQUIREMENTS.md:168 có fake timer dự kiến. Đã xử lý A13 (lọc savedAt < expiresAt) chưa?
> K3 — Trạng thái lượt làm rõ ràng. SPEC.md:121-139 có state diagram, chuyển hợp lệ, unique (examId, studentId, attemptNumber), nộp idempotent; REQUIREMENTS.md:169 dự kiến test Promise.all trên DB thật.
> K4 — Không mất bài. SPEC.md:221 ghi lưu ngay khi chọn, upsert, câu chưa lưu, retry khi online và E2E setOffline. Đã xử lý A14 (lưu tạm offline + vị trí câu) chưa?
> K5 — Đề đã thi không bị sửa ngược. SPEC.md:167-180, ERD.md:180-188 có snapshot câu/đáp án/điểm, D-03 "không chấm lại", test dự kiến đổi đáp án sau khi nộp mà điểm không đổi.
> K6 — Xáo trộn cố định theo lượt. SPEC.md:159-165, ARCHITECTURE.md:312-318 ghi seed 128-bit ở server, Fisher–Yates thuần, thứ tự ổn định khi reload, chấm theo ID.
> K7 — Luật chấm nhiều đáp án. SPEC.md:184-210 chốt all-or-nothing, không trừ điểm, có bảng 7 ca cho it.each và luật hiển thị trước khi làm (FR-13).
> K8 — Phân quyền ở server. PERMISSIONS.md có ma trận + 404; SPEC.md:225 dự kiến test gọi thẳng Server Action sai quyền. Đã đổi 403 → 404 ở mockup chưa (A5)?
>
> pr3

### Đã tự kiểm chứng

- Đọc SPEC mục 6, 7, 8, 9, SECURITY.md:13, REQUIREMENTS.md bảng truy vết K, ARCHITECTURE.md mục xáo trộn và chấm, PERMISSIONS.md, ERD.md mục snapshot, MOCKUPS.md.
- K1: DTO/select/savedAt/không có endpoint check answer và E2E quét ba nơi đã có; bổ sung đoạn giải thích CSS/client không đủ, dẫn D-18.
- K2: A13 đã có D-20, dòng `savedAt < expiresAt` trong ARCHITECTURE và mục 6 của SPEC; bổ sung dẫn D-20 ngay mục 6.
- K3, K5, K6, K7: các quyết định và bằng chứng dự kiến đã có, không sửa.
- K4: A14 đã có D-21, IndexedDB theo `attemptId` và `currentQuestionIndex`, E2E offline → reload → online.
- K8: D-15, ma trận PERMISSIONS và MOCKUPS dùng 404; không còn 403 trong mockup.
- Không chạy test theo yêu cầu; chỉ kiểm tra tài liệu.

### AI sai ở đâu

- Ban đầu định chạy bộ check của repo để chứng minh K1–K8; yêu cầu nói rõ đợt này không chạy test, nên chỉ đọc tài liệu và ghi kết quả kiểm tra tài liệu.
- Định ghi K1 chỉ bằng D-18, nhưng yêu cầu muốn giải thích ngay trong phần thiết kế K1; đã thêm đoạn riêng dưới bảng K1–K8.

### Findings từ review và quyết định

Không có finding bị từ chối. Hai điểm còn thiếu được bổ sung trong PR này; sáu K còn lại đã đúng về quyết định và bằng chứng dự kiến.

### Limitations

- Chưa chạy test; mọi bằng chứng trong bảng K1–K8 vẫn là dự kiến, chưa kiểm chứng.
- PR #3 đã merge; thay đổi này nằm ở PR mới trên branch `docs/k1-k8-clarifications`.

---

## 2026-11-26 19:54:40 +07:00 - Kiểm tra và bật branch protection cho main

### Prompt nguyên văn đã dùng

> check and protect main branch of test dite

### Đã tự kiểm chứng

- `gh api repos/khanhtung2410/test-site/branches/main/protection` ban đầu trả HTTP 404 `Branch not protected`.
- Gửi PUT cấu hình protection qua `gh api --method PUT ... --input main-protection.json`; response trả đầy đủ các trường.
- GET lại: `branches/main --jq '{name, protected}'` trả `{"name":"main","protected":true}`; endpoint protection trả `reviews=1`, `dismiss_stale=true`, `strict=true`, `contexts=[]`, `enforce_admins=true`, `force_pushes=false`, `deletions=false`, `conversation=true`.
- Cập nhật `docs/DEPLOY.md` với cấu hình và bằng chứng trên.

### AI sai ở đâu

- Ban đầu thử `gh api --include-headers` nhưng flag này không tồn tại; bỏ flag và đọc JSON trả về.
- Định yêu cầu status check ngay, nhưng repo chưa có workflow CI; nếu yêu cầu `lint`, `build`... sẽ chặn mọi PR. Để `contexts=[]` và ghi rõ "chưa kiểm chứng" trong docs.

### Findings từ review và quyết định

Không có vòng review riêng; thay đổi là cấu hình GitHub, đã kiểm chứng bằng hai lệnh GET sau PUT.

### Limitations

- Chưa bật required status checks; chưa có CI run để làm bằng chứng.
- Chưa kiểm chứng khả năng chặn force push bằng cách thử đẩy thật; chỉ dựa vào response API.

---

## 2026-11-26 18:51:22 +07:00 - Thêm script typecheck, format:check, check:language từ ant-jewelry

### Prompt nguyên văn đã dùng

> you can read script typecheck, format:check, check:language at D:\thuc tap\ant-jewelry to create changes fit to thí project

### Đã tự kiểm chứng

- Đọc `package.json`, `scripts/check-language.mjs`, `.prettierrc` và `.prettierignore` của `D:\thuc tap\ant-jewelry`, rồi đọc `package.json` và `tsconfig.json` của repo này trước khi sửa.
- Tạo branch `feat/check-scripts` từ `docs/requirement-evidence-rules` để giữ PR #2 dưới 400 dòng; PR mới là PR xếp chồng trên PR #2.
- Chạy `npm install` để cài Prettier 3 và cập nhật lockfile. Chạy `npm run format` vì lần đầu `format:check` báo 6 file scaffold chưa đúng style; sau đó chạy lại bộ check bằng Node `spawnSync`, `encoding: utf8`, `NO_COLOR=1`.
- Output cuối: `typecheck EXIT=0`, `format:check EXIT=0`, `check:language EXIT=0`, `lint EXIT=0`, `build EXIT=0`. Output đầy đủ nằm trong PR #3 mục Testing.
- Test âm cho `check-language`: tạo tạm `lang-probe.md` chứa hai ký tự Hán → lệnh in tên file kèm hai ký tự đó, `EXIT=1`; xóa file → lệnh in "All tracked text files use Vietnamese and English letters only.", `EXIT=0`. Không ghi lại ký tự cấm vào tài liệu vì script quét cả file markdown.

### AI sai ở đâu

- Định copy nguyên `check-language.mjs` nhưng file này quét cả thư mục plugin Figma local; đã thêm `figma-plugin` vào `SKIP_DIRS`.
- Định thêm script `format:check` mà không có `.prettierrc`; script của ant-jewelry dùng `singleQuote`, trong khi scaffold repo này dùng style khác. Đã thêm `.prettierrc` và `.prettierignore` riêng, không copy phần `prisma/` do repo chưa có Prisma.
- Lần đầu báo "đạt" khi chưa chạy `format:check`; thực tế lệnh trả `EXIT=1` với 6 file. Đã chạy `npm run format`, kiểm tra lại và chỉ ghi kết quả sau khi có output mới.
- Copy `check-language.mjs` với phép so sánh `new URL(import.meta.url).pathname`; trên Windows đường dẫn `D:\thuc tap` bị chuyển thành `/D:/thuc%20tap/...` nên hàm `invokedDirectly` luôn sai, script không quét gì nhưng vẫn `EXIT=0`. Đã đổi sang `fileURLToPath(import.meta.url)` và chứng minh bằng test âm ở trên.
- Để bảng script README có dòng `audit:production` rơi xuống sau một đoạn văn, làm bảng gãy. Đã đưa dòng vào lại trong bảng.

### Findings từ review và quyết định

Reviewer subagent đã soát docs PR #3 và ghi 9 finding. Chấp nhận và sửa trong PR #3: lỗi path của `check-language`, bảng README gãy, nhận định cũ trong file review về scaffold/script, Prettier trong HANDOVER/ARCHITECTURE, nhãn `not-yet` cho `prisma/` và `docs/superpowers/`, mô tả ngưỡng trong `PERFORMANCE.md`, và link PERF-06 cho NFR-08. Không có finding bị từ chối. Không mở PR review-only.

### Limitations

- `npm test` và `npm run test:e2e` chưa có script; ghi "chưa kiểm chứng".
- Chưa có CI run link; chưa deploy và chưa đụng dữ liệu production.
- PR mới xếp trên PR #2; nếu PR #2 được merge trước, cần cập nhật base nhánh này.

---

## 2026-11-26 17:04:27 +07:00 - Xử lý phản hồi review Mốc 1 A1-A15

### Prompt nguyên văn đã dùng

> A. Blocker trước khi duyệt Mốc 1
> A1 — Xóa khẳng định "work tree có scaffold Next.js". README.md:7,41-48, docs/ARCHITECTURE.md:3,13,51-59, docs/HANDOVER.md:13, AI_LOG.md:59 nói có create-next-app 16.4.6, src/, tsconfig.json, node_modules, script lint/build. HEAD không có gì trong số đó. Đổi thành "kế hoạch Mốc 2" hoặc commit scaffold kèm output.
> A2 — Bỏ nhãn "Có" cho script npm. README.md:143-146 ghi npm run dev/build/start/lint là "Có"; README.md:209-216, AGENTS.md:13, CONTRIBUTING.md:211-216 yêu cầu chạy. Bọc mọi lệnh bằng điều kiện "khi có package.json (Mốc 2)".
> A3 — Tạo .env.example và sửa .gitignore. README.md:79,96 bảo cp .env.example .env, nhưng file không có và .gitignore:34 (.env*) chặn nó. Thêm file mẫu (chỉ tên biến + giá trị giả, không secret) và dòng !.env.example.
> A4 — Giải quyết mâu thuẫn điểm với mockup. docs/MOCKUPS.md:24 (D6/S7 "Đã nộp · Chờ công bố", chưa xem được điểm) mâu thuẫn REQUIREMENTS.md:64 FR-23, SPEC.md:116, HUONG_DAN_VAN_HANH.md:124: điểm hiện ngay sau khi nộp. Bỏ D6/S7 hoặc đổi thành "điểm hiện ngay; chỉ đáp án đúng khóa sau khi đề đóng + allowReview". Ghi quyết định D-19 có lý do.
> A5 — Đổi "403" thành "404" trong mockup. docs/MOCKUPS.md:25 liệt kê trạng thái "403 không có quyền", trong khi D-15 (SPEC.md:81), REQUIREMENTS.md:36 FR-05 và PERMISSIONS.md:46-50 bắt buộc 404.
> A6 — Tạo file review Mốc 1. docs/reviews/ chỉ có TEMPLATE.md; AI_LOG.md:52,114 ghi "chưa có review độc lập"; GitHub API cho PR #1 có 0 review. Chạy requesting-code-review, lưu docs/reviews/2026-11-26-requesting-code-review.md theo template, ghi phát hiện Accepted/Rejected vào AI_LOG.md.
> A7 — Ghi nhận vi phạm PR & commit thẳng main. PR #1 = 2880 dòng/17 file (≤ 400); d758694 đẩy trực tiếp vào main, trái AGENTS.md:7. Không rewrite history; ghi vào review/AI_LOG; từ Mốc 2 dùng branch + PR một việc.
> A8 — Bỏ chữ "đã duyệt" khi chưa được duyệt. SPEC.md:231,357 và REQUIREMENTS.md:105 ghi "wireframe đã duyệt", nhưng SPEC.md:3, HANDOVER.md:156 ghi "chờ mentor duyệt". Đổi thành "bản trình duyệt / chờ duyệt".
> A9 — Reconcile Figma. Đề và SPEC.md:231 ghi "không có Figma", nhưng MOCKUPS.md:1-19 đưa link Figma + 22 frame. Chốt: wireframe ASCII là nguồn duyệt, Figma là tài liệu tùy chọn — hoặc bỏ nếu đề cấm. Plugin ở figma-plugin/ bị gitignore (.gitignore:44), người clone không tái tạo được; MOCKUPS.md:54,57 trỏ vào file không có.
> A10 — Artifact quy trình phải khớp trạng thái. AGENTS.md:16,70 trỏ docs/superpowers/specs|plans/ (không có); AGENTS.md:40 nói deploy qua .github/workflows/deploy.yml (chưa có, DEPLOY.md:170 ghi rõ). Tạo hoặc ghi "not-yet".
> A11 — Gom số liệu về một chỗ. Ngưỡng 85/90/CLS lặp ở SPEC.md:355, REQUIREMENTS.md:89-90, DEPLOY.md:62, CONTRIBUTING.md:136; A-01…A-08 lặp giữa SPEC.md:364-375, HANDOVER.md:97-106. Sửa SPEC.md:364 ("tại đây và PERFORMANCE.md"), PERFORMANCE.md:20,45, AI_LOG.md:110.
> A12 — Xử lý nguồn tham chiếu không có trong repo. SRS v0.1 (SPEC.md:5,395) và brief HTML (SPEC.md:396) chưa được commit; REQUIREMENTS.md:11 khẳng định "giữ nguyên mã FR/NFR theo SRS". Commit bản gốc hoặc đổi nguồn thành "đã trích trong REQUIREMENTS.md".
> A13 — K2: chốt bộ lọc savedAt < expiresAt khi chấm. ERD.md:122 có savedAt nhưng ARCHITECTURE.md:224-235 chấm mọi đáp án đã lưu. Ghi rõ rule + thứ tự khóa giữa saveAnswer và expireDueAttempts, thêm integration test fake timer tại ranh giới hạn.
> A14 — K4: định nghĩa nơi lưu hàng đợi offline. SPEC.md:221 chỉ ghi "retry khi online"; HUONG_DAN_VAN_HANH.md:129-131 nói giữ trên máy nhưng không nêu localStorage/IndexedDB. Chốt lưu tạm theo attemptId + khôi phục currentQuestionIndex; thêm E2E "offline → reload → online".
> A15 — Khớp các chi tiết nhỏ. FR-26 (REQUIREMENTS.md:72) phải nói rõ xem lại dùng snapshot AttemptOption.isCorrect; ERD.md:19 có mustChangePassword dù là Should; CONTRIBUTING.md:102-105 phải bắt buộc commit test đỏ riêng; số mốc trong HANDOVER.md lệch nhẹ so với đề.
>
> same pr
> only separate ì >400 line

Skill đã load: `receiving-code-review`, `requesting-code-review`.

### Đã tự kiểm chứng

- Đọc lại các file được trích dẫn trước khi sửa; reviewer subagent đọc toàn bộ file và chạy `git diff`, `git status`, `git check-ignore`, `git show` để đối chiếu base `d758694`.
- `git check-ignore .env.example` không in gì, `EXIT=1`; `git check-ignore -v .env.example` in `.gitignore:35:!.env.example` — file không bị ignore.
- `git diff --stat d758694` trước khi thêm review file: 15 file, 240 insertions, 64 deletions.
- Chạy `npm run lint` (`EXIT=0`, 8 warning từ file plugin bị ignore) và `npm run build` (`EXIT=0`) bằng Node `spawnSync`, output đã lưu trong `docs/reviews/2026-11-26-superpowers.md`.

### AI sai ở đâu

- Viết "Repo chưa có scaffold" trong khi scaffold tồn tại dưới dạng untracked trên máy; reviewer chỉ ra đúng. Đổi thành "HEAD chưa có" và ghi rõ scaffold untracked không phải artifact repo.
- Điều kiện "khi có `package.json`" chỉ thêm ở mục 6 và 9, quên mục 4 và 5 của README; đã bổ sung.
- Để lại cụm "đã duyệt" trong `REQUIREMENTS.md` và "đã chốt" trong `MOCKUPS.md`; đã đổi thành "bản trình duyệt, chờ mentor duyệt".
- Ghi sai `file:line` trong file review trước (`REQUIREMENTS.md:94` thay vì `:95`); đã sửa.
- Đưa D-19 vào như quyết định chốt dù tự ghi "phải xin mentor"; đã thêm "Chờ mentor xác nhận".

### Findings từ review và quyết định

Reviewer subagent (`requesting-code-review`) ghi 7 finding, lưu tại `docs/reviews/2026-11-26-requesting-code-review.md`. Chấp nhận cả 7: sửa trong PR này cho các finding 1-5, ghi nhận finding 6 là chờ mentor, finding 7 là vi phạm lịch sử PR #1 và commit `d758694` (không rewrite history, từ Mốc 2 dùng branch và PR một việc).

### Limitations

- Reviewer không chạy lại npm; output lint/build được trích từ file review trước, không phải lần chạy mới.
- `typecheck`, `test`, `format:check`, `check:language`, `test:e2e` chưa có script; chưa kiểm chứng.
- D-19 chờ mentor xác nhận; không có bằng chứng duyệt wireframe.

---

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
