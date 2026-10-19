<script setup lang="ts">
import {
    FKUI_DOCS_BASE,
    fkuiComponentLinks,
    type FkuiComponentName,
} from "../fkuiComponentLinks";
import { componentAccessibility } from "../accessibilityData";
import { findView, views } from "../navigation";

// Coverage documentation, not a conformance certification: felix-ds is a
// theme layer, so component behaviour and accessibility come from FKUI
// (whose components aim at WCAG 2.2 AA and EN 301 549). This page states
// what is tested where, and what stays manual review. The scan counts are
// computed from navigation.ts at render time – hardcoded numbers rotted
// twice before, so prose may never carry one.

// axe scans every view in both felix color modes (e2e/a11y.spec.ts) plus the
// header search dropdown's open state, which only renders while focused.
const scanCount = views.length * 2 + 2;

interface ViewLink {
    title: string;
    href: string;
}

interface ComponentRow {
    name: FkuiComponentName;
    docsHref: string;
    views: ViewLink[];
}

const rows: ComponentRow[] = (Object.keys(fkuiComponentLinks) as FkuiComponentName[]).map((name) => {
    const links: ViewLink[] = [];
    for (const slug of componentAccessibility[name].views) {
        const view = findView(slug);
        if (view === undefined) {
            throw new Error(`Okänd vy-slug i tillgänglighetsdatan: ${slug}`);
        }
        links.push({ title: view.title, href: `#/${view.slug}` });
    }
    return {
        name,
        docsHref: `${FKUI_DOCS_BASE}${fkuiComponentLinks[name].docsPath}`,
        views: links,
    };
});
</script>

<template>
    <div class="view">
        <h1>Tillgänglighet</h1>
        <p class="view__intro">
            felix-ds är ett temalager – färgprofiler, typsnitt och css-variabler ovanpå FKUI:s
            komponenter. Komponenternas beteende och tillgänglighet kommer från FKUI, vars
            komponenter ska uppfylla WCAG 2.2 AA och EU:s tillgänglighetskrav (EN 301 549). Den
            här sidan dokumenterar täckningen: vad som testas automatiskt, var varje komponent
            demonstreras och vad som kräver manuell granskning.
        </p>

        <section
            id="om-tillganglighet"
            aria-labelledby="om-tillganglighet-heading"
            class="demo"
        >
            <h2 :id="`om-tillganglighet-heading`">Vad temat bidrar med</h2>
            <p>
                Temat levererar färgprofilerna: ett ljust och ett mörkt läge med samma tokenstruktur, så
                att komponenterna blir läsbara i båda lägena utan egna regler. Demonstrationerna här i
                playgrounden passerar axe:s kontrastregler i båda färglägena. Fokusindikatorn är en
                tydlig tvådelad ring (svart yttre ring på ljus inre), och typsnitten laddas från den
                egna webbplatsen – inga externa typsnittstjänster.
            </p>
        </section>

        <section id="testning" aria-labelledby="testning-heading" class="demo">
            <h2 :id="`testning-heading`">Testning</h2>
            <p>
                Varje vy i playgrounden scannas med axe i både ljust och mörkt läge, och sökfältets
                öppna listruta scannas separat – sammanlagt {{ scanCount }} scanningar per körning
                ({{ views.length }} vyer × 2 färglägen + 2). Noll överträdelser är ett villkor för
                varje utgivning av paketet. Inga axe-regler är avstängda: ett fel som dyker upp
                ska åtgärdas eller spåras till komponenterna uppströms – aldrig döljas.
            </p>
        </section>

        <section id="komponenter" aria-labelledby="komponenter-heading" class="demo">
            <h2 :id="`komponenter-heading`">Komponenterna</h2>
            <p>
                Tabellen omfattar alla {{ rows.length }} FKUI-komponenter som playgrounden demonstrerar.
                Kolumnen Komponent länkar till komponentens sida i FKUI:s dokumentation, där detaljer om
                beteende och tillgänglighet finns. Kolumnen Visas i leder till demon här, som körs i
                båda färglägena.
            </p>
            <div class="a11y-table-wrap">
                <table class="a11y-table">
                    <thead>
                        <tr>
                            <th scope="col">Komponent</th>
                            <th scope="col">Visas i</th>
                            <th scope="col">Tillgänglighetstest</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in rows" :key="row.name">
                            <td><a :href="row.docsHref">{{ row.name }}</a></td>
                            <td>
                                <template v-for="(view, index) in row.views" :key="view.href">
                                    <a :href="view.href">{{ view.title }}</a><span v-if="index < row.views.length - 1">, </span>
                                </template>
                            </td>
                            <td>axe i ljust och mörkt läge</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section id="begransningar" aria-labelledby="begransningar-heading" class="demo">
            <h2 :id="`begransningar-heading`">Begränsningar</h2>
            <p>
                axe hittar de fel som går att upptäcka automatiskt – kontraster, namn och roller bland
                annat. Full afterlevnad av WCAG kräver också manuell granskning: verklig
                tangentbordsordning, skärmläsartest och innehållets språk och struktur. Automatiserade
                verktyg fångar vanligen omkring en tredjedel av WCAG:s efterlevnadskriterier.
            </p>
            <p>
                Temat ändrar bara presentationen. Beteende, roller och tangentbordsstöd kommer från
                komponenterna, och detaljer per komponent finns i FKUI:s dokumentation – länkad i
                tabellen ovan.
            </p>
        </section>
    </div>
</template>

<style scoped lang="scss">
// Inline links in prose must be distinguishable without colour in every
// theme profile (see GettingStartedView for the rationale).
p a {
    text-decoration: underline;
    text-underline-offset: 3px;
}

.a11y-table-wrap {
    overflow-x: auto;
}

.a11y-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;

    th,
    td {
        padding: 0.5rem 0.75rem 0.5rem 0;
        border-bottom: 1px solid var(--fkds-color-border-weak, #d7d9e0);
        vertical-align: top;
    }

    th {
        font-weight: var(--f-font-weight-bold, 600);
        border-bottom-width: 2px;
    }

    td:first-child a {
        font-family: var(--f-font-family-code, monospace);
        font-size: 0.875rem;
    }
}
</style>
