# Governance and version contract

This document describes the contract between felix-ds and its consumers: what the version number promises, what support the FKUI range gives and how changes are communicated. The release procedure itself lives in the [release runbook](./release.en.md) and the installation recipe in the [site-building guide](./create-a-site.en.md).

## Semantic versioning

felix-ds applies semantic versioning to everything the package exposes: the public token names (the CSS custom properties), the SCSS mixins and their configuration, the dist files (`dist/felix.css`, `dist/felix-auto.css`, `dist/felix-complete.css`), the icon set's names and the package's import paths.

- **Major** breaks the contract: a public token, mixin or dist file is removed or renamed, or an existing import path stops working.
- **Minor** extends the contract: new tokens are added, new mixin parameters with defaults appear, new dist files or icon names appear. A token-value change that alters the visual expression (a new colour profile, a new font file) is a minor, because consumer code keeps working unchanged.
- **Patch** corrects without changing the intended expression: a wrong token value is a deviation from the profile and ships as a patch. A visual difference after a patch must always be explainable as a bug fix.
- The repo's parity tests (DTCG tokens, icons and prebuilt CSS) are the machine check behind the contract: they fail when committed content does not match the sources.

## Supported FKUI versions

The theme has a single peer dependency: `@fkui/theme-default` within the range `>=6.57.0 <7.0.0`. The range covers the theme layer, meaning the Sass token surface of `@fkui/theme-default` – the variables its entry loads configured (`@use` in `src/theme/_default.scss`). Component internals are not covered: felix-ds reads no FKUI internals, so an upstream change that does not touch the token surface cannot break the theme.

Tested endpoints are listed in each release's notes (the template lives in the release runbook) – they belong in the dated release, not in the README. The lower bound (6.57.0) is proven weekly in CI: the FKUI-currency workflow's floor leg pins the dev dependencies to it and runs the build, type-check and accessibility gates (the pixel comparisons stay on the latest pin, where the committed baselines are rendered). The upper bound is kept current by the playground's exact dev pins sitting at the top of the range. Consumers pin their own FKUI versions exactly and own the choice within the range.

## Deprecation

When a token, mixin or file is to be removed:

1. It is marked in the code (SCSS comment) and in the CHANGELOG entry of the minor that announces it.
2. It keeps working for at least one further minor, so consumers have time to migrate.
3. Removal happens in the next major, per the version contract above.

The same applies to icon names: a name leaving the set is announced the same way, since FIcon's namespace is the contract with FKUI's icon API.

## Release cadence and upgrade notes

Releases happen when there is something to release: accumulated changes, an FKUI upgrade verified through the rehearsal pattern in the README, or a bug fix. There is no fixed interval – need drives the cadence, not the calendar.

Every release documents the upgrader's view in its release notes (the template lives in the release runbook): what changed, which consumer actions are required (usually none), any deprecated tokens, and which FKUI endpoints were tested. A consumer update should be a one-line version bump, and visual changes must always be explained in advance.

Every release also passes the axe gate: automated accessibility scans of every playground view in both colour modes, with zero violations as the condition. Per-component coverage – which view demonstrates each component and what the automated testing covers – is documented in the playground's Tillgänglighet view.

## Operating model

The system is sized to be run by a part-time pair: a UX designer at 50 % and a frontend developer at 50 %. The designer owns the token values, the typographic profile and the review of the accessibility coverage; the developer owns the theme source, the playground documentation site, the visual and accessibility release gates, and the weekly FKUI-currency workflow. Simplicity is the feature: one thin package with a tiny review surface is what makes part-time staffing honest, and at an organisation's scale that weighs heavier than pipeline breadth. The project makes no support promises beyond what this model can honour (see Support).

## Code is the source of truth

The hand-written theme source (`src/theme/`) is the single truth for the visual expression. Designers meet the code through the DTCG round-trip: `bun run tokens:build` exports the composed theme as W3C DTCG files (`tokens/light.json`, `tokens/dark.json`) that design tools can read, and `bun run tokens:import` reads any W3C DTCG file (a design-tool export, for example) back into custom properties. The import is the supported designer bridge. No design-tool API integration will be built: the API is Enterprise-gated and proprietary, and the tokens it generates do not cover the full CSS, so such a pipeline would relocate the hand-maintained layer rather than remove it. Automation stops at token export either way; rendering, interaction states and composite decisions are verified by people.

## Support

The latest minor is supported. Older minors receive no further patches – upgrade per the release notes. Bug reports are expected against the latest version; a bug reproducible only in an older version is resolved by upgrading.

## Changes to this document

This document is part of the project's contract and changes with the same openness as the code: changes are noted in the release notes of the release they land in.
