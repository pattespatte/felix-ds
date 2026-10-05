# Implementation Plan

**Project**: felix-ds-design-tokens
**Generated**: 2026-10-05

> **For Claude:** REQUIRED SUB-SKILL: Use clavix-implement to execute this plan task-by-task.
> After all tasks complete, use clavix-verify to audit implementation against PRD.

## Technical Context & Standards

*Detected Stack & Patterns*
- **Architecture**: single-package theme layer – SCSS mixins composing upstream `@fkui/theme-default` (peer `>=6.57.0 <7.0.0`, dev `6.60.0`); no runtime code
- **Tooling**: bun for scripts and tests (`bun test` discovers `*.test.ts`; no unit tests exist yet – this plan adds the first), sass via JS API (`sass` ^1.104.1 already a devDependency; `build:theme` proves `--load-path=node_modules` resolution), Vite + Playwright only for playground/e2e (out of scope here)
- **Conventions**: scripts in `scripts/*.ts` follow `scripts/fkui.ts` style – Swedish doc comments, `node:` imports, `ROOT` resolved from `import.meta.url`, small pure helpers, `fail()` pattern; docs as `docs/*.{en,sv}.md` pairs (Swedish first-class, English mirror); README bilingual with the Swedish half first (~lines 1–279) and English mirror after (~line 281)
- **Process rules** (workspace AGENTS.md): one task at a time; a task is done when its checks pass, it is checked off here with a one-line note, and changes are committed locally (conventional commits; never push, never publish); neutrality – no organisation names in any new file
- **PRD**: `.clavix/outputs/felix-ds-design-tokens/full-prd.md` – all owner decisions of 2026-10-05 are binding: tool-agnostic DTCG, headings skipped in v1, logo tokens excluded, one-way export

*Key mechanics fixed by the PRD and verified against the codebase*
- Compile per mode with `sass.compileString` using an entry that does `@use "src/theme/default" as felix with ($global: false)` then `:root { @include felix.light; }` / `felix.dark`, with `loadPaths` including `node_modules` and the entry URL anchored at the repo root (the shipped `dist/felix.css` is light-only and must not be used)
- Token names: custom property minus `--`, hyphen-split into nested groups under top-level `f` / `fkds`; round-trip is hyphen-join
- Known emitted aliases: `f-page-layout-background` → `var(--fkds-color-background-tertiary)` in both modes; the focus shadow composite contains two `var()` colour parts
- Current version 1.0.1; feature targets 1.1.0 via owner-gated release

---

## Phase 1: Extraction core (`scripts/tokens.ts`)

- [x] **Compile both theme modes and parse root declarations** (ref: PRD Must-Have 1, Architecture) – 185 tokennamn parsade per läge (identiska namnmängder), 182 exporterade efter de 3 exkluderingarna, 0 deklarationer utanför exakt `:root`; sass återöppnar `:root` efter kapslade regler → parsaren slår ihop alla exakta `:root`-block med senaste-vinner. Dokumenterade beslut: (1) `fkui-theme-default-version` (citerad sträng, upstream-paketmetadata) exkluderas; (2) 24 token med CSS-sammansatta värden (`inherit`, `initial`, `ease-out`, flerdelade marginaler/storlekar, transition-kortform) behålls utan `$type` (DTCG-utkast: `$type` är valfri/ärvs); (3) `%`/`lh` → `dimension`, `ms` → `duration`; (4) topnivågrupper blir f, fkds, padding, i + rot-token (size/min/max) – mekanisk avstavning bevarad. Check: `bun scripts/tokens.ts` (granskningsläge) listar båda lägena med alla former täckta. Commit: a2f94c3.
  Task ID: phase-1-extract-01
  > **Implementation**: Create `scripts/tokens.ts` following the `scripts/fkui.ts` house style.
  > **Details**: Export `compileMode(mode: "light" | "dark"): string` (sass JS API as fixed above) and `parseRootDeclarations(css: string): Map<string, string>` (custom property name without `--`, raw value including any `var()` untouched; multi-line values such as the focus shadow must survive). Export `EXCLUDED` = `["f-logo-image-small", "f-logo-image-large"]`. CLI behaviour comes in phase-1-extract-03; this task ends with an **audit step**: print, for both modes, every distinct value shape in the parsed set and check coverage against the PRD type table (color, dimension, fontFamily stack, fontWeight number, unitless number, shadow, whole-value var alias). Any shape not covered stops the task: record it in the task note with a documented decision (mapping rule or explicit exclusion with rationale) per the PRD's fail-loud rule – no silent drops. Check: `bun scripts/tokens.ts` in audit mode lists both modes with zero unresolved shapes (or documented decisions).

