# felix-ds

En privat konceptstudie (proof of concept): ett fristående, organisationsneutralt designsystem byggt som ett tunt temalager – designvariabler som CSS-variabler plus inbäddade typsnitt – ovanpå FKUI:s publika npm-paket. En lokal playground bevisar konceptet genom att visa samtliga 89 komponenter i FKUI:s publika paket (79 Vue-komponenter och 10 SCSS-komponenter) med omedelbar växling mellan FKUI:s grundtema och felix-temat. Inga Vue-wrappers, ingen fork, inga egna komponenter: konsumenten använder FKUI-komponenterna direkt och lägger bara på temat.

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
│   └── src/
│       ├── navigation.ts         # navigationens enda källa: vyer + ankare
│       ├── router.ts             # handrullad hash-routing (#/vy/ankare)
│       ├── views/                # en vyfil per kategori
│       └── demos/                # en demofil per komponent, grupperade per kategori
└── package.json
```

Temat bygger på samma modell som FKUI:s egna temapaket: mixins som skriver ut CSS-variabler ovanpå `@fkui/design`. Grundtemat (`@fkui/theme-default`) laddas först; felix-variablerna deklareras efter i kaskaden och vinner utan `!important`. Bara ljusläget finns i v1.

### Navigation i playgrounden

Playgrounden ligger i FKUI:s applikationsmall (`FLayoutApplicationTemplate` + `FLayoutLeftPanel`) med en egen tvånivånavigering i vänsterkolumnen: kategori > komponent. Länkarna är hash-rutter på formen `#/vy` och `#/vy/ankare` (t.ex. `#/formular/ftextfield`) så att GitHub Pages-deployen fungerar utan serverkonfiguration. Vilka vyer och ankare som finns definieras på ett ställe – `playground/src/navigation.ts` – som både vänstermenyn, sidfoten, startvyn och routern läser; en komponent som läggs till där får automatiskt länk, djuplänk och plats i startlistan.

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

Playgrounden täcker samtliga 89 komponenter i FKUI:s publika paket – 79 Vue-komponenter och 10 SCSS-komponenter – enligt komponentrapporten för installerad version. Registret över vad som finns är strukturellt i stället för en handskriven lista: varje komponent har en demofil `playground/src/demos/<kategori>/<Komponent>Demo.vue` (subkomponenter och enums demonstreras i sin förälders demo) och länkas som ankare från `playground/src/navigation.ts`. Startvyns avsnitt ”Komponenter i playgrounden” listar kategorierna direkt från navigation.ts, så listan på sidan kan aldrig skilja sig från menyn.

## Kända valideringsfynd (tredjepartskod)

En HTML/CSS-validerare (t.ex. W3C:s Nu-validerare) rapporterar ett antal fynd på playgrounden. Samtliga härstammar från tredjepartskod – inget från temalagrets egna filer – och därför åtgärdas de inte här: projektet konsumerar FKUI enbart som publika npm-paket (ingen fork, inga patches), och de aktuella fynden finns kvar i senaste publicerade versionen (6.57.1). Fynden är harmlösa i webbläsarna och redovisas nedan per ursprung.

Från FKUI:s stilmall `@fkui/design/lib/fkui.css`:

- `padding`/`padding-top`/`padding-bottom` med `calc(var(--…, initial) * var(--f-density-factor, 1))` (6 deklarationer) – giltig modern CSS (math functions med `var()`); validerarens parser stödjer den inte ännu, alltså ett falskt positivt.
- `container-type`, `@container` och `field-sizing` (4 fynd) – standardiserad modern CSS (container queries samt `field-sizing`, som där är skyddad av `@supports`); validerarens kunskap om egenskaper släpar efter, alltså falska positiva.
- `border-radius: var(--f-button-discrete-radius-hover, none)` (2 deklarationer) – variabeln är definierad som `none`, som inte är en giltig radielängd; deklarationen ogiltigförklaras därför i körning. Det är en bugg i FKUI:s publicerade css utan synbar effekt i playgrounden (radien behålls från knappelementets övriga regler).
- `background-color: none` (2 deklarationer) – ogiltigt värde som webbläsaren stryker; avsett värde sammanfaller med initialvärdet (transparent), så ingen visuell skillnad.
- `font-feature-settings: tnum` (1 deklaration) – funktionstaggen ska citeras (`"tnum"`); webbläsaren stryker den ociterade deklarationen medan de övriga, korrekt citerade i samma fil, gäller.

Från FKUI-renderad DOM:

- `<textarea value="">` – komponenten FTextareaField skickar med `value` som attribut, vilket HTML-specen inte tillåter på `textarea`. Renderas av FKUI i körning och kan inte åtgärdas utan en Vue-wrapper (förbjuden enligt projektreglerna).
- `<symbol x="0" y="0">` – `x`/`y` är giltiga attribut på `symbol` enligt SVG 2; validerarens schema bygger på SVG 1.1, alltså ett falskt positivt.

Från Vite:s utvecklingsläge:

- `<style type="text/css">` (8 varningar) – dev-servern injicerar importerad css som style-element. I produktionsbygget länkas css:en via `<link>` i stället, så varningarna försvinner: validera `bun run build` följt av `bun run preview` (eller den uppbyggda sidan), inte dev-serverns DOM.

## Licenser

