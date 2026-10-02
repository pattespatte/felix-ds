# felix-ds

[Svenska](#felix-ds) · [English](#felix-ds-english)

Projektet *felix-ds* är en konceptstudie (proof of concept) – ett fristående, organisationsneutralt designsystem. Det är ett tunt temalager ovanpå [FKUI:s](https://github.com/Forsakringskassan/designsystem) publika npm-paket. Temat levererar designvariabler som CSS-variabler och inbäddade typsnitt.

Du använder FKUI-komponenterna direkt och lägger felix-temat ovanpå. felix-ds har inga Vue-wrappers, ingen fork och inga egna komponenter.

En lokal playground visar att konceptet fungerar. Den visar alla 89 komponenter i FKUI:s publika paket (79 Vue-komponenter och 10 SCSS-komponenter) och låter dig växla direkt mellan FKUI:s grundtema och felix-temat.

FKUI:s dokumentation med levande komponentdemos finns på [designsystem.forsakringskassan.se](https://designsystem.forsakringskassan.se/).

## Välj ditt spår

Du kan använda felix-ds på två sätt. Välj det som passar ditt mål:

| Du vill … | Gå till |
| --- | --- |
| använda felix-temat i din egen webbapp | [Installation i en webbapp](#installation-i-en-webbapp) |
| köra playgrounden på din dator, utforska komponenterna eller utveckla temat | [Kom igång med playgrounden](#kom-igång-med-playgrounden) |
| se ett färdigt exempel på en webbapp med felix-temat | [Exempelsidan](https://pattespatte.github.io/felix-ds-demo-site/) |

Skillnaden i korthet:

- **Installation i en webbapp** lägger temat som ett npm-beroende i *ditt eget projekt*. Du klonar inte något repo och du kör inte playgrounden.
- **Kom igång med playgrounden** klonar *felix-ds-repot* och startar demoappen lokalt. Du gör det för att utforska eller utveckla temat, inte för att bygga en egen webbapp.

## Installation i en webbapp

Följ det här avsnittet när du vill använda felix-temat i din egen webbapp. Du installerar temat som ett npm-beroende. Playgrounden behöver du inte för det.

### 1. Välj hur du installerar temat

**Alternativ A – GitHub Packages (rekommenderas).** Paketet heter `@pattespatte/felix-ds` och publiceras på GitHub Packages med begränsad synlighet. Du behöver en personlig åtkomsttoken (PAT) med behörigheten `read:packages`. Exportera den som miljövariabeln `GITHUB_PACKAGES_TOKEN`. Hur du hanterar token beskrivs i [utgivningsdokumentationen](https://github.com/pattespatte/felix-ds/blob/main/docs/release.sv.md).

Kör blocket nedan i projektroten. Det skriver `.npmrc` och installerar paketet. Har du redan en `.npmrc`? Lägg då till de två raderna i den filen i stället.

```bash
# förutsätter att GITHUB_PACKAGES_TOKEN är exporterad (PAT med read:packages)
cat > .npmrc <<'EOF'
@pattespatte:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
EOF
bun add @pattespatte/felix-ds
```

**Alternativ B – git-pin.** Du installerar direkt från det publika repot och låser mot en exakt commit:

```bash
bun add felix-ds@github:pattespatte/felix-ds#<commit>
```

> [!NOTE]
> Sökvägen i dina importer följer paketnamnet. Med alternativ A skriver du `@pattespatte/felix-ds/src/...`. Med alternativ B skriver du `felix-ds/src/...`. Exemplen nedan använder alternativ A.

### 2. Installera FKUI-paketen

Temat bygger på FKUI. Du väljer själv versionerna av FKUI-paketen och låser dem exakt i `package.json`:

- Installera `@fkui/theme-default` med en version inom det stödda intervallet `>=6.57.0 <7.0.0`.
- Installera de andra FKUI-paketen du använder, till exempel `@fkui/design` och `@fkui/vue`.

```bash
bun add --exact @fkui/theme-default@6.60.0 @fkui/design@6.60.0 @fkui/vue@6.60.0
```

Läs [Kompatibilitet](#kompatibilitet) innan du skriver egen Sass som rör `@fkui/theme-default`.

### 3. Importera temat

Du importerar temat som SCSS. Paketet pekar ut `src/index.scss` via nyckeln `sass`.

Vill du ha ett globalt tema? Då skriver `@use` ut `@font-face` och `:root`-variabler:

```scss
@use "@pattespatte/felix-ds/src/index";
```

Vill du kunna växla tema i körtid? Då avgränsar du temat till en klass. Playgrounden gör så:

```scss
@use "@pattespatte/felix-ds/src/theme/default" as felix with ($global: false);

:root {
    @include felix.base; // FKUI:s grundtema
}

html.theme-felix {
    @include felix.light; // grundtema + felix-variabler
}
```

### 4. Ladda FKUI:s komponent-CSS

Importera FKUI:s CSS i webbappens ingångspunkt:

```ts
import "@fkui/design/lib/fkui.css";
import "@fkui/design/lib/fonts.css";
```

Du har nu temat på plats. En komplett genomgång finns i guiden [Skapa en webbplats med felix-ds](https://github.com/pattespatte/felix-ds/blob/main/docs/create-a-site.sv.md). Den tar upp projektsetup, temaintegration, mörkt läge, ikoner, formulär, sök och prerendering.

### Mörkt läge

Temat har även en mörk profil. `src/index.scss` skriver bara ut det ljusa temat. Du slår på mörkt läge med mixins:

- `base` / `light` – uppströms ljusa tema utan respektive med felix-variablerna.
- `base-dark` / `dark` – samma par för mörkt läge (`base-dark` är FKUI:s eget mörka tema).
- `auto` – båda de sammansatta temana bakom `prefers-color-scheme`-mediefrågor. Använd den när du vill följa systeminställningen.

Vill du styra läget själv, med klass eller attribut i stället för mediefrågor? Gör så här:

```scss
@use "@pattespatte/felix-ds/src/theme/default" as felix with ($global: false);

:root {
    @include felix.base; // grundtema, ljust
}

html[data-color-mode="dark"] {
    @include felix.base-dark; // grundtema, mörkt
}

html.theme-felix {
    @include felix.light; // felix, ljust
}

html.theme-felix[data-color-mode="dark"] {
    @include felix.dark; // felix, mörkt
}
```

Varje scope skriver ut hela tokenytan. Specificitetssteget (`:root` < `html.theme-felix` / `html[data-color-mode="dark"]` < den kombinerade selektorn) löser alla kombinationer utan `!important`. Mixinerna sätter också `color-scheme` per läge, så att nativa kontroller och rullningslister följer med.

I playgrounden gör färglägesknappen (sol/måne) uppe till höger exakt detta. Den följer systeminställningen tills användaren väljer själv. Valet sparas då i `localStorage`.

### Kompatibilitet

Temat har ett enda peer-beroende: `@fkui/theme-default` i intervallet `>=6.57.0 <7.0.0`. Intervallet gäller temalagret. Vi testar och stöder Sass-tokenytan i `@fkui/theme-default`, alltså de variabler som temats ingång laddar konfigurerat (`@use` i `src/theme/_default.scss`). Vi testar och stöder inte FKUI-komponenternas interna delar.

Övriga `@fkui/*`-paket (`@fkui/vue`, `@fkui/design` med flera) ingår inte i kontraktet. Du låser dem själv.

Testade ändpunkter i intervallet:

- 6.57.0 (undre gräns)
- 6.59.0 (demoplatsen)
- 6.60.0 (playgroundens låsta utvecklingsversioner, som vid varje uppgradering ligger på intervallets topp)

> [!WARNING]
> Låt aldrig din egen Sass ladda eller konfigurera `@fkui/theme-default`. Temats ingång laddar paketet redan konfigurerat. En andra konfigurerad `@use`-laddning krockar och bryter kompileringen.

### Exempel på implementering

- <https://pattespatte.github.io/felix-ds-demo-site/>

## Kom igång med playgrounden

Följ det här avsnittet när du vill köra playgrounden lokalt, utforska komponenterna eller utveckla temat. Du klonar hela felix-ds-repot. Playgrounden är en demoapp i samma repo, och du behöver den inte för att använda temat i en webbapp. Vill du bara använda temat? Gå till [Installation i en webbapp](#installation-i-en-webbapp).

```bash
git clone https://github.com/pattespatte/felix-ds.git
cd felix-ds
bun install        # npm install fungerar som alternativ
bun run dev        # startar playgrounden (Vite)
```

Öppna adressen som skrivs ut i terminalen (normalt `http://localhost:5173/`). Växla tema med väljaren uppe till höger.

### Skript

| Skript | Beskrivning |
| --- | --- |
| `bun run dev` | Starta playgrounden lokalt |
| `bun run build` | Bygg playgrounden för produktion |
| `bun run build:theme` | Kompilera temalagret till `dist/felix.css` (typsnittsfilerna hamnar bredvid i `dist/files/`) |
| `bun run fkui …` | Visa och uppgradera `@fkui/*`-beroendena (se [Uppgradera FKUI-beroendena](#uppgradera-fkui-beroendena)) |

## Utveckla felix-ds

Det här avsnittet vänder sig till dig som ändrar i repot.

### Arkitektur

felix-ds är ett enda npm-paket. Playgrounden ligger i en mapp i samma repo.

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

Temat följer samma modell som FKUI:s egna temapaket: mixins skriver ut CSS-variabler ovanpå `@fkui/design`. Grundtemat (`@fkui/theme-default`) laddas först. felix-variablerna deklareras efter i kaskaden och vinner utan `!important`. Temat har ett ljust och ett mörkt läge (se [Mörkt läge](#mörkt-läge)).

### Navigation i playgrounden

Playgrounden använder FKUI:s applikationsmall (`FLayoutApplicationTemplate` + `FLayoutLeftPanel`) med en egen navigering i två nivåer i vänsterkolumnen: kategori > komponent. Länkarna är hash-rutter på formen `#/vy` och `#/vy/ankare`, till exempel `#/formular/ftextfield`. Därför fungerar GitHub Pages-publiceringen utan serverkonfiguration.

Filen `playground/src/navigation.ts` definierar alla vyer och ankare. Vänstermenyn, sidfoten, startvyn och routern läser alla från den. Lägger du till en komponent där får den automatiskt en länk, en djuplänk och en plats i startlistan.

### Grafisk profil

- **Typografi:** Noto Sans för all löptext. Roboto Slab för rubriker och display (h1). Fetstil mappas till vikt 600. Temat bäddar inte in några 700-vikter.
- **Färger, linjetjocklekar (1/2 px) och radier (4/8 px):** Temat tar råa värden från en profilkälla utanför repot. Det återanvänder inte källans arkitektur.
- **Fokusmarkering:** en enkel 2 px-ring i profilens fokusfärg.

### Uppgradera FKUI-beroendena

Repot låser alla `@fkui/*`-paket till exakta versioner och uppgraderar dem i takt: samma version på samtliga paket, som uppströms publicerar dem. Hjälpskriptet `fkui` håller koll på läget och genomför uppgraderingen. (`bun fkui …` är en genväg som Bun tolkar som `bun run fkui …`.)

| Kommando | Beskrivning |
| --- | --- |
| `bun fkui version` | Visa specificerad, installerad och senaste version per paket |
| `bun fkui upgrade -n` | Torrkörning: visa planen (nuvarande → mål, steg, utgivningsdatum) utan att ändra något |
| `bun fkui upgrade` | Skriv nya exakta versioner i `package.json` och kör `bun install` |
| `bun fkui upgrade 6.58.0` | Som ovan, men till en vald version i stället för den senaste |

Planen skriver ut en länk till release notes och varnar särskilt för majorskiften. Efter en genomförd uppgradering gör du så här:

1. Kör `bun run build`.
2. Kör `bunx vue-tsc --noEmit`.
3. Kör `bun run build:theme`.
4. Gå en visuell runda i playgrounden.

### Komponenter i playgrounden

Playgrounden täcker alla 89 komponenter i FKUI:s publika paket (79 Vue-komponenter och 10 SCSS-komponenter), enligt komponentrapporten för den installerade versionen.

Komponentregistret är strukturellt i stället för en handskriven lista. Varje komponent har en demofil, `playground/src/demos/<kategori>/<Komponent>Demo.vue`, och en länk som ankare i `playground/src/navigation.ts`. Subkomponenter och enums visas i sin förälders demo. Startvyns avsnitt "Komponenter i playgrounden" hämtar kategorierna direkt från `navigation.ts`, så listan på sidan skiljer sig aldrig från menyn.

## Kända valideringsfynd (tredjepartskod)

<details>
<summary>Visa fynden</summary>

En HTML/CSS-validerare (till exempel W3C:s Nu-validerare) rapporterar flera fynd på playgrounden. Alla härstammar från tredjepartskod. Inget kommer från temalagrets egna filer. Vi åtgärdar dem därför inte här: projektet använder FKUI enbart som publika npm-paket (ingen fork, inga patchar), och fynden finns kvar i senaste publicerade versionen (6.57.1). Fynden är harmlösa i webbläsarna.

**Från FKUI:s stilmall `@fkui/design/lib/fkui.css`:**

- `padding`, `padding-top` och `padding-bottom` med `calc(var(--…, initial) * var(--f-density-factor, 1))` (6 deklarationer). Det är giltig modern CSS (math functions med `var()`). Validerarens parser stödjer den inte ännu, så det är ett falskt positivt.
- `container-type`, `@container` och `field-sizing` (4 fynd). Det är standardiserad modern CSS (container queries samt `field-sizing`, som är skyddad av `@supports`). Validerarens kunskap om egenskaper släpar efter, så det är falska positiva.
- `border-radius: var(--f-button-discrete-radius-hover, none)` (2 deklarationer). Variabeln är definierad som `none`, vilket inte är en giltig radielängd. Webbläsaren ogiltigförklarar därför deklarationen i körning. Det är en bugg i FKUI:s publicerade CSS, men den syns inte i playgrounden: knappelementets övriga regler behåller radien.
- `background-color: none` (2 deklarationer). Värdet är ogiltigt och webbläsaren stryker det. Det avsedda värdet är samma som initialvärdet (transparent), så det blir ingen visuell skillnad.
- `font-feature-settings: tnum` (1 deklaration). Funktionstaggen ska stå inom citattecken (`"tnum"`). Webbläsaren stryker den ociterade deklarationen. De andra, korrekt citerade deklarationerna i samma fil gäller.

**Från DOM som FKUI renderar:**

- `<textarea value="">`. Komponenten FTextareaField skickar med `value` som attribut, vilket HTML-specen inte tillåter på `textarea`. FKUI renderar det i körning. Vi kan inte åtgärda det utan en Vue-wrapper, och projektreglerna förbjuder wrappers.
- `<symbol x="0" y="0">`. `x` och `y` är giltiga attribut på `symbol` enligt SVG 2. Validerarens schema bygger på SVG 1.1, så det är ett falskt positivt.

**Från Vites utvecklingsläge:**

- `<style type="text/css">` (8 varningar). Dev-servern lägger in importerad CSS som style-element. Produktionsbygget länkar CSS:en med `<link>` i stället, så varningarna försvinner där. Validera därför `bun run build` följt av `bun run preview` (eller den byggda sidan), inte dev-serverns DOM.

</details>

## Licenser

- FKUI-beroendena (`@fkui/vue`, `@fkui/design`, `@fkui/theme-default`, `@fkui/date`, `@fkui/logic`, `@fkui/icon-lib-default`) har MIT-licens. Du använder dem som publika npm-paket.
- Noto Sans distribueras under SIL Open Font License 1.1. Licenstexten finns i `src/fonts/licenses/noto-sans-OFL.txt`.
- Roboto Slab distribueras under Apache License 2.0. Licenstexten finns i `src/fonts/licenses/roboto-slab-LICENSE-APACHE-2.0.txt`.

## Publiceringspolicy

Ägaren publicerar paketet som `@pattespatte/felix-ds` på GitHub Packages med begränsad synlighet. Den som installerar paketet behöver en PAT. Publicering sker bara enligt ägarens [utgivningsdokumentation](https://github.com/pattespatte/felix-ds/blob/main/docs/release.sv.md). Varje utgivning passerar först den visuella porten (skärmdumpsjämförelser och axe-skanningar). Repot ligger på GitHub, och playgrounden byggs och serveras via GitHub Pages med ägarens uttryckliga godkännande.

---

# felix-ds (English)

[Svenska](#felix-ds) · [English](#felix-ds-english)

felix-ds is a proof of concept: a standalone, organisation-neutral design system. It is a thin theme layer on top of [FKUI's](https://github.com/Forsakringskassan/designsystem) public npm packages. The theme delivers design tokens as CSS custom properties and self-hosted fonts.

You use the FKUI components directly and apply the felix theme on top. felix-ds has no Vue wrappers, no fork and no components of its own.

A local playground proves the concept. It shows all 89 components in FKUI's public packages (79 Vue components and 10 SCSS-only components) and lets you switch instantly between the FKUI base theme and the felix theme.

FKUI's documentation with live component demos is available at [designsystem.forsakringskassan.se](https://designsystem.forsakringskassan.se/).

## Choose your path

You can use felix-ds in two ways. Pick the one that matches your goal:

| You want to … | Go to |
| --- | --- |
| use the felix theme in your own web app | [Installation in a web app](#installation-in-a-web-app) |
| run the playground on your machine, explore the components or develop the theme | [Getting started with the playground](#getting-started-with-the-playground) |
| see a finished example of a web app with the felix theme | [Example site](https://pattespatte.github.io/felix-ds-demo-site/) |

The difference in short:

- **Installation in a web app** adds the theme as an npm dependency in *your own project*. You do not clone a repo and you do not run the playground.
- **Getting started with the playground** clones the *felix-ds repo* and starts the demo app locally. You do this to explore or develop the theme, not to build your own web app.

## Installation in a web app

Follow this section when you want to use the felix theme in your own web app. You install the theme as an npm dependency. You do not need the playground for that.

### 1. Choose how to install the theme

**Option A – GitHub Packages (recommended).** The package is called `@pattespatte/felix-ds` and is published on GitHub Packages with restricted visibility. You need a personal access token (PAT) with the `read:packages` scope. Export it as the environment variable `GITHUB_PACKAGES_TOKEN`. The [release runbook](https://github.com/pattespatte/felix-ds/blob/main/docs/release.en.md) describes how to handle the token.

Run the block below in your project root. It writes `.npmrc` and installs the package. Already have an `.npmrc`? Add the two lines to that file instead.

```bash
# requires GITHUB_PACKAGES_TOKEN to be exported (PAT with read:packages)
cat > .npmrc <<'EOF'
@pattespatte:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
EOF
bun add @pattespatte/felix-ds
```

**Option B – git pin.** You install straight from the public repo and lock to an exact commit:

```bash
bun add felix-ds@github:pattespatte/felix-ds#<commit>
```

> [!NOTE]
> The path in your imports follows the package name. With option A you write `@pattespatte/felix-ds/src/...`. With option B you write `felix-ds/src/...`. The examples below use option A.

### 2. Install the FKUI packages

The theme builds on FKUI. You choose the versions of the FKUI packages yourself and pin them exactly in `package.json`:

- Install `@fkui/theme-default` at a version inside the supported range `>=6.57.0 <7.0.0`.
- Install the other FKUI packages you use, for example `@fkui/design` and `@fkui/vue`.

```bash
bun add --exact @fkui/theme-default@6.60.0 @fkui/design@6.60.0 @fkui/vue@6.60.0
```

Read [Compatibility](#compatibility) before you write your own Sass that touches `@fkui/theme-default`.

### 3. Import the theme

You import the theme as SCSS. The package points to `src/index.scss` through its `sass` key.

Want a global theme? Then `@use` emits `@font-face` and `:root` variables:

```scss
@use "@pattespatte/felix-ds/src/index";
```

Want to switch themes at runtime? Then scope the theme to a class. The playground does this:

```scss
@use "@pattespatte/felix-ds/src/theme/default" as felix with ($global: false);

:root {
    @include felix.base; // FKUI base theme
}

html.theme-felix {
    @include felix.light; // base theme + felix variables
}
```

### 4. Load FKUI's component CSS

Import FKUI's CSS in your web app's entry point:

```ts
import "@fkui/design/lib/fkui.css";
import "@fkui/design/lib/fonts.css";
```

The theme is now in place. A complete walkthrough is in the guide [Building a site with felix-ds](https://github.com/pattespatte/felix-ds/blob/main/docs/create-a-site.en.md). It covers project setup, theme integration, dark mode, icons, forms, search and prerendering.

### Dark mode

The theme also ships a dark profile. `src/index.scss` emits only the light theme. You switch on dark mode with mixins:

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

### Compatibility

The theme has one peer dependency: `@fkui/theme-default` in the range `>=6.57.0 <7.0.0`. The range applies to the theme layer. We test and support the Sass token surface of `@fkui/theme-default`, meaning the variables that the theme entry loads configured (`@use` in `src/theme/_default.scss`). We do not test or support the internals of FKUI components.

The other `@fkui/*` packages (`@fkui/vue`, `@fkui/design` and the rest) are not part of the contract. You pin them yourself.

Tested endpoints within the range:

- 6.57.0 (lower bound)
- 6.59.0 (the demo site)
- 6.60.0 (the playground's dev pins, which exercise the top of the range as they are upgraded)

> [!WARNING]
> Never let your own Sass load or configure `@fkui/theme-default`. The theme entry already loads the package configured. A second configured `@use` load collides and breaks compilation.

### Example implementation

- <https://pattespatte.github.io/felix-ds-demo-site/>

## Getting started with the playground

Follow this section when you want to run the playground locally, explore the components or develop the theme. You clone the whole felix-ds repo. The playground is a demo app in the same repo, and you do not need it to use the theme in a web app. Only want to use the theme? Go to [Installation in a web app](#installation-in-a-web-app).

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
| `bun run build:theme` | Compile the theme layer to `dist/felix.css` (the font files land next to it in `dist/files/`) |
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

The theme follows the same model as FKUI's own theme packages: mixins emit CSS custom properties on top of `@fkui/design`. The base theme (`@fkui/theme-default`) loads first. The felix variables come after it in the cascade and win without `!important`. The theme has a light and a dark mode (see [Dark mode](#dark-mode)).

### Playground navigation

The playground uses FKUI's application template (`FLayoutApplicationTemplate` + `FLayoutLeftPanel`) with a custom two-level navigation in the left column: category > component. Links are hash routes on the form `#/view` and `#/view/anchor`, for example `#/formular/ftextfield`. That keeps the GitHub Pages deploy working without any server configuration.

The file `playground/src/navigation.ts` defines every view and anchor. The left menu, the footer, the start view and the router all read from it. When you add a component there, it automatically gets a link, a deep link and a place in the start list.

### Visual profile

- **Typography:** Noto Sans for all body text. Roboto Slab for headings and display (h1). Bold maps to weight 600. The theme bundles no 700 weights.
- **Colours, border widths (1/2 px) and radii (4/8 px):** The theme takes raw values from a profile source outside this repo. It does not reuse the source's architecture.
- **Focus indicator:** a single 2 px ring in the profile's focus colour.

### Upgrading the FKUI dependencies

The repo pins all `@fkui/*` packages to exact versions and upgrades them in lockstep: the same version on every package, matching how upstream publishes them. The `fkui` helper script tracks the state and performs the upgrade. (`bun fkui …` is a shortcut that Bun resolves to `bun run fkui …`.)

| Command | Description |
| --- | --- |
| `bun fkui version` | Show the specified, installed and latest version per package |
| `bun fkui upgrade -n` | Dry run: show the plan (current → target, step, release date) without changing anything |
| `bun fkui upgrade` | Write the new exact versions to `package.json` and run `bun install` |
| `bun fkui upgrade 6.58.0` | Same, but to a chosen version instead of the latest |

The plan prints a link to the release notes and calls out major bumps. After a completed upgrade, do this:

1. Run `bun run build`.
2. Run `bunx vue-tsc --noEmit`.
3. Run `bun run build:theme`.
4. Take a visual pass through the playground.

### Components in the playground

The playground covers all 89 components in FKUI's public packages (79 Vue components and 10 SCSS-only components), according to the component report for the installed version.

The component registry is structural rather than a hand-written list. Every component has a demo file, `playground/src/demos/<category>/<Component>Demo.vue`, and a link as an anchor in `playground/src/navigation.ts`. Sub-components and enums appear in their parent's demo. The start view's "Components in the playground" section reads the categories straight from `navigation.ts`, so the list on the page never drifts from the menu.

## Known validation findings (third-party code)

<details>
<summary>Show the findings</summary>

An HTML/CSS validator (for example the W3C Nu checker) reports several findings on the playground. All of them originate in third-party code. None come from the theme layer's own files. We therefore do not fix them here: the project uses FKUI strictly as public npm packages (no fork, no patches), and the findings remain in the latest published version (6.57.1). The findings are harmless in browsers.

**From FKUI's stylesheet `@fkui/design/lib/fkui.css`:**

- `padding`, `padding-top` and `padding-bottom` with `calc(var(--…, initial) * var(--f-density-factor, 1))` (6 declarations). This is valid modern CSS (math functions with `var()`). The validator's parser does not support it yet, so this is a false positive.
- `container-type`, `@container` and `field-sizing` (4 findings). This is standardised modern CSS (container queries, and `field-sizing`, which is guarded by `@supports`). The validator's property knowledge lags behind, so these are false positives.
- `border-radius: var(--f-button-discrete-radius-hover, none)` (2 declarations). The variable is defined as `none`, which is not a valid radius length. The browser therefore invalidates the declaration at runtime. This is a bug in FKUI's published CSS, but it has no visible effect in the playground: the button element's other rules keep the radius.
- `background-color: none` (2 declarations). The value is invalid and browsers drop it. The intended value equals the initial value (transparent), so there is no visual difference.
- `font-feature-settings: tnum` (1 declaration). The feature tag must be quoted (`"tnum"`). Browsers drop the unquoted declaration. The other, correctly quoted declarations in the same file apply.

**From DOM that FKUI renders:**

- `<textarea value="">`. The FTextareaField component passes `value` as an attribute, which the HTML spec does not allow on `textarea`. FKUI renders it at runtime. We cannot fix it without a Vue wrapper, and the project rules forbid wrappers.
- `<symbol x="0" y="0">`. `x` and `y` are valid attributes on `symbol` per SVG 2. The validator's schema is based on SVG 1.1, so this is a false positive.

**From Vite's development mode:**

- `<style type="text/css">` (8 warnings). The dev server injects imported CSS as style elements. The production build links the CSS with `<link>` instead, so the warnings disappear there. Validate `bun run build` followed by `bun run preview` (or the built site), not the dev server's DOM.

</details>

## Licenses

- The FKUI dependencies (`@fkui/vue`, `@fkui/design`, `@fkui/theme-default`, `@fkui/date`, `@fkui/logic`, `@fkui/icon-lib-default`) are MIT licensed. You use them as public npm packages.
- Noto Sans is distributed under the SIL Open Font License 1.1. The license text is in `src/fonts/licenses/noto-sans-OFL.txt`.
- Roboto Slab is distributed under the Apache License 2.0. The license text is in `src/fonts/licenses/roboto-slab-LICENSE-APACHE-2.0.txt`.

## Publishing policy

The owner publishes the package as `@pattespatte/felix-ds` on GitHub Packages with restricted visibility. Anyone who installs the package needs a PAT. Publishing follows only the owner's [release runbook](https://github.com/pattespatte/felix-ds/blob/main/docs/release.en.md). Every release first passes the visual gate (screenshot comparisons and axe scans). The repo is on GitHub, and the playground is built and served via GitHub Pages with the owner's explicit approval.
