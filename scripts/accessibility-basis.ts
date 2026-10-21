/**
 * Genererar underlaget för tillgänglighetsredogörelser
 * (docs/accessibility-basis.{en,sv}.md) ur playgroundens tillgänglighetsdata
 * (playground/src/accessibilityData.ts): en lyftbar standardtext plus en rad
 * per komponent med länkar till de vyer som demonstrerar den.
 *
 * Underlaget får bara påstå det repot bevisar: axe-porten per utgivning
 * (varje vy i båda färglägena, noll överträdelser som villkor) och
 * demonstrationsläget per komponent. Inga efterlevnadsanspråk, inga
 * påståenden om manuell testning och inga länkar som innehåller
 * organisationsnamn – komponentdokumentationen nås via playgroundens
 * komponentrubriker i grundtemaprofilen. Paritetstestet
 * scripts/accessibility-basis.test.ts fäller dokument som inte längre
 * matchar datan. Kör med `bun run accessibility:build`.
 */

import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { componentAccessibility } from "../playground/src/accessibilityData.ts";
import { views } from "../playground/src/navigation.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS_DIR = join(ROOT, "docs");
const PLAYGROUND_URL = "https://pattespatte.github.io/felix-ds/";

export const BASIS_OUTPUTS = {
    en: join(DOCS_DIR, "accessibility-basis.en.md"),
    sv: join(DOCS_DIR, "accessibility-basis.sv.md"),
} as const;

/** Antal axe-skanningar per portkörning: alla vyer × 2 lägen + sökrutans öppna listruta. */
export function scanCount(): number {
    return views.length * 2 + 2;
}

/** Vy-poster sorterade på slug, för deterministisk utdata. */
function viewBySlug(slug: string) {
    const view = views.find((candidate) => candidate.slug === slug);
    if (view === undefined) {
        throw new Error(`Okänd vy-slug i tillgänglighetsdata: ${slug}`);
    }
    return view;
}

function viewLink(slug: string): string {
    const view = viewBySlug(slug);
    return `[${view.title}](${PLAYGROUND_URL}#/${view.slug})`;
}

interface Row {
    name: string;
    viewLinks: string[];
}

/** En rad per komponent, alfabetisk ordning, vy-länkar i data-ordning. */
export function rows(): Row[] {
    return Object.keys(componentAccessibility)
        .sort()
        .map((name) => ({
            name,
            viewLinks: componentAccessibility[name].views.map(viewLink),
        }));
}

function renderTable(lang: "en" | "sv"): string {
    const headers =
        lang === "sv"
            ? ["Komponent", "Visas i"]
            : ["Component", "Demonstrated in"];
    const lines = [
        `| ${headers[0]} | ${headers[1]} |`,
        "| --- | --- |",
        ...rows().map((row) => `| ${row.name} | ${row.viewLinks.join(", ")} |`),
    ];
    return lines.join("\n");
}

function renderEn(): string {
    const scans = scanCount();
    return `# Accessibility statement basis

This document is the basis a consumer can lift into their own accessibility
statement: what felix-ds actually proves about the components it themes, no
more. The [Tillgänglighet view](${PLAYGROUND_URL}#/tillganglighet) in the
playground shows the same coverage live.

## What the evidence is

- Every playground view is scanned with axe in both colour modes, and the
  search field's open dropdown is scanned separately – ${scans} scans per
  run (${views.length} views × 2 colour modes + 2). Zero violations is a
  condition of every package release, and no axe rules are disabled.
- The coverage data behind the table below is derived mechanically from the
  demo suite and kept honest by completeness tests, so the table cannot
  drift from what the playground actually demonstrates.
- The evidence transfers per component: the views listed in the table are
  the ones demonstrating the component, and they are part of every
  release's scan.

## What the evidence is not

Automated tools typically catch about a third of WCAG's conformance
criteria. This basis makes no conformance claim – against WCAG 2.x, EN 301
549 or any other framework – and claims no manual testing. Keyboard order,
screen reader behaviour, content language and structure need human review,
as does the consumer's own usage. Behaviour, roles and keyboard support
belong to the FKUI components themselves; felix-ds changes presentation
only. Map the evidence onto the framework your statement uses, and test
your own site.

## Text to lift

Replace \`[Component]\` with the component's name:

> [Component] is themed by felix-ds and demonstrated in the felix-ds public
> demo playground in both colour modes (light and dark). Every felix-ds
> release passes automated accessibility scans (axe) of every playground
> view in both colour modes, with zero violations as the condition, and the
> views demonstrating the component are part of those scans. The basis
> covers the automated share only: the component's behaviour, roles and
> keyboard support come from FKUI and require manual review, as does the
> adopting site's own content and usage.

## Per component

All ${rows().length} FKUI components the playground demonstrates, with the
views exercising each one:

${renderTable("en")}

## How this file is generated

Generated by \`scripts/accessibility-basis.ts\` (\`bun run
accessibility:build\`) from \`playground/src/accessibilityData.ts\` and
verified by \`scripts/accessibility-basis.test.ts\`: a committed file that
no longer matches the data fails the parity test, exactly like the
prebuilt CSS.
`;
}