- [x] **Classify values into DTCG types** (ref: PRD Technical Requirements – type mapping) – 182 token per läge (185 − 3 exkluderade), identisk fördelning: 79 color, 55 dimension, 4 duration, 2 fontFamily, 10 number, 8 shadow, 24 utan `$type`. Helvärdesalias (4 st) ärver `$type` från måltoken; fokus-skuggan blir shadow-array med aliasfärger; `none`-skuggor behålls som `$value: "none"`. Check: `bun scripts/tokens.ts` skriver ut fördelningen + explicita kontroller (alias, shadow-array, none, fontFamily, fontvikts-tal) – alla ok, exit 0. Korrigerat 2026-10-05 efter ägarens externa DTCG-validering: aliassyntax utan `$` (spec) och `none` på icke-skuggor otypade – ny fördelning 6 shadow + 26 otypade; se verification-report.md.
  Task ID: phase-1-extract-02
  > **Implementation**: Extend `scripts/tokens.ts` with `classify(name: string, value: string): { $type: string; $value: unknown }`.
  > **Details**: color for `#`, `rgb(`, `rgba(`, `hsl(`, `hsla(` values; `dimension` for single `px|rem|em` lengths; `fontFamily` as string array with inner quotes stripped and multi-word names kept as single elements; `fontWeight` and unitless numbers (line-heights) as numbers; shadows parsed into DTCG shadow objects (or an array for the two-ring focus shadow), where a literal `none` stays the string `"none"` with `$type: "shadow"` (documented PRD deviation) and `var()` parts inside the shadow become alias references; a whole-value `var(--x)` becomes the alias string `"{x.with.dots}"`. Unmatched shapes throw with the token name. Add a `DESCRIPTIONS` record mapping the few felix token names whose SCSS comment documents that single token (e.g. `f-page-layout-background`, `f-background-overlay`, `fkds-color-header-text-primary`) to one-line Swedish descriptions; everything else gets no `$description`. Check: classification of both modes throws nowhere; `none`-shadows and both aliases classify as specified.

- [x] **Emit deterministic token files** (ref: PRD Must-Have 1–2) – `tokens/light.json` + `tokens/dark.json` genererade (182 token vardera), 2-mellanslags-indrag, rekursivt sorterade nycklar, LF + avslutande radbrytning, filnivå-`$description` med varning mot handredigering. Blandnoder (token med undergrupp, t.ex. `fkds.color.feedback.background.warning` + `strong`) hanteras med bevarad rundtur; `tokens:build`-skript tillagt i package.json. Check: två körningar i rad gav identiska filer (verifieras igen i slutporten mot git-diff).
  Task ID: phase-1-extract-03
  > **Implementation**: Add emission to `scripts/tokens.ts`; run CLI only under `import.meta.main`; add package.json script `"tokens:build": "bun scripts/tokens.ts"`.
  > **Details**: Nest each token by hyphen-splitting its name into groups under `f` / `fkds` (leaf conflicts with group names are allowed – `f.font.size.xxx.large` note). Each leaf gets `$value`, `$type` (and `$description` when in the map); each file gets a file-level `$description` in Swedish stating it is generated by `scripts/tokens.ts` and must not be hand-edited. Write `tokens/light.json` and `tokens/dark.json` (create `tokens/`), each a complete self-contained mode set with shared tokens duplicated. Deterministic output: recursively sorted keys (`$`-prefixed keys first, then alphabetical), 2-space indent, LF, trailing newline – regeneration must be byte-identical. Check: `bun scripts/tokens.ts` twice in a row produces zero `git diff`; both files parse as JSON and every leaf has `$value` + `$type`.

