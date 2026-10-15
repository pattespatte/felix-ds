import { defineConfig } from "@playwright/test";

/**
 * E2E config for the playground matrix. `bun run test:visual` runs both
 * e2e/visual.spec.ts (36 screenshot comparisons against the committed
 * baselines in e2e/visual.spec.ts-snapshots/, one darwin set plus one linux
 * set for the release runner) and e2e/a11y.spec.ts (24 axe scans) – together
 * they are the release gate. Regenerate the darwin baselines with
 * `bun run test:visual:update` after reviewing the change; linux baselines
 * come from the generate-linux-baselines workflow (docs/release.en.md).
 */
export default defineConfig({
    testDir: "e2e",
    timeout: 60_000,
    projects: [
        {
            name: "chromium",
            use: { browserName: "chromium" },
        },
    ],
    webServer: {
        command: "bun run dev -- --port 5273 --strictPort",
        url: "http://localhost:5273",
        reuseExistingServer: true,
    },
    use: {
        baseURL: "http://localhost:5273",
        viewport: { width: 1280, height: 800 },
        colorScheme: "light",
        reducedMotion: "reduce",
    },
});
