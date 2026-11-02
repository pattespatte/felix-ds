import type { Page } from "@playwright/test";

// The Kom igång view renders the playground's live FKUI pins
// (`@fkui/vue@6.63.0 …`) in its install snippet, and the footer's bottom
// band carries the same pin as plain text ("Bygger på FKUI 6.63.0"), so
// every real FKUI bump changes their pixels and would invalidate baselines
// (darwin, linux and the cross-browser set) for a change that is only
// version strings. Rewrite both to the project's X.Y.Z placeholder before
// the screenshot – the same determinism treatment as the footer badge in
// badge.ts. The .setup-code selector is Kom igång's own code-block class and
// no-ops on every other view; page-footer__fkui-version is the footer band's
// version span.
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
        for (const span of document.querySelectorAll(
            ".page-footer__fkui-version",
        )) {
            const text = span.textContent;
            if (text !== null) {
                span.textContent = text.replace(/\d+\.\d+\.\d+/g, "X.Y.Z");
            }
        }
    });
}
