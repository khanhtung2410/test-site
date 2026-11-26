# Project rules for coding agents

This file is the standing agreement for every agent working in this repository. Apply it to **every** request; do not wait to be told.

## 1. Standing working agreement

1. Pull the latest `main` from `origin` first (`git fetch origin` + reset/branch from `origin/main`), then create a branch for the work. Never work directly on `main`.
2. Read the **whole** relevant files before editing; never patch from a snippet or assumption.
3. Update docs when behavior, configuration, scope or a decision changes. The product spec is `docs/SPEC.md`; detailed requirements are `docs/REQUIREMENTS.md`.
4. Add an entry to `AI_LOG.md` using the established format: verbatim prompt, what was self-verified, **"AI sai ở đâu"** with concrete examples, and limitations. Prepend the new entry and verify the previous `##` header is still present immediately below the new `---`.
5. Create the PR with `gh`, using a Conventional Commits title and a body that follows `docs/CONTRIBUTING.md`.
6. Capture all check-command output with Node `spawnSync` in UTF-8 (`NO_COLOR=1`), never PowerShell redirection. PowerShell writes UTF-16 here and characters such as `✓ ─ │ · —` become mojibake in code blocks.
7. **Verification before completion:** before opening a PR and before the final response, re-run the full check set from `docs/CONTRIBUTING.md` (`npm run lint`, `npm run typecheck`, `npm test`, `npm run format:check`, `npm run build`) plus `npm run test:e2e` when behavior changed. Record the **full output with exit code**; write "đạt/pass" only when that output is attached. Never claim success from a previous run or from an agent report. Not-yet: `npm test` and `npm run test:e2e` have no script in this repo; record them as "chưa kiểm chứng" until added.
8. When creating a PR with `gh`, always give the user the PR link in the final response.
9. **Vietnamese and English letters only in anything you write** — docs, code/comments/identifiers, PR titles and bodies, commit messages. Any other letter (Han, Hangul, Cyrillic, stray Latin letters from translation/autocomplete, mojibake) is a defect. Non-letter characters (digits, punctuation, symbols) are allowed. Check before committing with `npm run check:language` when the script exists; its output must be clean. Do not rewrite historical verbatim content solely to enforce this rule without asking.
10. **Superpowers protocol:** load the relevant skill by its exact id (for example `brainstorming`, `writing-plans`, `test-driven-development`, `requesting-code-review`, `systematic-debugging`) and record that id in the review file. Feature-level designs will go to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` and plans to `docs/superpowers/plans/` (not-yet: those directories do not exist in this repo). The product-level spec remains `docs/SPEC.md`.
11. **A11y requirements are mandatory even when the spec is silent.** Never close a required accessibility behavior as "non-goal / not in spec"; ask the project owner first. "axe did not catch it" is not a reason to skip it.
12. **The PR body must contain the full check output.** Never replace the captured verification with a link or a summary only. Paste the complete stdout/stderr of every command in rule 7 with each `EXIT=` line.
13. **Performance numbers live only in `docs/PERFORMANCE.md`.** Other docs and PRs link to it; never copy the numbers elsewhere.

## 2. Exam-specific invariants (non-negotiable)

Any change touching the attempt payload, clock, state transitions, scoring or authorization must keep these true and must add or update the named test.

| ID | Invariant | What to check before merge |
|---|---|---|
| K1 | Correct answers never reach the browser during an attempt. | DTO selects only allowed fields; no `isCorrect` in client props, RSC payload or action responses; E2E scans HTML and network responses. |
| K2 | Time limits are enforced only by the server. | `expiresAt` set at start; expiry checked inside the transaction; no client clock used for decisions; fake-timer test covers save after expiry. |
| K3 | Attempt state is unambiguous. | Only `IN_PROGRESS → SUBMITTED` or `IN_PROGRESS → EXPIRED`; submit/start are idempotent; `updateMany` guard and unique `(examId, studentId, attemptNumber)` are present; parallel tests pass on real PostgreSQL. |
| K4 | Answers are not lost on reload, tab close or network loss. | Each selection is saved immediately; `upsert` on `(attemptId, attemptQuestionId)`; unsaved indicator per question; offline E2E passes. |
| K5 | A started or submitted exam cannot be changed retroactively. | Snapshot `AttemptQuestion`/`AttemptOption` at start; scoring uses the snapshot; editing or archiving a question does not change old scores; no regrade action. |
| K6 | Shuffle is stable per attempt. | Seed stored server-side; deterministic Fisher–Yates; reload keeps order; two attempts differ; scoring uses option IDs, not positions. |
| K7 | Multi-answer scoring is all-or-nothing. | Pure `scoreAttempt`; no partial credit, no negative marking; table-driven tests cover empty, all correct, missing, extra, all wrong; rule shown before start. |
| K8 | Authorization is server-side. | Every page/action calls `requireRole`/`assertOwn*`; unauthorized record returns 404; direct Server Action calls with a wrong-role account are rejected. |

Additional safety rules:

- Never log passwords, session tokens, `AUTH_SECRET`, or correct answers.
- Never use `prisma migrate reset` or `--force-reset`; use dedicated `exam_test` / `exam_e2e` databases.
- Never deploy manually; production deploys only through `.github/workflows/deploy.yml` (not-yet: that workflow does not exist in this repo).
- Never edit production data by hand; use a migration or a reviewed script.
- Never return a Prisma object across the server/client boundary; map to an explicit DTO.
- Never add a "check answer" endpoint or UI during an attempt.

## 3. Tools — Superpowers for OpenCode

Source of truth: <https://github.com/obra/superpowers/blob/main/docs/README.opencode.md>.

- **Verified local setup:** OpenCode CLI is **1.18.35 (V1)**, so the global config at `~/.config/opencode/opencode.jsonc` uses the V1 key:
  `"plugin": ["superpowers@git+https://github.com/obra/superpowers.git"]`. Do **not** switch to the V2 `plugins` key unless OpenCode **2.0.4+** is installed.
- **Verify the plugin is loaded:** ask "Tell me about your superpowers", or list skills with the native `skill` tool. Logs: `opencode run --print-logs "hello" 2>&1 | grep -i superpowers`.
- **Tool mapping used by this harness** (skills describe actions, not tool names):

  | Skill action | Tool here |
  |---|---|
  | List / load a skill | `skill` tool with the **bare id** (`superpowers:brainstorming` → `id: "brainstorming"`) |
  | Subagent (general-purpose) | `subagent` with `agent: "general"` (or `"explore"`); continue with `sessionID` |
  | Create todo / mark complete | **no todo tool** — track the plan in a markdown file or the harness plan facility |
  | Read a file | `read` |
  | Create / edit / delete files | `write`, `edit`, `shell` (use `patch` with `patchText` when available) |
  | Run a shell command | `shell` (`command`, `workdir`, `timeout`, `background`) — not `bash` |
  | Search file contents / names | `grep`, `glob` |
  | Fetch a URL / search the web | `webfetch`, `websearch` |

- **Skill priority:** project `.opencode/skills/` > personal `~/.config/opencode/skills/` > bundled Superpowers skills. Use distinct names for personal/project skills — on V1, a bundled skill can win a name collision.
- **Updating:** pin a release in the spec (`...git#v7.0.2`) if needed; if updates do not appear, clear OpenCode's package cache or reinstall the plugin. Migrating to V2 means changing `plugin` to `plugins` and removing the old `~/.config/opencode/plugins/superpowers.js` and `~/.config/opencode/skills/superpowers` symlinks.

