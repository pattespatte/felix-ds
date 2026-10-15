# Paritetskit – bevisa att en bump är pixelidentisk

Ett litet recept för konsumenter som vill bevisa att en uppdatering av felix-temat (eller av FKUI-paketen) inte ändrar en enda pixel: fånga fullsidiga skärmbilder av din app före och efter bumpen, jämför dem pixel för pixel och lås skillnaden till noll. Receptet är ett fristående skript – det skickas inte med i paketet och kräver inget utöver `@playwright/test` och ImageMagick.

Tanken: felix-ds:s strukturella löfte är att en tema- eller FKUI-uppgradering är en visuell nolla om versionsfakta inte säger något annat. Det här kiten gör löftet kontrollerbart i din egen CI.

## 1. Fånga skärmbilder

Spara som `capture-parity.mjs` i projektroten. Ändra `routes` till appens rutter och `MODE_STORAGE_KEY` till din appas localStorage-nyckel för färgläge (i referensappen är det `felix-consumer-color-mode`):

```js
import { chromium } from "@playwright/test";

// Adjust to your app: display name + hash route per page.
const routes = [
    { name: "start", path: "/" },
    { name: "formular", path: "/formular" },
    { name: "tabell", path: "/tabell" },
    { name: "modal", path: "/modal" },
];
const MODE_STORAGE_KEY = "felix-consumer-color-mode";

const outDir = process.argv[2];
if (!outDir) {
    console.error("usage: node capture-parity.mjs <output-dir>");
    process.exit(1);
}
const baseURL = process.env.PARITY_BASE_URL ?? "http://localhost:5275";

const browser = await chromium.launch();
try {
    for (const route of routes) {
        for (const mode of ["light", "dark"]) {
            const page = await browser.newPage({
                viewport: { width: 1280, height: 800 },
                colorScheme: "light",
            });
            await page.addInitScript(
                ([key, value]) => localStorage.setItem(key, value),
                [MODE_STORAGE_KEY, mode],
            );
            await page.goto(`${baseURL}/#${route.path}`);
            await page.waitForLoadState("networkidle");
            await page.screenshot({
                path: `${outDir}/${route.name}-${mode}.png`,
                fullPage: true,
            });
            await page.close();
        }
    }
} finally {
    await browser.close();
}
console.log(`captured ${routes.length * 2} pages -> ${outDir}`);
```

Appen behöver bara serva sin byggda dist eller dev-servern på `PARITY_BASE_URL` medan skriptet körs.

## 2. Jämför med noll-tolerans

Spara som `compare-parity.sh` och kör mellan två fångstkataloger. ImageMagicks `compare -metric AE` räknar avvikande pixlar, noll är det enda godkända värdet (utskriften för noll är bokstavligen `0 (0)`):

```bash
#!/usr/bin/env bash
set -u
before_dir=$1
after_dir=$2
fail=0
for before in "$before_dir"/*.png; do
    name=$(basename "$before")
    ae=$(compare -metric AE "$before" "$after_dir/$name" null: 2>&1 || true)
    if [[ "$ae" == "0 (0)"* ]]; then
        echo "OK   $name"
    else
        echo "DIFF $name (AE=$ae)"
        fail=1
    fi
done
exit $fail
```

I `package.json`:

```json
"scripts": {
    "parity:capture": "node capture-parity.mjs",
    "parity:compare": "./compare-parity.sh"
}
```

## 3. Kör cykeln vid en bump

```bash
bun run dev -- --port 5275 &
bun run parity:capture before
# bumpa @pattespatte/felix-ds och/eller @fkui/*, kör bun install
bun run parity:capture after
bun run parity:compare before after
```

Exit-kod 0 betyder pixelidentiskt – bumpen kan ges ut med rent samvete. Exit-kod 1 betyder synliga skillnader: läs versionsfakta förutgående utgivning och förklara varje diff därifrån, eller stoppa bumpen.

## 4. I CI (GitHub Actions)

Samma cykel som ett eget jobb, som failar på AE > 0:

```yaml
jobs:
  visual-parity:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bunx playwright install --with-deps chromium
      - run: bun run build
      - run: bun run preview -- --port 5275 &
        shell: bash
      - run: node capture-parity.mjs before
      - name: Bump felix-ds to the candidate version
        run: bun add @pattespatte/felix-ds@^X.Y.Z && bun install
      - run: bun run build
      - run: node capture-parity.mjs after
      - run: ./compare-parity.sh before after
```

Ersätt `X.Y.Z` med kandidatversionen. Jobbet förutsätter att appens routes inte ändrats mellan fångsterna – diffen ska visa temats inverkan, inte appens.

## När kiten ska köras

- Före och efter varje bump av `@pattespatte/felix-ds`.
- Före och efter varje bump av `@fkui/*` (moderbiblioteket flyttar sig också).
- Vid större egna css-ändringar som ska vara osynliga.

Receptet fångar i ljust och mörkt läge via appens localStorage-nyckel. Har appen ingen sådan nyckel, ta bort mode-loopen och lita på `prefers-color-scheme` i stället.
