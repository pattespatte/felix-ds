# Building a site with felix-ds

This guide describes how to build a complete website on felix-ds – FKUI's public npm packages with the felix theme on top. It is written from the pattern proven on a full demo site (Vue 3 + TypeScript + Vite, 26 routes, search, prerendering and both light and dark modes), not speculatively.

A living example of everything below exists as a demo site consuming felix-ds as a git dependency.

## Prerequisites

- Bun (package manager and script runner; npm works as a fallback)
- A current Node.js
- Basic familiarity with Vue 3 `<script setup lang="ts">`, Vue Router and Vite

## Project setup

Create a Vite project from the vue-ts template and add the dependencies:

```bash
bun add vue vue-router@^4
bun add @fkui/vue@6.57.1 @fkui/design@6.57.1 @fkui/theme-default@6.57.1 @fkui/date@6.57.1 @fkui/logic@6.57.1 @fkui/icon-lib-default@6.57.1
bun add -d vite @vitejs/plugin-vue sass typescript vue-tsc @types/node
bun add felix-ds@github:pattespatte/felix-ds#<commit>
```

Three things are worth knowing:

- **FKUI packages are pinned exactly.** All six `@fkui/*` packages pin to the same exact version (6.57.1 at the time of writing), the version felix-ds was built and tested against.
- **felix-ds is consumed as a git dependency** so the build is identical locally and in CI. Point at a specific commit, not a branch.
- **The git dependency contains only `src/`.** The build artifact `dist/felix.css` is gitignored in the theme repo and therefore not shipped – consume the SCSS sources under `felix-ds/src/`, which is in any case the only entry that supports dark mode (see the next section).

In `vite.config.ts` you need two things beyond the vue plugin: an `@` alias to `./src` and `isCustomElement: (tag) => tag.startsWith("ce-")`, because FKUI registers its own custom elements (ce-page-layout among others) at runtime.

## Theme integration

The app entry point loads FKUI's component CSS first:

```ts
import "@fkui/icon-lib-default/dist/f";
import "@fkui/design/lib/fkui.css";
import "@fkui/design/lib/fonts.css";
import "./assets/main.scss";
import "./fkui-patches";
```

The theme itself is applied in `main.scss` using the documented scoped mixin pair. Every scope emits the complete token surface and the specificity ladder (`:root` (0,1,0) < `html[data-color-mode="dark"]` (0,1,1)) resolves both modes without `!important`:

```scss
@use "felix-ds/src/fonts/fonts";
@use "felix-ds/src/theme/default" as felix with (
    $global: false
);

:root {
    @include felix.light;
}

html[data-color-mode="dark"] {
    @include felix.dark;
}
```

Why not the simpler entries? The global `@use "felix-ds/src/index"` and the prebuilt `dist/felix.css` both emit only the light theme hardcoded to `:root` – they cannot express the attribute-scoped dark mode. The `felix.light` and `felix.dark` mixins also declare `color-scheme` per mode, so native controls and scrollbars follow automatically. Never configure `@fkui/theme-default` yourself in the consumer – the felix module already configures its own load of it, and a double configuration collides.

Custom layout SCSS is written with tokens only – `--fkds-*` and `--f-*` – and no raw hex values. Every custom surface (cards, panels, table stripes) then flips with the color mode for free, and dark-mode contrast is never half handmade. Dimensions (margins, breakpoints) are of course plain rem values.

## Typography

The theme self-hosts all typefaces: Noto Sans for body text (400, 600 + italics) and Roboto Slab for headings, with bold mapped to weight 600. `@use "felix-ds/src/fonts/fonts"` provides the @font-face rules with woff2 files that Vite bundles – no CDN calls, no Google Fonts, no privacy review. Verify in the build that `dist/assets/*.woff2` exists and that no `fonts.googleapis.com` reference has slipped in.

## Dark mode

The pattern has three cooperating parts:

1. **A color-mode module** (`color-mode.ts`) owns the mode: it follows `prefers-color-scheme` until the user chooses explicitly, persists the choice in localStorage under its own key, sets or removes `data-color-mode="dark"` on `<html>` and listens for system changes as long as no explicit choice exists.
2. **An inline script in `<head>`** runs the same logic before first paint, so the page never flashes the wrong mode. The script duplicates the module's localStorage read – keep the key in sync.
3. **A toggle button** in the header calls the module's toggle. The sun/moon glyphs have to be hand drawn – the default icon library has no such icons.

Expect light snapshots from prerendering: the static HTML is built in light mode and the inline script applies dark on visit. That is intentional and fine for a demo; a service with requirements on dark snapshots needs to prerender in both modes.

## Icons

`@fkui/icon-lib-default` contains 31 icons (alert, arrow-down, arrow-in-circle, arrow-right, bars, bell, calendar, caret-down, caret-up, chevrons-left, circle, circle-notch-solid, close, cross, dash, doc, ellipsis, error, file, i, new-window, paper-clip, pdf, pen, pic, plus, search, sort, success, trashcan, triangle). Import the library once in the entry point and render with `<f-icon name="...">`.

