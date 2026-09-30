# Release runbook (owner only)

This document is the single, explicit exception to the project's no-push rule
(see the repo's AGENTS.md): **every `git push` and publish action in the
felix-ds project happens through this runbook, executed by the owner.**
Automated agent sessions never execute it. Nothing here is triggered by
committing files — the workflow only fires when a `v*` tag reaches GitHub.

The release flow is: prepare locally → tag → **push (owner-gated)** → GitHub
Actions builds, gates and publishes → review the GitHub Release.

## 1. Preconditions

Run through this list before touching a tag:

1. **Clean tree.** `git status` is clean and `main` is at the commit you want
   to release.
2. **Supported FKUI range still honest.** Re-check the peer range against
   upstream:

   ```bash
   npm view @fkui/theme-default version
   ```

   If this is `>= 7.0.0`, the release is blocked until the theme is verified
   (and the playground's dev pins bumped and baselines refreshed) against the
   new major, or the peer range in `package.json` is deliberately narrowed.
   Also skim the changelog of every `@fkui/*` release inside the supported
   range since the last felix-ds release for token-surface changes.
3. **Gate green locally.** `bun install`, `bun run build`, `bunx vue-tsc
   --noEmit` and especially `bun run test:visual` (36 visual baselines + 24
   axe scans) all pass on your machine.
4. **Baselines current.** If the playground changed since the last release,
   regenerate and review baselines first:

   ```bash
   bun run test:visual:update
   git diff e2e/visual.spec.ts-snapshots   # review the PNG diffs deliberately
   ```

   A baseline update is a reviewed decision, never a "make the gate pass"
   button: every pixel change must be explainable.
5. **Linux baselines for CI.** The release workflow runs `bun run
   test:visual` on ubuntu-latest, which needs `-linux` suffixed baselines.
   Regenerate them whenever the darwin baselines changed, via the repo's
   **Generate linux visual baselines** workflow (no docker needed locally):

   1. GitHub → Actions → *Generate linux visual baselines* → **Run workflow**
      on `main` (about 4 minutes; it runs `--update-snapshots` on an ubuntu
      runner and uploads the snapshot folder as the `linux-baselines`
      artifact). Triggering it is also possible from a terminal:

      ```bash
      gh workflow run generate-linux-baselines.yml --repo pattespatte/felix-ds --ref main
      gh run watch --repo pattespatte/felix-ds   # optional, live view
      ```

   2. Download the artifact and copy **only** the `*-linux.png` files into
      `e2e/visual.spec.ts-snapshots/` (it also contains the darwin set –
      ignore those):

      ```bash
      gh run download --repo pattespatte/felix-ds -n linux-baselines -D /tmp/linux-baselines
      cp /tmp/linux-baselines/e2e/visual.spec.ts-snapshots/*-linux.png e2e/visual.spec.ts-snapshots/
      ls e2e/visual.spec.ts-snapshots/*-linux.png | wc -l   # expect 36
      ```

   3. Run `bun run test:visual` locally (confirms the darwin set still passes
      side by side) and commit the linux PNGs together with the darwin ones.
      Playwright picks the suffix matching the runner platform at test time.

   A missing linux set fails the release gate with "snapshot doesn't exist …
   `-chromium-linux.png`" — that is the gate doing its job; don't bypass it.

## 2. Release steps

```bash
# 1. Regenerate the changelog from conventional commits and commit it
bun run changelog
git add CHANGELOG.md
git commit -m "chore(release): prepare vX.Y.Z"

# 2. Annotated tag (semver; the contract starts at 1.0.0)
git tag -a vX.Y.Z -m "felix-ds vX.Y.Z"
```

3. **OWNER-GATED — the only push in the entire project:**

   ```bash
   git push origin main --follow-tags
   ```

4. Watch the Actions run for the **Release to GitHub Packages** workflow
   (`.github/workflows/release.yml`). It checks out, installs with the
   frozen lockfile, builds, type-checks, runs the visual gate on linux
   baselines, publishes `@pattespatte/felix-ds` to npm.pkg.github.com and
   creates the GitHub Release with generated notes.
5. Review the GitHub Release notes; edit for readability if needed (notes are
   generated from commits — the CHANGELOG.md is the curated source).

## 3. Post-release

- Verify installability exactly the way a consumer would (see section 5 for
  the `.npmrc` lines):

  ```bash
  npm view @pattespatte/felix-ds@latest version --registry=https://npm.pkg.github.com
  ```

- `deploy-playground.yml` also fires on this push (it triggers on every push
  to `main`). That is expected and harmless — the playground just deploys.

## 4. Rollback

A published version is immutable. Never delete or re-publish the same
version; fix forward:

```bash
npm deprecate @pattespatte/felix-ds@X.Y.Z "Broken in <way>; use X.Y.Z+1" --registry=https://npm.pkg.github.com
```

Then fix the issue, release the next version through this runbook, and
un-deprecate only if the old version turns out to be fine.

## 5. Consumer prerequisites

The package is published to GitHub Packages under the `pattespatte` account
with restricted visibility. Every consumer needs:

1. A personal access token (classic) with `read:packages` — created at
   github.com/settings/tokens by a user with access to the repo.
2. An `.npmrc` in the project root:

   ```ini
   @pattespatte:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
   ```

   Keep the token in an environment variable, never in the file. For
   CI, inject the token via the environment runner secret.

3. Install:

   ```bash
   bun add @pattespatte/felix-ds
   ```

Consumers pin their own `@fkui/*` versions; felix-ds declares
`@fkui/theme-default` (supported range `>=6.57.0 <7.0.0`) as its only peer
dependency and loads that module itself — a consumer's own Sass must never
`@use` it with configuration, or the two configured loads collide. See the
README's Compatibility section.
