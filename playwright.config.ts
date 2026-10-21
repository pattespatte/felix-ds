import { defineConfig } from "@playwright/test";

/**
 * E2E config for the playground matrix. `bun run test:visual` runs both
 * e2e/visual.spec.ts (screenshot comparisons of every view against the
 * committed baselines in e2e/visual.spec.ts-snapshots/, one darwin set plus
 * one linux set for the release runner) and e2e/a11y.spec.ts (axe scans of
 * every view in both felix color modes, plus the search dropdown's open
 * state) – together they are the release gate. `bun run test:visual:cross`
 * is the cross-browser half: e2e/visual-cross.spec.ts on firefox and webkit
 * (every playground view, linux-only baselines). The
 * firefox/webkit projects carry a testMatch so only the cross spec can ever
 * run there, which keeps the default chromium matrix and the a11y scans
 * untouched. Regenerate the darwin baselines with `bun run
 * test:visual:update` after reviewing the change; linux baselines come from
 * the generate-linux-baselines workflow (docs/release.en.md).
 */
export default defineConfig({
    testDir: "e2e",
    timeout: 60_000,
    projects: [
        {
            name: "chromium",
            use: { browserName: "chromium" },
        },
        {
            name: "firefox",
            testMatch: "**/visual-cross.spec.ts",
            use: { browserName: "firefox" },
        },
        {
            name: "webkit",
            testMatch: "**/visual-cross.spec.ts",
            use: { browserName: "webkit" },
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
