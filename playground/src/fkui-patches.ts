// Runtime workarounds for FKUI component bugs, applied before the app mounts.
// Each patch is a narrow override that can be deleted once the upstream
// package ships a fixed version.
import { FExpand } from "@fkui/vue";

// FExpand's leave hook pins the measured height and then collapses to 0px in
// a microtask, but it never forces a style recalc after pinning the height
// (the enter hook does). The browser therefore records `height: auto` as the
// transition's before-change style, `auto → 0px` is not interpolable, no
// transition runs, `transitionend` never fires and Vue never removes the
// content element – it stays in the DOM as a visible padding box.
//
// This replacement adds the missing flush (mirroring the enter hook) and a
// safety timeout so `done()` fires exactly once even when `transitionend` is
// delayed or suppressed (frame throttling, prefers-reduced-motion).
(FExpand.methods as { leave: (element: Element, done: () => void) => void }).leave =
    function leave(element: Element, done: () => void): void {
        if (!(element instanceof HTMLElement)) {
            return;
        }
        const DURATION = 400;
        let finished = false;
        const finish = (): void => {
            if (finished) {
                return;
            }
            finished = true;
            element.style.height = "auto";
            done();
        };
        element.style.height = "auto";
        element.style.height = getComputedStyle(element).height;
        Object.assign(element.style, {
            overflow: "hidden",
            transition: `height ${DURATION}ms cubic-bezier(0.46, 0.03, 0.52, 0.96)`,
        });
        getComputedStyle(element).height;
        queueMicrotask(() => {
            element.style.height = "0px";
            element.addEventListener("transitionend", finish, { once: true });
            setTimeout(finish, DURATION + 100);
        });
    };
