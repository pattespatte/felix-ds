/**
 * Fullständighetstest för playgroundens tillgänglighetsdata
 * (playground/src/accessibilityData.ts).
 *
 * Data ska omfatta exakt de komponenter som fkuiComponentLinks känner till –
 * varken fler eller färre – varje post ska peka på minst en vy, alla slugs
 * ska finnas i navigationens vylista och varje komponentkategori ska vara
 * representerad. Kör med `bun test`.
 */

import { describe, expect, test } from "bun:test";
import { componentAccessibility } from "../playground/src/accessibilityData.ts";
import { fkuiComponentLinks } from "../playground/src/fkuiComponentLinks.ts";
import { views } from "../playground/src/navigation.ts";

const viewSlugs = new Set(views.map((view) => view.slug));

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
        const referenced = new Set(Object.values(componentAccessibility).flatMap((entry) => entry.views));
        const unknown = [...referenced].filter((slug) => !viewSlugs.has(slug));
        expect(unknown, "okänd vy-slug i tillgänglighetsdata").toEqual([]);
    });

    test("varje komponentkategori representeras, och inga icke-komponentvyer pekas ut", () => {
        const referenced = new Set(Object.values(componentAccessibility).flatMap((entry) => entry.views));
        const missing = componentViewSlugs.filter((slug) => !referenced.has(slug));
        const unexpected = [...referenced].filter((slug) => !(componentViewSlugs as readonly string[]).includes(slug));
        expect({ missing, unexpected }).toEqual({ missing: [], unexpected: [] });
    });
});
