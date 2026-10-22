# felix-ds

[Svenska](#felix-ds) · [English](#felix-ds-english)

Projektet *felix-ds* är en konceptstudie (proof of concept) – ett fristående, organisationsneutralt designsystem. Det är ett tunt temalager ovanpå [FKUI:s](https://github.com/Forsakringskassan/designsystem) publika npm-paket. Temat levererar designvariabler som CSS-variabler och inbäddade typsnitt.

Du använder FKUI-komponenterna direkt och lägger felix-temat ovanpå. felix-ds har inga Vue-wrappers, ingen fork och inga egna komponenter.

En lokal playground visar att konceptet fungerar. Den visar alla 89 komponenter i FKUI:s publika paket (79 Vue-komponenter och 10 SCSS-komponenter) och låter dig växla direkt mellan FKUI:s grundtema och felix-temat.

FKUI:s dokumentation med levande komponentdemos finns på [designsystem.forsakringskassan.se](https://designsystem.forsakringskassan.se/).

## Välj ditt spår

| Du vill … | Gå till |
| --- | --- |
| använda felix-temat i din egen webbapp | [Installation i en webbapp](#installation-i-en-webbapp) |
| testa playgrounden på GitHub Pages | [Känn på playgrounden](https://pattespatte.github.io/felix-ds/) |
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
- Installera de andra FKUI-paketen du använder, till exempel `@fkui/design` och `@fkui/vue`, i samma version.

```bash
bun add --exact @fkui/theme-default@X.Y.Z @fkui/design@X.Y.Z @fkui/vue@X.Y.Z
```

Byt ut `X.Y.Z` mot den version du valt. Playgroundens egna lås står i repots `package.json` och visas i vyn Kom igång.

Läs [Kompatibilitet](#kompatibilitet) innan du skriver egen Sass som rör `@fkui/theme-default`.

### 3. Importera temat

Standardvägen är förbyggd CSS – den kräver ingen Sass. Importera en fil i appens startfil:

```ts
import "@pattespatte/felix-ds/dist/felix.css";
```

Filen innehåller `@font-face`, det ljusa temat på `:root` och det mörka temat på `html[data-color-mode="dark"]`. Vill du följa systeminställningen i stället för att styra färgläget själv finns `dist/felix-auto.css`. Paketets `main`-nyckel pekar på `dist/felix.css`, så den korta importen `import "@pattespatte/felix-ds"` fungerar också.

Vill du ha en enda import i stället för tre? Då finns `dist/felix-complete.css`. Den innehåller samma css som de här tre importerna, sammanfogade i samma ordning:

```ts
import "@fkui/design/lib/fkui.css";
import "@fkui/design/lib/fonts.css";
import "@pattespatte/felix-ds/dist/felix.css";
```

Den här raden ger alltså samma resultat som de tre raderna ovan, och ersätter både steg 3 och steg 4:

```ts
import "@pattespatte/felix-ds/dist/felix-complete.css";
```

`felix-complete.css` är ett smidigt alternativ, men standardvägen är de tre importerna ovan. De håller temat litet: standardposterna väger cirka 5 kb gzippat. Paritetstestet har bytebudgetar som ser till att de inte växer i onödan – en ändring som gör en post tyngre måste vara värd sin vikt.

Varje post har dessutom ett minifierat syskon: `dist/felix.min.css`, `dist/felix-auto.min.css` och `dist/felix-complete.min.css` innehåller samma regler i komprimerad form, för användare som laddar posten som ren `<link>`-css utan byggkedja. Minifieringen läser in varje färdig post som ren css, så en syntaktiskt ogiltig post fäller bygget i stället för att hamna i paketet.

Behöver du avgränsa temat till en egen selektor, till exempel för att växla tema i körtid? Då använder du SCSS-posterna i stället. Paketet pekar ut `src/index.scss` via nyckeln `sass`. Ett globalt tema:

```scss
@use "@pattespatte/felix-ds/src/index";
```

Körningsväxling med en klass – så här gör playgrounden:

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

Importera FKUI:s CSS i appens startfil:

```ts
import "@fkui/design/lib/fkui.css";
import "@fkui/design/lib/fonts.css";
```

Du har nu temat på plats. En komplett genomgång finns i guiden [Skapa en webbplats med felix-ds](https://github.com/pattespatte/felix-ds/blob/main/docs/create-a-site.sv.md). Den tar upp projektsetup, temaintegration, mörkt läge, ikoner, formulär, sök och prerendering.

### Ikoner

Paketet skickar med en kurerad ikonuppsättning från [Phosphor Icons](https://phosphoricons.com) (MIT-licens) i vikten bold. Uppsättningen ersätter standardikonbibliotekets teckningar bakom FIcons oförändrade namn – varje namn ur `@fkui/icon-lib-default` täcks (även de sammansatta `info`, `warning` och `tooltip`), maskinkontrollerat av paritetstestet i `scripts/icons.test.ts`, plus en kurerad utökning. Ikonerna är SVG-sprites som följer textfärgen i det aktiva temat.

Byt ut standardbibliotekets import mot temats spritesheet i appens startfil – importera aldrig båda, eftersom dubbla `f-icon-*`-symbol-id:n löser sig till det blad som först hamnar i DOM:en:

```ts
import "@pattespatte/felix-ds/src/icons/phosphor-spritesheet";
```

FIcon används sedan som vanligt, till exempel `<f-icon name="house">`. Hela uppsättningen visas på [playgroundens ikonsida](https://pattespatte.github.io/felix-ds/#/knappar/ficon). Nästa mening vänder sig till dig som utvecklar själva felix-ds-paketet – använder du bara paketet behöver du inte läsa den. Spritesheetet är genererat: när du har ändrat mappningarna i `scripts/icons.ts` skapar du det på nytt med `bun run icons:build`.

### Mörkt läge

Temat har även en mörk profil. Den förbyggda `dist/felix.css` har båda lägena inbyggda – ljust på `:root`, mörkt på `html[data-color-mode="dark"]`. På SCSS-sidan skriver `src/index.scss` bara ut det ljusa temat; du slår på mörkt läge med mixins:

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

### Design tokens i DTCG-format

Paketet skickar med tematokens som [W3C Design Tokens](https://design-tokens.github.io/community-group/) i utkastformatets JSON – två kompletta filer, en per färgläge:

- `@pattespatte/felix-ds/tokens/light.json` – det sammansatta temat i ljust läge
- `@pattespatte/felix-ds/tokens/dark.json` – det sammansatta temat i mörkt läge

”Sammansatt tema” är uppströms `@fkui/theme-default` plus felix-profilens överskrivningar, alltså exakt det som temats mixins skriver ut. Filerna genereras ur SCSS-källorna (i repot: `bun run tokens:build`) och paritetstestet (`bun test`) fäller filer som inte längre stämmer med temat. Formatet är verktygsneutralt och passar bland annat Tokens Studio och Style Dictionary. Importen är symmetrisk: `bun run tokens:import` läser valfri W3C DTCG-fil (till exempel en Figma-export) och skriver ut anpassade egenskaper, medan det handskrivna temat förblir den enda sanningskällan – se [docs/tokens.sv.md](docs/tokens.sv.md).

Namngivning, aliaser, undantag och konsumtionsvägar finns i guiden [Design tokens](https://github.com/pattespatte/felix-ds/blob/main/docs/tokens.sv.md).

### Kompatibilitet

Temat har ett enda peer-beroende: `@fkui/theme-default` i intervallet `>=6.57.0 <7.0.0`. Intervallet gäller temalagret. Vi testar och stöder Sass-tokenytan i `@fkui/theme-default`, alltså de variabler som temats ingång laddar konfigurerat (`@use` i `src/theme/_default.scss`). Vi testar och stöder inte FKUI-komponenternas interna delar.

Övriga `@fkui/*`-paket (`@fkui/vue`, `@fkui/design` med flera) ingår inte i kontraktet. Du låser dem själv.

> [!WARNING]
> Låt aldrig din egen Sass ladda eller konfigurera `@fkui/theme-default`. Temats ingång laddar paketet redan konfigurerat. En andra konfigurerad `@use`-laddning krockar och bryter kompileringen.

Versionskontraktet – semantisk versionering av token och mixins, avvecklingsmönstret och stödintervallet – beskrivs i [Styrning och versionskontrakt](https://github.com/pattespatte/felix-ds/blob/main/docs/governance.sv.md). När token inte räcker till är första svaret komposition i stället för wrappers – beprövade recept finns i [Mönsterbiblioteket](https://github.com/pattespatte/felix-ds/blob/main/docs/patterns.sv.md).

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
| `bun run build:theme` | Kompilera de förbyggda CSS-posterna till `dist/felix.css`, `dist/felix-auto.css` och `dist/felix-complete.css` samt minifierade `.min.css`-syskon (committas; paritetstestet fäller föråldrade filer och bevakar bytebudgetarna) |
| `bun run tokens:build` | Generera `tokens/light.json` och `tokens/dark.json` ur temats SCSS-källor |
| `bun run tokens:import` | Läs en W3C DTCG-fil och skriv ut anpassade CSS-egenskaper (valfri fil som argument) |
| `bun run icons:build` | Generera om `src/icons/phosphor-spritesheet.ts` ur mappningarna i `scripts/icons.ts` |
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
│   ├── prebuilt/                 # selektorskal för de förbyggda CSS-posterna
│   ├── fonts/                    # woff2, @font-face och licenstexter
│   └── index.scss                # ingång: @font-face + tema
├── dist/                         # förbyggd css (committad, paritetstestad)
├── playground/                   # Vite-app som demonstrerar temat
│   └── src/
│       ├── navigation.ts         # navigationens enda källa: vyer + ankare
│       ├── router.ts             # handrullad hash-routing (#/vy/ankare)
│       ├── views/                # en vyfil per kategori
│       └── demos/                # en demofil per komponent, grupperade per kategori
└── package.json
```

Temat följer samma modell som FKUI:s egna temapaket: mixins skriver ut CSS-variabler ovanpå `@fkui/design`. Grundtemat (`@fkui/theme-default`) laddas först. felix-variablerna deklareras efter i kaskaden och vinner utan `!important`. Temat har ett ljust och ett mörkt läge (se [Mörkt läge](#mörkt-läge)). Vill en organisation replikera modellen för en annan varumärkesprofil beskriver guiden [Bygg din egen profil](https://github.com/pattespatte/felix-ds/blob/main/docs/build-your-own.sv.md) hela metoden.

### Navigation i playgrounden

Playgrounden använder FKUI:s applikationsmall (`FLayoutApplicationTemplate` + `FLayoutLeftPanel`) med en egen navigering i två nivåer i vänsterkolumnen: kategori > komponent. Länkarna är hash-rutter på formen `#/vy` och `#/vy/ankare`, till exempel `#/formular/ftextfield`. Därför fungerar GitHub Pages-publiceringen utan serverkonfiguration.

Filen `playground/src/navigation.ts` definierar alla vyer och ankare. Vänstermenyn, sidfoten, startvyn och routern läser alla från den. Lägger du till en komponent där får den automatiskt en länk, en djuplänk och en plats i startlistan.

### Grafisk profil

- **Typografi:** Noto Sans för all löptext. Roboto Slab för rubriker och display (h1). Fetstil mappas till vikt 600. Temat bäddar inte in några 700-vikter.
- **Färger, linjetjocklekar (1 px) och radier (6/8 px):** temat ritar alla komponentramar som 1 px-hårstreck. Mindre komponenter får radie 6 px, större 8 px.
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

1. Kör `bun test` (paritetstesterna för tokens, ikoner och förbyggd css).
2. Kör `bun run build:theme` och committa de omkompilerade filerna i `dist/` om de ändrats.
3. Kör `bun run build` och `bunx vue-tsc --noEmit`.
4. Kör `bun run test:visual` och `bun run test:a11y`.
5. Gå en visuell runda i playgrounden.

Senaste uppgraderingsrepetitionen: 6.60.0 → 6.62.0 (2026-10-15) blev en visuell nolla. Enda skillnaden i kompilerad css var versionsmarkören `--fkui-theme-default-version`, ingen tokenändring. Hela porten (paritetstester, bygge, typkontroll, 45 skärmdumpsjämförelser i chromium, 32 axe-skanningar) passerade oförändrad.

### Komponenter i playgrounden

Playgrounden täcker alla 89 komponenter i FKUI:s publika paket (79 Vue-komponenter och 10 SCSS-komponenter), enligt komponentrapporten för den installerade versionen.

Komponentregistret är strukturellt i stället för en handskriven lista. Varje komponent har en demofil, `playground/src/demos/<kategori>/<Komponent>Demo.vue`, och en länk som ankare i `playground/src/navigation.ts`. Subkomponenter och enums visas i sin förälders demo. Startvyns avsnitt "Komponenter i playgrounden" hämtar kategorierna direkt från `navigation.ts`, så listan på sidan skiljer sig aldrig från menyn.

## Kända valideringsfynd (tredjepartskod)

<details>
<summary>Visa fynden</summary>

En HTML/CSS-validerare (till exempel W3C:s Nu-validerare) rapporterar flera fynd på playgrounden. Alla härstammar från tredjepartskod. Inget kommer från temalagrets egna filer. Vi åtgärdar dem därför inte här: projektet använder FKUI enbart som publika npm-paket (ingen fork, inga patchar), och fynden finns kvar i senaste publicerade versionen. Fynden är harmlösa i webbläsarna.

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
- Ikonuppsättningen är renderad från Phosphor Icons (MIT-licens) via utvecklingsberoendet `@phosphor-icons/vue`.
- Noto Sans distribueras under SIL Open Font License 1.1. Licenstexten finns i `src/fonts/licenses/noto-sans-OFL.txt`.
- Roboto Slab distribueras under Apache License 2.0. Licenstexten finns i `src/fonts/licenses/roboto-slab-LICENSE-APACHE-2.0.txt`.

## Publiceringspolicy

Ägaren publicerar paketet som `@pattespatte/felix-ds` på GitHub Packages med begränsad synlighet. Den som installerar paketet behöver en PAT (Personal Access Token). Publicering sker bara enligt ägarens [utgivningsdokumentation](https://github.com/pattespatte/felix-ds/blob/main/docs/release.sv.md). Varje utgivning passerar först den visuella porten (skärmdumpsjämförelser och axe-skanningar). Tillgänglighetstäckningen dokumenteras i playgroundens vy Tillgänglighet: vilken vy som demonstrerar varje komponent, vad axe-testningen omfattar och vad som kräver manuell granskning. Underlaget att lyfta in i en egen tillgänglighetsredogörelse finns i [docs/accessibility-basis.sv.md](docs/accessibility-basis.sv.md). Repot ligger på GitHub, och playgrounden byggs och serveras via GitHub Pages med ägarens uttryckliga godkännande.

---

# felix-ds (English)

[Svenska](#felix-ds) · [English](#felix-ds-english)

felix-ds is a proof of concept: a standalone, organisation-neutral design system. It is a thin theme layer on top of [FKUI's](https://github.com/Forsakringskassan/designsystem) public npm packages. The theme delivers design tokens as CSS custom properties and self-hosted fonts.

You use the FKUI components directly and apply the felix theme on top. felix-ds has no Vue wrappers, no fork and no components of its own.

A local playground proves the concept. It shows all 89 components in FKUI's public packages (79 Vue components and 10 SCSS-only components) and lets you switch instantly between the FKUI base theme and the felix theme.

FKUI's documentation with live component demos is available at [designsystem.forsakringskassan.se](https://designsystem.forsakringskassan.se/).

## Choose your path

| You want to … | Go to |
| --- | --- |
| use the felix theme in your own web app | [Installation in a web app](#installation-in-a-web-app) |
| test the playground at GitHub Pages | [Check out the playground](https://pattespatte.github.io/felix-ds/) |
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
- Install the other FKUI packages you use, for example `@fkui/design` and `@fkui/vue`, at the same version.

```bash
bun add --exact @fkui/theme-default@X.Y.Z @fkui/design@X.Y.Z @fkui/vue@X.Y.Z
```

Replace `X.Y.Z` with the version you chose. The playground's own pins live in the repo's `package.json` and are shown in the Kom igång view.

Read [Compatibility](#compatibility) before you write your own Sass that touches `@fkui/theme-default`.

### 3. Import the theme

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

So this one line gives the same result as the three lines above, and replaces both step 3 and step 4:

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

### 4. Load FKUI's component CSS

Import FKUI's CSS in your web app's entry point:

```ts
import "@fkui/design/lib/fkui.css";
import "@fkui/design/lib/fonts.css";
```

The theme is now in place. A complete walkthrough is in the guide [Building a site with felix-ds](https://github.com/pattespatte/felix-ds/blob/main/docs/create-a-site.en.md). It covers project setup, theme integration, dark mode, icons, forms, search and prerendering.

### Icons

The package ships a curated icon set from [Phosphor Icons](https://phosphoricons.com) (MIT licensed) at the bold weight. The set replaces the default icon library's artwork behind FIcon's unchanged names – every name from `@fkui/icon-lib-default` is covered (including the stacked composites `info`, `warning` and `tooltip`), machine-checked by the parity test in `scripts/icons.test.ts`, plus a curated expansion. The icons are SVG sprites that follow the active theme's text color.

Replace the default library's import with the theme's spritesheet in your web app's entry point – never import both, since duplicate `f-icon-*` symbol ids resolve to whichever sheet enters the DOM first:

```ts
import "@pattespatte/felix-ds/src/icons/phosphor-spritesheet";
```

FIcon is then used as usual, for example `<f-icon name="house">`. The full set is on the [playground's icon page](https://pattespatte.github.io/felix-ds/#/knappar/ficon). Maintainers regenerate the sheet with `bun run icons:build` – the mappings in `scripts/icons.ts` are the source.

### Dark mode

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

### Design tokens in DTCG format

The package ships the theme tokens as [W3C Design Tokens](https://design-tokens.github.io/community-group/) in the draft format's JSON – two complete files, one per color mode:

- `@pattespatte/felix-ds/tokens/light.json` – the composed theme in light mode
- `@pattespatte/felix-ds/tokens/dark.json` – the composed theme in dark mode

”Composed theme” means the upstream `@fkui/theme-default` plus the felix profile's overrides, in other words exactly what the theme mixins emit. The files are generated from the SCSS sources (in the repo: `bun run tokens:build`), and the parity test (`bun test`) fails files that no longer match the theme. The format is tool-agnostic and fits, among others, Tokens Studio and Style Dictionary. The import is symmetric: `bun run tokens:import` reads any W3C DTCG file (a Figma export, for example) and emits custom properties, while the hand-written theme remains the single source of truth – see [docs/tokens.en.md](docs/tokens.en.md).

Naming, aliases, exclusions and consumption paths are covered in the [Design tokens](https://github.com/pattespatte/felix-ds/blob/main/docs/tokens.en.md) guide.

### Compatibility

The theme has one peer dependency: `@fkui/theme-default` in the range `>=6.57.0 <7.0.0`. The range applies to the theme layer. We test and support the Sass token surface of `@fkui/theme-default`, meaning the variables that the theme entry loads configured (`@use` in `src/theme/_default.scss`). We do not test or support the internals of FKUI components.

The other `@fkui/*` packages (`@fkui/vue`, `@fkui/design` and the rest) are not part of the contract. You pin them yourself.

> [!WARNING]
> Never let your own Sass load or configure `@fkui/theme-default`. The theme entry already loads the package configured. A second configured `@use` load collides and breaks compilation.

The version contract – semantic versioning of tokens and mixins, the deprecation pattern and the support range – is described in [Governance and version contract](https://github.com/pattespatte/felix-ds/blob/main/docs/governance.en.md). When the tokens are not enough, the first answer is composition instead of wrappers – proven recipes live in the [pattern library](https://github.com/pattespatte/felix-ds/blob/main/docs/patterns.en.md).

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
| `bun run build:theme` | Compile the prebuilt CSS entries to `dist/felix.css`, `dist/felix-auto.css` and `dist/felix-complete.css` plus minified `.min.css` siblings (committed; the parity test fails stale files and enforces the byte budgets) |
| `bun run tokens:build` | Generate `tokens/light.json` and `tokens/dark.json` from the theme's SCSS sources |
| `bun run tokens:import` | Read a W3C DTCG file and emit CSS custom properties (any file as argument) |
| `bun run icons:build` | Regenerate `src/icons/phosphor-spritesheet.ts` from the mappings in `scripts/icons.ts` |
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

The theme follows the same model as FKUI's own theme packages: mixins emit CSS custom properties on top of `@fkui/design`. The base theme (`@fkui/theme-default`) loads first. The felix variables come after it in the cascade and win without `!important`. The theme has a light and a dark mode (see [Dark mode](#dark-mode)). An organisation that wants to replicate the model for another brand profile finds the whole method in the [build your own profile](https://github.com/pattespatte/felix-ds/blob/main/docs/build-your-own.en.md) guide.

### Playground navigation

The playground uses FKUI's application template (`FLayoutApplicationTemplate` + `FLayoutLeftPanel`) with a custom two-level navigation in the left column: category > component. Links are hash routes on the form `#/view` and `#/view/anchor`, for example `#/formular/ftextfield`. That keeps the GitHub Pages deploy working without any server configuration.

The file `playground/src/navigation.ts` defines every view and anchor. The left menu, the footer, the start view and the router all read from it. When you add a component there, it automatically gets a link, a deep link and a place in the start list.

### Visual profile

- **Typography:** Noto Sans for all body text. Roboto Slab for headings and display (h1). Bold maps to weight 600. The theme bundles no 700 weights.
- **Colours, border widths (1 px) and radii (6/8 px):** The theme draws every component border as a 1 px hairline. Smaller components get a 6 px radius, larger ones 8 px.
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

1. Run `bun test` (the parity tests for tokens, icons and prebuilt CSS).
2. Run `bun run build:theme` and commit the recompiled files in `dist/` if they changed.
3. Run `bun run build` and `bunx vue-tsc --noEmit`.
4. Run `bun run test:visual` and `bun run test:a11y`.
5. Take a visual pass through the playground.

Latest upgrade rehearsal: 6.60.0 → 6.62.0 (2026-10-15) was a visual no-op. The only difference in compiled CSS was the `--fkui-theme-default-version` marker, no token change. The whole gate (parity tests, build, type-check, 45 chromium screenshot comparisons, 32 axe scans) passed unchanged.

### Components in the playground

The playground covers all 89 components in FKUI's public packages (79 Vue components and 10 SCSS-only components), according to the component report for the installed version.

The component registry is structural rather than a hand-written list. Every component has a demo file, `playground/src/demos/<category>/<Component>Demo.vue`, and a link as an anchor in `playground/src/navigation.ts`. Sub-components and enums appear in their parent's demo. The start view's "Components in the playground" section reads the categories straight from `navigation.ts`, so the list on the page never drifts from the menu.

## Known validation findings (third-party code)

<details>
<summary>Show the findings</summary>

An HTML/CSS validator (for example the W3C Nu checker) reports several findings on the playground. All of them originate in third-party code. None come from the theme layer's own files. We therefore do not fix them here: the project uses FKUI strictly as public npm packages (no fork, no patches), and the findings remain in the latest published version. The findings are harmless in browsers.

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
- The icon set is rendered from Phosphor Icons (MIT licensed) via the `@phosphor-icons/vue` dev dependency.
- Noto Sans is distributed under the SIL Open Font License 1.1. The license text is in `src/fonts/licenses/noto-sans-OFL.txt`.
- Roboto Slab is distributed under the Apache License 2.0. The license text is in `src/fonts/licenses/roboto-slab-LICENSE-APACHE-2.0.txt`.

## Publishing policy

The owner publishes the package as `@pattespatte/felix-ds` on GitHub Packages with restricted visibility. Anyone who installs the package needs a PAT. Publishing follows only the owner's [release runbook](https://github.com/pattespatte/felix-ds/blob/main/docs/release.en.md). Every release first passes the visual gate (screenshot comparisons and axe scans). Accessibility coverage is documented in the playground's Tillgänglighet view: which view demonstrates each component, what the axe testing covers and what requires manual review. A lift-ready basis for your own accessibility statement is in [docs/accessibility-basis.en.md](docs/accessibility-basis.en.md). The repo is on GitHub, and the playground is built and served via GitHub Pages with the owner's explicit approval.
