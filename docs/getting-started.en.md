# Get started with felix-ds in a web app

*This document is also available in Swedish: [getting-started.sv.md](getting-started.sv.md).*

The details behind the [three installation options](README.en.md#installation-in-a-web-app) in the README are on this page.

## Step by step

The steps of the options in detail: the FKUI version choice, the import entries and the SCSS entries for compiling your own CSS.

### 1. Install the FKUI packages

The theme builds on FKUI. You choose the versions of the FKUI packages yourself and pin them exactly in `package.json`. Otherwise Bun and npm resolve the `@fkui/theme-default` peer dependency automatically, at the latest version inside the range:

- Install `@fkui/theme-default` at a version inside the supported range `>=6.57.0 <7.0.0`.
- Install the other FKUI packages you use, for example `@fkui/design` and `@fkui/vue`, at the same version.

```bash
bun add --exact @fkui/theme-default@X.Y.Z @fkui/design@X.Y.Z @fkui/vue@X.Y.Z
```

Replace `X.Y.Z` with the version you chose. The playground's own pins live in the repo's `package.json` and are shown in the Kom igång view.

Read [the compatibility section](#compatibility) before you write your own Sass that touches `@fkui/theme-default`.

### 2. Import the theme

The default path is prebuilt CSS – no Sass required. Import one file in your web app's entry point:

```ts
import "@pattespatte/felix-ds/dist/felix.css";
```

The file contains `@font-face`, the light theme on `:root` and the dark theme on `html[data-color-mode="dark"]`. Want to follow the system preference instead of controlling the color mode yourself? Use `dist/felix-auto.css`. The package's `main` key points at `dist/felix.css`, so the short import `import "@pattespatte/felix-ds"` works too.

Want a single import instead of three? Use `dist/felix-complete.css`. It contains the same CSS as these three imports, concatenated in the same order:

```ts
import "@fkui/design/lib/fkui.css";
import "@fkui/design/lib/fonts.css";
import "@pattespatte/felix-ds/dist/felix.css";
```

So this one line gives the same result as the three lines above, and replaces both step 2 and step 3:

```ts
import "@pattespatte/felix-ds/dist/felix-complete.css";
```

`felix-complete.css` is a convenience, but the default path is the three imports above. They keep the theme small: the standard entries weigh about 5 KB gzipped. Byte budgets in the parity test make sure they stay that way – a change that adds weight must be worth its bytes.

Each entry also ships a minified sibling: `dist/felix.min.css`, `dist/felix-auto.min.css` and `dist/felix-complete.min.css` contain the same rules, compressed, for consumers that load an entry as plain `<link>` CSS without a build step. The minifier parses every finished entry as plain CSS, so a syntactically invalid entry fails the build instead of shipping.

Need to scope the theme to your own selector, for example to switch themes at runtime? Use the SCSS entries instead. The package points to `src/index.scss` through its `sass` key. A global theme:

```scss
@use "@pattespatte/felix-ds/src/index";
```

Runtime switching with a class – the playground does this:

```scss
@use "@pattespatte/felix-ds/src/theme/default" as felix with ($global: false);

:root {
    @include felix.base; // FKUI base theme
}

html.theme-felix {
    @include felix.light; // base theme + felix variables
}
```

### 3. Load FKUI's component CSS

Import FKUI's CSS in your web app's entry point:

```ts
import "@fkui/design/lib/fkui.css";
import "@fkui/design/lib/fonts.css";
```

The theme is now in place. A complete walkthrough is in the guide [Building a site with felix-ds](create-a-site.en.md). It covers project setup, theme integration, dark mode, icons, forms, search and prerendering.

## Icons

The package ships a curated icon set from [Phosphor Icons](https://phosphoricons.com) (MIT licensed) at the bold weight. The set replaces the default icon library's artwork behind FIcon's unchanged names – every name from `@fkui/icon-lib-default` is covered (including the stacked composites `info`, `warning` and `tooltip`), machine-checked by the parity test in `scripts/icons.test.ts`, plus a curated expansion. The icons are SVG sprites that follow the active theme's text color.

Replace the default library's import with the theme's spritesheet in your web app's entry point – never import both, since duplicate `f-icon-*` symbol ids resolve to whichever sheet enters the DOM first:

```ts
import "@pattespatte/felix-ds/src/icons/phosphor-spritesheet";
```

FIcon is then used as usual, for example `<f-icon name="house">`. The full set is on the [playground's icon page](https://pattespatte.github.io/felix-ds/#/knappar/ficon). Maintainers regenerate the sheet with `bun run icons:build` – the mappings in `scripts/icons.ts` are the source.

## Dark mode

The theme also ships a dark profile. The prebuilt `dist/felix.css` has both modes built in – light on `:root`, dark on `html[data-color-mode="dark"]`. On the SCSS side `src/index.scss` emits only the light theme; you switch on dark mode with mixins:

- `base` / `light` – the upstream light theme without and with the felix variables.
- `base-dark` / `dark` – the same pair for dark mode (`base-dark` is FKUI's own dark theme).
- `auto` – both composed themes behind `prefers-color-scheme` media queries. Use it when you want to follow the system preference.

Want to control the mode yourself, with a class or attribute instead of media queries? Do this:

```scss
@use "@pattespatte/felix-ds/src/theme/default" as felix with ($global: false);

:root {
    @include felix.base; // base theme, light
}

html[data-color-mode="dark"] {
    @include felix.base-dark; // base theme, dark
}

html.theme-felix {
    @include felix.light; // felix, light
}

html.theme-felix[data-color-mode="dark"] {
    @include felix.dark; // felix, dark
}
```

Every scope emits the complete token surface. The specificity ladder (`:root` < `html.theme-felix` / `html[data-color-mode="dark"]` < the combined selector) resolves all combinations without `!important`. The mixins also set `color-scheme` per mode, so native controls and scrollbars follow along.

In the playground, the color mode button (sun/moon) in the top right does exactly this. It follows the system preference until the user makes an explicit choice. The choice is then saved to `localStorage`.

## Design tokens in DTCG format

The package ships the theme tokens as [W3C Design Tokens](https://design-tokens.github.io/community-group/) in the draft format's JSON – two complete files, one per color mode:

- `@pattespatte/felix-ds/tokens/light.json` – the composed theme in light mode
- `@pattespatte/felix-ds/tokens/dark.json` – the composed theme in dark mode

"Composed theme" means the upstream `@fkui/theme-default` plus the felix profile's overrides, in other words exactly what the theme mixins emit. The files are generated from the SCSS sources (in the repo: `bun run tokens:build`), and the parity test (`bun test`) fails files that no longer match the theme. The format is tool-agnostic and fits, among others, Tokens Studio and Style Dictionary. The import is symmetric: `bun run tokens:import` reads any W3C DTCG file (a Figma export, for example) and emits custom properties, while the hand-written theme remains the single source of truth – see [docs/tokens.en.md](tokens.en.md).

Naming, aliases, exclusions and consumption paths are covered in the [Design tokens](tokens.en.md) guide.

## Compatibility

The theme has one peer dependency: `@fkui/theme-default` in the range `>=6.57.0 <7.0.0`. The range applies to the theme layer. We test and support the Sass token surface of `@fkui/theme-default`, meaning the variables that the theme entry loads configured (`@use` in `src/theme/_default.scss`). We do not test or support the internals of FKUI components.

The other `@fkui/*` packages (`@fkui/vue`, `@fkui/design` and the rest) are not part of the contract. You pin them yourself.

> [!WARNING]
> Never let your own Sass load or configure `@fkui/theme-default`. The theme entry already loads the package configured. A second configured `@use` load collides and breaks compilation.

The version contract – semantic versioning of tokens and mixins, how tokens and mixins are phased out and which versions are supported – is described in [Governance and version contract](governance.en.md). When the tokens are not enough, combine what is already there instead of building wrappers. Proven recipes are in the [pattern library](patterns.en.md).

## Example implementation

- <https://pattespatte.github.io/felix-ds-demo-site/>
