# Underhåll och arbetsflöden

Den här guiden är för den som underhåller repot (ägaren). Den besvarar tre frågor om repots fem GitHub Actions-arbetsflöden: vad som körs av sig självt, när du behöver göra något och hur en vanlig vecka ser ut. De flesta veckor räcker det med en `git pull`.

## De fem arbetsflödena i korthet

| Arbetsflöde | Startar | Vad det gör | Du agerar |
| --- | --- | --- | --- |
| `Deploy playground to GitHub Pages` (`deploy-playground.yml`) | varje push till `main` | bygger och publicerar playgrounden på GitHub Pages | aldrig |
| `FKUI currency check` (`fkui-currency.yml`) | måndagar 08.00 svensk tid (vintertid), eller för hand | höjer de sex `@fkui/*`-versionerna till den senaste versionen, kör hela porten och öppnar en pull request vid höjning | när en pull request eller en röd körning dyker upp |
| `Friday baseline currency` (`friday-baseline-currency.yml`) | fredagar 13.00 svensk tid (vintertid), eller för hand | genererar om `linux-baselines` när det visuella ändrats, kör hela porten och pushar till `main` själv | `git pull` när den har pushat |
| `Generate linux visual baselines` (`generate-linux-baselines.yml`) | bara för hand | renderar nya `linux-baselines` och laddar upp dem som en artefakt | inför en utgivning, när pixeländringar väntar på fredagen |
| `Release to GitHub Packages` (`release.yml`) | push av en `v*`-tagg | bygger, kör portarna, publicerar paketet och skapar GitHub-releasen | enligt [utgivningsdokumentationen](release.sv.md) |

Cron-tiderna står i UTC, så de svenska klockslagen flyttas en timme vid sommar- och vintertidsomläggningen.

## En vanlig vecka

Inget behöver förberedas. Båda schemalagda körningarna startar av sig själva.

### Fredagen: `linux-baselines` hålls aktuella

Körningen börjar med en ren git-kontroll: har inget som styr det visuella (playgroundens vyer, temakällor, tokens, testkonfiguration, låsfil) ändrats sedan `linux-baselines` senast genererades om, avslutar den grönt utan att köra ett enda test. I annat fall genererar den om `linux-baselines`, komprimerar om png-filerna förlustfritt, kör hela porten (paritetstester, bygge, typkontroll, visuella jämförelser i tre webbläsare, axe-skanningar) och pushar resultatet till `main` som committen ”test(visual): regenerate linux baselines (friday currency)”. Efteråt gör du en enda sak: `git pull`.

### Måndagen: FKUI-kontrollen

