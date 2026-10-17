import type { Page } from "@playwright/test";

// The footer's version badge is a live shields.io image: its pixels change
// with every release and the gate would depend on an external service.
// Fulfil the request with a text-free SVG of the same 96x20 geometry instead
// – deterministic on every platform (no font rendering), so the committed
// baselines stay valid across version bumps.
const BADGE_STUB = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="20">',
    '<g shape-rendering="crispEdges">',
    '<rect width="51" height="20" fill="#555"/>',
    '<rect x="51" width="45" height="20" fill="#007ec6"/>',
    "</g></svg>",
].join("");

export async function stubVersionBadge(page: Page): Promise<void> {
    await page.route("https://img.shields.io/**", (route) =>
        route.fulfill({ contentType: "image/svg+xml", body: BADGE_STUB }),
    );
}
