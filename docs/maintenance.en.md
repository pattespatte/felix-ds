# Maintenance and workflows

This guide is for whoever maintains the repo (the owner). It answers three questions about the repo's five GitHub Actions workflows: what runs by itself, when you need to act, and what a normal week looks like. Most weeks the only thing you do is `git pull`.

## The five workflows at a glance

| Workflow | Starts | What it does | You act |
| --- | --- | --- | --- |
| Deploy playground to GitHub Pages (`deploy-playground.yml`) | every push to `main` | builds and publishes the playground to GitHub Pages | never |
| FKUI currency check (`fkui-currency.yml`) | Mondays 08:00 Swedish time (winter), or manually | bumps the six `@fkui/*` pins to the latest version, runs the full gate, opens a pull request when there is a bump | when a pull request or a red run appears |
| Friday baseline currency (`friday-baseline-currency.yml`) | Fridays 13:00 Swedish time (winter), or manually | regenerates the linux visual baselines when visuals have changed, runs the full gate, pushes to `main` itself | `git pull` after it has pushed |
| Generate linux visual baselines (`generate-linux-baselines.yml`) | only manually | renders fresh linux baselines and uploads them as an artifact | before a release, when pixel changes are still waiting for Friday |
| Release to GitHub Packages (`release.yml`) | push of a `v*` tag | builds, runs the gates, publishes the package, creates the GitHub release | according to the [release runbook](release.en.md) |

The cron schedules are written in UTC, so the Swedish clock times shift one hour when summer or winter time begins.

## A normal week

Nothing needs preparing. Both scheduled runs start by themselves.

### Friday: the linux baselines stay current

The run starts with a git-only check: if nothing that drives the visuals (playground views, theme sources, tokens, test configuration, lockfile) has changed since the last linux baseline regen, it exits green without running a single test. Otherwise it regenerates the linux set, losslessly recompresses the png files, runs the whole gate (parity tests, build, typecheck, visual comparisons in three browsers, axe scans) and pushes the result to `main` itself as `test(visual): regenerate linux baselines (friday currency)`. Afterwards you do one thing: `git pull`.

### Monday: the FKUI check

If FKUI has not published a new version, the run exits green without opening anything. When there is a new version, it bumps the six `@fkui/*` pins, runs the full gate on the bump and opens a pull request (`chore(deps): bump @fkui/* …`). Review and merge it, then cut the next release per the [release runbook](release.en.md). The pull request text also lists any `@fkui/vue` components the bump adds or removes, so new components announce themselves. A second leg of the run pins the peer range's lower bound (6.57.0) and runs the non-visual gates; a red floor leg is a signal to look at and never opens a pull request. The run also performs a dependency audit that only reports.

## When you act yourself

### You changed pixels in a view

If you regenerated the darwin baselines and pushed, the linux mirror is the only thing missing. Friday's run picks it up automatically. If you are releasing before Friday, generate the linux set by hand (next section): the release gate and the Monday run compare against the linux baselines and go red when they are stale or missing.

### You need the linux baselines now

Typical case: a release is coming up and pixel changes were pushed after last Friday. Start the workflow and watch it (about 10 minutes; it publishes nothing):

```bash
gh workflow run generate-linux-baselines.yml --repo pattespatte/felix-ds --ref main
gh run watch --repo pattespatte/felix-ds   # optional, live view
```

It uploads the artifact `linux-baselines` (kept for 7 days). The artifact also contains the darwin set – ignore it. Download it and copy only the `*-linux.png` files:

```bash
gh run download --repo pattespatte/felix-ds -n linux-baselines -D /tmp/linux-baselines
cp /tmp/linux-baselines/visual.spec.ts-snapshots/*-linux.png e2e/visual.spec.ts-snapshots/
cp /tmp/linux-baselines/visual-cross.spec.ts-snapshots/*-linux.png e2e/visual-cross.spec.ts-snapshots/
ls e2e/visual.spec.ts-snapshots/*-linux.png | wc -l        # expected: 45 (15 views × 3 configurations)
ls e2e/visual-cross.spec.ts-snapshots/*-linux.png | wc -l  # expected: 60 (all 15 views × 2 modes × 2 browsers)
```

Then recompress every new png losslessly (`oxipng -o max`), confirm each one with `compare -metric AE original.png recompressed.png null:` (it must print `0 (0)`), run `bun run test:visual` locally and commit the linux png files together with the darwin set. The same procedure, step by step, is in the [release runbook](release.en.md), section 1 step 5.

### Running a scheduled workflow at another time

Both scheduled workflows also accept manual runs, either via GitHub (Actions → the workflow → **Run workflow**) or from the terminal:

```bash
gh workflow run friday-baseline-currency.yml --repo pattespatte/felix-ds --ref main
gh workflow run fkui-currency.yml --repo pattespatte/felix-ds --ref main
```

The Friday run is safe to trigger at any time: when the baselines are already current it exits green without doing anything.

### The Monday run is red

The most common cause is a stale linux baseline set; the error `snapshot doesn't exist` means the set is missing altogether. Trigger the Friday workflow by hand – it regenerates, runs the gate and pushes, after which a fresh Monday run goes green. For any other failure, the run uploads its test report as an artifact (`currency-gate-failure`, kept for 14 days).

## Pitfalls

- **”Re-run failed jobs” reuses the old commit.** A scheduled run that raced a baseline regen must run against the new `main`. Start a fresh run (Run workflow, or `gh workflow run`) instead of re-running.
- **Bot commits land on `main`.** The Friday run commits its baselines directly. Run `git pull` before you keep working locally.
- **Schedules need the file on the default branch** and GitHub switches them off after 60 days without repo activity. After a long pause, check that both weekly runs actually ran.
- **Times are UTC in the cron lines.** The Swedish clock times in this guide are winter times and shift one hour in summer.
- **Artifacts expire.** `linux-baselines` is kept for 7 days, failure reports for 14 days.