Har FKUI inte gett ut någon ny version avslutar körningen grönt utan att öppna något. Finns en ny version höjer den de sex `@fkui/*`-versionerna, kör hela porten på höjningen och öppnar en pull request (”chore(deps): bump @fkui/* …”). Granska och merga den, och ge ut nästa version enligt [utgivningsdokumentationen](release.sv.md). Texten i pull requesten listar också de `@fkui/vue`-komponenter som höjningen lägger till eller tar bort. En andra del av körningen låser peer-intervallets undre gräns (6.57.0) och kör portarna som inte är visuella. Ett rött resultat där är en signal att titta närmare på, och den delen öppnar aldrig någon pull request. Körningen gör också en beroendeaudit som bara rapporterar.

## När du behöver göra något själv

Baselines finns i två uppsättningar, en per plattform: filnamnen slutar på `-darwin` eller `-linux`, och Playwright väljer själv rätt uppsättning när testerna körs. På mac jämförs `darwin-baselines` och på Ubuntu `linux-baselines`. Oavsett plattform renderas `linux-baselines` alltid av arbetsflödena, på den låsta runner-bilden som porten jämför mot.

### Du har ändrat pixlar i en vy

Har du ändrat en vy och pushat är det `linux-baselines` som saknas. (På mac genererar du först om `darwin-baselines` lokalt.) Fredagens körning plockar upp linux-uppsättningen automatiskt. Ska du ge ut en version innan fredagen, generera `linux-baselines` för hand (nästa avsnitt). Utgivningsporten och måndagskörningen jämför mot `linux-baselines` och blir röda när de är gamla eller saknas.

### Du behöver `linux-baselines` nu

Typiskt fall: en utgivning står för dörren och pixeländringar pushades efter senaste fredagen. Starta arbetsflödet och följ det. Körningen tar cirka 10 minuter och publicerar ingenting:

```bash
gh workflow run generate-linux-baselines.yml --repo pattespatte/felix-ds --ref main
gh run watch --repo pattespatte/felix-ds   # valfritt, live-vy
```

Körningen laddar upp artefakten `linux-baselines` (sparas i 7 dagar). Artefakten innehåller även darwin-uppsättningen – strunta i den. Hämta den och kopiera endast filerna `*-linux.png`:

```bash
gh run download --repo pattespatte/felix-ds -n linux-baselines -D /tmp/linux-baselines
cp /tmp/linux-baselines/visual.spec.ts-snapshots/*-linux.png e2e/visual.spec.ts-snapshots/
cp /tmp/linux-baselines/visual-cross.spec.ts-snapshots/*-linux.png e2e/visual-cross.spec.ts-snapshots/
ls e2e/visual.spec.ts-snapshots/*-linux.png | wc -l        # väntat tal: 45 (15 vyer × 3 konfigurationer)
ls e2e/visual-cross.spec.ts-snapshots/*-linux.png | wc -l  # väntat tal: 60 (alla 15 vyer × 2 lägen × 2 webbläsare)
```

Komprimera sedan om varje ny png förlustfritt (`oxipng -o max`), kontrollera varje fil med `compare -metric AE original.png rekomprimerad.png null:` (ska skriva ut `0 (0)`), kör `bun run test:visual` lokalt och committa linux-png:erna tillsammans med darwin-uppsättningen. Samma procedur står steg för steg i [utgivningsdokumentationen](release.sv.md), avsnitt 1 steg 5.

### Köra ett schemalagt arbetsflöde vid annan tidpunkt

Båda schemalagda arbetsflödena går också att starta för hand, antingen via GitHub (Actions → arbetsflödet → **Run workflow**) eller från terminalen:

```bash
gh workflow run friday-baseline-currency.yml --repo pattespatte/felix-ds --ref main
gh workflow run fkui-currency.yml --repo pattespatte/felix-ds --ref main
```

Fredagskörningen är ofarlig att trigga när som helst: är `linux-baselines` redan aktuella avslutar den grönt utan att göra något.

### Måndagskörningen är röd

Vanligaste orsaken är en gammal linux-uppsättning, och felet ”snapshot doesn't exist” betyder att den saknas helt. Trigga fredagsarbetsflödet för hand – det genererar om, kör porten och pushar, varefter en ny måndagskörning blir grön. Vid andra fel finns testrapporten som artefakt (`currency-gate-failure`, 14 dagar) att hämta.

## Fallgropar

- **”Re-run failed jobs” återanvänder den gamla committen.** En schemalagd körning som hunnit starta innan nya baselines pushats måste köras om mot nya `main`. Starta en ny körning (Run workflow eller `gh workflow run`) i stället för att köra om den gamla.
- **Bot-commits landar på `main`.** Fredagskörningen committar sina baselines direkt. Kör `git pull` innan du fortsätter arbeta lokalt.
- **Scheman kräver filen på standardgrenen**, och GitHub stänger av dem efter 60 dagar utan repoaktivitet. Efter ett längre uppehåll: kontrollera att båda veckokörningarna verkligen kördes.
- **Tiderna i cron-raderna är UTC.** Klockslagen i den här guiden är vintertid och flyttas en timme på sommaren.
- **Artefakter gallras.** `linux-baselines` sparas i 7 dagar, felparaten i 14 dagar.
