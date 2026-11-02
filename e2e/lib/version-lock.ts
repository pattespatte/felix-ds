import type { Page } from "@playwright/test";

// The Kom igång view renders the playground's live FKUI pins
// (`@fkui/vue@6.63.0 …`) in its install snippet, so every real FKUI bump
// changes the view's pixels and would invalidate its baselines (darwin,
// linux and the cross-browser set) for a change that is six version strings
// and nothing else. Rewrite the pins to the project's X.Y.Z placeholder
// before the screenshot – the same determinism treatment as the footer
// badge in badge.ts. No-op on every other view (.setup-code is Kom igång's
// own code-block class).
export async function stubFkuiVersionLock(page: Page): Promise<void> {
    await page.evaluate(() => {
        for (const code of document.querySelectorAll(".setup-code code")) {
            const text = code.textContent;
            if (text !== null) {
                code.textContent = text.replace(
                    /(@fkui\/[\w-]+)@\d+\.\d+\.\d+/g,
                    "$1@X.Y.Z",
                );
            }
        }
    });
}
