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

Tested endpoints are listed in each release's notes (the template lives in the release runbook) – they belong in the dated release, not in the README. The lower bound (6.57.0) is tested at every release, and the upper bound is kept current by the playground's exact dev pins sitting at the top of the range. Consumers pin their own FKUI versions exactly and own the choice within the range.

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

## Support

The latest minor is supported. Older minors receive no further patches – upgrade per the release notes. Bug reports are expected against the latest version; a bug reproducible only in an older version is resolved by upgrading.

## Changes to this document

This document is part of the project's contract and changes with the same openness as the code: changes are noted in the release notes of the release they land in.
