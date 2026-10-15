# The visual parity kit – prove that a bump is pixel-identical

A small recipe for consumers who want to prove that an update of the felix theme (or of the FKUI packages) does not change a single pixel: capture full-page screenshots of your app before and after the bump, compare them pixel for pixel and pin the difference to zero. The recipe is a standalone script – it ships neither in the package nor with anything beyond `@playwright/test` and ImageMagick as requirements.

The idea: felix-ds's structural promise is that a theme or FKUI upgrade is a visual no-op unless the release notes say otherwise. This kit makes that promise checkable in your own CI.

## 1. Capture screenshots

Save as `capture-parity.mjs` in the project root. Change `routes` to your app's routes and `MODE_STORAGE_KEY` to your app's localStorage key for the color mode (in the reference app it is `felix-consumer-color-mode`):

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

The app only needs to serve its built dist or its dev server on `PARITY_BASE_URL` while the script runs.

## 2. Compare with zero tolerance

Save as `compare-parity.sh` and run it between two capture directories. ImageMagick's `compare -metric AE` counts differing pixels; zero is the only accepted value (the printed form of zero is literally `0 (0)`):

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

In `package.json`:

```json
"scripts": {
    "parity:capture": "node capture-parity.mjs",
    "parity:compare": "./compare-parity.sh"
}
```

## 3. Run the cycle on a bump

```bash
bun run dev -- --port 5275 &
bun run parity:capture before
# bump @pattespatte/felix-ds and/or @fkui/*, run bun install
bun run parity:capture after
bun run parity:compare before after
```

Exit code 0 means pixel-identical – the bump can ship with a clear conscience. Exit code 1 means visible differences: read the release notes of the outgoing release and explain every diff from there, or stop the bump.

## 4. In CI (GitHub Actions)

The same cycle as a dedicated job, failing on AE > 0:

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

Replace `X.Y.Z` with the candidate version. The job assumes the app's routes are unchanged between the captures – the diff should show the theme's impact, not the app's.

## When to run the kit

- Before and after every bump of `@pattespatte/felix-ds`.
- Before and after every bump of `@fkui/*` (the mother library moves too).
- Around larger own CSS changes that are meant to be invisible.

The recipe captures in light and dark mode via the app's localStorage key. If your app has no such key, remove the mode loop and rely on `prefers-color-scheme` instead.
