# Accessibility statement basis

This document is the basis a consumer can lift into their own accessibility
statement: what felix-ds actually proves about the components it themes, no
more. The [Tillgänglighet view](https://pattespatte.github.io/felix-ds/#/tillganglighet) in the
playground shows the same coverage live.

## What the evidence is

- Every playground view is scanned with axe in both colour modes, and the
  search field's open dropdown is scanned separately – 32 scans per
  run (15 views × 2 colour modes + 2). Zero violations is a
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

Replace `[Component]` with the component's name:

> [Component] is themed by felix-ds and demonstrated in the felix-ds public
> demo playground in both colour modes (light and dark). Every felix-ds
> release passes automated accessibility scans (axe) of every playground
> view in both colour modes, with zero violations as the condition, and the
> views demonstrating the component are part of those scans. The basis
> covers the automated share only: the component's behaviour, roles and
> keyboard support come from FKUI and require manual review, as does the
> adopting site's own content and usage.

## Per component

All 70 FKUI components the playground demonstrates, with the
views exercising each one:

| Component | Demonstrated in |
| --- | --- |
| FBadge | [Återkoppling och status](https://pattespatte.github.io/felix-ds/#/aterkoppling) |
| FBankAccountNumberTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FBankgiroTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FButton | [Knappar och ikoner](https://pattespatte.github.io/felix-ds/#/knappar) |
| FCalendar | [Datum och kalender](https://pattespatte.github.io/felix-ds/#/kalender) |
| FCalendarDay | [Datum och kalender](https://pattespatte.github.io/felix-ds/#/kalender) |
| FCard | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor) |
| FCheckboxField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FClearingnumberTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FConfirmModal | [Modaler och dialoger](https://pattespatte.github.io/felix-ds/#/modaler) |
| FContextMenu | [Modaler och dialoger](https://pattespatte.github.io/felix-ds/#/modaler) |
| FCrudButton | [Knappar och ikoner](https://pattespatte.github.io/felix-ds/#/knappar) |
| FCrudDataset | [Tabeller och data](https://pattespatte.github.io/felix-ds/#/tabeller) |
| FCurrencyTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FDataTable | [Tabeller och data](https://pattespatte.github.io/felix-ds/#/tabeller) |
| FDatepickerField | [Datum och kalender](https://pattespatte.github.io/felix-ds/#/kalender) |
| FDefinitionList | [Tabeller och data](https://pattespatte.github.io/felix-ds/#/tabeller) |
| FDetailsPanel | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor) |
| FDialogueTree | [Modaler och dialoger](https://pattespatte.github.io/felix-ds/#/modaler) |
| FEmailTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FErrorList | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FExpand | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor) |
| FExpandablePanel | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor) |
| FExpandableParagraph | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor) |
| FFieldset | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FFileItem | [Filer](https://pattespatte.github.io/felix-ds/#/filer) |
| FFileSelector | [Filer](https://pattespatte.github.io/felix-ds/#/filer) |
| FFixedPane | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor) |
| FFormModal | [Modaler och dialoger](https://pattespatte.github.io/felix-ds/#/modaler) |
| FFormModalAction | [Modaler och dialoger](https://pattespatte.github.io/felix-ds/#/modaler) |
| FIcon | [Knappar och ikoner](https://pattespatte.github.io/felix-ds/#/knappar) |
| FInteractiveTable | [Tabeller och data](https://pattespatte.github.io/felix-ds/#/tabeller) |
| FLabel | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FLayoutRightPanel | [Navigation och layout](https://pattespatte.github.io/felix-ds/#/navigation) |
| FList | [Tabeller och data](https://pattespatte.github.io/felix-ds/#/tabeller) |
| FLoader | [Återkoppling och status](https://pattespatte.github.io/felix-ds/#/aterkoppling) |
| FLogo | [Knappar och ikoner](https://pattespatte.github.io/felix-ds/#/knappar) |
| FMessageBox | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor) |
| FMinimizablePanel | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor) |
| FModal | [Modaler och dialoger](https://pattespatte.github.io/felix-ds/#/modaler) |
| FNavigationMenu | [Navigation och layout](https://pattespatte.github.io/felix-ds/#/navigation) |
| FNumericTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FOffline | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor) |
| FOrganisationsnummerTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FOutputField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FPageLayout | [Navigation och layout](https://pattespatte.github.io/felix-ds/#/navigation) |
| FPaginateDataset | [Tabeller och data](https://pattespatte.github.io/felix-ds/#/tabeller) |
| FPaginator | [Tabeller och data](https://pattespatte.github.io/felix-ds/#/tabeller) |
| FPercentTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FPersonnummerTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FPhoneTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FPlusgiroTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FPostalCodeTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FProgressbar | [Återkoppling och status](https://pattespatte.github.io/felix-ds/#/aterkoppling) |
| FRadioField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FResizePane | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor) |
| FSearchTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FSelectField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FSortFilterDataset | [Tabeller och data](https://pattespatte.github.io/felix-ds/#/tabeller) |
| FStaticField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FTable | [Tabeller och data](https://pattespatte.github.io/felix-ds/#/tabeller) |
| FTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FTextareaField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FTooltip | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor) |
| FValidationForm | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FValidationFormAction | [Modaler och dialoger](https://pattespatte.github.io/felix-ds/#/modaler) |
| FValidationGroup | [Formulär](https://pattespatte.github.io/felix-ds/#/formular) |
| FWizard | [Stegvisa flöden](https://pattespatte.github.io/felix-ds/#/wizard) |
| FWizardStep | [Stegvisa flöden](https://pattespatte.github.io/felix-ds/#/wizard) |
| FWizardStepAction | [Stegvisa flöden](https://pattespatte.github.io/felix-ds/#/wizard) |

## How this file is generated

Generated by `scripts/accessibility-basis.ts` (`bun run
accessibility:build`) from `playground/src/accessibilityData.ts` and
verified by `scripts/accessibility-basis.test.ts`: a committed file that
no longer matches the data fails the parity test, exactly like the
prebuilt CSS.
