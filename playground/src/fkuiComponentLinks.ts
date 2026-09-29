// Single source of truth for the FKUI links in the demo headings: component
// name → paths relative to the documentation and source-code URL bases.
// ComponentHeading builds every href from these two bases; no full URL is
// hardcoded anywhere else.
//
// Neutrality exception (owner instruction 2026-09-29): the organisation's
// domain and name may appear exactly and only in the two URL bases below –
// never in link texts, comments, file names or any other file in this repo.

export const FKUI_DOCS_BASE =
    "https://designsystem.forsakringskassan.se/latest/components/";

export const FKUI_SOURCE_BASE =
    "https://github.com/Forsakringskassan/designsystem/tree/main/packages/vue/src/components/";

export interface FkuiComponentLink {
    /** Documentation page, relative to FKUI_DOCS_BASE. */
    docsPath: string;
    /** Source folder, relative to FKUI_SOURCE_BASE. */
    sourcePath: string;
}

export const fkuiComponentLinks = {
    FBankAccountNumberTextField: {
        docsPath: "input/textfield-specialized.html",
        sourcePath: "FTextField/extendedTextFields/FBankAccountNumberTextField",
    },
    FBadge: {
        docsPath: "fbadge.html",
        sourcePath: "FBadge",
    },
    FBankgiroTextField: {
        docsPath: "input/textfield-specialized.html",
        sourcePath: "FTextField/extendedTextFields/FBankgiroTextField",
    },
    FButton: {
        docsPath: "button.html",
        sourcePath: "FButton",
    },
    FCalendar: {
        docsPath: "fcalendar.html",
        sourcePath: "FCalendar",
    },
    FCalendarDay: {
        docsPath: "fcalendar.html",
        sourcePath: "FCalendar",
    },
    FCard: {
        docsPath: "fcard.html",
        sourcePath: "FCard",
    },
    FCheckboxField: {
        docsPath: "input/fcheckboxfield.html",
        sourcePath: "FCheckboxField",
    },
    FClearingnumberTextField: {
        docsPath: "input/textfield-specialized.html",
        sourcePath: "FTextField/extendedTextFields/FClearingnumberTextField",
    },
    FConfirmModal: {
        docsPath: "modal/fconfirmmodal.html",
        sourcePath: "FModal/FConfirmModal",
    },
    FContextMenu: {
        docsPath: "fcontextmenu.html",
        sourcePath: "FContextMenu",
    },
    FCrudButton: {
        docsPath: "table-and-list/fcruddataset.html",
        sourcePath: "FCrudDataset",
    },
    FCrudDataset: {
        docsPath: "table-and-list/fcruddataset.html",
        sourcePath: "FCrudDataset",
    },
    FCurrencyTextField: {
        docsPath: "input/textfield-specialized.html",
        sourcePath: "FTextField/extendedTextFields/FCurrencyTextField",
    },
    FDataTable: {
        docsPath: "table-and-list/table.html",
        sourcePath: "FDataTable",
    },
    FDatepickerField: {
        docsPath: "input/fdatepickerfield.html",
        sourcePath: "FDatepickerField",
    },
    FDefinitionList: {
        docsPath: "fdefinitionlist.html",
        sourcePath: "FDefinitionList",
    },
    FDetailsPanel: {
        docsPath: "page-layout/fdetailspanel.html",
        sourcePath: "FDetailsPanel",
    },
    FDialogueTree: {
        docsPath: "fdialoguetree.html",
        sourcePath: "FDialogueTree",
    },
    FEmailTextField: {
        docsPath: "input/textfield-specialized.html",
        sourcePath: "FTextField/extendedTextFields/FEmailTextField",
    },
    FErrorList: {
        docsPath: "validation/ferrorlist.html",
        sourcePath: "FErrorList",
    },
    FExpand: {
        docsPath: "expandable/fexpand.html",
        sourcePath: "FExpand",
    },
    FExpandablePanel: {
        docsPath: "expandable/fexpandablepanel.html",
        sourcePath: "FExpandablePanel",
    },
    FExpandableParagraph: {
        docsPath: "expandable/fexpandableparagraph.html",
        sourcePath: "FExpandableParagraph",
    },
    FFieldset: {
        docsPath: "group/ffieldset.html",
        sourcePath: "FFieldset",
    },
    FFileItem: {
        docsPath: "file-upload/ffileitem.html",
        sourcePath: "FFileItem",
    },
    FFileSelector: {
        docsPath: "file-upload/ffileselector.html",
        sourcePath: "FFileSelector",
    },
    FFixedPane: {
        docsPath: "page-layout/ffixedpane.html",
        sourcePath: "FFixedPane",
    },
    FFormModal: {
        docsPath: "modal/fformmodal.html",
        sourcePath: "FModal/FFormModal",
    },
    FFormModalAction: {
        docsPath: "modal/fformmodal.html",
        sourcePath: "FModal/FFormModal",
    },
    FIcon: {
        docsPath: "ficon.html",
        sourcePath: "FIcon",
    },
    FInteractiveTable: {
        docsPath: "table-and-list/table.html",
        sourcePath: "FInteractiveTable",
    },
    FLabel: {
        docsPath: "flabel.html",
        sourcePath: "FLabel",
    },
    FLayoutRightPanel: {
        docsPath: "page-layout/application-layout.html",
        sourcePath: "FLayoutRightPanel",
    },
    FList: {
        docsPath: "table-and-list/flist.html",
        sourcePath: "FList",
    },
    FLoader: {
        docsPath: "load/floader.html",
        sourcePath: "FLoader",
    },
    FLogo: {
        docsPath: "flogo.html",
        sourcePath: "FLogo",
    },
    FMessageBox: {
        docsPath: "fmessagebox.html",
        sourcePath: "FMessageBox",
    },
    FMinimizablePanel: {
        docsPath: "page-layout/fminimizablepanel.html",
        sourcePath: "FMinimizablePanel",
    },
    FModal: {
        docsPath: "modal/fmodal.html",
        sourcePath: "FModal",
    },
    FNavigationMenu: {
        docsPath: "page-layout/fnavigationmenu.html",
        sourcePath: "FNavigationMenu",
    },
    FNumericTextField: {
        docsPath: "input/textfield-specialized.html",
        sourcePath: "FTextField/extendedTextFields/FNumericTextField",
    },
    FOffline: {
        docsPath: "foffline.html",
        sourcePath: "FOffline",
    },
    FOrganisationsnummerTextField: {
        docsPath: "input/textfield-specialized.html",
        sourcePath: "FTextField/extendedTextFields/FOrganisationsnummerTextField",
    },
    FOutputField: {
        docsPath: "presentation/foutputfield.html",
        sourcePath: "FOutputField",
    },
    FPaginateDataset: {
        docsPath: "pagination.html",
        sourcePath: "FPaginateDataset",
    },
    FPaginator: {
        docsPath: "pagination.html",
        sourcePath: "FPaginator",
    },
    FPageLayout: {
        docsPath: "page-layout/fpagelayout.html",
        sourcePath: "FPageLayout",
    },
    FPercentTextField: {
        docsPath: "input/textfield-specialized.html",
        sourcePath: "FTextField/extendedTextFields/FPercentTextField",
    },
    FPersonnummerTextField: {
        docsPath: "input/textfield-specialized.html",
        sourcePath: "FTextField/extendedTextFields/FPersonnummerTextField",
    },
    FPhoneTextField: {
        docsPath: "input/textfield-specialized.html",
        sourcePath: "FTextField/extendedTextFields/FPhoneTextField",
    },
    FPlusgiroTextField: {
        docsPath: "input/textfield-specialized.html",
        sourcePath: "FTextField/extendedTextFields/FPlusgiroTextField",
    },
    FPostalCodeTextField: {
        docsPath: "input/textfield-specialized.html",
        sourcePath: "FTextField/extendedTextFields/FPostalCodeTextField",
    },
    FProgressbar: {
        docsPath: "load/fprogressbar.html",
        sourcePath: "FProgressbar",
    },
    FRadioField: {
        docsPath: "input/fradiofield.html",
        sourcePath: "FRadioField",
    },
    FResizePane: {
        docsPath: "page-layout/fresizepane.html",
        sourcePath: "FResizePane",
    },
    FSearchTextField: {
        docsPath: "input/textfield-specialized.html",
        sourcePath: "FTextField/extendedTextFields/FSearchTextField",
    },
    FSelectField: {
        docsPath: "input/fselectfield.html",
        sourcePath: "FSelectField",
    },
    FSortFilterDataset: {
        docsPath: "table-and-list/fsortfilterdataset.html",
        sourcePath: "FSortFilterDataset",
    },
    FStaticField: {
        docsPath: "presentation/fstaticfield.html",
        sourcePath: "FStaticField",
    },
    FTable: {
        docsPath: "table-and-list/table.html",
        sourcePath: "FTable",
    },
    FTextField: {
        docsPath: "input/ftextfield.html",
        sourcePath: "FTextField",
    },
    FTextareaField: {
        docsPath: "input/ftextareafield.html",
        sourcePath: "FTextareaField",
    },
    FTooltip: {
        docsPath: "ftooltip.html",
        sourcePath: "FTooltip",
    },
    FValidationForm: {
        docsPath: "validation/fvalidationform.html",
        sourcePath: "FValidationForm",
    },
    FValidationFormAction: {
        docsPath: "validation/fvalidationform.html",
        sourcePath: "FValidationForm",
    },
    FValidationGroup: {
        docsPath: "validation/fvalidationgroup.html",
        sourcePath: "FValidationGroup",
    },
    FWizard: {
        docsPath: "fwizard.html",
        sourcePath: "FWizard",
    },
    FWizardStep: {
        docsPath: "fwizard.html",
        sourcePath: "FWizard",
    },
    FWizardStepAction: {
        docsPath: "fwizard.html",
        sourcePath: "FWizard",
    },
} as const satisfies Record<string, FkuiComponentLink>;

export type FkuiComponentName = keyof typeof fkuiComponentLinks;
