<script setup lang="ts">
import {
    FKUI_DOCS_BASE,
    fkuiComponentLinks,
    type FkuiComponentName,
} from "../fkuiComponentLinks";
import { statusesFor } from "../componentStatus";
import { views } from "../navigation";

// Decision guide: which component when. Entries carry a task-oriented
// "use when" text, the demo anchor in this playground and the primary
// component's upstream docs link (API details stay upstream – this view
// never copies them). The completeness check at the bottom keeps the guide
// honest: every demo anchor in navigation.ts must appear exactly once.

interface GuideEntry {
    /** Demo view slug in navigation.ts. */
    slug: string;
    /** Demo anchor id in navigation.ts. */
    id: string;
    /** When the user needs this – the decision text. */
    text: string;
    /** Primary component for the FKUI docs link, when one exists. */
    name?: FkuiComponentName;
}

interface GuideGroup {
    id: string;
    title: string;
    entries: GuideEntry[];
}

const groups: GuideGroup[] = [
    {
        id: "knappar",
        title: "Knappar och handlingar",
        entries: [
            { slug: "knappar", id: "fbutton", name: "FButton", text: "starta en handling – primär, sekundär eller destruktiv knapp" },
            { slug: "knappar", id: "fcrudbutton", name: "FCrudButton", text: "redigera, spara eller ta bort i en redigerbar yta" },
            { slug: "knappar", id: "ficon", name: "FIcon", text: "visa en ikon med fördefinierad teckning" },
            { slug: "knappar", id: "flogo", name: "FLogo", text: "visa en logotyp, till exempel i en sidhuvudslänk" },
        ],
    },
    {
        id: "formular",
        title: "Formulär",
        entries: [
            { slug: "formular", id: "ftextfield", name: "FTextField", text: "fritt textfält med validering" },
            { slug: "formular", id: "fsearchtextfield", name: "FSearchTextField", text: "sökfält med sökknapp" },
            { slug: "formular", id: "fnumerictextfield", name: "FNumericTextField", text: "numeriskt värde" },
            { slug: "formular", id: "fcurrencytextfield", name: "FCurrencyTextField", text: "belopp" },
            { slug: "formular", id: "fpercenttextfield", name: "FPercentTextField", text: "procent" },
            { slug: "formular", id: "fphonetextfield", name: "FPhoneTextField", text: "telefonnummer" },
            { slug: "formular", id: "femailtextfield", name: "FEmailTextField", text: "e-postadress" },
            { slug: "formular", id: "fpostalcodetextfield", name: "FPostalCodeTextField", text: "postnummer" },
            { slug: "formular", id: "fpersonnummertextfield", name: "FPersonnummerTextField", text: "personnummer" },
            { slug: "formular", id: "forganisationsnummertextfield", name: "FOrganisationsnummerTextField", text: "organisationsnummer" },
            { slug: "formular", id: "fbankaccountnumbertextfield", name: "FBankAccountNumberTextField", text: "bankkontonummer" },
            { slug: "formular", id: "fbankgirotextfield", name: "FBankgiroTextField", text: "bankgironummer" },
            { slug: "formular", id: "fclearingnumbertextfield", name: "FClearingnumberTextField", text: "clearingnummer" },
            { slug: "formular", id: "fplusgirotextfield", name: "FPlusgiroTextField", text: "plusgironummer" },
            { slug: "formular", id: "ftextareafield", name: "FTextareaField", text: "flerradigt fritextfält" },
            { slug: "formular", id: "fselectfield", name: "FSelectField", text: "välja ett alternativ ur en rullista" },
            { slug: "formular", id: "fcheckboxfield", name: "FCheckboxField", text: "ett eller flera oberoende val" },
            { slug: "formular", id: "fradiofield", name: "FRadioField", text: "välja ett av flera kända alternativ" },
            { slug: "formular", id: "ffieldset", name: "FFieldset", text: "gruppera relaterade fält" },
            { slug: "formular", id: "flabel", name: "FLabel", text: "etikett kopplad till ett fält" },
            { slug: "formular", id: "fstaticfield", name: "FStaticField", text: "visa statisk text i formulärsform" },
            { slug: "formular", id: "foutputfield", name: "FOutputField", text: "visa utdata eller beräknat värde" },
            { slug: "formular", id: "fvalidationform", name: "FValidationForm", text: "formulär med samlad validering" },
            { slug: "formular", id: "ferrorlist", name: "FErrorList", text: "sammanfatta felen för användaren" },
        ],
    },
    {
        id: "datum",
        title: "Datum",
        entries: [
            { slug: "kalender", id: "fcalendar", name: "FCalendar", text: "visa en kalender" },
            { slug: "kalender", id: "fdatepickerfield", name: "FDatepickerField", text: "låta användaren välja datum" },
        ],
    },
    {
        id: "filer",
        title: "Filer",
        entries: [
            { slug: "filer", id: "ffileselector", name: "FFileSelector", text: "låta användaren välja filer" },
            { slug: "filer", id: "ffileitem", name: "FFileItem", text: "visa en vald eller uppladdad fil" },
            { slug: "filer", id: "file-uploader", text: "ladda upp filer (CSS-mönster)" },
        ],
    },
    {
        id: "ytor",
        title: "Ytor och paneler",
        entries: [
            { slug: "ytor", id: "fcard", name: "FCard", text: "gruppera innehåll på ett kort" },
            { slug: "ytor", id: "fexpand", name: "FExpand", text: "visa och dölja mer innehåll på plats" },
            { slug: "ytor", id: "fexpandablepanel", name: "FExpandablePanel", text: "en expanderbar yta" },
            { slug: "ytor", id: "fexpandableparagraph", name: "FExpandableParagraph", text: "lång text med en Visa mer-kontroll" },
            { slug: "ytor", id: "fmessagebox", name: "FMessageBox", text: "presentera ett meddelande – info, varning eller fel" },
            { slug: "ytor", id: "ftooltip", name: "FTooltip", text: "förklaring vid pekare eller tangentfokus" },
            { slug: "ytor", id: "fdetailspanel", name: "FDetailsPanel", text: "detaljyta vid sidan av innehållet" },
            { slug: "ytor", id: "fminimizablepanel", name: "FMinimizablePanel", text: "yta som användaren kan minimera" },
            { slug: "ytor", id: "ffixedpane", name: "FFixedPane", text: "fast panel i layouten" },
            { slug: "ytor", id: "fresizepane", name: "FResizePane", text: "panel som användaren kan ändra storlek på" },
            { slug: "ytor", id: "foffline", name: "FOffline", text: "nedkopplad vy" },
        ],
    },
    {
        id: "modaler",
        title: "Modaler och dialoger",
        entries: [
            { slug: "modaler", id: "fmodal", name: "FModal", text: "en fokuserad uppgift i modal" },
            { slug: "modaler", id: "fconfirmmodal", name: "FConfirmModal", text: "bekräfta en destruktiv handling" },
            { slug: "modaler", id: "fformmodal", name: "FFormModal", text: "formulär i modal" },
            { slug: "modaler", id: "fcontextmenu", name: "FContextMenu", text: "snabbmeny, till exempel vid högerklick" },
            { slug: "modaler", id: "fdialoguetree", name: "FDialogueTree", text: "guidat frågeträd" },
        ],
    },
    {
        id: "navigation",
        title: "Navigation och layout",
        entries: [
            { slug: "navigation", id: "fnavigationmenu", name: "FNavigationMenu", text: "sektions- eller treemeny" },
            { slug: "navigation", id: "fpagelayout", name: "FPageLayout", text: "sidadlayout med paneler" },
            { slug: "navigation", id: "flayoutrightpanel", name: "FLayoutRightPanel", text: "högerpanel" },
        ],
    },
    {
        id: "tabeller",
        title: "Tabeller och data",
        entries: [
            { slug: "tabeller", id: "ftable", name: "FTable", text: "enkel tabell" },
            { slug: "tabeller", id: "fdatatable", name: "FDataTable", text: "datatabell med valbara rader" },
            { slug: "tabeller", id: "finteractivetable", name: "FInteractiveTable", text: "tabell med expandering och val" },
            { slug: "tabeller", id: "fcruddataset", name: "FCrudDataset", text: "redigerbar mängd" },
            { slug: "tabeller", id: "fsortfilterdataset", name: "FSortFilterDataset", text: "mängd med sökning och sortering" },
            { slug: "tabeller", id: "fpaginatedataset", name: "FPaginateDataset", text: "sidindelad mängd" },
            { slug: "tabeller", id: "fpaginator", name: "FPaginator", text: "sidindelning" },
            { slug: "tabeller", id: "flist", name: "FList", text: "lista, med eller utan val" },
            { slug: "tabeller", id: "fdefinitionlist", name: "FDefinitionList", text: "nyckel–värde-lista" },
        ],
    },
    {
        id: "aterkoppling",
        title: "Återkoppling och status",
        entries: [
            { slug: "aterkoppling", id: "fbadge", name: "FBadge", text: "statusbricka" },
            { slug: "aterkoppling", id: "floader", name: "FLoader", text: "snurra vid väntan" },
            { slug: "aterkoppling", id: "fprogressbar", name: "FProgressbar", text: "förlopp" },
        ],
    },
    {
        id: "stegvisa",
        title: "Stegvisa flöden",
        entries: [
            { slug: "wizard", id: "fwizard", name: "FWizard", text: "stegvis flöde i flera steg" },
        ],
    },
    {
        id: "css",
        title: "Endast CSS",
        entries: [
            { slug: "css", id: "anchor", text: "länkstil (CSS-mönster)" },
            { slug: "css", id: "entrypoint", text: "startpunktskort (CSS-mönster)" },
            { slug: "css", id: "combobox", text: "kombinationsruta (CSS-mönster)" },
            { slug: "css", id: "selectable-item", text: "valbart listobjekt (CSS-mönster)" },
            { slug: "css", id: "chip", text: "chip (CSS-mönster)" },
            { slug: "css", id: "close-button", text: "stängknapp (CSS-mönster)" },
            { slug: "css", id: "indent", text: "indrag (CSS-mönster)" },
        ],
    },
];

