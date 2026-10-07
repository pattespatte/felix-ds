import { defineConfig } from "@playwright/test";

/**
 * E2E config for the playground matrix. e2e/a11y.spec.ts is the release
 * gate (24 axe scans, no artifacts); e2e/visual.spec.ts is local-only
 * visual regression tooling whose snapshots in
 * e2e/visual.spec.ts-snapshots/ stay untracked (see .gitignore) and are
 * regenerated with `bun run test:visual:update`.
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