## 4. Review records

- After **every** review round (any review produced by a skill such as `requesting-code-review`, or a self-review done with Superpowers), save the complete result to `docs/reviews/YYYY-MM-DD-<skill>.md`. `<skill>` is the skill id actually used without the `superpowers:` prefix; a self-review uses `superpowers`. Use the date you run the review, in the agent's local time. Keep one file per round; do not overwrite a previous round.
- For **every** finding, the file must state `file:line`, severity (`Critical` / `Important` / `Minor`), reproduction steps, and an explicit decision: **Accepted** (fixed in this PR or scheduled in a named follow-up PR/branch) or **Rejected** (with the concrete reason). Never silently drop a finding, and never accept an AI suggestion without re-reading the real source yourself first.
- In `AI_LOG.md`, prepend a new entry containing the **verbatim prompt used**, **which findings were accepted** (with the PR/branch they go to), and **which findings were rejected and why**. Link to the review file.
- If a review round adds nothing beyond the mentor checklist, say so explicitly instead of presenting that checklist as a new result.
- Use `docs/reviews/TEMPLATE.md` for every round.

## 5. Documentation map

| File | Purpose |
|---|---|
| `README.md` | Project overview, local setup, scripts, structure |
| `docs/SPEC.md` | Product spec, decisions, flows, wireframes, acceptance |
| `docs/MOCKUPS.md` | Figma mockups, design tokens, screen states, local plugin |
| `docs/REQUIREMENTS.md` | FR/NFR catalog, business rules, validation, traceability |
| `docs/ARCHITECTURE.md` | Layers, modules, request flows, transactions, ADRs |
| `docs/ERD.md` | Data model and constraints |
| `docs/PERMISSIONS.md` | Role matrix and record-level rules |
| `docs/SECURITY.md` | Threat model, controls, missing checks |
| `docs/CONTRIBUTING.md` | Branch, commit, PR, review, TDD |
| `docs/DEPLOY.md` | CI/CD, migrations, rollback, production hygiene |
| `docs/PERFORMANCE.md` | Performance targets and measurement policy |
| `docs/HUONG_DAN_VAN_HANH.md` | Operator guide for admin/teacher/student |
| `docs/HANDOVER.md` | Current status, remaining work, decisions, risks |
| `docs/reviews/` | One file per review round |
| `AI_LOG.md` | AI usage log with prompts, mistakes and limitations |

Documentation language: Vietnamese prose with English technical terms, identifiers and code. `AGENTS.md`, `ERD.md` and `reviews/TEMPLATE.md` may stay in English for precision.

## 6. Next.js version rules

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 7. Evidence, process and operations

- Every conclusion in a PR, review file or report must carry proof: command output with `EXIT=`, a CI run link, or an image. If something is not verified, write "chưa kiểm chứng". Never claim "fixed", "root cause found" or "pass" without proof.
- Numbers live only in `docs/PERFORMANCE.md`. Other docs and PRs link there; they do not copy the figures.
- For every large feature, run `brainstorming`, then write a design spec, then a plan, before implementation. Save spec and plan under `docs/superpowers/`.
- K2-K7 require TDD with a separate red-test commit before the implementation commit.
- Run `requesting-code-review` before each milestone; save the result under `docs/reviews/` using `docs/reviews/TEMPLATE.md`. Fold review-status-only changes into the fix PR; do not open a review-only PR.
- Deploy only through `.github/workflows/deploy.yml` (not-yet: file chưa có trong repo); never deploy manually from a personal machine. Clean up production test data after checking.