// Completeness check: the guide's anchors must be exactly the demo anchors
// of navigation.ts (all views except the three documentation views). A
// renamed or new demo anchor fails loudly here instead of silently leaving
// the guide incomplete.
const DOC_VIEW_SLUGS = ["start", "kom-igang", "valj-komponent"];

const guideAnchors = new Set(
    groups.flatMap((group) => group.entries.map((entry) => `${entry.slug}/${entry.id}`)),
);
const demoAnchors = new Set(
    views
        .filter((view) => !DOC_VIEW_SLUGS.includes(view.slug))
        .flatMap((view) => view.anchors.map((anchor) => `${view.slug}/${anchor.id}`)),
);
for (const anchor of guideAnchors) {
    if (!demoAnchors.has(anchor)) {
        throw new Error(`Okänd demo-ankare i komponentguiden: ${anchor}`);
    }
}
for (const anchor of demoAnchors) {
    if (!guideAnchors.has(anchor)) {
        throw new Error(`Demo-ankare saknas i komponentguiden: ${anchor}`);
    }
}

const anchorTitles = new Map(
    views.flatMap((view) => view.anchors.map((anchor) => [`${view.slug}/${anchor.id}`, anchor.title])),
);

function docsHref(name: FkuiComponentName): string | null {
    const link = fkuiComponentLinks[name];
    return link === undefined ? null : `${FKUI_DOCS_BASE}${link.docsPath}`;
}

