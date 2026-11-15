# Developing felix-ds and running the playground

*This document is also available in Swedish: [development.sv.md](development.sv.md).*

This page is for you if you want to run the [playground](README.en.md#choose-your-path) locally or change the felix-ds repo.

## Getting started with the playground

Follow this section when you want to run the playground locally, explore the components or develop the theme. You clone the whole felix-ds repo. The playground is a demo app in the same repo, and you do not need it to use the theme in a web app. Only want to use the theme? Go to [Installation in a web app](README.en.md#installation-in-a-web-app).

```bash
git clone https://github.com/pattespatte/felix-ds.git
cd felix-ds
bun install        # npm install works as a fallback
bun run dev        # starts the playground (Vite)
```

Open the address printed in the terminal (usually `http://localhost:5173/`). Switch themes with the selector in the top right corner.

### Scripts

| Script | Description |
| --- | --- |
| `bun run dev` | Run the playground locally |
| `bun run build` | Build the playground for production |
| `bun run build:theme` | Compile the prebuilt CSS entries to `dist/felix.css`, `dist/felix-auto.css` and `dist/felix-complete.css` plus minified `.min.css` siblings (committed; the parity test fails stale files and enforces the byte budgets) |
| `bun run tokens:build` | Generate `tokens/light.json` and `tokens/dark.json` from the theme's SCSS sources |
| `bun run tokens:export` | Alias for `tokens:build` – the same script, named after the export direction |
| `bun run tokens:import` | Read a W3C DTCG file and emit CSS custom properties (any file as argument) |
| `bun run icons:build` | Regenerate `src/icons/phosphor-spritesheet.ts` from the mappings in `scripts/icons.ts` |
| `bun run search:build` | Generate the playground search index `playground/public/search-index.json` from the navigation and demos (also run automatically by Vite in dev and build) |
| `bun run accessibility:build` | Generate `docs/accessibility-basis.en.md` and `docs/accessibility-basis.sv.md` – the lift-ready basis for your own accessibility statement – from the playground's accessibility data |
| `bun run changelog` | Generate `CHANGELOG.md` from the repo's commits with git-cliff |
| `bun run test:visual` | Run the chromium screenshot comparisons against committed baselines |
| `bun run test:visual:update` | Same as `test:visual`, but rewrite the baselines instead of comparing |
| `bun run test:visual:cross` | Run screenshot comparisons in webkit and firefox as a complement to the chromium gate |
| `bun run test:a11y` | Run the accessibility tests (axe scans) in chromium |
| `bun run fkui …` | Show and upgrade the `@fkui/*` dependencies (see [Upgrading the FKUI dependencies](#upgrading-the-fkui-dependencies)) |

## Developing felix-ds

This section is for you if you change the repo.

### Architecture

felix-ds is a single npm package. The playground sits in a folder in the same repo.

```
felix-ds/
├── src/
│   ├── theme/                    # SCSS redefining FKUI's variables
│   │   ├── _default.scss         # theme entry: composes base + felix
│   │   ├── shared/_index.scss    # --f-* (typography, borders, radii, focus)
│   │   └── light/_variables.scss # every --fkds-color-* token (light mode)
│   ├── prebuilt/                 # selector shells for the prebuilt CSS entries
│   ├── fonts/                    # woff2, @font-face and license texts
│   └── index.scss                # entry: @font-face + theme
├── dist/                         # prebuilt css (committed, parity tested)
├── playground/                   # Vite app demonstrating the theme
│   └── src/
│       ├── navigation.ts         # single source of truth: views + anchors
│       ├── router.ts             # hand-rolled hash routing (#/view/anchor)
│       ├── views/                # one view file per category
│       └── demos/                # one demo file per component, grouped by category
└── package.json
```

The theme follows the same model as FKUI's own theme packages: mixins emit CSS custom properties on top of `@fkui/design`. The base theme (`@fkui/theme-default`) loads first. The felix variables come after it in the cascade and win without `!important`. The theme has a light and a dark mode (see [Dark mode](getting-started.en.md#dark-mode)). An organization that wants to replicate the model for another brand profile finds the whole method in the [build your own profile](build-your-own.en.md) guide.

### Playground navigation

The playground uses FKUI's application template (`FLayoutApplicationTemplate` + `FLayoutLeftPanel`) with a custom two-level navigation in the left column: category > component. Links are hash routes on the form `#/view` and `#/view/anchor`, for example `#/formular/ftextfield`. That keeps the GitHub Pages deploy working without any server configuration.

The file `playground/src/navigation.ts` defines every view and anchor. The left menu, the footer, the start view and the router all read from it. When you add a component there, it automatically gets a link, a deep link and a place in the start list.

### Visual profile

- **Typography:** Noto Sans for all body text. Roboto Slab for headings and display (h1). Bold maps to weight 600. The theme bundles no 700 weights.
- **Colors, border widths (1 px) and radii (6/8 px):** The theme draws every component border as a 1 px hairline. Smaller components get a 6 px radius, larger ones 8 px.
- **Focus indicator:** a single 2 px ring in the profile's focus color.

### Upgrading the FKUI dependencies

The repo pins all `@fkui/*` packages to exact versions and upgrades them in lockstep: the same version on every package, matching how upstream publishes them. The `fkui` helper script tracks the state and performs the upgrade. (`bun fkui …` is a shortcut that Bun resolves to `bun run fkui …`.) Both paths – the weekly round's pull request and the local rehearsal – are walked through step by step in the [upgrade guide](upgrade-fkui.en.md).

| Command | Description |
| --- | --- |
| `bun fkui version` | Show the specified, installed and latest version per package |
| `bun fkui upgrade -n` | Dry run: show the plan (current → target, step, release date) without changing anything |
| `bun fkui upgrade` | Write the new exact versions to `package.json` and run `bun install` |
| `bun fkui upgrade 6.58.0` | Same, but to a chosen version instead of the latest |
| `bun fkui components` | List the components exported by `@fkui/vue`, one per line |
| `bun fkui components:status` | Same, but with a status per line: Produktionsklar (green) or Deprekerad (red) |

The plan prints a link to the release notes and calls out major bumps. After a completed upgrade, do this:

1. Run `bun test` (the parity tests for tokens, icons and prebuilt CSS).
2. Run `bun run build:theme` and commit the recompiled files in `dist/` if they changed.
3. Run `bun run build` and `bunx vue-tsc --noEmit`.
4. Run `bun run test:visual` and `bun run test:a11y`.
5. Take a visual pass through the playground.

Latest upgrade rehearsal: 6.64.0 → 6.65.0 (2026-11-13) was a visual no-op upstream – the only pixel change was the entrypoint's arrow, which the theme layer's shared chevron redraw had aimed downward. It now points forward and is drawn one step larger. Upstream carried configurable text wrapping in FTable (new `--wrap` classes in `table-ng`), a reverted legacy palette, an anchor overlap mode for popup menus, a preserved text color on the datepicker close button, and Enter in editable table cells no longer submits the form – 6.64.1's rewritten hover and active colors on buttons and links came along in the same bump. The token files (`tokens/light.json`, `tokens/dark.json`) regenerated byte-identical, the component exports were unchanged, and the whole gate (parity tests, build, type-check, 45 chromium screenshot comparisons, 32 axe scans) passed. The latest release is 6.65.1, but it exists for only five of six packages (`@fkui/theme-default` stays at 6.65.0) – the lockstep follows the latest version common to all packages and picks up 6.65.1 at the next shared release.

### Components in the playground

The playground covers all 89 components in FKUI's public packages (79 Vue components and 10 SCSS-only components), according to the component report for the installed version.

The component registry is structural rather than a hand-written list. Every component has a demo file, `playground/src/demos/<category>/<Component>Demo.vue`, and a link as an anchor in `playground/src/navigation.ts`. Sub-components and enums appear in their parent's demo. The start view's "Components in the playground" section reads the categories straight from `navigation.ts`, so the list on the page never drifts from the menu.

### Maintenance and workflows

The repo's five GitHub Actions workflows – weekly rounds, baseline generation, releases – are covered in [docs/maintenance.en.md](maintenance.en.md): what runs by itself, when you act, and how the workflows are triggered.
