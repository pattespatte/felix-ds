# Uppgradera FKUI-beroendena – steg för steg

När FKUI ger ut en ny version höjer det här repot alla sex `@fkui/*`-paket i takt till samma version och bevisar med hela porten att temat håller. Den här guiden visar de två vägarna: låt veckoronden öppna en pull request (normalfallet) eller gör repetitionen lokalt. Vad arbetsflödena gör av sig självt beskrivs i [underhållsguiden](maintenance.sv.md) – det här är kommandona.

## Vem guiden är till för

Guiden gäller felix-ds-repot självt – temalagret och playgrounden – och den som underhåller det. Använd den när FKUI har gett ut en ny version och repots låsta versioner ligger efter. Hur det märks står i nästa avsnitt.

- **Playgrounden: samma procedur.** Playgrounden är en mapp i repot och följer med automatiskt när de sex `@fkui/*`-versionerna höjs – det finns ingen separat uppgradering att göra.
- **Demosajten och konsumentappen: guiden gäller inte.** De låser sina egna FKUI-versioner och uppgraderar sitt felix-ds-beroende själva när en ny paketversion ges ut.
- **Appar som inte bygger på FKUI: ingen relevans.** Guiden handlar enbart om förhållandet mellan felix-ds och FKUI:s sex npm-paket.

## Märk att en ny version finns

Tre sätt, i den ordning de brukar dyka upp:

1. Måndagsronden (`fkui-currency`) hittar den – grönt resultat med en pull request, eller rött när porten faller.
2. Sidfoten i playgrounden jämför den låsta versionen mot npm och skriver ”Senaste utgåvan är X” när versionen ligger efter.
3. `bun fkui version` lokalt visar specifierad, installerad och senaste version per paket.

Schemalagda körningar kan utebli. Syns ingen måndagskörning alls, starta den för hand enligt väg A nedan.

## Väg A: låt veckoronden göra uppgraderingen

```bash
gh workflow run fkui-currency.yml --repo pattespatte/felix-ds --ref main
gh run watch --repo pattespatte/felix-ds
```

Körningen höjer de sex `@fkui/*`-versionerna, bygger om de förbyggda css-filerna, kör hela porten på ubuntu och öppnar en grön pull request med `package.json`, `bun.lockb` och `dist/`. Pull request-texten listar `@fkui/vue`-komponenter som tillkommit eller tagits bort. Granska och merga den – sedan återstår punkterna under ”Efteråt”.

Blir körningen röd på de visuella stegen har FKUI ändrat pixlar, och baslinjerna måste genereras om – något arbetsflödet inte gör. Gör i stället uppgraderingen lokalt enligt väg B och följ avsnittet ”När pixlar ändras”. Vid andra fel finns testrapporten som artefakt (`currency-gate-failure`, 14 dagar).

## Väg B: gör uppgraderingen lokalt

Alla kommandon körs från repo-roten.

```bash
git pull --ff-only                  # fredagsronden kan ha pushat baslinjer
bun fkui upgrade -n                 # torrkörning: planen och länken till release notes
bun fkui upgrade                    # sex exakta versioner i package.json + bun install
bun run build:theme                 # dist måste vara färskt före paritetstesterna
bun run tokens:build                # behövs när uppströms tokens ändrats – testerna säger till
bun test                            # 67 tester, bland annat css-paritet mot dist
bun run build && bunx vue-tsc --noEmit
lsof -nP -iTCP:5273 -sTCP:LISTEN    # glömd dev-server? i så fall: döda den först
bun run test:visual                 # ~50 s: 45 skärmdumpsjämförelser, a11y-speccen ingår
```

Gå sedan en visuell runda i playgrounden (`bun run dev`) och committa:

```bash
git add package.json bun.lockb dist/ tokens/   # tokens/ endast när filerna ändrats
git commit -m "chore(deps): bump @fkui/* 6.63.0 -> 6.64.0"
```

Versionsnumren i exemplet är från repetitionen 2026-11-03 – byt ut dem mot aktuella versioner. Vad den senaste repetitionen visade står i README-avsnittet ”Uppgradera FKUI-beroendena”.

## När pixlar ändras

De visuella stegen pekar ut vilka vyer som skiljer. Generera om darwin-uppsättningen för just de vyerna:

```bash
bunx playwright test visual.spec.ts -g "<vy-slug>" --update-snapshots
```

Komprimera om de nya png-filerna förlustfritt (`oxipng -o max`) och kontrollera varje fil med `compare -metric AE` – resultatet ska vara `0 (0)`. Linux-speglarna hämtas ur artefakten från `generate-linux-baselines` (endast filerna `*-linux.png`), eller vänta in fredagsronden som pushar dem själv. Proceduren står steg för steg i [underhållsguiden](maintenance.sv.md), avsnittet ”Du behöver `linux-baselines` nu”, och i [utgivningsdokumentationen](release.sv.md).

## Efteråt

1. Skriv om README-noteringen ”Senaste uppgraderingsrepetitionen” (svenska och engelska) med vad rundan faktiskt visade – visuell nolla eller vilka pixlar som ändrades.
2. Pusha. Deploy av playgrounden triggas av `package.json`-ändringen. Verifiera sidfoten efteråt: ”Bygger på FKUI X.Y.Z” med tillägget ”som är den senaste utgåvan”.
3. Starta `fkui-currency` för hand som slutkontroll – den ska avsluta grönt utan pull request (”already current”).
4. Bestäm om de förbyggda css-filerna ska ges ut som en ny paketversion – filerna följer utgivningarna, inte pusharna. Proceduren står i [utgivningsdokumentationen](release.sv.md).
5. Demosajten och konsumentappen låser sina egna FKUI-versioner och uppgraderar sitt felix-ds-beroende själva.

## Fallgropar

- **En glömd dev-server ger falskt grönt.** En Vite-server som startades före versionsbytet serverar gamla `node_modules`. Kontrollera port 5273 före den visuella körningen.
- **`bun test` kräver färsk dist.** Paritetstesterna jämför mot `dist/` – kör `build:theme` först, annars faller css-testerna.
- **Tokenfilerna kan bli föråldrade.** När uppströms ändrar token-uppsättningen (6.64.0 lade till footer-tokens) krävs `tokens:build` och en commit av `tokens/`.
- **Testbevis raderas.** Playwright tömmer `test-results/` i början av varje körning – kopiera bevisen från en röd körning före nästa.
- **Levande datum ogiltigförklarar baslinjer.** Demor som följer aktuellt datum (kalendern) blir fel vid varje månadsskifte – demorna visar fasta datum.
- **`-g` matchar hela titelkedjan.** Använd en delsträng av vynamnet, aldrig `^`-ankare.
- **Schemalagda körningar kan utebli.** GitHub garanterar inte leverans – starta körningen för hand om den saknas.
- **Uppströms kan ligga ojämnt.** Paketen publiceras ibland inte samtidigt (vid 6.64.0 låg `@fkui/design` ett korrigeringssteg före). Låsningen följer `@fkui/vue` – mellanstegen plockas upp nästa gång alla sex paket rör sig.