</script>

<template>
    <div class="view">
        <h1>Välj komponent</h1>
        <p class="view__intro">
            Komponentguide grupperad efter uppgift: hitta det användaren ska
            göra och följ länken till demon här i playgrounden, eller till
            FKUI:s dokumentation för API och riktlinjer. Allt som visas här är
            FKUI:s egna komponenter med felix-temat på – inga wrappers.
        </p>

        <section
            v-for="group in groups"
            :key="group.id"
            :id="group.id"
            :aria-labelledby="`${group.id}-heading`"
            class="demo"
        >
            <h2 :id="`${group.id}-heading`">{{ group.title }}</h2>
            <ul class="guide-list">
                <li v-for="entry in group.entries" :key="`${entry.slug}/${entry.id}`">
                    <span class="guide-when">{{ entry.text }}</span>
                    <a class="guide-demo" :href="`#/${entry.slug}/${entry.id}`">{{
                        anchorTitles.get(`${entry.slug}/${entry.id}`) ?? entry.id
                    }}</a>
                    <span class="guide-meta">
                        <template v-if="entry.name && docsHref(entry.name)">
                            <a class="guide-api" :href="docsHref(entry.name)">{{ entry.name }}</a>
                            <span
                                v-for="status in statusesFor([entry.name])"
                                :key="status.label"
                                class="badge"
                                :class="`badge--${status.variant}-inverted`"
                                >{{ status.label }}</span
                            >
                        </template>
                    </span>
                </li>
            </ul>
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

.guide-list {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 0.25rem 1rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--fkds-color-border-weak, #d7d9e0);
    }

    li:last-child {
        border-bottom: none;
    }
}

.guide-when {
    flex: 1 1 16rem;
    color: var(--fkds-color-text-primary, #081130);
}

.guide-demo {
    flex: 0 0 auto;
    font-weight: var(--f-font-weight-bold, 600);
}

.guide-meta {
    display: inline-flex;
    align-items: baseline;
    gap: 0.5rem;
}

.guide-api {
    font-family: var(--f-font-family-code, monospace);
    font-size: 0.875rem;
}
</style>
