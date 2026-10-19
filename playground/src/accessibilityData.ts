// Per-component accessibility coverage for the Tillgänglighet view: which
// playground view demos each FKUI component, so the coverage table can link
// readers to where a component is exercised in both color modes.
//
// Derived mechanically from the demo SFCs (the ComponentHeading :names props
// and the demo sections' navigation anchor ids) – not hand-typed. Kept honest
// by scripts/accessibility-data.test.ts, which fails when a component is
// missing from the data, is renamed, or points at a view that no longer
// exists. Pattern: componentStatus.ts.

import type { FkuiComponentName } from "./fkuiComponentLinks";

export interface ComponentAccessibility {
    /** Playground view slugs where the component's demo appears. */
    views: string[];
}

export const componentAccessibility: Record<FkuiComponentName, ComponentAccessibility> = {
    FBankAccountNumberTextField: { views: ["formular"] },
    FBadge: { views: ["aterkoppling"] },
    FBankgiroTextField: { views: ["formular"] },
    FButton: { views: ["knappar"] },
    FCalendar: { views: ["kalender"] },
    FCalendarDay: { views: ["kalender"] },
    FCard: { views: ["ytor"] },
    FCheckboxField: { views: ["formular"] },
    FClearingnumberTextField: { views: ["formular"] },
    FConfirmModal: { views: ["modaler"] },
    FContextMenu: { views: ["modaler"] },
    FCrudButton: { views: ["knappar"] },
    FCrudDataset: { views: ["tabeller"] },
    FCurrencyTextField: { views: ["formular"] },
    FDataTable: { views: ["tabeller"] },
    FDatepickerField: { views: ["kalender"] },
    FDefinitionList: { views: ["tabeller"] },
    FDetailsPanel: { views: ["ytor"] },
    FDialogueTree: { views: ["modaler"] },
    FEmailTextField: { views: ["formular"] },
    FErrorList: { views: ["formular"] },
    FExpand: { views: ["ytor"] },
    FExpandablePanel: { views: ["ytor"] },
    FExpandableParagraph: { views: ["ytor"] },
    FFieldset: { views: ["formular"] },
    FFileItem: { views: ["filer"] },
    FFileSelector: { views: ["filer"] },
    FFixedPane: { views: ["ytor"] },
    FFormModal: { views: ["modaler"] },
    FFormModalAction: { views: ["modaler"] },
    FIcon: { views: ["knappar"] },
    FInteractiveTable: { views: ["tabeller"] },
    FLabel: { views: ["formular"] },
    FLayoutRightPanel: { views: ["navigation"] },
    FList: { views: ["tabeller"] },
    FLoader: { views: ["aterkoppling"] },
    FLogo: { views: ["knappar"] },
    FMessageBox: { views: ["ytor"] },
    FMinimizablePanel: { views: ["ytor"] },
    FModal: { views: ["modaler"] },
    FNavigationMenu: { views: ["navigation"] },
    FNumericTextField: { views: ["formular"] },
    FOffline: { views: ["ytor"] },
    FOrganisationsnummerTextField: { views: ["formular"] },
    FOutputField: { views: ["formular"] },
    FPaginateDataset: { views: ["tabeller"] },
    FPaginator: { views: ["tabeller"] },
    FPageLayout: { views: ["navigation"] },
    FPercentTextField: { views: ["formular"] },
    FPersonnummerTextField: { views: ["formular"] },
    FPhoneTextField: { views: ["formular"] },
    FPlusgiroTextField: { views: ["formular"] },
    FPostalCodeTextField: { views: ["formular"] },
    FProgressbar: { views: ["aterkoppling"] },
    FRadioField: { views: ["formular"] },
    FResizePane: { views: ["ytor"] },
    FSearchTextField: { views: ["formular"] },
    FSelectField: { views: ["formular"] },
    FSortFilterDataset: { views: ["tabeller"] },
    FStaticField: { views: ["formular"] },
    FTable: { views: ["tabeller"] },
    FTextField: { views: ["formular"] },
    FTextareaField: { views: ["formular"] },
    FTooltip: { views: ["ytor"] },
    FValidationForm: { views: ["formular"] },
    FValidationFormAction: { views: ["modaler"] },
    FValidationGroup: { views: ["formular"] },
    FWizard: { views: ["wizard"] },
    FWizardStep: { views: ["wizard"] },
    FWizardStepAction: { views: ["wizard"] },
};