- FKUI-beroendena (`@fkui/vue`, `@fkui/design`, `@fkui/theme-default`, `@fkui/date`, `@fkui/logic`, `@fkui/icon-lib-default`) är MIT-licensierade och används som publika npm-paket.
- Noto Sans distribueras under SIL Open Font License 1.1 – licenstexten ligger i `src/fonts/licenses/noto-sans-OFL.txt`.
- Roboto Slab distribueras under Apache License 2.0 – licenstexten ligger i `src/fonts/licenses/roboto-slab-LICENSE-APACHE-2.0.txt`.

## Publiceringspolicy

Paketet hålls `private: true` – ingen publicering till npm sker. Repot publiceras på GitHub och playgrounden byggs och serveras via GitHub Pages, med ägarens uttryckliga godkännande.

---

# felix-ds (English)

A private proof of concept: a standalone, organisation-neutral design system built as a thin theme layer – design tokens as CSS custom properties plus self-hosted fonts – on top of FKUI's public npm packages. The concept is proven by a local playground showing all 89 components in FKUI's public packages (79 Vue components and 10 SCSS-only components) with instant switching between the FKUI base theme and the felix theme. No Vue wrappers, no fork, no components of our own – consumers use the FKUI components directly and simply apply the theme.

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
│   └── src/
│       ├── navigation.ts         # single source of truth: views + anchors
│       ├── router.ts             # hand-rolled hash routing (#/view/anchor)
│       ├── views/                # one view file per category
│       └── demos/                # one demo file per component, grouped by category
└── package.json
```

The theme follows the same model as FKUI's own theme packages: mixins emitting CSS custom properties on top of `@fkui/design`. The base theme (`@fkui/theme-default`) loads first; the felix variables are declared after it in the cascade and win without `!important`. Light mode only in v1.

### Playground navigation

The playground sits in FKUI's application template (`FLayoutApplicationTemplate` + `FLayoutLeftPanel`) with a custom two-level navigation in the left column: category > component. Links are hash routes on the form `#/view` and `#/view/anchor` (e.g. `#/formular/ftextfield`), which keeps the GitHub Pages deploy working without any server configuration. Which views and anchors exist is defined in one place – `playground/src/navigation.ts` – read by the left menu, the footer, the start view and the router alike; a component added there automatically gets a link, a deep link and a place in the start list.

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

The playground covers all 89 components in FKUI's public packages – 79 Vue components and 10 SCSS-only components – according to the component report for the installed version. The registry of what exists is structural rather than a hand-written list: every component has a demo file `playground/src/demos/<category>/<Component>Demo.vue` (sub-components and enums are demonstrated inside their parent's demo) and is linked as an anchor from `playground/src/navigation.ts`. The start view's "Components in the playground" section lists the categories straight from navigation.ts, so the on-page list can never drift from the menu.

## Known validation findings (third-party code)

An HTML/CSS validator (e.g. the W3C Nu checker) reports a number of findings on the playground. All of them originate in third-party code – none in the theme layer's own files – and they are therefore not fixed here: the project consumes FKUI strictly as public npm packages (no fork, no patches), and the findings remain in the latest published version (6.57.1). They are harmless in browsers and are listed below by origin.

From FKUI's stylesheet `@fkui/design/lib/fkui.css`:

- `padding`/`padding-top`/`padding-bottom` with `calc(var(--…, initial) * var(--f-density-factor, 1))` (6 declarations) – valid modern CSS (math functions with `var()`); the validator's parser does not support it yet, so this is a false positive.
- `container-type`, `@container` and `field-sizing` (4 findings) – standardised modern CSS (container queries, and `field-sizing`, which there is guarded by `@supports`); the validator's property knowledge lags behind, so these are false positives.
- `border-radius: var(--f-button-discrete-radius-hover, none)` (2 declarations) – the variable is defined as `none`, which is not a valid radius length; the declaration is therefore invalidated at runtime. This is a bug in FKUI's published css with no visible effect in the playground (the radius comes from the button element's other rules).
- `background-color: none` (2 declarations) – invalid value that browsers drop; the intended value coincides with the initial value (transparent), so there is no visual difference.
- `font-feature-settings: tnum` (1 declaration) – the feature tag must be quoted (`"tnum"`); browsers drop the unquoted declaration while the other, correctly quoted ones in the same file apply.

From FKUI-rendered DOM:

- `<textarea value="">` – the FTextareaField component passes `value` as an attribute, which the HTML spec does not allow on `textarea`. It is rendered by FKUI at runtime and cannot be fixed without a Vue wrapper (forbidden by the project rules).
- `<symbol x="0" y="0">` – `x`/`y` are valid attributes on `symbol` per SVG 2; the validator's schema is based on SVG 1.1, so this is a false positive.

From Vite's development mode:

- `<style type="text/css">` (8 warnings) – the dev server injects imported css as style elements. The production build links the css via `<link>` instead, so the warnings disappear: validate `bun run build` followed by `bun run preview` (or the built site), not the dev server's DOM.

## Licenses

- The FKUI dependencies (`@fkui/vue`, `@fkui/design`, `@fkui/theme-default`, `@fkui/date`, `@fkui/logic`, `@fkui/icon-lib-default`) are MIT licensed and consumed as public npm packages.
- Noto Sans is distributed under the SIL Open Font License 1.1 – the license text is in `src/fonts/licenses/noto-sans-OFL.txt`.
- Roboto Slab is distributed under the Apache License 2.0 – the license text is in `src/fonts/licenses/roboto-slab-LICENSE-APACHE-2.0.txt`.

## Publishing policy

The package stays `private: true` – nothing is published to npm. The repo is published on GitHub and the playground is built and served via GitHub Pages, with the owner's explicit approval.
