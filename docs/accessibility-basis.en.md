# Accessibility statement basis

*This document is also available in Swedish: [accessibility-basis.sv.md](accessibility-basis.sv.md).*

This document is the basis a consumer can lift into their own accessibility
statement: what felix-ds actually proves about the components it themes, no
more. The [Tillgänglighet view](https://pattespatte.github.io/felix-ds/#/tillganglighet) in the
playground shows the same coverage live.

## What the evidence is

- Every playground view is scanned with axe in both color modes, and the
  search field's open dropdown is scanned separately – 32 scans per
  run (15 views × 2 color modes + 2). Zero violations is a
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
screen reader behavior, content language and structure need human review,
as does the consumer's own usage. Behavior, roles and keyboard support
belong to the FKUI components themselves; felix-ds changes presentation
only. Map the evidence onto the framework your statement uses, and test
your own site.

## Text to lift

Replace `[Component]` with the component's name:

> [Component] is themed by felix-ds and demonstrated in the felix-ds public
> demo playground in both color modes (light and dark). Every felix-ds
> release passes automated accessibility scans (axe) of every playground
> view in both color modes, with zero violations as the condition, and the
> views demonstrating the component are part of those scans. The basis
> covers the automated share only: the component's behavior, roles and
> keyboard support come from FKUI and require manual review, as does the
> adopting site's own content and usage.

## Per component

All 70 FKUI components the playground demonstrates, with the
views exercising each one:

| Component | Demonstrated in |
| --- | --- |
| FBadge | [Återkoppling och status](https://pattespatte.github.io/felix-ds/#/aterkoppling/fbadge) |
| FBankAccountNumberTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/fbankaccountnumbertextfield) |
| FBankgiroTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/fbankgirotextfield) |
| FButton | [Knappar och ikoner](https://pattespatte.github.io/felix-ds/#/knappar/fbutton) |
| FCalendar | [Datum och kalender](https://pattespatte.github.io/felix-ds/#/kalender/fcalendar) |
| FCalendarDay | [Datum och kalender](https://pattespatte.github.io/felix-ds/#/kalender/fcalendar) |
| FCard | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor/fcard) |
| FCheckboxField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/fcheckboxfield) |
| FClearingnumberTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/fclearingnumbertextfield) |
| FConfirmModal | [Modaler och dialoger](https://pattespatte.github.io/felix-ds/#/modaler/fconfirmmodal) |
| FContextMenu | [Modaler och dialoger](https://pattespatte.github.io/felix-ds/#/modaler/fcontextmenu) |
| FCrudButton | [Knappar och ikoner](https://pattespatte.github.io/felix-ds/#/knappar/fcrudbutton) |
| FCrudDataset | [Tabeller och data](https://pattespatte.github.io/felix-ds/#/tabeller/fcruddataset) |
| FCurrencyTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/fcurrencytextfield) |
| FDataTable | [Tabeller och data](https://pattespatte.github.io/felix-ds/#/tabeller/fdatatable) |
| FDatepickerField | [Datum och kalender](https://pattespatte.github.io/felix-ds/#/kalender/fdatepickerfield) |
| FDefinitionList | [Tabeller och data](https://pattespatte.github.io/felix-ds/#/tabeller/fdefinitionlist) |
| FDetailsPanel | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor/fdetailspanel) |
| FDialogueTree | [Modaler och dialoger](https://pattespatte.github.io/felix-ds/#/modaler/fdialoguetree) |
| FEmailTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/femailtextfield) |
| FErrorList | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/ferrorlist) |
| FExpand | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor/fexpand) |
| FExpandablePanel | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor/fexpandablepanel) |
| FExpandableParagraph | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor/fexpandableparagraph) |
| FFieldset | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/ffieldset) |
| FFileItem | [Filer](https://pattespatte.github.io/felix-ds/#/filer/ffileitem) |
| FFileSelector | [Filer](https://pattespatte.github.io/felix-ds/#/filer/ffileselector) |
| FFixedPane | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor/ffixedpane) |
| FFormModal | [Modaler och dialoger](https://pattespatte.github.io/felix-ds/#/modaler/fformmodal) |
| FFormModalAction | [Modaler och dialoger](https://pattespatte.github.io/felix-ds/#/modaler/fformmodal) |
| FIcon | [Knappar och ikoner](https://pattespatte.github.io/felix-ds/#/knappar/ficon) |
| FInteractiveTable | [Tabeller och data](https://pattespatte.github.io/felix-ds/#/tabeller/finteractivetable) |
| FLabel | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/flabel) |
| FLayoutRightPanel | [Navigation och layout](https://pattespatte.github.io/felix-ds/#/navigation/flayoutrightpanel) |
| FList | [Tabeller och data](https://pattespatte.github.io/felix-ds/#/tabeller/flist) |
| FLoader | [Återkoppling och status](https://pattespatte.github.io/felix-ds/#/aterkoppling/floader) |
| FLogo | [Knappar och ikoner](https://pattespatte.github.io/felix-ds/#/knappar/flogo) |
| FMessageBox | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor/fmessagebox) |
| FMinimizablePanel | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor/fminimizablepanel) |
| FModal | [Modaler och dialoger](https://pattespatte.github.io/felix-ds/#/modaler/fmodal) |
| FNavigationMenu | [Navigation och layout](https://pattespatte.github.io/felix-ds/#/navigation/fnavigationmenu) |
| FNumericTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/fnumerictextfield) |
| FOffline | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor/foffline) |
| FOrganisationsnummerTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/forganisationsnummertextfield) |
| FOutputField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/foutputfield) |
| FPageLayout | [Navigation och layout](https://pattespatte.github.io/felix-ds/#/navigation/fpagelayout) |
| FPaginateDataset | [Tabeller och data](https://pattespatte.github.io/felix-ds/#/tabeller/fpaginatedataset) |
| FPaginator | [Tabeller och data](https://pattespatte.github.io/felix-ds/#/tabeller/fpaginator) |
| FPercentTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/fpercenttextfield) |
| FPersonnummerTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/fpersonnummertextfield) |
| FPhoneTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/fphonetextfield) |
| FPlusgiroTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/fplusgirotextfield) |
| FPostalCodeTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/fpostalcodetextfield) |
| FProgressbar | [Återkoppling och status](https://pattespatte.github.io/felix-ds/#/aterkoppling/fprogressbar) |
| FRadioField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/fradiofield) |
| FResizePane | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor/fresizepane) |
| FSearchTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/fsearchtextfield) |
| FSelectField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/fselectfield) |
| FSortFilterDataset | [Tabeller och data](https://pattespatte.github.io/felix-ds/#/tabeller/fsortfilterdataset) |
| FStaticField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/fstaticfield) |
| FTable | [Tabeller och data](https://pattespatte.github.io/felix-ds/#/tabeller/ftable) |
| FTextField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/ftextfield) |
| FTextareaField | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/ftextareafield) |
| FTooltip | [Ytor och paneler](https://pattespatte.github.io/felix-ds/#/ytor/ftooltip) |
| FValidationForm | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/fvalidationform) |
| FValidationFormAction | [Modaler och dialoger](https://pattespatte.github.io/felix-ds/#/modaler/fformmodal) |
| FValidationGroup | [Formulär](https://pattespatte.github.io/felix-ds/#/formular/fvalidationform) |
| FWizard | [Stegvisa flöden](https://pattespatte.github.io/felix-ds/#/wizard/fwizard) |
| FWizardStep | [Stegvisa flöden](https://pattespatte.github.io/felix-ds/#/wizard/fwizard) |
| FWizardStepAction | [Stegvisa flöden](https://pattespatte.github.io/felix-ds/#/wizard/fwizard) |

## How this file is generated

Generated by `scripts/accessibility-basis.ts` (`bun run
accessibility:build`) from `playground/src/accessibilityData.ts` and
verified by `scripts/accessibility-basis.test.ts`: a committed file that
no longer matches the data fails the parity test, exactly like the
prebuilt CSS.
