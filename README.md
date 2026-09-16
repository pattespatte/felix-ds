# felix-ds

En privat konceptstudie (proof of concept): ett fristående, organisationsneutralt designsystem byggt som ett tunt temalager – designvariabler som CSS-variabler plus inbäddade typsnitt – ovanpå FKUI:s publika npm-paket. En lokal playground bevisar konceptet genom att visa cirka 20 representativa FKUI-komponenter med omedelbar växling mellan FKUI:s grundtema och felix-temat. Inga Vue-wrappers, ingen fork, inga egna komponenter: konsumenten använder FKUI-komponenterna direkt och lägger bara på temat.

## Kom igång

```bash
bun install        # npm install fungerar som alternativ
bun run dev        # startar playgrounden (Vite)
```

Öppna adressen som skrivs ut i terminalen (normalt `http://localhost:5173/`) och växla tema med väljaren uppe till höger.

Fler skript:

| Skript | Beskrivning |
| --- | --- |
| `bun run dev` | Starta playgrounden lokalt |
| `bun run build` | Bygg playgrounden för produktion |
| `bun run build:theme` | Kompilera temalagret till `dist/felix.css` (med typsnittsfilerna bredvid i `dist/files/`) |

## Arkitektur

Ett enda npm-paket (`private: true`). Playgrounden är en mapp i samma repo.

```
felix-ds/
├── src/
│   ├── theme/                    # SCSS som omdefinierar FKUI:s variabler
│   │   ├── _default.scss         # temaingång: sammansätter grundtema + felix
│   │   ├── shared/_index.scss    # --f-* (typografi, linjer, radier, fokus)
│   │   └── light/_variables.scss # samtliga --fkds-color-* (ljusläge)
│   ├── fonts/                    # woff2, @font-face och licenstexter
│   └── index.scss                # entry: @font-face + tema
├── playground/                   # Vite-app som demonstrerar temat
└── package.json
```

Temat bygger på samma modell som FKUI:s egna temapaket: mixins som skriver ut CSS-variabler ovanpå `@fkui/design`. Grundtemat (`@fkui/theme-default`) laddas först; felix-variablerna deklareras efter i kaskaden och vinner utan `!important`. Bara ljusläget finns i v1.

### Grafisk profil

- Typografi: Noto Sans för all löptext, Roboto Slab för rubriker och display (h1). Fetstil mappas till vikt 600 – inga 700-vikter bäddas in.
- Färger, linjetjocklekar (1/2 px) och radier (4/8 px) kommer som råa värden från en profilkälla utanför repot; källans arkitektur återanvänds inte.
- Fokusmarkering: en enkel 2 px-ring i profilens fokusfärg.

## Använda temat

Temat importeras som SCSS (paketet pekar ut `src/index.scss` via nyckeln `sass`):

```scss
// globalt tema: emitterar @font-face och :root-variabler
@use "felix-ds/src/index";
```

Eller avgränsa temat till en klass när du vill kunna växla i körtiden (så playgrounden gör):

```scss
@use "felix-ds/src/theme/default" as felix with ($global: false);

:root {
    @include felix.base; // FKUI:s grundtema
}

html.theme-felix {
    @include felix.light; // grundtema + felix-variabler
}
```

Konsumentens ingångspunkt laddar dessutom FKUI:s komponent-CSS:

```ts
import "@fkui/design/lib/fkui.css";
import "@fkui/design/lib/fonts.css";
```

## Komponenter i playgrounden

Playgrounden visar cirka 20 representativa FKUI-komponenter: FButton, FBadge, FMessageBox, FTooltip, FProgressbar, FLoader, FTextField, FTextareaField, FSelectField, FSearchTextField, FCheckboxField, FRadioField, FFieldset, FValidationForm, FErrorList (renderas av valideringsformuläret), FCard, FModal, FExpandablePanel, FTable, FDefinitionList, FPageHeader – samt chip-läget (ren SCSS-komponent) som fältgrupperna i formulärssektionen demonstrerar.

## Licenser

- FKUI-beroendena (`@fkui/vue`, `@fkui/design`, `@fkui/theme-default`, `@fkui/date`, `@fkui/logic`, `@fkui/icon-lib-default`) är MIT-licensierade och används som publika npm-paket.
- Noto Sans distribueras under SIL Open Font License 1.1 – licenstexten ligger i `src/fonts/licenses/noto-sans-OFL.txt`.
- Roboto Slab distribueras under Apache License 2.0 – licenstexten ligger i `src/fonts/licenses/roboto-slab-LICENSE-APACHE-2.0.txt`.

