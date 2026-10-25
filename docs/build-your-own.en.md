# Build your own profile – the method

felix-ds is one brand profile built with a small, repeatable method. A multi-brand organisation can replicate the layer per brand at thin-layer cost: one package of CSS custom properties and fonts per brand, zero components, all of FKUI covered from the day it ships. This guide describes the method end to end and points at the documents that prove each step. It is deliberately not a copy-the-files walkthrough – the token values are yours to write, the shape is what is described here.

## 1. Configure the upstream theme once, then speak in tokens

The layer is SCSS mixins on top of `@fkui/theme-default`: the upstream theme is loaded configured exactly once (the `src/theme/_default.scss` pattern), and the profile's mixins emit CSS custom properties after it in the cascade – so they win without `!important`. Never let a second Sass load configure `@fkui/theme-default`; a second configured `@use` collides and breaks compilation (the README's warning applies to every brand).

## 2. Write the brand's tokens in the same shape

The token source splits into a shared index (typography, line widths, radii, focus) plus one variables file per colour mode (`light/_variables.scss`, `dark/_variables.scss`), exposed as mixins that can be emitted globally, class-scoped for runtime switching, or composed behind `prefers-color-scheme`. The whole expression lives in these files – that is the single source of truth, kept hand-written on purpose (see step 6).

## 3. Self-host the fonts

`@font-face` declarations with `font-display: swap` and woff2 files shipped in the package, licence texts included. No external font service.

## 4. Swap the icon artwork (optional)

FKUI's `FIcon` renders from a spritesheet; a brand can replace the artwork behind the unchanged component names with its own SVG sprites, name-parity-tested against `@fkui/icon-lib-default`. Icons are a one-import step for consumers.

## 5. Ship prebuilt CSS, guarded by a parity test

Compile the profiles to committed dist entries (including an all-in-one entry if wanted), and keep a test that recompiles from source and fails on any drift – plus gzipped byte budgets so the weight advantage stays a guarantee. The shape is `scripts/build-css.ts` and `scripts/css.test.ts` in this repo.

## 6. Keep the DTCG round-trip as the designer contract

Export the composed theme as W3C DTCG files for design tools, and accept any W3C DTCG file back into custom properties. The hand-written token source stays the single source of truth; no design-tool API integration is built (see [governance](./governance.en.md)). This is the standards-based designer story.

## 7. Prove it, don't promise it

- **Demo playground** – every component demonstrated in both colour modes, with navigation, deep links and search driven from one source file.
- **Visual gate** – committed baselines for chromium, one set per platform (in this repo: linux and darwin), plus a firefox/webkit cross-browser set, regenerated through a documented workflow.
- **Accessibility gate** – axe scans of every view in both colour modes with zero violations as the release condition, and a per-component coverage table (the Tillgänglighet view pattern).
- **Consumer parity kit** – the recipe a consumer's CI can run to prove a version bump is pixel-identical ([visual parity kit](./visual-parity-kit.en.md)).

## 8. Keep it current and governed

Pin the FKUI dev dependencies exactly and in lockstep, schedule a weekly currency workflow that bumps and gates, and publish under a written contract: semver over the token surface, a stated FKUI peer range, deprecation pattern, upgrade notes per release ([governance](./governance.en.md), [release runbook](./release.en.md)).

The operating cost is the point: this entire surface – theme, docs site, gates, currency workflow – is sized to be owned by a part-time pair (see the governance policy's operating model). Replicate the method per brand, and each brand carries the same thin cost.
