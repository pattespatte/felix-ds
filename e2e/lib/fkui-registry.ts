import { readFileSync } from "node:fs";
import type { Page } from "@playwright/test";

// The footer probes registry.npmjs.org for the latest @fkui/vue release and
// renders a sync suffix from the answer. Fulfil the probe with the
// playground's own dev pin (read from package.json, so the stub tracks the
// pin through every FKUI bump) and the footer always renders its in-sync
// state – deterministic pixels, the same treatment as the shields.io badge
// in badge.ts.
export async function stubFkuiRegistry(page: Page): Promise<void> {
    const pkg = JSON.parse(
        readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
    ) as { devDependencies: Record<string, string> };
    const fkuiVersion = pkg.devDependencies["@fkui/vue"];
    await page.route("https://registry.npmjs.org/@fkui/vue/latest", (route) =>
        route.fulfill({
            contentType: "application/json",
            body: JSON.stringify({ version: fkuiVersion }),
        }),
    );
}