A rich icon set (Phosphor and friends) has no counterpart here – map semantically per usage (calendar → calendar, search → search, medical/care → cross) and let decorative icons without an equivalent become plain text rather than carry the wrong meaning. The icon name is strict: an invalid name renders nothing.

## Components and layout

Some patterns the demo site has proven:

- **Navigation menu with SPA routing.** `FNavigationMenu` renders anchors and documents the pattern itself: pass routes without `href`, listen for `@selected-route` and call `router.push(key)`. Otherwise every click reloads the whole page under history routing. The `vertical` variant suits secondary navigation.
- **Dropdown menus.** `FContextMenu` is FKUI's popup menu: a trigger button with `aria-haspopup="menu"` as the anchor, items with `label`/`key`, controlled through `:is-open` and `@select`/`@close`. Full keyboard support included.
- **Tabs.** FKUI 6.57 has no tabs component. Build a thin app-level component with the WAI-ARIA tabs pattern (tablist/tab/tabpanel, arrow keys) styled with tokens – a couple of hundred lines, and no wrapper layer is needed in the theme repo.
- **Breadcrumbs.** Not in FKUI either; a thin `<nav>` with an ordered list, router links and `aria-current="page"` is correct and sufficient.
- **Cards, lists and messages.** `FCard` (heading through the `#header` slot and its `headingSlotClass`), `FMessageBox` (info/success/warning/error), `FBadge` and `FDataTable` cover most surfaces. `FSortFilterDataset` around a table adds sorting; `FPaginator` adds pagination.
- **Expandable content and accordions.** `FExpandableParagraph` with the `#title` slot; an accordion (one open at a time) is controlled with `:expanded` + `@toggle` from a ref. Consider carrying the theme repo's FExpand patch in a `fkui-patches.ts` – it fixes a leave bug in 6.57.1.

## Forms and validation

Register the `ValidationPlugin` on the app and build forms with `FValidationForm`:

```vue
<f-validation-form @submit="submit">
    <template #error-message> Errors in the following fields: </template>
    <f-text-field id="name" v-model="name" v-validation.required :maxlength="100">
        Name
    </f-text-field>
</f-validation-form>
```

- Directives chain: `v-validation.required.email`, `v-validation.required.ssn` and more.
- Use the typed fields instead of your own patterns: `FPersonnummerTextField`, `FPhoneTextField`, `FEmailTextField`, `FPostalCodeTextField`.
- Selects are `FSelectField` (option elements in the default slot), checkboxes group in an `FFieldset` with `FCheckboxField`, radios in an `FFieldset` with `FRadioField`.
- Date ranges on `FDatepickerField` are set with validators, not props: `v-validation.minDate.maxDate="{ minDate: { limit: '2026-01-01' }, maxDate: { limit: '2026-06-01' } }"`.
- File upload composes `FFileSelector` + `FFileItem` inside a `.file-uploader` wrapper, with your own size and count checks in the handler.
- The `FValidationForm` submit event only fires once the form is valid – errors collect in the error list (`FErrorList` via the `#error-message` slot).

## Search (optional)

Client-side search without a backend: a script reads `src/router/index.ts`, finds routes with title and description, strips the template markup of each view (directives, bindings, mustaches and tags) and writes a `public/search-index.json` with title, url, content excerpt and keywords per page. A `useSearch` composable fetches the index with `fetch(BASE_URL + "search-index.json")`, scores matches (title > description > content > keywords) and generates snippets. The search box is built on `FSearchTextField` with a live dropdown driven by focus, arrow keys and Esc – FSearchTextField has no dropdown of its own.

## Prerendering and GitHub Pages (optional)

A Playwright pass after `vite build` starts a static server over `dist/`, visits every route, waits for `#app` to fill and the title to match, and writes the snapshot HTML to `dist/<route>.html`. The base path (a GitHub Pages subdirectory) is read from the built index.html so the server matches production. Run the whole chain as one build script: index generation → vue-tsc → vite build → prerender.

Because a demo site's content is fictional, indexing protection comes along: `noindex, nofollow` meta per route (set it in the router guard so snapshots pick it up), a `robots.txt` with disallow-all including common AI bots, plus `_headers` with `X-Robots-Tag` and a `.nojekyll` file.

## Checklist

- [ ] FKUI packages pinned exactly, felix-ds as a git dependency at a commit
- [ ] FKUI CSS + scoped mixin pair in main.scss; custom SCSS with tokens only
- [ ] Color-mode module + inline script + toggle; `color-scheme` verified in both modes
- [ ] Fonts self-hosted; no font CDN in the build
- [ ] Forms on FValidationForm with typed fields and chained validators
- [ ] Search index generated in the build; search box with a keyboard-driven dropdown
- [ ] Prerender covers every route; the noindex package in place
