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
        slug: "start",
        title: "Start",
        anchors: [
            { id: "om", title: "Om playgrounden" },
            { id: "komponenter", title: "Komponenter i playgrounden" },
        ],
    },
    {
        slug: "knappar",
        title: "Knappar och ikoner",
        anchors: [
            { id: "fbutton", title: "Knappar" },
            { id: "fcrudbutton", title: "CRUD-knappar" },
            { id: "ficon", title: "Ikoner" },
            { id: "flogo", title: "Logotyp" },
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
        anchors: [
            { id: "ffileselector", title: "Filväljare" },
            { id: "ffileitem", title: "Filrad" },
            { id: "file-uploader", title: "Uppladdning (CSS)" },
        ],
    },
    {
        slug: "ytor",
        title: "Ytor och paneler",
        anchors: [
            { id: "fcard", title: "Kort" },
            { id: "fexpand", title: "Expanderingsyta" },
            { id: "fexpandablepanel", title: "Expanderbar panel" },
            { id: "fexpandableparagraph", title: "Expanderbar paragraf" },
            { id: "fmessagebox", title: "Meddelanderutor" },
            { id: "ftooltip", title: "Tooltip" },
            { id: "fdetailspanel", title: "Detaljpanel" },
            { id: "fminimizablepanel", title: "Minimerbar panel" },
            { id: "ffixedpane", title: "Fast panel" },
            { id: "fresizepane", title: "Storleksändring" },
            { id: "foffline", title: "Nedkopplad" },
            { id: "ftable", title: "Tabell" },
            { id: "fdefinitionlist", title: "Definitionslista" },
        ],
    },
    {
        slug: "modaler",
        title: "Modaler och dialoger",
        anchors: [
            { id: "fmodal", title: "Modal" },
            { id: "fconfirmmodal", title: "Bekräftelsedialog" },
            { id: "fformmodal", title: "Formulärmodal" },
            { id: "fcontextmenu", title: "Snabbmeny" },
            { id: "fdialoguetree", title: "Frågeträd" },
        ],
    },
    {
        slug: "navigation",
        title: "Navigation och layout",
        anchors: [
            { id: "fnavigationmenu", title: "Navigeringsmeny" },
            { id: "fpagelayout", title: "Sidlayout" },
            { id: "flayoutrightpanel", title: "Högerpanel" },
        ],
    },
    {
        slug: "tabeller",
        title: "Tabeller och data",
        anchors: [],
    },
    {
        slug: "aterkoppling",
        title: "Återkoppling och status",
        anchors: [
            { id: "fbadge", title: "Brickor" },
            { id: "floader", title: "Snurra" },
            { id: "fprogressbar", title: "Förlopp" },
        ],
    },
    {
        slug: "wizard",
        title: "Stegvisa flöden",
        anchors: [{ id: "fwizard", title: "Wizard" }],
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
