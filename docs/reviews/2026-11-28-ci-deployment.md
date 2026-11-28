# Code review — Branch protection `main` theo CI (2026-11-28)

- **Skill:** requesting-code-review (self-review; controller loại trừ reviewer/subagent trong brief của task này)
- **Phạm vi:** Chỉ cấu hình branch protection của nhánh `main` trên `khanhtung2410/test-site` qua GitHub API; không đổi code ứng dụng. Đối chiếu `required_status_checks.contexts` với tên job của `.github/workflows/ci.yml`.
- **Base:** `7d7391b817d18aa987217acde6b5bdff672dbc38` | **Head:** `7d7391b817d18aa987217acde6b5bdff672dbc38` (`fix(deploy): tolerate missing previous production deployment`)
- **Prompt nguyên văn:**

> You are a subagent spawned by another session.
> You are implementing Task 4 of 4: branch protection with required CI checks for the CI infrastructure plan.
>
> Read this file FIRST — it is your requirements, with exact values to use verbatim:
> D:\thuc tap\test-site\.superpowers\sdd\2026-11-28-ci-deploy-infrastructure\task-4-brief.md
>
> Design authority: docs/superpowers/specs/2026-11-28-ci-deploy-infrastructure-design.md (read only if brief is unclear).
>
> ## Context
>
> Work from D:\thuc tap\test-site on branch `feature/ci-deploy-infrastructure`, HEAD 7d7391b. Task 3 created `.github/workflows/ci.yml` with job ids/names exactly `static`, `test`, `build`, `e2e`. Current `main` protection (from PR #16) has `contexts=[]`, 1 approval, dismiss stale, conversation resolution, enforce admins, no force push/deletions. GitHub CLI `gh` is authenticated as khanhtung2410.
>
> ## Global constraints (binding)
>
> - This task changes GitHub configuration via API, not application code.
> - Required contexts must match the CI job names exactly.
> - Keep 1 approval, dismiss stale, conversation resolution, enforce admins, no force push/deletions; add `strict=true`.
> - Do NOT merge any PR and do NOT use admin override to bypass protection.
> - Record API output verbatim in `docs/reviews/2026-11-28-ci-deployment.md` with exact commit SHA of HEAD and skill id `requesting-code-review`.
> - Verify GET after PUT; if contexts mismatch, fix before reporting.
> - No AI_LOG change (controller owns it at final pass). Commit only the review file.
>
> ## Your job
>
> Follow the brief steps, write the review file with full API output, commit. No subagents, no reviewer, no merge, no push to main.
>
> Return ONLY: Status, commit SHA + subject, one-line verification summary, concerns, report path.

## Phương pháp

Tự review cấu hình GitHub theo đúng bốn bước của brief. Đọc `task-4-brief.md`, `.github/workflows/ci.yml` (dòng 9-94), `package.json` và các file test trước khi đổi. Load skill `requesting-code-review` bằng id đúng; skill khuyến nghị dispatch reviewer nhưng brief của controller cấm subagent/reviewer nên không dispatch. Chạy GET trước để lưu trạng thái cũ, PUT payload đầy đủ (mọi field bắt buộc của endpoint, `restrictions: null`), rồi GET lại để đối chiếu `contexts`. Không chạy lệnh merge, không dùng cờ `--admin`, không push lên `main`. Mọi output API được dán nguyên văn ở phần Output kiểm chứng.

Payload PUT (`required_status_checks.strict=true`, `contexts=["static","test","build","e2e"]`, `enforce_admins=true`, `required_approving_review_count=1`, `dismiss_stale_reviews=true`, `required_conversation_resolution=true`, `allow_force_pushes=false`, `allow_deletions=false`).

## Phát hiện và quyết định

| # | Mức độ · file:line | Cách tái hiện / ảnh hưởng | Quyết định |
|---|---|---|---|
| 1 | Minor · GitHub config `main` (trước PUT) | `GET .../branches/main/protection` trả `required_status_checks.contexts=[]`: PR có thể merge mà không có check CI nào được yêu cầu | **Accepted** — đã PUT `contexts=["static","test","build","e2e"]` với `strict=true`; GET sau PUT trả đúng bốn context |
| 2 | Minor · `.github/workflows/ci.yml:10,34,50,73` | Giá trị context là `name:` của job, không phải id ổn định do GitHub cấp; nếu đổi `name` job về sau thì protection trôi và block PR | **Rejected** — brief yêu cầu khớp đúng tên job hiện tại và task này không đổi workflow; ghi chú để controller cập nhật protection nếu đổi tên job |

## Không đánh giá

- Chạy lại bộ check `npm`: task này chỉ đổi config GitHub; đã đọc `package.json` để đối chiếu script (`test` = `vitest run`, `test:e2e` = `playwright test`) nhưng không chạy bộ check vì không có thay đổi code.
- Nội dung CI workflow (Task 3) và deploy workflow (Task 2): chỉ đọc để lấy tên job, không review lại.
- Merge PR, admin override, push lên `main`: bị brief cấm rõ ràng.
- AI_LOG: controller cập nhật ở final pass; task này không sửa file.

## Đối chiếu checklist với bằng chứng

| Tuyên bố | Test hoặc output | Kết quả |
|---|---|---|
| `contexts` khớp đúng tên job `static`, `test`, `build`, `e2e` | GET sau PUT trả `["static","test","build","e2e"]`; `ci.yml` có bốn `name:` tương ứng | đạt |
| Thêm `strict=true` | GET sau PUT: `"strict":true` | đạt |
| Giữ 1 approval | GET sau PUT: `"required_approving_review_count":1` | đạt |
| Giữ dismiss stale reviews | GET sau PUT: `"dismiss_stale_reviews":true` | đạt |
| Giữ conversation resolution | GET sau PUT: `"required_conversation_resolution":{"enabled":true}` | đạt |
| Giữ enforce admins | GET sau PUT: `"enforce_admins":{"enabled":true}` | đạt |
| Cấm force push và xóa branch | GET sau PUT: `"allow_force_pushes":{"enabled":false}`, `"allow_deletions":{"enabled":false}` | đạt |
| Kiểm chứng GET sau PUT, sửa nếu lệch | GET sau PUT khớp PUT response; không cần sửa lại | đạt |
| Không merge, không dùng admin override | Không có lệnh `gh pr merge` hay cờ `--admin` trong quá trình thực hiện; HEAD vẫn là `7d7391b...` | đạt |
| Commit chỉ file review, không đổi AI_LOG | `git status --short` trước commit chỉ có file review này | đạt |

## Output kiểm chứng

GET trước PUT:

```text
$ gh api repos/khanhtung2410/test-site/branches/main/protection
{"url":"https://api.github.com/repos/khanhtung2410/test-site/branches/main/protection","required_status_checks":{"url":"https://api.github.com/repos/khanhtung2410/test-site/branches/main/protection/required_status_checks","strict":true,"contexts":[],"contexts_url":"https://api.github.com/repos/khanhtung2410/test-site/branches/main/protection/required_status_checks/contexts","checks":[]},"required_pull_request_reviews":{"url":"https://api.github.com/repos/khanhtung2410/test-site/branches/main/protection/required_pull_request_reviews","dismiss_stale_reviews":true,"require_code_owner_reviews":false,"require_last_push_approval":false,"required_approving_review_count":1},"required_signatures":{"url":"https://api.github.com/repos/khanhtung2410/test-site/branches/main/protection/required_signatures","enabled":false},"enforce_admins":{"url":"https://api.github.com/repos/khanhtung2410/test-site/branches/main/protection/enforce_admins","enabled":true},"required_linear_history":{"enabled":false},"allow_force_pushes":{"enabled":false},"allow_deletions":{"enabled":false},"block_creations":{"enabled":false},"required_conversation_resolution":{"enabled":true},"lock_branch":{"enabled":false},"allow_fork_syncing":{"enabled":false}}
```

PUT:

```text
$ gh api --method PUT repos/khanhtung2410/test-site/branches/main/protection --input protection-payload.json
{"url":"https://api.github.com/repos/khanhtung2410/test-site/branches/main/protection","required_status_checks":{"url":"https://api.github.com/repos/khanhtung2410/test-site/branches/main/protection/required_status_checks","strict":true,"contexts":["static","test","build","e2e"],"contexts_url":"https://api.github.com/repos/khanhtung2410/test-site/branches/main/protection/required_status_checks/contexts","checks":[{"context":"static","app_id":null},{"context":"test","app_id":null},{"context":"build","app_id":null},{"context":"e2e","app_id":null}]},"required_pull_request_reviews":{"url":"https://api.github.com/repos/khanhtung2410/test-site/branches/main/protection/required_pull_request_reviews","dismiss_stale_reviews":true,"require_code_owner_reviews":false,"require_last_push_approval":false,"required_approving_review_count":1},"required_signatures":{"url":"https://api.github.com/repos/khanhtung2410/test-site/branches/main/protection/required_signatures","enabled":false},"enforce_admins":{"url":"https://api.github.com/repos/khanhtung2410/test-site/branches/main/protection/enforce_admins","enabled":true},"required_linear_history":{"enabled":false},"allow_force_pushes":{"enabled":false},"allow_deletions":{"enabled":false},"block_creations":{"enabled":false},"required_conversation_resolution":{"enabled":true},"lock_branch":{"enabled":false},"allow_fork_syncing":{"enabled":false}}
```

GET sau PUT:

```text
$ gh api repos/khanhtung2410/test-site/branches/main/protection; "EXIT=$LASTEXITCODE"
{"url":"https://api.github.com/repos/khanhtung2410/test-site/branches/main/protection","required_status_checks":{"url":"https://api.github.com/repos/khanhtung2410/test-site/branches/main/protection/required_status_checks","strict":true,"contexts":["static","test","build","e2e"],"contexts_url":"https://api.github.com/repos/khanhtung2410/test-site/branches/main/protection/required_status_checks/contexts","checks":[{"context":"static","app_id":null},{"context":"test","app_id":null},{"context":"build","app_id":null},{"context":"e2e","app_id":null}]},"required_pull_request_reviews":{"url":"https://api.github.com/repos/khanhtung2410/test-site/branches/main/protection/required_pull_request_reviews","dismiss_stale_reviews":true,"require_code_owner_reviews":false,"require_last_push_approval":false,"required_approving_review_count":1},"required_signatures":{"url":"https://api.github.com/repos/khanhtung2410/test-site/branches/main/protection/required_signatures","enabled":false},"enforce_admins":{"url":"https://api.github.com/repos/khanhtung2410/test-site/branches/main/protection/enforce_admins","enabled":true},"required_linear_history":{"enabled":false},"allow_force_pushes":{"enabled":false},"allow_deletions":{"enabled":false},"block_creations":{"enabled":false},"required_conversation_resolution":{"enabled":true},"lock_branch":{"enabled":false},"allow_fork_syncing":{"enabled":false}}
EXIT=0
```

Trạng thái git và tên job (đối chiếu nguồn của `contexts`):

```text
$ git rev-parse HEAD
7d7391b817d18aa987217acde6b5bdff672dbc38
EXIT_HEAD=0
$ git status --short
EXIT_STATUS=0
$ Select-String -Path .github/workflows/ci.yml -Pattern '^  (static|test|build|e2e):','^    name: (static|test|build|e2e)$'
  static:
    name: static
  test:
    name: test
  build:
    name: build
  e2e:
    name: e2e
```

## Giới hạn

- Không dispatch reviewer subagent vì brief của controller cấm; đây là self-review của một thay đổi cấu hình, không phải review code.
- Chưa kiểm chứng bằng một PR thật rằng bốn check được báo lên và block merge; điều đó cần bằng chứng từ lịch sử check của PR do controller mở.
- `required_signatures` vẫn `enabled:false`; endpoint PUT dùng không quản lý field này, brief không yêu cầu đổi.
- Chưa chạy bộ check `npm` vì không có thay đổi code trong task này; trạng thái check của CI là trách nhiệm của Task 3.

Link entry AI_LOG: controller thêm ở final pass.
