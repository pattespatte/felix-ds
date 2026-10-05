# Idle-time Task – felix-ds design-token export (DTCG)

You are working autonomously and unattended on **felix-ds** – adding a one-way W3C design-token (DTCG) export to the theme package: a bun script that compiles the full composed theme (upstream `@fkui/theme-default` plus the felix profile overrides, light and dark) and emits `tokens/light.json` + `tokens/dark.json`, a parity test suite, packaging and bilingual docs. No human can answer during this run: do not ask questions and do not make decisions that require approval. Follow this prompt and the documents it points to. The run is complete when every task of phases 1–3 in the plan is `[x]` with a one-line note, the phase-4 prep is done and handed over (that release itself is owner-gated – see below), the clavix-verify audit has run, all changes are committed locally with conventional commits, and a self-contained final report has been written.

## Canonical documents for this run

- PRD: `.clavix/outputs/felix-ds-design-tokens/full-prd.md` – the owner decisions of 2026-10-05 recorded there are binding (tool-agnostic DTCG; heading typography skipped in v1; `--f-logo-image-*` excluded; one-way export, SCSS stays the source of truth).
- Plan: `.clavix/outputs/felix-ds-design-tokens/tasks.md` – 8 tasks in 4 phases with task IDs, exact file paths and per-task checks. Execute task-by-task in order using the clavix-implement skill; when the implementable tasks are done, audit with clavix-verify as the plan header instructs.
- This prompt and the two documents above govern this run. The workspace `AGENTS.md` remains canonical for the hard rules.

## Pre-answered questions (nobody will answer during this run)

The clavix-implement skill normally asks interactively; these answers are fixed for this run:

- **Scope: `all`** – every pending task in `.clavix/outputs/felix-ds-design-tokens/tasks.md` (the only tasks.md in this repo), in plan order.
- **"Continue?" after each task: yes, always** – proceed to the next task without pausing.
- **Commit strategy: per-task** – local conventional commits only (workspace rule: a task is done when its checks pass, it is checked off in tasks.md with a one-line note, and the changes are committed). Never push, never publish.
- **Phase 4 is owner-gated.** Execute only its prep sub-items: add the parity step (`bun install --frozen-lockfile` + `bun test`) before the publish job in `.github/workflows/release.yml`, and run `bun run changelog` so the entry is staged. Then leave the task `- [ ]` with a note that the prep is done and the release awaits the owner, and move on. Never edit `package.json` version, never dispatch a workflow, never publish.
- **Blocked tasks:** the skill's "ask for guidance" step becomes the workspace rule – mark the task `BLOCKED:` in tasks.md with a short explanation, leave no half-finished code, commit what is clean, and continue with the next task. If a verification fails 3+ fix attempts, treat the task as BLOCKED, not as done.
- **Before task 1:** commit the planning documents as `docs(plan): add DTCG design-token export PRD, plan and idle-task prompt` so `.clavix/` is tracked from the start.

## Current state (2026-10-05)

- Repo `~/repo/felix-ds/` (reachable via the `felix-ds-codebase/` symlink from this workspace), branch `main` at `5414be9`, in sync with `origin/main`; working tree clean except the untracked `.clavix/` planning documents.
- Package version 1.0.1. `tokens/` does not exist yet. There are no unit tests yet – `scripts/tokens.test.ts` will be the repo's first `bun test` suite.
- No new dependencies are needed and none may be added: `node_modules/` is installed (`sass`, `@fkui/theme-default` 6.60.0 present). Do not run installs and do not touch the lockfile.
- `dist/` is gitignored and irrelevant here: the extraction script and the parity tests compile the theme themselves via the sass JS API (the shipped `dist/felix.css` is light-only and must not be used).

## Rules (canonical: AGENTS.md in this workspace)

- Neutrality: no real organisation names, logos, trademarks or brand references in any file you create – code, tokens JSON, docs, comments, commit messages. `@fkui/*` package names and the `--f-*`/`--fkds-*` token prefixes are existing technical names and fine.
- Never publish: no `git push`, no `npm publish`, no workflow dispatch, no uploads to external services. Local commits at task boundaries are pre-approved.
- No fork, single package: FKUI is consumed as public npm packages only; no new build tools or dependencies (bun + sass only); the export introduces no new design values.
- The SCSS theme sources (`src/**`) must not change: this feature adds an export alongside them. If a task seems to require editing `src/theme/**`, that is a misread – mark it BLOCKED with that explanation.
- Verification is the Iron Law: a task is never marked `[x]` without the check commands from its task note having actually run and passed in this run. `bun test` must stay green from phase 2 onwards through every later task.
- End state: clean working tree (everything committed, nothing pushed).

## Workspace layout

- Theme repo: `~/repo/felix-ds/` via `felix-ds-codebase/`. Key files: `src/theme/_default.scss` (composed light/dark mixins; configure `$global: false` when compiling per mode), `scripts/fkui.ts` (house style for bun scripts – Swedish doc comments, `node:` imports, `ROOT` from `import.meta.url`), `package.json` (version 1.0.1, `files`), `README.md` (bilingual, Swedish half first), `docs/*.{en,sv}.md` (bilingual doc pairs), `.github/workflows/release.yml`.
- Read-only references (should not be needed): `~/repo/fkui/`, `~/repo/helix/`.
- Planning documents: `.clavix/outputs/felix-ds-design-tokens/` (this prompt, `full-prd.md`, `quick-prd.md`, `tasks.md`).

## Final gates and report

After phase 3 and the phase-4 prep, before writing the report:

1. `bun test` – green (parity, structure, staleness).
2. `bun scripts/tokens.ts` twice – the second run must produce zero `git diff` (determinism).
3. `command npm pack --dry-run` – the tarball lists `tokens/light.json` and `tokens/dark.json` and excludes playground/e2e.
4. Run the clavix-verify skill against the PRD; fix findings that are within this plan's scope; anything owner-gated or outside the PRD goes into the report instead.

The final report must state: tasks completed and their one-line notes, the commit list, every documented decision from task 1's value-shape audit, the flagged `release.yml` change, the phase-4 handover (the owner releases 1.0.1 → 1.1.0 via the runbook in `docs/release.en.md`), and any BLOCKED items with their reasons.
