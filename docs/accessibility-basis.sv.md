# Underlag för tillgänglighetsredogörelse

Det här dokumentet är underlaget som en konsument kan lyfta in i sin egen
tillgänglighetsredogörelse: vad felix-ds faktiskt bevisar om de komponenter
det tematiserar, och inget mer. Vyn
[Tillgänglighet](https://pattespatte.github.io/felix-ds/#/tillganglighet) i playgrounden visar
samma täckning live.

## Vad underlaget bygger på

- Varje vy i playgrounden scannas med axe i båda färglägena, och sökfältets
  öppna listruta scannas separat – 32 scanningar per körning
  (15 vyer × 2 färglägen + 2). Noll överträdelser är ett
  villkor för varje utgivning av paketet, och inga axe-regler är avstängda.
- Täckningsdata bakom tabellen nedan härleds maskinellt ur demosviten och
  hålls ärlig av fullständighetstester, så tabellen kan inte glida isär från
  vad playgrounden faktiskt demonstrerar.
- Beviset överförs per komponent: vyerna i tabellen är de som demonstrerar
  komponenten, och de omfattas av varje utgivnings skanning.

## Vad underlaget inte är

Automatiserade verktyg fångar vanligen omkring en tredjedel av WCAG:s
efterlevnadskriterier. Underlaget gör inga efterlevnadsanspråk – mot WCAG
2.x, EN 301 549 eller något annat ramverk – och påstår ingen manuell
testning. Tangentbordsordning, skärmläsarbeteende, innehållets språk och
struktur kräver manuell granskning, liksom konsumentens egen användning.
Beteende, roller och tangentbordsstöd hör till FKUI:s komponenter; felix-ds
ändrar bara presentationen. Avbilda beviset på det ramverk din redogörelse
använder, och testa din egen webbplats.

## Text att lyfta

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
vyerna som övar var och en:

| Komponent | Visas i |
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

## Hur den här filen genereras

Genereras av `scripts/accessibility-basis.ts` (`bun run
accessibility:build`) ur `playground/src/accessibilityData.ts` och
kontrolleras av `scripts/accessibility-basis.test.ts`: en committad fil
som inte längre matchar datan fäller paritetstestet, på samma sätt som den
förbyggda css:en.
