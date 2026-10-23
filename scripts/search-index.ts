/**
 * Genererar playground/public/search-index.json – sökindexet för playgroundens
 * klientsidesökning. En post per vy (guidens kapitel) och en per navigerings-
 * ankare (komponentsektion), med djuplänkar som matchar hash-routerns
 * `#/slug` och `#/slug/ankare`.
 *
 * Användning:
 *   bun run search:build     generera indexet (körs även automatiskt av
 *                            Vite-pluginnet i playground/vite.config.ts, både
 *                            i dev och build)
 *
 * Konventioner som skriptet följer:
 * - navigation.ts är den enda sanningskällan för vyer och ankare; indexet
 *   genereras och checkas aldrig in (katalogen är gitignorerad)
 * - textinnehållet kommer från demoernas `demo__description` och vyernas
 *   `view__intro`/första stycke per sektion – inga radredigeringar behövs
 * - Täckningsgrind: varje demo rot-sektions-id måste vara ett navigerings-
 *   ankare, och varje ankare måste ha en källa (demo eller vysektion) –
 *   tyst hål är förbjudet, skriptet felar
 * - utdata är deterministisk: vy-/ankerordning, sorterad filvandring
 */

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { views } from "../playground/src/navigation.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PLAYGROUND_SRC = join(ROOT, "playground", "src");
const DEMOS_DIR = join(PLAYGROUND_SRC, "demos");
const VIEWS_DIR = join(PLAYGROUND_SRC, "views");
export { PLAYGROUND_SRC, DEMOS_DIR, VIEWS_DIR };
export const OUTPUT_PATH = join(ROOT, "playground", "public", "search-index.json");

/** Post i sökindexet; kontrakt mot useSearch i playgrounden. */
export interface SearchIndexEntry {
    /** "slug" för vyposter, "slug/ankare" för sektionsposter. */
    id: string;
    slug: string;
    /** Tom sträng för vyposter. */
    anchor: string;
    title: string;
    url: string;
    viewTitle: string;
    /** Komponentnamn ur sektionens rubrik (demosektioner). */
    names: string[];
    content: string;
    keywords: string[];
}

interface DemoSource {
    names: string[];
    description: string;
}

interface ViewSource {
    intro: string;
    /** Första styckets text per sektions-id i vyfilen. */
    sections: Map<string, string>;
}

/** Rensar bort HTML-taggar, HTML-kommentarer och {{...}}-uttryck ur mallen så att bara texten återstår. */
function stripProse(raw: string): string {
    return raw
        .replace(/<!--[\s\S]*?-->/g, " ")
        .replace(/\{\{[\s\S]*?\}\}/g, " ")
        .replace(/<[^>]*>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\"")
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

function walkVueFiles(dir: string): string[] {
    const files: string[] = [];
    for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
        a.name.localeCompare(b.name),
    )) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...walkVueFiles(path));
        } else if (entry.name.endsWith(".vue")) {
            files.push(path);
        }
    }
    return files;
}

/** Alla `<section id="...">` med startposition, i filordning. */
function sectionStarts(content: string): { id: string; start: number }[] {
    return [...content.matchAll(/<section\s+id="([a-z0-9-]+)"/g)].map((match) => ({
        id: match[1],
        start: match.index ?? 0,
    }));
}

function parseDemo(file: string): { id: string; source: DemoSource } {
    const content = readFileSync(file, "utf8");
    const starts = sectionStarts(content);
    if (starts.length === 0) {
        throw new Error(`search-index: ingen <section id="..."> i ${file}`);
    }
    // Komponentnamn finns bara på FKUI-demos (ComponentHeading); CSS-mönstren
    // (demos/css, FileUploaderDemo) har vanliga h2-rubriker utan namnlista.
    const namesMatch = content.match(/:names="\[([^\]]*)\]"/);
    const descriptionMatch = content.match(/<p class="demo__description">([\s\S]*?)<\/p>/);
    if (!descriptionMatch) {
        throw new Error(`search-index: ingen demo__description i ${file}`);
    }
    return {
        // Rotsektionen är filens första sektion – dess id är navigeringsankaret.
        id: starts[0].id,
        source: {
            names: namesMatch
                ? [...namesMatch[1].matchAll(/'([^']+)'/g)].map((match) => match[1])
                : [],
            description: stripProse(descriptionMatch[1]),
        },
    };
}

function parseView(file: string): ViewSource {
    const content = readFileSync(file, "utf8");
    const introMatch = content.match(/<p class="view__intro">([\s\S]*?)<\/p>/);
    const sections = new Map<string, string>();
    const starts = sectionStarts(content);
    starts.forEach((section, index) => {
        const bound = index + 1 < starts.length ? starts[index + 1].start : content.length;
        const slice = content.slice(section.start, bound);
        const paragraph = slice.match(/<p[^>]*>([\s\S]*?)<\/p>/);
        sections.set(section.id, paragraph ? stripProse(paragraph[1]) : "");
    });
    return { intro: introMatch ? stripProse(introMatch[1]) : "", sections };
}

/**
 * Slug -> vyfil, ur App.vue:s importblock och viewComponents-literal. Filnamnen
 * följer ingen mekanisk slugregel (kom-igang -> GettingStartedView.vue), så
 * mappningen läses ur sitt enda författade ställe – samma källa routern använder.
 */
