// Per-component status badges for the demo headings and the component
// guide, mirroring the reference profile's component pages (the "Status"
// entry on each documentation page).
//
// Source of truth: the status frontmatter of the upstream component
// documentation (docs/components/**/*.md in the read-only reference
// checkout). The statuses used there are "Produktionsklar",
// "Experimentell" (labs X-components only, none documented here) and
// "Deprekerad". The deprecated entries below match the @deprecated
// markers in the installed @fkui/vue package (list them with
// `bun run fkui components:status`); when a component's status changes,
// edit its entry here.
//
// cssPatternStatuses covers the hand-written CSS/SCSS demo sections whose
// names are not Vue components in fkuiComponentLinks. Chip, anchor,
// entrypoint, combobox and file-uploader have documentation pages with a
// status; indent, selectable item and close button have no documentation
// page but ship in the production CSS package, so they carry the same
// status.

import { fkuiComponentLinks, type FkuiComponentName } from "./fkuiComponentLinks";

export interface ComponentStatus {
    /** Badge text, Swedish like the reference profile. */
    label: string;
    /** Upstream badge variant; rendered as .badge--<variant>-inverted. */
    variant: "default" | "success" | "warning" | "error" | "info";
}

const PRODUCTION_READY: ComponentStatus = {
    label: "Produktionsklar",
    variant: "success",
};

const DEPRECATED: ComponentStatus = {
    label: "Deprekerad",
    variant: "error",
};

export const componentStatuses: Record<FkuiComponentName, ComponentStatus> = {
    FBankAccountNumberTextField: PRODUCTION_READY,
    FBadge: PRODUCTION_READY,
    FBankgiroTextField: PRODUCTION_READY,
    FButton: PRODUCTION_READY,
    FCalendar: PRODUCTION_READY,
    FCalendarDay: PRODUCTION_READY,
    FCard: PRODUCTION_READY,
    FCheckboxField: PRODUCTION_READY,
    FClearingnumberTextField: PRODUCTION_READY,
    FConfirmModal: PRODUCTION_READY,
    FContextMenu: PRODUCTION_READY,
    FCrudButton: DEPRECATED,
    FCrudDataset: PRODUCTION_READY,
    FCurrencyTextField: PRODUCTION_READY,
    FDataTable: DEPRECATED,
    FDatepickerField: PRODUCTION_READY,
    FDefinitionList: PRODUCTION_READY,
    FDetailsPanel: PRODUCTION_READY,
    FDialogueTree: PRODUCTION_READY,
    FEmailTextField: PRODUCTION_READY,
    FErrorList: PRODUCTION_READY,
    FExpand: PRODUCTION_READY,
    FExpandablePanel: PRODUCTION_READY,
    FExpandableParagraph: PRODUCTION_READY,
    FFieldset: PRODUCTION_READY,
    FFileItem: PRODUCTION_READY,
    FFileSelector: PRODUCTION_READY,
    FFixedPane: PRODUCTION_READY,
    FFormModal: PRODUCTION_READY,
    FFormModalAction: PRODUCTION_READY,
    FIcon: PRODUCTION_READY,
    FInteractiveTable: DEPRECATED,
    FLabel: PRODUCTION_READY,
    FLayoutRightPanel: PRODUCTION_READY,
    FList: PRODUCTION_READY,
    FLoader: PRODUCTION_READY,
    FLogo: PRODUCTION_READY,
    FMessageBox: PRODUCTION_READY,
    FMinimizablePanel: PRODUCTION_READY,
    FModal: PRODUCTION_READY,
    FNavigationMenu: PRODUCTION_READY,
    FNumericTextField: PRODUCTION_READY,
    FOffline: PRODUCTION_READY,
    FOrganisationsnummerTextField: PRODUCTION_READY,
    FOutputField: PRODUCTION_READY,
    FPaginateDataset: PRODUCTION_READY,
    FPaginator: PRODUCTION_READY,
    FPageLayout: PRODUCTION_READY,
    FPercentTextField: PRODUCTION_READY,
    FPersonnummerTextField: PRODUCTION_READY,
    FPhoneTextField: PRODUCTION_READY,
    FPlusgiroTextField: PRODUCTION_READY,
    FPostalCodeTextField: PRODUCTION_READY,
    FProgressbar: PRODUCTION_READY,
    FRadioField: PRODUCTION_READY,
    FResizePane: PRODUCTION_READY,
    FSearchTextField: PRODUCTION_READY,
    FSelectField: PRODUCTION_READY,
    FSortFilterDataset: PRODUCTION_READY,
    FStaticField: PRODUCTION_READY,
    FTable: PRODUCTION_READY,
    FTextField: PRODUCTION_READY,
    FTextareaField: PRODUCTION_READY,
    FTooltip: PRODUCTION_READY,
    FValidationForm: PRODUCTION_READY,
    FValidationFormAction: PRODUCTION_READY,
    FValidationGroup: PRODUCTION_READY,
    FWizard: PRODUCTION_READY,
    FWizardStep: PRODUCTION_READY,
    FWizardStepAction: PRODUCTION_READY,
};

/** Statuses for the hand-written CSS/SCSS demo sections (plain names). */
export const cssPatternStatuses = {
    chip: PRODUCTION_READY,
    indent: PRODUCTION_READY,
    combobox: PRODUCTION_READY,
    closeButton: PRODUCTION_READY,
    anchor: PRODUCTION_READY,
    selectableItem: PRODUCTION_READY,
    entrypoint: PRODUCTION_READY,
    fileUploader: PRODUCTION_READY,
} satisfies Record<string, ComponentStatus>;

/** Deduplicated statuses for a (possibly grouped) heading. */
export function statusesFor(names: readonly FkuiComponentName[]): ComponentStatus[] {
    const seen = new Set<string>();
    const unique: ComponentStatus[] = [];
    for (const name of names) {
        const status = componentStatuses[name];
        const key = `${status.variant} ${status.label}`;
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(status);
        }
    }
    return unique;
}