## Phase 2: Parity test suite (`scripts/tokens.test.ts`)

- [x] **Value parity against freshly compiled CSS** (ref: PRD Must-Have 3) – `scripts/tokens.test.ts` (första bun test-sviten i repot; `bunfig.toml` avgränsar `bun test` till scripts/ så Playwright-specarna inte krockar). Namnmängd + varje värde jäörs typmedvetet mot färskt kompilerad CSS (alias löses på båda sidor); fel nämner token. Check: `bun test` 12/12 grönt, 1067 assertions; negativcheck – manipulerat hex i tokens/light.json fäller med `token --fkds-color-feedback-text-on-warning avviker…`.
  Task ID: phase-2-parity-01
  > **Implementation**: Create `scripts/tokens.test.ts` (bun test; import the exported functions from `scripts/tokens.ts`).
  > **Details**: For each mode: compile fresh via `compileMode`, flatten the committed JSON back to name → resolved value (recursively resolve alias references), serialize typed values to their CSS string form (fontFamily arrays joined with quotes around names containing whitespace; shadow objects joined as `x y blur spread color` with alias colours resolved and `"none"` verbatim; numbers as strings) and assert the name set (minus `EXCLUDED`) and every value equal the compiled declarations. Fail with a diff naming each mismatching token. Check: `bun test` passes; deliberately editing one value in `tokens/light.json` makes it fail naming that token.

- [x] **Structure self-checks and staleness guard** (ref: PRD Must-Have 3) – strukturtest: tomma grupper fäller, blad kräver `$value` (och `$type` utanför whitelistan), alla `{$alias}`-referenser måste lösa sig till ett blad i samma fil; föråldrarvakt: omgenererad fil måste vara byte-identisk med den committade. Check: `bun test` grönt; negativcheck – ändrat värde i `src/theme/light/_variables.scss` fäller med `tokens/light.json är föråldrad – kör bun run tokens:build och committa`. Samma commit som parity-01 (båda tasksen ligger i en svit): 993f95b.
  Task ID: phase-2-parity-02
  > **Implementation**: Extend `scripts/tokens.test.ts`.
  > **Details**: Walk both files asserting every group child is a group or a typed token leaf, no empty groups, and every alias reference (whole-value and inside composite values) resolves to an existing token path in the same file. Staleness: generate both files in memory through the same emission path (or into a temp dir) and require byte-identical equality with the committed files; on mismatch fail with the message "kör `bun scripts/tokens.ts` och committa". Check: `bun test` green; touching `src/theme/light/_variables.scss` (e.g. a temporary hex change) makes the staleness test fail.

## Phase 3: Packaging and documentation

- [x] **Ship the token files and document them in README** (ref: PRD Must-Have 2, 4) – `files` i package.json utökad med `tokens`; `command npm pack --dry-run` listar `tokens/light.json` (21,9 kB) + `tokens/dark.json` (21,7 kB) och exkluderar fortfarande playground/e2e. README: `tokens:build` tillagd i skripttabellen (båda språken) + avsnittet ”Design tokens i DTCG-format” / ”Design tokens in DTCG format” efter mörkt-läge-avsnittet med importvägar, formatlänk och hänvisning till docs-guiden. Check: pack-lista + `bun test` grönt. Commit: 158c35d.
  Task ID: phase-3-package-01
  > **Implementation**: Modify `package.json` (`files` gains `"tokens"`) and `README.md` (both language halves).
  > **Details**: Verify shipped contents with `command npm pack --dry-run` – `tokens/light.json` and `tokens/dark.json` must appear while playground/e2e stay excluded. README: add the new script to the `### Skript` / `### Scripts` lists, and add a `### Design tokens i DTCG-format` section (Swedish half) plus `### Design tokens in DTCG format` (English half) in the consumer-facing area (after the dark-mode subsections): import path `@pattespatte/felix-ds/tokens/light.json` / `dark.json`, format link (design-tokens community group draft), the two exclusions, the `"none"` shadow deviation, and the parity guarantee. Check: pack dry-run listing; `bun test` still green.

