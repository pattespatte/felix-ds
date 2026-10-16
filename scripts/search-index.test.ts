/**
 * Paritetstest för playgroundens sökindex (scripts/search-index.ts).
 *
 * Låser kontraktet mellan navigation.ts (den enda sanningskällan för vyer
 * och ankare) och den genererade indexfilen: postantalet måste vara exakt
 * vyer + ankare, sektionsposterna måste täcka alla ankare, url:erna måste
 * följa hash-routerns mönster, och utdata måste vara deterministisk.
 * Kör med `bun test`.
 */

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { generateSearchIndex, OUTPUT_PATH } from "./search-index.ts";
import { views } from "../playground/src/navigation";

const expectedAnchors = views.flatMap((view) =>
    view.anchors.map((anchor) => `${view.slug}/${anchor.id}`),
);

describe("search index parity", () => {
    test("entry count is exactly views plus anchors", () => {
        const entries = generateSearchIndex();
        expect(entries.length).toBe(views.length + expectedAnchors.length);
    });

    test("section entries cover every navigation anchor exactly", () => {
        const entries = generateSearchIndex();
        const sectionIds = entries.filter((entry) => entry.anchor).map((entry) => entry.id);
        expect(sectionIds.sort()).toEqual([...expectedAnchors].sort());
    });

    test("view entries cover every view slug", () => {
        const entries = generateSearchIndex();
        const viewIds = entries.filter((entry) => !entry.anchor).map((entry) => entry.id);
        expect(viewIds).toEqual(views.map((view) => view.slug));
    });

    test("ids are unique", () => {
        const entries = generateSearchIndex();
        const ids = entries.map((entry) => entry.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    test("urls follow the hash router pattern and match slug/anchor", () => {
        const entries = generateSearchIndex();
        for (const entry of entries) {
            expect(entry.url).toMatch(/^#\/[a-z0-9-]+(\/[a-z0-9-]+)?$/);
            expect(entry.url).toBe(entry.anchor ? `#/${entry.slug}/${entry.anchor}` : `#/${entry.slug}`);
        }
    });

    test("titles are non-empty and keywords are unique lowercase words", () => {
        for (const entry of generateSearchIndex()) {
            expect(entry.title.length).toBeGreaterThan(0);
            expect(entry.viewTitle.length).toBeGreaterThan(0);
            expect(entry.keywords).toEqual([...new Set(entry.keywords)]);
            for (const keyword of entry.keywords) {
                expect(keyword).toBe(keyword.toLowerCase());
                expect(keyword).toMatch(/^[åäö\w-]+$/);
            }
        }
    });

    test("output is deterministic and matches the file on disk", () => {
        const first = JSON.stringify(generateSearchIndex(), null, 4);
        const second = JSON.stringify(generateSearchIndex(), null, 4);
        expect(second).toBe(first);
        expect(readFileSync(OUTPUT_PATH, "utf8")).toBe(`${first}\n`);
    });
});
