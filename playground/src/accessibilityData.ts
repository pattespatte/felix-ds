// Per-component accessibility coverage for the Tillgänglighet view: which
// playground view demo exercises each FKUI component, so the coverage table
// can link readers to the exact demo section – in both color modes.
//
// Every entry is a "slug/anchor" string: the playground view slug plus the
// navigation anchor id of the demo section that shows the component (the
// ids come from navigation.ts – the same ids the hash router deep-links to,
// e.g. "formular/ftextfield" → #/formular/ftextfield). A component without
// a single demo section of its own points at the section that contains it;
// only a view-wide component would point at the bare slug.
//
// Kept honest by scripts/accessibility-data.test.ts, which fails when a
// component is missing from the data, is renamed, or points at a view or
// anchor that no longer exists. Pattern: componentStatus.ts.

import type { FkuiComponentName } from "./fkuiComponentLinks";

export interface ComponentAccessibility {
    /** "slug/anchor" deep links into the playground views that demo the component. */
    views: string[];
}

export const componentAccessibility: Record<FkuiComponentName, ComponentAccessibility> = {
    FBankAccountNumberTextField: { views: ["formular/fbankaccountnumbertextfield"] },
    FBadge: { views: ["aterkoppling/fbadge"] },
    FBankgiroTextField: { views: ["formular/fbankgirotextfield"] },
    FButton: { views: ["knappar/fbutton"] },
    FCalendar: { views: ["kalender/fcalendar"] },
    FCalendarDay: { views: ["kalender/fcalendar"] },
    FCard: { views: ["ytor/fcard"] },
    FCheckboxField: { views: ["formular/fcheckboxfield"] },
    FClearingnumberTextField: { views: ["formular/fclearingnumbertextfield"] },
    FConfirmModal: { views: ["modaler/fconfirmmodal"] },
    FContextMenu: { views: ["modaler/fcontextmenu"] },
    FCrudButton: { views: ["knappar/fcrudbutton"] },
    FCrudDataset: { views: ["tabeller/fcruddataset"] },
    FCurrencyTextField: { views: ["formular/fcurrencytextfield"] },
    FDataTable: { views: ["tabeller/fdatatable"] },
    FDatepickerField: { views: ["kalender/fdatepickerfield"] },
    FDefinitionList: { views: ["tabeller/fdefinitionlist"] },
    FDetailsPanel: { views: ["ytor/fdetailspanel"] },
    FDialogueTree: { views: ["modaler/fdialoguetree"] },
    FEmailTextField: { views: ["formular/femailtextfield"] },
    FErrorList: { views: ["formular/ferrorlist"] },
    FExpand: { views: ["ytor/fexpand"] },
    FExpandablePanel: { views: ["ytor/fexpandablepanel"] },
    FExpandableParagraph: { views: ["ytor/fexpandableparagraph"] },
    FFieldset: { views: ["formular/ffieldset"] },
    FFileItem: { views: ["filer/ffileitem"] },
    FFileSelector: { views: ["filer/ffileselector"] },
    FFixedPane: { views: ["ytor/ffixedpane"] },
    FFormModal: { views: ["modaler/fformmodal"] },
    FFormModalAction: { views: ["modaler/fformmodal"] },
    FIcon: { views: ["knappar/ficon"] },
    FInteractiveTable: { views: ["tabeller/finteractivetable"] },
    FLabel: { views: ["formular/flabel"] },
    FLayoutRightPanel: { views: ["navigation/flayoutrightpanel"] },
    FList: { views: ["tabeller/flist"] },
    FLoader: { views: ["aterkoppling/floader"] },
    FLogo: { views: ["knappar/flogo"] },
    FMessageBox: { views: ["ytor/fmessagebox"] },
    FMinimizablePanel: { views: ["ytor/fminimizablepanel"] },
    FModal: { views: ["modaler/fmodal"] },
    FNavigationMenu: { views: ["navigation/fnavigationmenu"] },
    FNumericTextField: { views: ["formular/fnumerictextfield"] },
    FOffline: { views: ["ytor/foffline"] },
    FOrganisationsnummerTextField: { views: ["formular/forganisationsnummertextfield"] },
    FOutputField: { views: ["formular/foutputfield"] },
    FPaginateDataset: { views: ["tabeller/fpaginatedataset"] },
    FPaginator: { views: ["tabeller/fpaginator"] },
    FPageLayout: { views: ["navigation/fpagelayout"] },
    FPercentTextField: { views: ["formular/fpercenttextfield"] },
    FPersonnummerTextField: { views: ["formular/fpersonnummertextfield"] },
    FPhoneTextField: { views: ["formular/fphonetextfield"] },
    FPlusgiroTextField: { views: ["formular/fplusgirotextfield"] },
    FPostalCodeTextField: { views: ["formular/fpostalcodetextfield"] },
    FProgressbar: { views: ["aterkoppling/fprogressbar"] },
    FRadioField: { views: ["formular/fradiofield"] },
    FResizePane: { views: ["ytor/fresizepane"] },
    FSearchTextField: { views: ["formular/fsearchtextfield"] },
    FSelectField: { views: ["formular/fselectfield"] },
    FSortFilterDataset: { views: ["tabeller/fsortfilterdataset"] },
    FStaticField: { views: ["formular/fstaticfield"] },
    FTable: { views: ["tabeller/ftable"] },
    FTextField: { views: ["formular/ftextfield"] },
    FTextareaField: { views: ["formular/ftextareafield"] },
    FTooltip: { views: ["ytor/ftooltip"] },
    FValidationForm: { views: ["formular/fvalidationform"] },
    FValidationFormAction: { views: ["modaler/fformmodal"] },
    FValidationGroup: { views: ["formular/fvalidationform"] },
    FWizard: { views: ["wizard/fwizard"] },
    FWizardStep: { views: ["wizard/fwizard"] },
    FWizardStepAction: { views: ["wizard/fwizard"] },
};
