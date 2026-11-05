# Upgrading the FKUI dependencies – step by step

When FKUI publishes a new version, this repo bumps all six `@fkui/*` packages in lockstep to the same version and proves with the full gate that the theme holds up. This guide shows the two paths: let the weekly round open a pull request (the normal case) or do the rehearsal locally. What the workflows do on their own is covered in the [maintenance guide](maintenance.en.md) – this is the commands.

## Who this guide is for

The guide covers the felix-ds repo itself – the theme layer and the playground – and whoever maintains it. Use it when FKUI has published a new version and the repo's pinned versions are behind. How that shows up is covered in the next section.

- **The playground: same procedure.** The playground is a folder in the repo and follows along automatically when the six `@fkui/*` versions are bumped – there is no separate upgrade to do.
- **The demo site and the consumer app: the guide does not apply.** They pin their own FKUI versions and upgrade their felix-ds dependency on their own when a new package version is released.
- **Apps that do not build on FKUI: not relevant.** The guide is only about the relationship between felix-ds and FKUI's six npm packages.

## Noticing a new version

Three ways, in the order they usually appear:

1. The Monday round (`fkui-currency`) finds it – a green run with a pull request, or a red one when the gate fails.
2. The playground footer compares the pin against npm and prints "Senaste utgåvan är X" ("the latest release is X") when the pin is behind.
3. `bun fkui version` locally shows the specified, installed and latest version per package.

Scheduled runs can be dropped by GitHub. If no Monday run appears at all, start it by hand as in path A below.

## Path A: let the weekly round do the bump

```bash
gh workflow run fkui-currency.yml --repo pattespatte/felix-ds --ref main
gh run watch --repo pattespatte/felix-ds
```

The run bumps the six pins, rebuilds the prebuilt dist, runs the full gate on ubuntu and opens a green pull request with `package.json`, `bun.lockb` and `dist/`. The pull request text lists any `@fkui/vue` components added or removed. Review and merge it – what remains is the items under "Afterwards".

If the run goes red on the visual steps, FKUI has changed pixels and the baselines need regenerating – something the workflow does not do. Do the bump locally per path B instead and follow the "When pixels change" section. On other failures the test report is uploaded as an artifact (`currency-gate-failure`, 14 days).

## Path B: do the bump locally

All commands run from the repo root.

```bash
git pull --ff-only                  # the Friday round may have pushed baselines
bun fkui upgrade -n                 # dry run: the plan and the link to the release notes
bun fkui upgrade                    # six exact versions into package.json + bun install
bun run build:theme                 # dist must be fresh before the parity tests
bun run tokens:build                # needed when upstream tokens changed – the tests say so
bun test                            # 67 tests, including css parity against dist
bun run build && bunx vue-tsc --noEmit
lsof -nP -iTCP:5273 -sTCP:LISTEN    # leftover dev server? if so: kill it first
bun run test:visual                 # ~50 s: 45 screenshot comparisons, the a11y spec included
```

Then take a visual pass through the playground (`bun run dev`) and commit:

```bash
git add package.json bun.lockb dist/ tokens/   # tokens/ only when the files changed
git commit -m "chore(deps): bump @fkui/* 6.63.0 -> 6.64.0"
```

The versions in the example are from the 2026-11-03 rehearsal – swap them for the current ones. What the latest rehearsal showed is recorded in the README section "Upgrading the FKUI dependencies".

## When pixels change

The visual steps call out which views differ. Regenerate the darwin set for exactly those views:

```bash
bunx playwright test visual.spec.ts -g "<view-slug>" --update-snapshots
```

Recompress the new png files losslessly (`oxipng -o max`) and verify each file with `compare -metric AE` – the result must be `0 (0)`. The linux mirrors come from the `generate-linux-baselines` artifact (only the `*-linux.png` files), or wait for the Friday round, which pushes them itself. The procedure is walked through in the [maintenance guide](maintenance.en.md), section "You need `linux-baselines` now", and in the [release runbook](release.en.md).

## Afterwards

1. Rewrite the README note "Latest upgrade rehearsal" (Swedish and English) with what the round actually showed – a visual no-op, or which pixels changed.
2. Push. The playground deploy is triggered by the `package.json` change. Verify the footer afterwards: "Bygger på FKUI X.Y.Z" with the suffix "som är den senaste utgåvan" ("the latest release").
3. Start `fkui-currency` by hand as a final check – it should exit green without a pull request ("already current").
4. Decide whether the prebuilt dist should go out as a new package version – dist follows releases, not pushes. The procedure is in the [release runbook](release.en.md).
5. The consumer apps (the demo site and the consumer app) pin their own FKUI versions and upgrade their felix-ds dependency on their own.

## Pitfalls

- **A leftover dev server fakes green.** A Vite server that survived from before the dependency change serves old `node_modules`. Check port 5273 before the visual run.
- **`bun test` requires fresh dist.** The parity tests compare against `dist/` – run `build:theme` first, or the css tests fail.
- **The token files can go stale.** When upstream changes the token set (6.64.0 added footer tokens), `tokens:build` and a commit of `tokens/` are required.
- **Test evidence gets wiped.** Playwright empties `test-results/` at the start of every run – copy the evidence from a red run before the next one.
- **Live dates invalidate baselines.** Demos that follow the current date (the calendar) break at every month boundary – the demos show fixed dates.
- **`-g` matches the whole title chain.** Use a substring of the view name, never a `^` anchor.
- **Scheduled slots can be dropped.** GitHub does not guarantee delivery – start runs by hand when they do not appear.
- **Upstream can be uneven.** The packages are not always published in unison (at 6.64.0, `@fkui/design` sat one patch ahead). The lockstep follows `@fkui/vue` – intermediate steps are picked up the next time all six packages move.
