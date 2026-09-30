import { defineConfig } from "@playwright/test";

/**
 * Release-gate config: visual regression + axe over the playground matrix.
 *
 * Snapshot naming uses Playwright's per-platform defaults (e.g. -darwin-arm64
 * locally, -linux in the release workflow); only one platform's baselines are
 * committed at a time – see docs/release.en.md for the linux regeneration step.
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