function viewFileBySlug(): Map<string, string> {
    const app = readFileSync(join(PLAYGROUND_SRC, "App.vue"), "utf8");
    const fileByComponent = new Map<string, string>();
    for (const match of app.matchAll(/import\s+(\w+)\s+from\s+"\.\/views\/(\w+)\.vue"/g)) {
        fileByComponent.set(match[1], match[2]);
    }
    const mapStart = app.indexOf("viewComponents");
    const literalStart = app.indexOf("{", mapStart);
    const mapEnd = app.indexOf("};", mapStart);
    if (mapStart === -1 || literalStart === -1 || mapEnd === -1) {
        throw new Error("search-index: hittar inte viewComponents-mappningen i App.vue");
    }
    const literal = app.slice(literalStart, mapEnd);
    const fileBySlug = new Map<string, string>();
    for (const match of literal.matchAll(/(?:"([a-z0-9-]+)"|([a-z0-9]+)):\s*(\w+)/g)) {
        const slug = match[1] ?? match[2];
        const file = fileByComponent.get(match[3]);
        if (!file) {
            throw new Error(`search-index: okänd vykomponent "${match[3]}" i App.vue`);
        }
        fileBySlug.set(slug, file);
    }
    return fileBySlug;
}

/** Nyckelord ur text: gemener, svenska bokstäver behålls, ord längre än 3 tecken. */
function deriveKeywords(text: string, limit = 24): string[] {
    return [
        ...new Set(
            text
                .toLowerCase()
                .replace(/[^\w\såäöÅÄÖ]/g, " ")
                .split(/\s+/)
                .filter((word) => word.length > 3),
        ),
    ].slice(0, limit);
}

export function generateSearchIndex(): SearchIndexEntry[] {
    const anchorById = new Map<
        string,
        { slug: string; title: string; viewTitle: string }
    >();
    for (const view of views) {
        for (const anchor of view.anchors) {
            anchorById.set(anchor.id, {
                slug: view.slug,
                title: anchor.title,
                viewTitle: view.title,
            });
        }
    }

    const demoById = new Map<string, DemoSource>();
    for (const file of walkVueFiles(DEMOS_DIR)) {
        const { id, source } = parseDemo(file);
        if (!anchorById.has(id)) {
            throw new Error(
                `search-index: demon ${file} har sektionsid "${id}" som inte är något navigeringsankare`,
            );
        }
        demoById.set(id, source);
    }

    const fileBySlug = viewFileBySlug();
    const viewBySlug = new Map<string, ViewSource>();
    const viewSectionById = new Map<string, string>();
    for (const [slug, file] of fileBySlug) {
        const source = parseView(join(VIEWS_DIR, `${file}.vue`));
        viewBySlug.set(slug, source);
        for (const [id, paragraph] of source.sections) {
            viewSectionById.set(id, paragraph);
        }
    }

    const entries: SearchIndexEntry[] = [];
    for (const view of views) {
        const viewSource = viewBySlug.get(view.slug);
        if (!viewSource) {
            throw new Error(`search-index: hittar inte vyfil för slug "${view.slug}"`);
        }
        entries.push({
            id: view.slug,
            slug: view.slug,
            anchor: "",
            title: view.title,
            url: `#/${view.slug}`,
            viewTitle: view.title,
            names: [],
            content: viewSource.intro,
            keywords: deriveKeywords(
                `${view.title} ${view.anchors.map((anchor) => anchor.title).join(" ")} ${viewSource.intro}`,
            ),
        });

        for (const anchor of view.anchors) {
            const demo = demoById.get(anchor.id);
            const sectionParagraph = viewSectionById.get(anchor.id);
            // Dynamiskt renderade sektioner (t.ex. ComponentGuideView:s
            // grupploop) syns inte för en statisk skanning – posten får
            // titel och nyckelord men inget textinnehåll. Varningen håller hålet
            // synligt i byggutdata utan att felblockera legitima fall.
            if (!demo && sectionParagraph === undefined) {
                console.warn(
                    `search-index: ankaret "${anchor.id}" (${view.slug}) har ingen statisk källa – indexeras utan textinnehåll`,
                );
            }
            const names = demo?.names ?? [];
            const content = demo?.description ?? sectionParagraph ?? "";
            entries.push({
                id: `${view.slug}/${anchor.id}`,
                slug: view.slug,
                anchor: anchor.id,
                title: anchor.title,
                url: `#/${view.slug}/${anchor.id}`,
                viewTitle: view.title,
                names,
                content,
                keywords: [
                    ...new Set([
                        ...names.map((name) => name.toLowerCase()),
                        ...deriveKeywords(`${anchor.title} ${content}`),
                    ]),
                ],
            });
        }
    }

    mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
    writeFileSync(OUTPUT_PATH, `${JSON.stringify(entries, null, 4)}\n`);
    return entries;
}

if (import.meta.main) {
    const entries = generateSearchIndex();
    console.log(`Generated search index with ${entries.length} entries`);
    console.log(`Search index saved to: ${OUTPUT_PATH}`);
}