function renderSv(): string {
    const scans = scanCount();
    return `# Underlag för tillgänglighetsredogörelse

Det här dokumentet är underlaget som en konsument kan lyfta in i sin egen
tillgänglighetsredogörelse: vad felix-ds faktiskt bevisar om de komponenter
det tematiserar, och inget mer. Vyn
[Tillgänglighet](${PLAYGROUND_URL}#/tillganglighet) i playgrounden visar
samma täckning live.

## Vad underlaget bygger på

- Varje vy i playgrounden skannas med axe i båda färglägena, och sökfältets
  öppna listruta skannas separat – ${scans} skanningar per körning
  (${views.length} vyer × 2 färglägen + 2). Noll överträdelser är ett
  villkor för varje utgivning av paketet, och inga axe-regler är avstängda.
- Täckningsdata bakom tabellen nedan härleds maskinellt ur demosviten och
  hålls ärlig av fullständighetstester, så tabellen kan inte glida isär från
  vad playgrounden faktiskt demonstrerar.
- Beviset överförs per komponent: vyerna i tabellen är de som demonstrerar
  komponenten, och de omfattas av varje utgivnings skanning.

## Vad underlaget inte är

Automatiserade verktyg fångar vanligen omkring en tredjedel av WCAG:s
efterlevnadskriterier. Underlaget gör inga efterlevnadsanspråk – mot WCAG
2.x, EN 301 549 eller något annat ramverk – och påstår ingen manuell
testning. Tangentbordsordning, skärmläsarbeteende, innehållets språk och
struktur kräver manuell granskning, liksom konsumentens egen användning.
Beteende, roller och tangentbordsstöd hör till FKUI:s komponenter. felix-ds
ändrar bara presentationen. Överför beviset till det ramverk din redogörelse
använder, och testa din egen webbplats.

## Text att lyfta

Byt \`[Komponent]\` mot komponentens namn:

> [Komponent] tematiseras av felix-ds och demonstreras i felix-ds öppna
> demoplayground i båda färglägena (ljust och mörkt). Varje utgivning av
> felix-ds passerar automatiserade tillgänglighetsskanningar (axe) av varje
> playground-vy i båda färglägena, med noll överträdelser som villkor, och
> vyerna som demonstrerar komponenten omfattas av skanningarna. Underlaget
> täcker bara den automatiserade delen: komponentens beteende, roller och
> tangentbordsstöd kommer från FKUI och kräver manuell granskning, liksom
> den egna webbplatsens innehåll och användning.

## Per komponent

Alla ${rows().length} FKUI-komponenter som playgrounden demonstrerar, med
vyerna som visar var och en:

${renderTable("sv")}

## Hur den här filen genereras

Genereras av \`scripts/accessibility-basis.ts\` (\`bun run
accessibility:build\`) ur \`playground/src/accessibilityData.ts\` och
kontrolleras av \`scripts/accessibility-basis.test.ts\`: en committad fil
som inte längre matchar datan fäller paritetstestet, på samma sätt som den
förbyggda css:en.
`;
}

export function renderBasis(): Record<"en" | "sv", string> {
    return { en: renderEn(), sv: renderSv() };
}

if (import.meta.main) {
    const rendered = renderBasis();
    writeFileSync(BASIS_OUTPUTS.en, rendered.en);
    writeFileSync(BASIS_OUTPUTS.sv, rendered.sv);
    console.log(
        `Skrev ${BASIS_OUTPUTS.en} och ${BASIS_OUTPUTS.sv} (${rows().length} komponenter, ${scanCount()} skanningar).`,
    );
}
