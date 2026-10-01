# Utgivningsdokumentation (endast ägaren)

Det här dokumentet är det enda, uttryckliga undantaget från projektets förbud mot push (se repots AGENTS.md): **varje `git push` och varje publicering i felix-ds-projektet sker via det här dokumentet, utfört av ägaren.** Automatiska agentsessioner kör det aldrig. Inget här triggas av att filer committas – arbetsflödet drar igång först när en `v*`-tagg når GitHub.

Utgivningsflödet är: förbered lokalt → tagga → **pusha (ägarestyrt)** → GitHub Actions bygger, kör portarna och publicerar → granska GitHub-releasen.

## 1. Förutsättningar

Gå igenom listan innan du rör en tagg:

1. **Rent träd.** `git status` visar inga ändringar och `main` står på committen du vill ge ut.
2. **Det stödda FKUI-intervallet stämmer fortfarande.** Kontrollera peer-intervallet mot uppströms igen:

   ```bash
   npm view @fkui/theme-default version
   ```

   Är versionen `>= 7.0.0` är utgivningen blockerad tills temat verifierats mot den nya majorversionen (och playgroundens låsta utvecklingsversioner höjts och baselines uppdaterats), eller tills peer-intervallet i `package.json` medvetet har snävats av. Läs också snabbt igenom changlogen för varje `@fkui/*`-utgivning inom det stödda intervallet sedan förra felix-ds-utgivningen, och håll utkik efter ändringar i tokensytan.
3. **Porten grön lokalt.** `bun install`, `bun run build`, `bunx vue-tsc --noEmit` och framför allt `bun run test:visual` (36 visuella baselines + 24 axe-skanningar) passerar på din maskin.
4. **Aktuella baselines.** Har playgrounden ändrats sedan förra utgivningen: generera om baselinesna och granska dem först:

   ```bash
   bun run test:visual:update
   git diff e2e/visual.spec.ts-snapshots   # granska png-diffarna noga
   ```

   En baseline-uppdatering är ett granskat beslut, aldrig en knapp för att ”få porten grön”: varje pixeländring ska gå att förklara.
5. **Linux-baselines för CI.** Utgivningsarbetsflödet kör `bun run test:visual` på ubuntu-latest, vilket kräver baselines med suffixet `-linux`. Generera om dem när darwin-baselinesna har ändrats, via repots arbetsflöde **Generate linux visual baselines** (ingen docker behövs lokalt):

   1. GitHub → Actions → *Generate linux visual baselines* → **Run workflow** på `main` (cirka 4 minuter; den kör `--update-snapshots` på en ubuntu-runner och laddar upp snapshot-mappen som artefakten `linux-baselines`). Den går också att starta från terminalen:

      ```bash
      gh workflow run generate-linux-baselines.yml --repo pattespatte/felix-ds --ref main
      gh run watch --repo pattespatte/felix-ds   # valfritt, live-vy
      ```

   2. Ladda ner artefakten och kopiera **endast** filerna `*-linux.png` till `e2e/visual.spec.ts-snapshots/` (den innehåller även darwin-uppsättningen – strunta i den):

      ```bash
      gh run download --repo pattespatte/felix-ds -n linux-baselines -D /tmp/linux-baselines
      cp /tmp/linux-baselines/*-linux.png e2e/visual.spec.ts-snapshots/
      ls e2e/visual.spec.ts-snapshots/*-linux.png | wc -l   # väntat tal: 36
      ```

   3. Kör `bun run test:visual` lokalt (bekräftar att darwin-uppsättningen fortfarande godkänns) och committa linux-png:erna tillsammans med darwin-png:erna. Playwright väljer det suffix som matchar runner-plattformen när testerna körs.

   Saknas linux-uppsättningen fallerar utgivningsporten med felet ”snapshot doesn't exist … `-chromium-linux.png`” – det är porten som gör sitt jobb; gå inte förbi den.

## 2. Ge ut versionen

```bash
# 1. Höj `version` i package.json till X.Y.Z och generera om changeloggen
#    utifrån konventionella commits; committa båda två
#    (uteblir versionshöjningen misslyckas npm publish med
#    "409 Conflict - Cannot publish over existing version")
echo '"version": "X.Y.Z"' # påminnelse – redigera package.json, sedan:
bun run changelog
git add package.json CHANGELOG.md
git commit -m "chore(release): prepare vX.Y.Z"

# 2. Annoterad tagg (semver; kontraktet börjar på 1.0.0)
git tag -a vX.Y.Z -m "felix-ds vX.Y.Z"
```

3. **ÄGARSTYRT – projektets enda push:**

   ```bash
   git push origin main --follow-tags
   ```

4. Följ Actions-körningen för arbetsflödet **Release to GitHub Packages** (`.github/workflows/release.yml`). Den checkar ut repot, installerar med låst lockfile, bygger, typkontrollerar, kör den visuella porten mot linux-baselines, publicerar `@pattespatte/felix-ds` på npm.pkg.github.com och skapar GitHub-releasen med genererade versionsfakta.
5. Granska versionsfakta i GitHub-releasen och redigera dem för läsbarhet om det behövs (de genereras från commits – CHANGELOG.md är den källa som underhålls för hand).

## 3. Efter utgivningen

- Kontrollera att paketet går att installera, precis som en konsument skulle göra (`.npmrc`-raderna står i avsnitt 5):

  ```bash
  npm view @pattespatte/felix-ds@latest version --registry=https://npm.pkg.github.com
  ```

- `deploy-playground.yml` triggas också av pushen (den körs vid varje push till `main`). Det är väntat och harmlöst – playgrounden deployas bara.

## 4. Om något går fel

En publicerad version är oföränderlig. Radera aldrig samma version och publicera aldrig om den; åtgärda felet i nästa version:

```bash
npm deprecate @pattespatte/felix-ds@X.Y.Z "Trasig <på sätt>; använd X.Y.Z+1" --registry=https://npm.pkg.github.com
```

Åtgärda sedan felet, ge ut nästa version enligt det här dokumentet och ta bort föråldradmarkeringen bara om den gamla versionen visar sig fungera.

## 5. Vad konsumenten behöver

Paketet publiceras på GitHub Packages under kontot `pattespatte` med begränsad synlighet. Varje konsument behöver:

1. En personlig åtkomsttoken (classic) med `read:packages` – skapas på github.com/settings/tokens av en användare med åtkomst till repot.
2. En `.npmrc` i projektroten:

   ```ini
   @pattespatte:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
   ```

   Tokenen ligger i en miljövariabel, aldrig i filen. I CI matas den in via en runner-secret i miljön.

3. Installera:

   ```bash
   bun add @pattespatte/felix-ds
   ```

Konsumenterna låser själva sina `@fkui/*`-versioner; felix-ds deklarerar `@fkui/theme-default` (stött intervall `>=6.57.0 <7.0.0`) som enda peer-beroende och laddar modulen själv – konsumentens egen Sass ska aldrig läsa in paketet via konfigurerad `@use`, eftersom de två konfigurerade laddningarna då krockar. Se avsnittet Kompatibilitet i README.
