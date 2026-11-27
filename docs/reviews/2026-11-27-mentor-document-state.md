# Code review — đợt 2, trạng thái tài liệu (2026-11-27)

- **Skill:** receiving-code-review (đọc phản hồi mentor), verification-before-completion
- **Phạm vi:** docs trên `main` tại `39d4c2d`, không đánh giá code tính năng.
- **Base/Head:** `39d4c2d` (HEAD mentor review) → branch `docs/mentor-round2-rules`.
- **Prompt nguyên văn:** xem file `checklist-dot-2 (2).html` do người dùng đính kèm. Không ghi vào `AI_LOG.md` theo yêu cầu.

## Bằng chứng mentor và kiểm chứng lại

```text
npm run typecheck sau rm -rf .next:
src/app/layout.tsx(9,50): error TS2304: Cannot find name 'LayoutProps'.
EXIT=2

gh api repos/khanhtung2410/test-site/branches/main/protection:
protected=true, reviews=1, enforce_admins=true, force_pushes=false, contexts=[]
```

## Phát hiện và quyết định

| ID | Mức độ | Vấn đề | Quyết định |
|---|---|---|---|
| A-R1 | Blocker | S6 vẫn là màn 403 đổi nhãn | **Ghi nhận là chưa đạt** trong `MOCKUPS.md`; cần vẽ lại ảnh "Không tìm thấy trang" dùng chung cho mọi case. Không tự sửa ảnh trong đợt docs-only. |
| A-R2 | Blocker | `typecheck` đỏ từ clone sạch | **Đã kiểm chứng lại EXIT=2**; ghi rõ trong `README.md`/`DEPLOY.md`, đưa rule "next typegen" vào `AGENTS.md`. Chưa đổi script (ngoài phạm vi docs). |
| A-R3 | Blocker | Docs ghi protection 1 approval nhưng 13 PR merge với 0 review | **Accepted** — ghi rõ ngoại lệ admin override trong `DEPLOY.md` và `HANDOVER.md`; API hiện vẫn trả cấu hình như docs. |
| A-R4 | Blocker | Đặt tên 5 giai đoạn là "Mốc 1–5" | **Accepted** — đổi thành "Giai đoạn 1–5" trong README/ARCHITECTURE/HANDOVER/SPEC; giữ 3 mốc theo đề. |
| A-R5 | Blocker | Đã dùng 14 PR, vượt ngân sách | **Accepted** — cập nhật SPEC §13 với thực tế và kế hoạch PR từ `main` mới nhất, gom Dependabot. |
| A-R6 | Blocker | ESLint 10 peer conflict; docs lệch phiên bản | **Accepted** — README/ARCHITECTURE ghi đúng ESLint 10, React 19.3.1; đưa rule "không merge major khi chưa có CI" vào AGENTS. Chưa hạ version (ngoài phạm vi docs). |
| A-R7 | Blocker | K4 × K2 chưa ghi kết quả khi gửi muộn | **Accepted** — D-21 bổ sung luật K2 thắng K4, thông báo UI và dọn IndexedDB. |
| A-R8 | Blocker | FR-19/truy vết K4 chưa có ca reload offline | **Accepted** — cập nhật FR-19 và bảng truy vết K4. |
| A-R9 | Blocker | S7 thiếu số điểm | **Ghi nhận là chưa đạt** trong `MOCKUPS.md`; cần sửa ảnh. |
| C | Quy trình | File review ghi "working tree" thay vì SHA | **Accepted** — đổi Head thành `a25e2dd` và `1acb3b9`. |

## Không đánh giá

- Code tính năng đã dựng trên branch khác — người dùng yêu cầu chỉ đọc `main`.
- CI/deploy production chưa có.

## Đối chiếu checklist

| Tuyên bố | Bằng chứng | Kết quả |
|---|---|---|
| `typecheck` đạt từ clone sạch | Lệnh trên | ❌ EXIT=2 — chưa đạt |
| Branch protection API | `gh api` ở trên | ✅ config đúng, có ngoại lệ override |
| Rule mới trong AGENTS | `AGENTS.md` §8 | ✅ |
| Không ghi AI_LOG | `git diff --name-only` lúc commit | ✅ |

## Giới hạn

Chỉ cập nhật tài liệu; chưa đổi script/package, chưa vẽ lại ảnh S6/S7. Những mục đó vẫn là blocker trước khi duyệt Mốc 1.
