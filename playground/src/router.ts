// Hand-rolled hash router: "#/view" and "#/view/anchor". No router package –
// GitHub Pages deploys work without any server-side rewrite.
import { nextTick, ref } from "vue";
import { findView, views } from "./navigation";

export interface Route {
    slug: string;
    anchor: string;
}

const DEFAULT_ROUTE: Route = { slug: views[0].slug, anchor: "" };

/** Parses "#/slug" or "#/slug/anchor"; null when the hash is not a route. */
function parseHash(hash: string): Route | null {
    const match = /^#\/([a-z0-9-]+)(?:\/([a-z0-9-]+))?$/.exec(hash);
    if (!match) {
        return null;
    }
    return { slug: match[1], anchor: match[2] ?? "" };
}

/** Unknown slugs and anchors fall back to the default view – dead links never ship. */
function normalize(route: Route | null): Route {
    if (route) {
        const view = findView(route.slug);
        if (view && (!route.anchor || view.anchors.some((a) => a.id === route.anchor))) {
            return route;
        }
    }
    return DEFAULT_ROUTE;
}

function resolve(): Route {
    return normalize(parseHash(window.location.hash));
}

export const currentRoute = ref<Route>(resolve());

function scrollToTop(): void {
    window.scrollTo({ top: 0 });
}

function scrollToAnchor(anchor: string): void {
    if (!anchor) {
        return;
    }
    // The view must be mounted before its anchor element can be scrolled to.
    void nextTick(() => {
        document.getElementById(anchor)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    });
}

function applyRoute(previous: Route, next: Route): void {
    if (previous.slug !== next.slug) {
        scrollToTop();
        scrollToAnchor(next.anchor);
    } else if (previous.anchor !== next.anchor) {
        scrollToAnchor(next.anchor);
    }
}

export function navigate(slug: string, anchor = ""): void {
    const target = normalize({ slug, anchor });
    const hash = target.anchor ? `#/${target.slug}/${target.anchor}` : `#/${target.slug}`;
    if (window.location.hash === hash) {
        // Identical hashes fire no hashchange – apply the route directly.
        applyRoute(currentRoute.value, target);
        return;
    }
    window.location.hash = hash;
}

window.addEventListener("hashchange", () => {
    const previous = currentRoute.value;
    const next = resolve();
    if (previous.slug === next.slug && previous.anchor === next.anchor) {
        return;
    }
    // Keep the address bar in sync when a bad hash was normalised away.
    const normalizedHash = next.anchor
        ? `#/${next.slug}/${next.anchor}`
        : `#/${next.slug}`;
    if (window.location.hash !== normalizedHash) {
        history.replaceState(null, "", normalizedHash);
    }
    currentRoute.value = next;
    applyRoute(previous, next);
});
