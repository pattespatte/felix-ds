# Bygg din egen profil – metoden

felix-ds är en varumärkesprofil byggd med en liten, upprepningsbar metod. En organisation med flera varumärken kan upprepa lagret för varje varumärke till låg kostnad: ett paket med CSS-variabler och typsnitt per varumärke, noll komponenter, all FKUI täckt den dag den ges ut. Den här guiden beskriver metoden från början till slut och pekar på de dokument som visar hur varje steg genomförs. Den är medvetet inte en kopiera-filerna-genomgång – token-värdena skriver du själv, formen är det som beskrivs här.

## 1. Konfigurera uppströmstemat en gång, tala sedan i token

Lagret är SCSS-mixins ovanpå `@fkui/theme-default`: uppströmstemat läses in med konfiguration exakt en gång (mönstret i `src/theme/_default.scss`), och profilens mixins skriver ut CSS-variabler efter det i kaskaden – de vinner alltså utan `!important`. Låt aldrig en andra Sass-laddning konfigurera `@fkui/theme-default` – en andra konfigurerad `@use`-laddning krockar och bryter kompileringen (README:s varning gäller varje varumärke).

## 2. Skriv varumärkets token i samma form

Token-källan delas i ett gemensamt index (typografi, linjebredder, radier, fokus) plus en variabelfil per färgläge (`light/_variables.scss`, `dark/_variables.scss`), exponerade som mixins som kan skrivas ut globalt, klass-scopade för byte i runtime eller sammansatta bakom `prefers-color-scheme`. Hela uttrycket ligger i de här filerna – det är den enda sanningskällan, medvetet handskriven (se steg 6).

## 3. Ladda typsnitten från den egna domänen

`@font-face`-deklarationer med `font-display: swap` och woff2-filer i paketet, licenstexter inkluderade. Ingen extern typsnittstjänst.

## 4. Byt ikonerna (valfritt)

FKUI:s `FIcon` renderar ur en spritesheet. Ett varumärke kan byta bilderna bakom oförändrade komponentnamn mot egna SVG-sprites, namn-paritetstestade mot `@fkui/icon-lib-default`. Ikoner är ett importsteg för konsumenten.

## 5. Skicka förbyggd css, bevakad av paritetstest

Kompilera profilerna till committade dist-poster (med en allt-i-ett-post om så önskas) och håll ett test som kompilerar om ur källorna och fäller varje avvikelse – plus gzippade bytebudgetar så att viktfördelen förblir en garanti. Formen finns i `scripts/build-css.ts` och `scripts/css.test.ts` i det här repot.

## 6. Håll DTCG-rundturen som designerkontrakt

Exportera det sammansatta temat som W3C DTCG-filer till designverktygen, och ta emot valfri W3C DTCG-fil tillbaka till anpassade egenskaper. Den handskrivna token-källan förblir den enda sanningskällan, ingen API-integration mot designverktyg byggs (se [styrningen](./governance.sv.md)). Det är designerspåret som bygger på standarder.

## 7. Bevisa det, lova det inte

- **Demoplayground** – varje komponent demonstrerad i båda färglägena, med navigation, djuplänkar och sök drivna ur en källfil.
- **Visuell port** – committade baselines för chromium (darwin lokalt, linux i utgivningen) plus en firefox/webkit-cross-uppsättning, omgenererade via ett dokumenterat arbetsflöde.
- **Tillgänglighetsport** – axe-skanningar av varje vy i båda färglägena med noll överträdelser som utgivningsvillkor, och en täckningstabell per komponent (mönstret i vyn Tillgänglighet).
- **Paritetskit för konsumenter** – receptet som en konsuments CI kan köra för att bevisa att en versionsbump är pixelidentisk ([visual parity kit](./visual-parity-kit.en.md)).

## 8. Håll det aktuellt och styrt

Lås FKUI-utvecklingsberoendena exakt och i takt, schemalägg ett arbetsflöde som varje vecka uppgraderar och kör portarna, och ge ut under ett skrivet kontrakt: semantisk versionering av tokenytan, ett angivet FKUI-peer-intervall, avvecklingsmönster och uppgraderingsnoteringar per utgivning ([styrningen](./governance.sv.md), [utgivningsdokumentationen](./release.sv.md)).

Driftkostnaden är poängen: hela den här ytan – tema, dokumentsajt, portar, det veckovisa aktualitetsarbetsflödet – är dimensionerad för två halvtidstjänster (se styrningspolicyns driftmodell). Replikera metoden per varumärke, och varje varumärke bär samma tunna kostnad.
