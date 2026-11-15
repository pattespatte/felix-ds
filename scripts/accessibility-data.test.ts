/**
 * Fullständighetstest för playgroundens tillgänglighetsdata
 * (playground/src/accessibilityData.ts).
 *
 * Data ska omfatta exakt de komponenter som fkuiComponentLinks känner till –
 * varken fler eller färre – varje post ska peka på minst en vy, alla slugs
 * ska finnas i navigationens vylista, varje ankare ska finnas i vyens
 * navigeringsankare och varje komponentkategori ska vara representerad.
 * Kör med `bun test`.
 */

import { describe, expect, test } from "bun:test";
import { componentAccessibility } from "../playground/src/accessibilityData.ts";
import { fkuiComponentLinks } from "../playground/src/fkuiComponentLinks.ts";
import { views } from "../playground/src/navigation.ts";

const viewSlugs = new Set(views.map((view) => view.slug));
const anchorIdsBySlug = new Map(views.map((view) => [view.slug, new Set(view.anchors.map((anchor) => anchor.id))]));

// De vyer som demoar FKUI-komponenter. Uppdateras när en kategorivy läggs
// till, tas bort eller byter slug – mönstret är samma högljudda lista som
// crossBrowserViewSlugs i navigation.ts.
const componentViewSlugs = [
    "knappar",
    "formular",
    "kalender",
    "filer",
    "ytor",
    "modaler",
    "navigation",
    "tabeller",
    "aterkoppling",
    "wizard",
] as const;

/** Delar upp en "slug/ankare"-post och normaliserar en bar slug till vyrot. */
function splitEntry(entry: string): { slug: string; anchor: string } {
    const match = /^([a-z0-9-]+)(?:\/([a-z0-9-]+))?$/.exec(entry);
    if (!match) {
        throw new Error(`Ogiltigt postformat i tillgänglighetsdatan: ${entry}`);
    }
    return { slug: match[1], anchor: match[2] ?? "" };
}

describe("tillgänglighetsdata (playground)", () => {
    test("nyckelmängden motsvarar fkuiComponentLinks exakt", () => {
        const dataKeys = Object.keys(componentAccessibility).sort();
        const linkKeys = Object.keys(fkuiComponentLinks).sort();
        expect({ missing: linkKeys.filter((key) => !dataKeys.includes(key)), extra: dataKeys.filter((key) => !linkKeys.includes(key)) }).toEqual({
            missing: [],
            extra: [],
        });
    });

    test("varje komponent pekar på minst en vy", () => {
        for (const [name, entry] of Object.entries(componentAccessibility)) {
            expect(entry.views.length, `--${name} pekar på ingen vy`).toBeGreaterThan(0);
        }
    });

    test("alla refererade vy-slugs finns i navigationen", () => {
        const referenced = new Set(
            Object.values(componentAccessibility).flatMap((entry) => entry.views.map((view) => splitEntry(view).slug)),
        );
        const unknown = [...referenced].filter((slug) => !viewSlugs.has(slug));
        expect(unknown, "okänd vy-slug i tillgänglighetsdata").toEqual([]);
    });

    test("alla refererade ankare finns i vyens navigeringsankare", () => {
        const problems: string[] = [];
        for (const [name, entry] of Object.entries(componentAccessibility)) {
            for (const view of entry.views) {
                const { slug, anchor } = splitEntry(view);
                if (!anchor) {
                    continue;
                }
                const anchorIds = anchorIdsBySlug.get(slug);
                if (!anchorIds?.has(anchor)) {
                    problems.push(`${name} → ${slug}/${anchor}`);
                }
            }
        }
        expect(problems, "okänt ankare i tillgänglighetsdata").toEqual([]);
    });

    test("varje komponentkategori representeras, och inga icke-komponentvyer pekas ut", () => {
        const referenced = new Set(
            Object.values(componentAccessibility).flatMap((entry) => entry.views.map((view) => splitEntry(view).slug)),
        );
        const missing = componentViewSlugs.filter((slug) => !referenced.has(slug));
        const unexpected = [...referenced].filter((slug) => !(componentViewSlugs as readonly string[]).includes(slug));
        expect({ missing, unexpected }).toEqual({ missing: [], unexpected: [] });
    });
});
