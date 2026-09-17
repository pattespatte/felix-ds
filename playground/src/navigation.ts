// Single source of truth for the playground navigation: the ordered category
// views and their in-view anchors. Consumed by both the nav tree (App shell)
// and the hash router, so links and routes can never drift apart.

export interface NavAnchor {
    /** Id of the target element inside the view – also the deep-link slug. */
    id: string;
    title: string;
}

export interface NavView {
    slug: string;
    title: string;
    anchors: NavAnchor[];
}

export const views: NavView[] = [
    {
        slug: "knappar",
        title: "Knappar och ikoner",
        anchors: [
            { id: "fbutton", title: "Knappar" },
            { id: "fcrudbutton", title: "CRUD-knappar" },
            { id: "ficon", title: "Ikoner" },
            { id: "flogo", title: "Logotyp" },
            { id: "fbadge", title: "Brickor" },
            { id: "fmessagebox", title: "Meddelanderutor" },
            { id: "ftooltip", title: "Tooltip" },
            { id: "fprogressbar", title: "Förlopp och läge" },
        ],
    },
    {
        slug: "formular",
        title: "Formulär",
        anchors: [
            { id: "ftextfield", title: "Textfält" },
            { id: "fsearchtextfield", title: "Sökfält" },
            { id: "fnumerictextfield", title: "Numeriskt fält" },
            { id: "fcurrencytextfield", title: "Beloppsfält" },
            { id: "fpercenttextfield", title: "Procentfält" },
            { id: "fphonetextfield", title: "Telefonfält" },
            { id: "femailtextfield", title: "E-postfält" },
            { id: "fpostalcodetextfield", title: "Postnummer" },
            { id: "fpersonnummertextfield", title: "Personnummer" },
            { id: "forganisationsnummertextfield", title: "Organisationsnummer" },
            { id: "fbankaccountnumbertextfield", title: "Bankkonto" },
            { id: "fbankgirotextfield", title: "Bankgiro" },
            { id: "fclearingnumbertextfield", title: "Clearingnummer" },
            { id: "fplusgirotextfield", title: "Plusgiro" },
            { id: "ftextareafield", title: "Textruta" },
            { id: "fselectfield", title: "Rulllista" },
            { id: "fcheckboxfield", title: "Kryssruta" },
            { id: "fradiofield", title: "Radioknappar" },
            { id: "ffieldset", title: "Fältset" },
            { id: "flabel", title: "Etikett" },
            { id: "fstaticfield", title: "Statiskt fält" },
            { id: "foutputfield", title: "Utdatafält" },
            { id: "fvalidationform", title: "Valideringsformulär" },
            { id: "ferrorlist", title: "Fellista" },
        ],
    },
    {
        slug: "kalender",
        title: "Datum och kalender",
        anchors: [
            { id: "fcalendar", title: "Kalender" },
            { id: "fdatepickerfield", title: "Datumfält" },
        ],
    },
    {
        slug: "filer",
        title: "Filer",
        anchors: [],
    },
    {
        slug: "ytor",
        title: "Ytor och paneler",
        anchors: [
            { id: "fcard", title: "Kort" },
            { id: "fmodal", title: "Modal" },
            { id: "fexpandablepanel", title: "Expanderbar panel" },
            { id: "ftable", title: "Tabell" },
            { id: "fdefinitionlist", title: "Definitionslista" },
        ],
    },
    {
        slug: "modaler",
        title: "Modaler och dialoger",
        anchors: [],
    },
    {
        slug: "navigation",
        title: "Navigation och layout",
        anchors: [],
    },
    {
        slug: "tabeller",
        title: "Tabeller och data",
        anchors: [],
    },
    {
        slug: "aterkoppling",
        title: "Återkoppling och status",
        anchors: [],
    },
    {
        slug: "wizard",
        title: "Stegvisa flöden",
        anchors: [],
    },
    {
        slug: "css",
        title: "Endast CSS",
        anchors: [],
    },
];

export function findView(slug: string): NavView | undefined {
    return views.find((view) => view.slug === slug);
}
