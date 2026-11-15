# Underlag för tillgänglighetsredogörelse

*Det här dokumentet finns också på engelska: [accessibility-basis.en.md](accessibility-basis.en.md).*

Det här dokumentet är underlaget som en konsument kan lyfta in i sin egen
tillgänglighetsredogörelse: vad felix-ds faktiskt bevisar om de komponenter
det tematiserar, och inget mer. Vyn
[Tillgänglighet](https://pattespatte.github.io/felix-ds/#/tillganglighet) i playgrounden visar
samma täckning live.

## Vad underlaget bygger på

- Varje vy i playgrounden skannas med axe i båda färglägena, och sökfältets
  öppna listruta skannas separat – 32 skanningar per körning
  (15 vyer × 2 färglägen + 2). Noll överträdelser är ett
  villkor för varje utgivning av paketet, och inga axe-regler är avstängda.
- Täckningsdata bakom tabellen nedan härleds maskinellt ur demosviten och
  tester kontrollerar att den är fullständig, så att tabellen inte kan glida isär från
  vad playgrounden faktiskt demonstrerar.
- Beviset överförs per komponent: vyerna i tabellen är de som demonstrerar
  komponenten, och de omfattas av varje utgivnings skanning.

## Vad underlaget inte är

Automatiserade verktyg fångar vanligen omkring en tredjedel av WCAG:s
efterlevnadskriterier. Underlaget gör inga efterlevnadsanspråk. Det täcker
inte WCAG 2.x, EN 301 549 eller något annat ramverk, och det påstår ingen
manuell testning. Tangentbordsordning, skärmläsarbeteende, innehålets språk och
struktur kräver manuell granskning, liksom konsumentens egen användning.
Beteende, roller och tangentbordsstöd hör till FKUI:s komponenter. felix-ds
ändrar bara presentationen. Överför beviset till det ramverk din redogörelse
använder, och testa din egen webbplats.

## Text du kan kopiera till din redogörelse

Byt `[Komponent]` mot komponentens namn:

> [Komponent] tematiseras av felix-ds och demonstreras i felix-ds öppna
> demoplayground i båda färglägena (ljust och mörkt). Varje utgivning av
> felix-ds passerar automatiserade tillgänglighetsskanningar (axe) av varje
> playground-vy i båda färglägena, med noll överträdelser som villkor, och
> vyerna som demonstrerar komponenten omfattas av skanningarna. Underlaget
> täcker bara den automatiserade delen: komponentens beteende, roller och
> tangentbordsstöd kommer från FKUI och kräver manuell granskning, liksom
> den egna webbplatsens innehåll och användning.

## Per komponent

Alla 70 FKUI-komponenter som playgrounden demonstrerar, med
vyerna som visar var och en:

| Komponent | Visas i |
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

## Hur den här filen genereras

Genereras av `scripts/accessibility-basis.ts` (`bun run
accessibility:build`) ur `playground/src/accessibilityData.ts` och
kontrolleras av `scripts/accessibility-basis.test.ts`: en committad fil
som inte längre matchar datan misslyckas i paritetstestet, på samma sätt som den
förbyggda css:en.