- [x] **Bilingual docs pages** (ref: PRD Must-Have 4) – `docs/tokens.sv.md` (källa) + `docs/tokens.en.md` (spegling): filernas innehåll och definition av sammansatt tema, DTCG-utkastnotis med typtabell, namngivningsregeln med rundtur och blandnodsexempel, aliassektionen (4 helalias + skuggdelaliaser), de fyra dokumenterade undantagen/avvikelserna, konsumtionsvägar (JSON, Style Dictionary-illustration, Tokens Studio) samt generering + paritetsgaranti med uppströmsrutin. Svenska skrivregler följda (sentence case, tankstreck, citattecken). Check: båda sidor valid Markdown, inga organisationer, länkade från README.
  Task ID: phase-3-docs-01
  > **Implementation**: Create `docs/tokens.sv.md` and `docs/tokens.en.md` mirroring the conventions of the existing `docs/*.{en,sv}.md` pairs.
  > **Details**: Content: what the files contain (full composed theme per mode), DTCG format and version note (draft – design-tokens.github.io/community-group), how to consume (npm import path, example with Style Dictionary or plain JSON tooling as illustration only), naming/grouping rule with the `f.font.size.xxx.large` example, alias semantics, exclusions (`--f-logo-image-*`) and the `none`-shadow deviation, regeneration (`bun scripts/tokens.ts`) and the parity guarantee (`bun test`). Swedish page is the source of truth; English page mirrors it. Follow Swedish writing rules: sentence-case headings, tankstreck (–) never em-dash, ”svenska citattecken”. Check: both pages render as valid Markdown with no organisation names.

## Phase 4: Release (owner-gated)

- [ ] **Prepare and hand over the 1.0.1 → 1.1.0 release** (ref: PRD Must-Have 5) – FÖRBEREDELSEN KLAR, utgivningen väntar på ägaren: `release.yml` har ett paritetssteg (`bun test` efter `bun install --frozen-lockfile`, före build/publish) och CHANGELOG.md har en färdig Unreleased-sektion (commits 4434ee5–6951e6c). Ägaren genomför 1.0.1 → 1.1.0 exakt enligt runbooken `docs/release.en.md` (minor bump, tagga v1.1.0, pusha; arbetsflödet bygger, kör portarna inklusive den nya paritetsporten och publicerar). Agenten redigerar aldrig version, dispatchar aldrig arbetsflöden och pushar/publicerar aldrig.
  Task ID: phase-4-release-01
  > **Implementation**: Modify `.github/workflows/release.yml` (add parity step) and prepare the changelog; **OWNER-GATED – the bump, workflow dispatch and publish are executed by the owner via the runbook in `docs/release.en.md`, never by an agent.**
  > **Details**: Add a step before the publish job in `release.yml` that runs `bun install --frozen-lockfile` + `bun test` so a stale or non-paritoning token file cannot ship (flag this workflow change to the owner when handing over). Run `bun run changelog` (git-cliff) so the entry is staged. Then stop and hand over: version 1.0.1 → 1.1.0 (minor – new feature) following `docs/release.en.md` exactly. Check: owner confirms the published 1.1.0 tarball contains `tokens/light.json` + `tokens/dark.json` and the release run is green.

---

*Generated by Clavix /clavix-plan*