## Publiceringspolicy

Projektet hålls `private: true`. Ingen publicering till npm, GitHub eller annan extern server sker utan ägarens uttryckliga godkännande. Repot versionshanteras bara lokalt; inga fjärrrepos läggs till.

---

# felix-ds (English)

A private proof of concept: a standalone, organisation-neutral design system built as a thin theme layer – design tokens as CSS custom properties plus self-hosted fonts – on top of FKUI's public npm packages. The concept is proven by a local playground showing about 20 representative FKUI components with instant switching between the FKUI base theme and the felix theme. No Vue wrappers, no fork, no components of our own – consumers use the FKUI components directly and simply apply the theme.

## Getting started

```bash
bun install        # npm install works as a fallback
bun run dev        # starts the playground (Vite)
```

Open the address printed in the terminal (usually `http://localhost:5173/`) and switch themes with the selector in the top right corner.

Further scripts:

| Script | Description |
| --- | --- |
| `bun run dev` | Run the playground locally |
| `bun run build` | Production build of the playground |
| `bun run build:theme` | Compile the theme layer to `dist/felix.css` (fonts copied next to it in `dist/files/`) |

## Architecture

A single npm package (`private: true`). The playground is a folder in the same repo.

```
felix-ds/
├── src/
│   ├── theme/                    # SCSS redefining FKUI's variables
│   │   ├── _default.scss         # theme entry: composes base + felix
│   │   ├── shared/_index.scss    # --f-* (typography, borders, radii, focus)
│   │   └── light/_variables.scss # every --fkds-color-* token (light mode)
│   ├── fonts/                    # woff2, @font-face and license texts
│   └── index.scss                # entry: @font-face + theme
├── playground/                   # Vite app demonstrating the theme
└── package.json
```

The theme follows the same model as FKUI's own theme packages: mixins emitting CSS custom properties on top of `@fkui/design`. The base theme (`@fkui/theme-default`) loads first; the felix variables are declared after it in the cascade and win without `!important`. Light mode only in v1.

### Visual profile

- Typography: Noto Sans for all body text, Roboto Slab for headings and display (h1). Bold maps to weight 600 – no 700 weights are bundled.
- Colours, border widths (1/2 px) and radii (4/8 px) are taken as raw values from a profile source outside this repo; its architecture is not reused.
- Focus indicator: a single 2 px ring in the profile's focus colour.

## Using the theme

Import the theme as SCSS (the package points to `src/index.scss` via its `sass` key):

```scss
// global theme: emits @font-face and :root variables
@use "felix-ds/src/index";
```

Or scope the theme to a class when you want runtime switching (this is what the playground does):

```scss
@use "felix-ds/src/theme/default" as felix with ($global: false);

:root {
    @include felix.base; // FKUI base theme
}

html.theme-felix {
    @include felix.light; // base theme + felix variables
}
```

Also load FKUI's component CSS in the consumer entry point:

```ts
import "@fkui/design/lib/fkui.css";
import "@fkui/design/lib/fonts.css";
```

## Components in the playground

About 20 representative FKUI components are shown: FButton, FBadge, FMessageBox, FTooltip, FProgressbar, FLoader, FTextField, FTextareaField, FSelectField, FSearchTextField, FCheckboxField, FRadioField, FFieldset, FValidationForm, FErrorList (rendered by the validation form), FCard, FModal, FExpandablePanel, FTable, FDefinitionList, FPageHeader – plus the chip mode (an SCSS-only component) demonstrated by the field groups in the forms section.

## Licenses

- The FKUI dependencies (`@fkui/vue`, `@fkui/design`, `@fkui/theme-default`, `@fkui/date`, `@fkui/logic`, `@fkui/icon-lib-default`) are MIT licensed and consumed as public npm packages.
- Noto Sans is distributed under the SIL Open Font License 1.1 – the license text is in `src/fonts/licenses/noto-sans-OFL.txt`.
- Roboto Slab is distributed under the Apache License 2.0 – the license text is in `src/fonts/licenses/roboto-slab-LICENSE-APACHE-2.0.txt`.

## Publishing policy

The project stays `private: true`. Nothing is published to npm, GitHub or any other external server without the owner's explicit approval. The repo is version-controlled locally; no remotes are added.
