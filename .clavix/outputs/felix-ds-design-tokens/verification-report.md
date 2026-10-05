# Verification Report: felix-ds design-token export (DTCG)

**Spec**: `tasks.md` (phases 1–4) + `full-prd.md` | **Status**: Pass (0 critical, 0 major, 1 minor fixed, 1 outdated resolved)

Audited 2026-10-05 against 8 local commits `5884ed1..12c9a61` on `main` (nothing pushed).

## 🔍 Review Comments

| ID | Severity | Location | Issue | Resolution |
|:--:|:--------:|:---------|:------|:-----------|
| #1 | ⚪ OUTDATED | `full-prd.md` | PRD said the logo tokens were the only planned exclusion and top-level groups are `f`/`fkds`; the fail-loud audit discovered: `fkui-theme-default-version` excluded (package metadata), 24 tokens kept without `$type` (composite shorthands), extra top-level groups (`i`, `padding`, root leaves `size`/`min`/`max`), and 4 whole-value aliases (not 2). | **Resolved**: Implementation Addendum appended to `full-prd.md`; decisions were already recorded in tasks.md task notes and docs/tokens.*.md. |
| #2 | 🟡 MINOR | `tasks.md` phase-1-extract-01 note | ”185 token/namn per läge” could be misread as the exported count (185 parsed → 182 exported after 3 exclusions). | **Fixed**: note now states 185 parsed, 182 exported. |

No 🔴 CRITICAL or 🟠 MAJOR findings. Code-level checks: no secrets, no `any`, no new dependencies, CLI output only under `import.meta.main`, alias loops guarded on both the CSS and JSON sides, fail-loud preserved (unlisted unclassifiable shapes throw).

## ✅ Requirement coverage (PRD Must-Haves)

1. **Extraction script** – `scripts/tokens.ts`: compiles both composed modes via `sass.compileString` (`$global: false`, own `:root` wrapper; `dist/felix.css` unused), merges all exact `:root` blocks with last-wins cascade, classifies by DTCG type, deterministic emission. Verified.
2. **Token files** – `tokens/light.json` + `tokens/dark.json`: 182 tokens each (identical name sets), shared tokens duplicated, committed, shipped (`files` += `tokens`; `npm pack --dry-run` lists both). Verified.
3. **Parity test** – `scripts/tokens.test.ts` (12 tests, 1067 assertions): (a) name set + every value type-aware against freshly compiled CSS, (b) structure + alias resolution, (c) staleness guard. Negative checks verified: tampered JSON value → failure naming the token; edited SCSS → ”föråldrad” failure. Verified.
4. **Packaging and docs** – README sections in both language halves + scripts tables; bilingual `docs/tokens.{sv,en}.md` (sv source of truth, Swedish writing rules). Verified.
5. **Release** – owner-gated: `release.yml` gained a `bun test` parity gate after install (flagged to owner); changelog staged with an Unreleased section; version untouched at 1.0.1; handover note left in tasks.md (task deliberately unchecked). Verified.

## 🚦 Final gates (re-run after fixes)

- `bun test`: 12 pass / 0 fail
- `bun scripts/tokens.ts` ×2: zero `git diff` after the second run (determinism)
- `command npm pack --dry-run`: lists `tokens/light.json` + `tokens/dark.json`
- Working tree clean; `main` ahead of `origin/main` by 8 local commits (pushes are never performed by agents)

## Out of scope confirmed untouched

No reverse import, no shipped Style Dictionary config, no Figma publishing workflow, no site migrations, no composite heading typography tokens, no bulk descriptions, no multi-theme scheme beyond the two files.

## Post-verification fix round (2026-10-05 – owner's external DTCG validation)

The owner validated the generated files with an external DTCG validator before releasing. Verdict per finding class:

| Validator finding | Verdict | Action |
|---|---|---|
| 6 × DANGLING_REFERENCE on all alias tokens | **True error** – aliases were emitted as `{$path}` with a stray `$`; the DTCG spec reserves `$` for property names, so the validator looked for `$fkds…` and found nothing. (The PRD's inline alias example carried the wrong syntax; the plan's was correct. The parity suite used the same wrong regex on both sides and could not catch it.) | **Fixed**: `toAlias()` now emits `{path}`; all regexes/expectations in `scripts/tokens.test.ts` updated to the spec syntax. |
| 2 × INVALID_COMPOSITE_FIELD on `f.button.discrete.radius.hover`, `f.modal.close.button.padding` | **True error** – these `none` values belong to a radius and a padding; the classifier had typed every `none` as `shadow`. | **Fixed**: `none` is shadow-typed only for shadow-named tokens; the two moved to UNTYPED (now 26). |
| 3 × INVALID_COMPOSITE_FIELD on `f.button.shadow`, `f.box.modal.shadow`, `f.input.shadow.inset` | Documented deviation (PRD: `"none"` shadows kept as `$type: "shadow"`, `$value: "none"`). | Kept; docs now state the warning is expected. |
| 24 × MISSING_TYPE | Documented decision (composite shorthands/keywords without `$type`). | Kept; now 26 after the reclassification, docs updated. |

Post-fix state: distribution per mode 79 color / 55 dimension / 4 duration / 2 fontFamily / 10 number / 6 shadow / 26 untyped (182 tokens); all aliases are `{group.path}` and resolve in-file.

Re-verified after the fixes:
- `bun test`: 13 pass / 0 fail (1076 assertions; +1 regression test for the two untyped `none` tokens)
- `bun scripts/tokens.ts` ×2: zero `git diff` on the second run
- `command npm pack --dry-run`: lists `tokens/light.json` + `tokens/dark.json`

Files changed: `scripts/tokens.ts`, `scripts/tokens.test.ts`, `tokens/light.json`, `tokens/dark.json`, `docs/tokens.sv.md`, `docs/tokens.en.md`, PRD (alias example corrected + addendum item 6), `tasks.md` correction note, this report.

## Second validation round (2026-10-05 – strict tree, `_self` rule)

The owner's second validator pass showed 173 of 182 tokens and one remaining ⛔ DANGLING_REFERENCE (`f.focus.box.shadow` → `fkds.focus.indicator.color.background`). Root cause: the emitter had allowed "mixed nodes" (a token object that also serves as a group). Per DTCG, a node with `$value` is a token and its non-`$` children are ignored by conformant tools – nine tokens were invisible (`f.font.family.code`, `f.button.shadow.hover/active`, the five `feedback.background.*.strong`, `fkds.focus.indicator.color.background`) and the alias into one of them dangled.

**Fix**: strict tree with a reserved `_self` segment – a token whose name is a strict prefix of another token's name nests under `_self` (9 relocations; e.g. `f.font.family._self` beside `f.font.family.code`, `fkds.focus.indicator.color._self` beside `.background`). Round trip unchanged mechanically (hyphen-join, drop `_self`); underscore never occurs in the name vocabulary. The build now asserts no mixed nodes and no empty groups (`assertStrictTree`); the test suite gained a strict-tree test and `_self`-aware flattening.

Re-verified: `bun test` 14/14 green (1418 assertions); regeneration byte-identical to committed files; `npm pack --dry-run` lists both token files. External validation after this fix (owner's third pass, 2026-10-05): 182 tokens, 0 errors, 31 warnings – 26 missing `$type` + 5 INVALID_COMPOSITE_FIELD for the `"none"` shadows, now all five visible (`f.button.shadow._self`/`.hover`/`.active`, `f.box.modal.shadow`, `f.input.shadow.inset`) where the pre-strict-tree validator could only see three. Every warning corresponds to a documented deviation; nothing unexplained remains.
