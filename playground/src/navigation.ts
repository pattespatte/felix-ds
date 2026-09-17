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
        anchors: [{ id: "fvalideringsform", title: "Valideringsformulär" }],
    },
    {
        slug: "kalender",
        title: "Datum och kalender",
        anchors: [],
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
