# Utveckla felix-ds och köra playgrounden

*Det här dokumentet finns också på engelska: [development.en.md](development.en.md).*

Den här sidan riktar sig till dig som kör [playgrounden](../README.md#välj-ditt-spår) lokalt eller ändrar i felix-ds-repot.

## Kom igång med playgrounden

Följ det här avsnittet när du vill köra playgrounden lokalt, utforska komponenterna eller utveckla temat. Du klonar hela felix-ds-repot. Playgrounden är en demoapp i samma repo, och du behöver den inte för att använda temat i en webbapp. Vill du bara använda temat? Gå till [Installation i en webbapp](../README.md#installation-i-en-webbapp).

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
| `bun run build:theme` | Kompilera de förbyggda CSS-posterna till `dist/felix.css`, `dist/felix-auto.css` och `dist/felix-complete.css` samt minifierade `.min.css`-syskon (filerna committas – paritetstestet upptäcker föråldrade filer och kontrollerar bytebudgetarna) |
| `bun run tokens:build` | Generera `tokens/light.json` och `tokens/dark.json` ur temats SCSS-källor |
| `bun run tokens:export` | Alias för `tokens:build` – samma skript, döpt efter exportriktningen |
| `bun run tokens:import` | Läs en W3C DTCG-fil och skriv ut anpassade CSS-egenskaper (valfri fil som argument) |
| `bun run icons:build` | Generera om `src/icons/phosphor-spritesheet.ts` ur mappningarna i `scripts/icons.ts` |
| `bun run search:build` | Generera playgroundens sökindex `playground/public/search-index.json` ur navigationen och demoerna (körs även automatiskt av Vite i dev och bygge) |
| `bun run accessibility:build` | Generera `docs/accessibility-basis.en.md` och `docs/accessibility-basis.sv.md` – underlaget till en egen tillgänglighetsredogörelse – ur playgroundens tillgänglighetsdata |
| `bun run changelog` | Generera `CHANGELOG.md` ur repots commits med git-cliff |
| `bun run test:visual` | Kör skärmdumpsjämförelserna i chromium mot committade referensbilder |
| `bun run test:visual:update` | Som `test:visual`, men skriv om referensbilderna i stället för att jämföra |
| `bun run test:visual:cross` | Kör skärmdumpsjämförelser i webkit och firefox som komplement till chromium-porten |
| `bun run test:a11y` | Kör tillgänglighetstesterna (axe-skanningar) i chromium |
| `bun run fkui …` | Visa och uppgradera `@fkui/*`-beroendena (se [Uppgradera FKUI-beroendena](#uppgradera-fkui-beroendena)) |

## Utveckla felix-ds

Det här avsnittet vänder sig till dig som ändrar i repot.

### Arkitektur

felix-ds är ett enda npm-paket. Playgrounden ligger i en mapp i samma repo.

```
felix-ds/
├── src/
│   ├── theme/                    # SCSS som omdefinierar FKUI:s variabler
│   │   ├── _default.scss         # temats startfil: slår ihop grundtema + felix
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

Temat följer samma modell som FKUI:s egna temapaket: mixins skriver ut CSS-variabler ovanpå `@fkui/design`. Grundtemat (`@fkui/theme-default`) laddas först. felix-variablerna deklareras efter i kaskaden och vinner utan `!important`. Temat har ett ljust och ett mörkt läge (se [Mörkt läge](getting-started.sv.md#mörkt-läge)). Vill en organisation replikera modellen för en annan varumärkesprofil beskriver guiden [Bygg din egen profil](build-your-own.sv.md) hela metoden.

### Navigation i playgrounden

Playgrounden använder FKUI:s applikationsmall (`FLayoutApplicationTemplate` + `FLayoutLeftPanel`) med en egen navigering i två nivåer i vänsterkolumnen: kategori > komponent. Länkarna är hash-rutter på formen `#/vy` och `#/vy/ankare`, till exempel `#/formular/ftextfield`. Därför fungerar GitHub Pages-publiceringen utan serverkonfiguration.

Filen `playground/src/navigation.ts` definierar alla vyer och ankare. Vänstermenyn, sidfoten, startvyn och routern läser alla från den. Lägger du till en komponent där får den automatiskt en länk, en djuplänk och en plats i startlistan.

### Grafisk profil

- **Typografi:** Noto Sans för all löptext. Roboto Slab för rubriker och display (h1). Fetstil mappas till vikt 600. Temat bäddar inte in några 700-vikter.
- **Färger, linjetjocklekar (1 px) och radier (6/8 px):** temat ritar alla komponentramar som 1 px-hårstreck. Mindre komponenter får radie 6 px, större 8 px.
- **Fokusmarkering:** en enkel 2 px-ring i profilens fokusfärg.

### Uppgradera FKUI-beroendena

Repot låser alla `@fkui/*`-paket till exakta versioner och uppgraderar dem i takt: samma version på samtliga paket, som uppströms publicerar dem. Hjälpskriptet `fkui` håller koll på läget och genomför uppgraderingen. (`bun fkui …` är en genväg som Bun tolkar som `bun run fkui …`.) Båda vägarna – veckorondens pull request och den lokala repetitionen – går steg för steg i [uppgraderingsguiden](upgrade-fkui.sv.md).

| Kommando | Beskrivning |
| --- | --- |
| `bun fkui version` | Visa specificerad, installerad och senaste version per paket |
| `bun fkui upgrade -n` | Torrkörning: visa planen (nuvarande → mål, steg, utgivningsdatum) utan att ändra något |
| `bun fkui upgrade` | Skriv nya exakta versioner i `package.json` och kör `bun install` |
| `bun fkui upgrade 6.58.0` | Som ovan, men till en vald version i stället för den senaste |
| `bun fkui components` | Lista de komponenter som `@fkui/vue` exporterar, en per rad |
| `bun fkui components:status` | Som ovan, men med status per rad: Produktionsklar (grönt) eller Deprekerad (rött) |

Planen skriver ut en länk till release notes och varnar särskilt för majorskiften. Efter en genomförd uppgradering gör du så här:

1. Kör `bun test` (paritetstesterna för tokens, ikoner och förbyggd css).
2. Kör `bun run build:theme` och committa de omkompilerade filerna i `dist/` om de ändrats.
3. Kör `bun run build` och `bunx vue-tsc --noEmit`.
4. Kör `bun run test:visual` och `bun run test:a11y`.
5. Gå en visuell runda i playgrounden.

Senaste uppgraderingsrepetitionen: 6.64.0 → 6.65.0 (2026-11-13) blev en visuell nolla uppströms – enda pixeländringen var startpunktens pil, som temalagrets delade chevron-omritning hade riktat nedåt. Den pekas nu framåt och ritas ett steg större. Uppströms innehöll konfigurerbar textbrytning i FTable (nya `--wrap`-klasser i `table-ng`), återkallad legacy-palett, ett överlappsläge för popup-menyers ankare, bevarad textfärg på datepicker-stängknappen samt att Enter i redigerbara tabellceller inte längre skickar formuläret – 6.64.1:s omskrivna hover- och aktivfärger på knappar och länkar följde med i samma lyft. Tokenfilerna (`tokens/light.json`, `tokens/dark.json`) genererades om byte-identiska, komponentexporterna var oförändrade och hela porten (paritetstester, bygge, typkontroll, 45 skärmdumpsjämförelser i chromium, 32 axe-skanningar) passerade. Senaste utgåvan är 6.65.1, men den finns bara hos fem av sex paket (`@fkui/theme-default` stannar på 6.65.0) – låsningen följer senaste version som finns hos samtliga och plockar upp 6.65.1 vid nästa gemensamma utgåva.

### Komponenter i playgrounden

Playgrounden täcker alla 89 komponenter i FKUI:s publika paket (79 Vue-komponenter och 10 SCSS-komponenter), enligt komponentrapporten för den installerade versionen.

Komponentregistret är strukturellt i stället för en handskriven lista. Varje komponent har en demofil, `playground/src/demos/<kategori>/<Komponent>Demo.vue`, och en länk som ankare i `playground/src/navigation.ts`. Subkomponenter och enums visas i sin förälders demo. Startvyns avsnitt ”Komponenter i playgrounden” hämtar kategorierna direkt från `navigation.ts`, så listan på sidan skiljer sig aldrig från menyn.

### Underhåll och arbetsflöden

Repots fem GitHub Actions-arbetsflöden – veckoronder, baseline-generering, utgivning – beskrivs i [docs/maintenance.sv.md](maintenance.sv.md): vad som körs av sig självt, när du själv behöver göra något och hur arbetsflödena triggas.
