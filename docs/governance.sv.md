# Styrning och versionskontrakt

Det här dokumentet beskriver kontraktet mellan felix-ds och de som använder temat: vad versionsnumret lovar, vilket stöd FKUI-intervallet ger och hur ändringar kommuniceras. Själva utgivningsproceduren står i [utgivningsdokumentationen](./release.sv.md) och installationsstegen i [guiden för att bygga en webbapp](./create-a-site.sv.md).

## Semantisk versionering

felix-ds följer semantisk versionering för det som paketet exponerar: de publika token-namnen (CSS-variablerna), SCSS-mixinerna och mixinkonfigurationen, dist-filerna (`dist/felix.css`, `dist/felix-auto.css`, `dist/felix-complete.css`), ikonuppsättningens namn och paketets importvägar.

- **Major** bryter kontraktet: en publik token, mixin eller dist-fil tas bort eller byter namn, eller en befintlig importväg slutar fungera.
- **Minor** utökar kontraktet: nya token läggs till, nya mixinparametrar med standardvärden tillkommer, liksom nya dist-filer eller ikonnamn. En förändring av ett token-värde som ändrar det visuella uttrycket (till exempel en ny färgprofil eller en ny typsnittsfil) är en minor, eftersom konsumentens kod fortsätter fungera oförändrad.
- **Patch** rättar utan att ändra avsett uttryck: en felaktig token är en avvikelse från profilen och rättas som patch. En visuell skillnad efter en patch ska alltid gå att förklara som en felrättning.
- Paritetstesterna i repot (DTCG-token, ikoner och förbyggd css) är maskinkontrollen bakom kontraktet: de misslyckas om det committade innehållet inte matchar källorna.

## Stödda FKUI-versioner

Temat har ett enda peer-beroende: `@fkui/theme-default` i intervallet `>=6.57.0 <7.0.0`. Intervallet gäller temalagret, alltså Sass-tokenytan i `@fkui/theme-default` – de variabler som temats startfil läser in med sin konfiguration (`@use` i `src/theme/_default.scss`). Komponenternas interna delar omfattas inte: felix-ds läser ingenting inne i FKUI:s komponenter, så en ändring hos FKUI som inte rör tokenytan kan inte bryta temat.

Testade ändpunkter listas i varje utgivnings versionsfakta (mallen ligger i [utgivningsdokumentationen](./release.sv.md)) – de hör hemma i den daterade utgivningen, inte i README. Undre gränsen (6.57.0) bevisas veckovis i CI: arbetsflödets `floor`-jobb (kontrollen av intervallets äldsta minor) låser utvecklingsberoendena till den och kör bygge, typkontroll och tillgänglighetsporten, medan pixeljämförelserna bara körs mot den senaste låsta versionen eftersom `baselines` är renderade där. Övre gränsen hålls aktuell genom att playgroundens låsta utvecklingsversioner ligger på intervallets topp. Konsumenten låser sina egna FKUI-versioner exakt och väljer själv version inom intervallet.

## Avveckling (deprecation)

När en token, mixin eller fil ska tas bort:

1. Den markeras i koden (SCSS-kommentar) och i CHANGELOG i den minor där beskedet ges.
2. Den fungerar kvar minst en minor-version till, så att konsumenter hinner gå över.
3. Borttagningen sker i nästa major, enligt versionskontraktet ovan.

Motsvarande gäller ikonnamn: ett namn som lämnar uppsättningen aviseras på samma sätt, eftersom FIcons namnrymd är kontraktet mot FKUI:s ikon-API.

## Utgivningstakt och uppgraderingsnoteringar

Utgivningar sker när det finns något att ge ut: ackumulerade ändringar, en FKUI-uppgradering som verifierats enligt repetitionsmönstret i README, eller en buggfix. Det finns inget fast datumintervall – takten styrs av behovet, inte kalendern.

Varje utgivning beskriver i versionsfakta vad den som uppgraderar behöver veta (mallen ligger i [utgivningsdokumentationen](./release.sv.md)): vad som ändrats, vilka konsumentåtgärder som krävs (oftast inga), avvecklade token om några, och vilka FKUI-ändpunkter som testats. Konsumentens uppdatering ska vara en versionshöjning på en rad, och visuella förändringar ska alltid vara förklarade i förväg.

Varje utgivning passerar också axe-porten: automatiserade tillgänglighetsskanningar av varje playground-vy i båda färglägena, med noll överträdelser som villkor. Täckningen per komponent – vilken vy som demonstrerar komponenten och vad den automatiserade testningen omfattar – dokumenteras i [playgroundens vy Tillgänglighet](https://pattespatte.github.io/felix-ds/#/tillganglighet), och ett underlag som konsumenten kan lyfta in i sin egen tillgänglighetsredogörelse genereras till [docs/accessibility-basis.sv.md](./accessibility-basis.sv.md).

## Driftmodell

Systemet är dimensionerat för att drivas av två halvtidstjänster: en UX-designer på 50 % och en frontendutvecklare på 50 %. Designern äger token-värdena, den typografiska profilen och granskningen av tillgänglighetstäckningen. Utvecklaren äger temats källkod, playgroundens dokumentsajt, den visuella och tillgänglighetsbaserade utgivningsporten och det veckovisa arbetsflödet som bevakar FKUI-aktualiteten. Enkelheten är poängen: ett tunt paket är lite kod att granska och underhålla, och därför räcker bemanningen. I en organisations skala väger det tyngre än en bred pipeline. Projektet lovar inget stöd utöver vad den här bemanningen kan hålla. Se [Stöd](#stöd).

## Koden är sanningskällan

Den handskrivna temakällkoden (`src/theme/`) är den enda sanningen för det visuella uttrycket. Designerna möter koden via DTCG-rundturen: `bun run tokens:build` exporterar det sammansatta temat som W3C DTCG-filer (`tokens/light.json`, `tokens/dark.json`) som designverktyg kan läsa, och `bun run tokens:import` läser valfri W3C DTCG-fil (till exempel en export från ett designverktyg) tillbaka till anpassade egenskaper. Importen är den stödda bryggan mot designsidan. Ingen API-integration mot ett designverktyg byggs: API:et är Enterprise-låst och proprietärt, och de token det genererar täcker inte hela css:en, så en sådan pipeline skulle flytta det handskötta lagret i stället för att ta bort det. Automatiseringen stannar vid token-export i båda fallen. Rendering, interaktionstillstånd och sammansatta beslut granskas av människor.

## Stöd

Senaste minor-versionen stöds. Äldre versioner får inte fler patchar – uppgradera enligt versionsfakta. Felrapporter förväntas gälla senaste versionen, och ett fel som bara går att återskapa i en äldre version åtgärdas genom uppgradering.

## Ändringar av det här dokumentet

Det här dokumentet är en del av projektets kontrakt och ändras med samma öppenhet som koden: ändringar nämns i versionsfakta för den utgivning där de landar.
