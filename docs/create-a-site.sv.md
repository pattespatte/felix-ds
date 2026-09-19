# Skapa en webbplats med felix-ds

Den här guiden beskriver hur man bygger en komplett webbplats på felix-ds – FKUI:s publika npm-paket med felix-temat ovanpå. Den är skriven efter det mönster som bevisats på en fullständig demosajt (Vue 3 + TypeScript + Vite, 26 rutter, sök, prerendering och både ljust och mörkt läge), inte spekulativt.

Ett levande exempel på allt nedan finns i demosajten som konsumerar felix-ds som git-beroende.

## Förutsättningar

- Bun (pakethanterare och skriptkörare; npm fungerar som reserv)
- Node.js i aktuell version
- Grundläggande vana vid Vue 3 med `<script setup lang="ts">`, Vue Router och Vite

## Projektsetup

Skapa ett Vite-projekt med vue-ts-mallen och lägg till beroendena:

```bash
bun add vue vue-router@^4
bun add @fkui/vue@6.57.1 @fkui/design@6.57.1 @fkui/theme-default@6.57.1 @fkui/date@6.57.1 @fkui/logic@6.57.1 @fkui/icon-lib-default@6.57.1
bun add -d vite @vitejs/plugin-vue sass typescript vue-tsc @types/node
bun add felix-ds@github:pattespatte/felix-ds#<commit>
```

Tre saker är värda att känna till:

- **FKUI paket låses exakt.** Alla sex `@fkui/*`-paket pinas till samma exakta version (6.57.1 i skrivande stund), samma version felix-ds byggts och testats mot.
- **felix-ds konsumeras som git-beroende** så att bygget blir identiskt lokalt och i CI. Peka på en specifik commit, inte en gren.
- **Git-beroendet innehåller bara `src/`.** Byggprodukten `dist/felix.css` är gitignorad i temarepot och följer därför inte med – konsumera SCSS-källorna under `felix-ds/src/`, vilket ändå är det enda som stödjer mörkt läge (se nästa avsnitt).

I `vite.config.ts` behövs två saker utöver vue-pluginen: en `@`-alias till `./src` och `isCustomElement: (tag) => tag.startsWith("ce-")`, eftersom FKUI registrerar sina egna custom elements (ce-page-layout med flera) i runtime.

## Temaintegration

Appens ingångspunkt laddar FKUI:s komponent-CSS först:

```ts
import "@fkui/icon-lib-default/dist/f";
import "@fkui/design/lib/fkui.css";
import "@fkui/design/lib/fonts.css";
import "./assets/main.scss";
import "./fkui-patches";
```

Själva temat appliceras i `main.scss` med det dokumenterade scoped mixin-paret. Varje scope emitterar den kompletta tokensytan och specificitetsstegen (`:root` (0,1,0) < `html[data-color-mode="dark"]` (0,1,1)) löser båda lägena utan `!important`:

```scss
@use "felix-ds/src/fonts/fonts";
@use "felix-ds/src/theme/default" as felix with (
    $global: false
);

:root {
    @include felix.light;
}

html[data-color-mode="dark"] {
    @include felix.dark;
}
```

Varför inte de enklare ingångarna? Den globala `@use "felix-ds/src/index"` och den färdigbyggda `dist/felix.css` emitterar båda endast det ljusa temat hårdkodat på `:root` – de kan inte uttrycka det attributstyrda mörka scopet. Mixinerna `felix.light` och `felix.dark` deklarerar dessutom `color-scheme` per läge, så nativa kontroller och rullistor följer med automatiskt. Konfigurera aldrig `@fkui/theme-default` själv i konsumenten – felix-modulen konfigurerar redan sin egen load av den, och en dubbel konfiguration kolliderar.

Egen layout-SCSS skrivs med tokens endast – `--fkds-*` och `--f-*` – utan råa hexvärden. Då flippar varje egen yta (kort, paneler, tabellistriper) med färgläget gratis, och kontrasten i mörkt läge blir aldrig halvhandgjord. Dimensioner (marginaler, brytpunkter) är förstås vanliga remvärden.

## Typsnitt

Temat self-hostar alla typsnitt: Noto Sans för brödtext (400, 600 + kursiv) och Roboto Slab för rubriker, med fet stil mappad på vikt 600. `@use "felix-ds/src/fonts/fonts"` ger @font-face-reglerna med woff2-filer som Vite bundle:ar – inga CDN-anrop, inga Google Fonts, inga integritetsbrewer. Kontrollera gärna i bygget att `dist/assets/*.woff2` finns och att ingen `fonts.googleapis.com`-referens smugit sig in.

## Mörkt läge

Mönstret har tre delar som samverkar:

1. **En color-modul** (`color-mode.ts`) äger läget: den följer `prefers-color-scheme` tills användaren väljer explicit, persistar valet i localStorage under en egen nyckel, sätter eller tar bort `data-color-mode="dark"` på `<html>` och lyssnar på systembyten så länge inget explicit val finns.
2. **Ett inline-skript i `<head>`** kör samma logik innan första painten, så sidan aldrig blinkar i fel läge. Skriptet duplicerar modulens läsning av localStorage – håll nyckeln synkroniserad.
3. **En växlingsknapp** i sidhuvudet anropar modulens toggle. Sol/måne-gliferna får ritas för hand – standardbiblioteket har inga sådana ikoner.

Vänta dig ljusa snapshots vid prerendering: det statiska HTML:et byggs i ljust läge och det inline skriptet applicerar mörkt vid besök. Det är avsiktligt och räcker för en demo; en tjänst med krav på mörka snapshots behöver köra prerender i båda lägena.

## Ikoner

`@fkui/icon-lib-default` innehåller 31 ikoner (alert, arrow-down, arrow-in-circle, arrow-right, bars, bell, calendar, caret-down, caret-up, chevrons-left, circle, circle-notch-solid, close, cross, dash, doc, ellipsis, error, file, i, new-window, paper-clip, pdf, pen, pic, plus, search, sort, success, trashcan, triangle). Importera bibliteket en gång i ingångspunkten och rendera med `<f-icon name="...">`.

Ett rikt ikonbibliotek (Phosphor med flera) har ingen motsvarighet här – mappa semantiskt per användningsfall (kalender → calendar, sök → search, läkare/vård → cross) och låt dekorativa ikoner utan motsvarighet bli text i stället för att ge fel betydelse. Ikon-namnet är strängt: ett ogiltigt namn renderar tomt.

## Komponenter och layout

Några mönster som demosajten bevisat:

- **Navigeringsmeny med SPA-routing.** `FNavigationMenu` renderar ankare och dokumenterar själv mönstret: skicka rutter utan `href`, lyssna på `@selected-route` och anropa `router.push(key)`. Annars laddar om sidan hela sidan under history-routing. Den vertikala varianten (`vertical`) passar sekundärnavigering.
- **Rullgardinsmenyer.** `FContextMenu` är FKUI:s popup-meny: en knapprubrik med `aria-haspopup="menu"` som ankare, menyval med `label`/`key`, styrning via `:is-open` och `@select`/`@close`. Fullt tangentbordsstöd ingår.
- **Flikar.** FKUI 6.57 saknar en flikkomponent. Bygg en tunn app-komponent med WAI-ARIA-tabs-mönstret (tablist/tab/tabpanel, piltangenter) stylad med tokens – ett par hundra rader, och inget wrapperskikt i temarepot behövs.
- **Brödsmulor.** Finns inte heller dessa i FKUI; en tunn `<nav>` med ordnad lista, router-länkar och `aria-current="page"` räcker och blir rätt.
- **Kort, listor och meddelanden.** `FCard` (rubrik via `#header`-slotten och dess `headingSlotClass`), `FMessageBox` (info/success/warning/error), `FBadge` och `FDataTable` täcker de flesta ytor. `FSortFilterDataset` runt en tabell ger sortering; `FPaginator` ger sidbrytning.
- **Expanderbart innehåll och accordion.** `FExpandableParagraph` med `#title`-slotten; en accordion (en öppen åt gången) styrs med `:expanded` + `@toggle` från en ref. Lägg gärna temats FExpand-patch från playgrounden i en `fkui-patches.ts` – den åtgärdar en leave-bugg i 6.57.1.

## Formulär och validering

Registrera `ValidationPlugin` på appen och bygg formulären med `FValidationForm`:

```vue
<f-validation-form @submit="submit">
    <template #error-message> Fel i följande fält: </template>
    <f-text-field id="namn" v-model="namn" v-validation.required :maxlength="100">
        Namn
    </f-text-field>
</f-validation-form>
```

- Direktiven kedjas: `v-validation.required.email`, `v-validation.required.ssn` med flera.
- Använd de typade fältena i stället för egna mönster: `FPersonnummerTextField`, `FPhoneTextField`, `FEmailTextField`, `FPostalCodeTextField`.
- Select heter `FSelectField` (option-element i standardslotten), kryssrutor grupperas i `FFieldset` med `FCheckboxField`, radioknappar i `FFieldset` med `FRadioField`.
- Datumintervall på `FDatepickerField` sätts med validatorer, inte props: `v-validation.minDate.maxDate="{ minDate: { limit: '2026-01-01' }, maxDate: { limit: '2026-06-01' } }"`.
- Filuppladdning komponeras av `FFileSelector` + `FFileItem` inuti en `.file-uploader`-wrapper, med egen storleks- och antalskontroll i hanteraren.
- Submit-händelsen på `FValidationForm` avfyras först när formuläret är giltigt – fel samlas i fellistan (`FErrorList` via `#error-message`-slotten).

## Sök (valfritt)

Klientsökning utan backend: ett skript läser `src/router/index.ts`, hittar rutter med titel och beskrivning, strippar mallmarkupen i varje vy (direktiv, bindningar, mustascher och taggar) och skriver ett `public/search-index.json` med titel, url, innehållsutmärkning och nyckelord per sida. En `useSearch`-composable hämtar indexet med `fetch(BASE_URL + "search-index.json")`, poängsätter träffar (rubrik > beskrivning > innehåll > nyckelord) och genererar utdrag. Sökrutan byggs på `FSearchTextField` med en live-dropdown som styrs av fokus, piltangenter och Esc – FSearchTextField saknar egen dropdown.

## Prerendering och GitHub Pages (valfritt)

En Playwright-pass efter `vite build` startar en statisk server över `dist/`, besöker varje rutt, väntar på att `#app` fylls och titeln stämmer, och skriver snapshot-HTML:en till `dist/<rutt>.html`. Basvägen (GitHub Pages underkatalog) läses ut det byggda index.html så servern matchar produktion. Kör hela kedjan som ett build-skript: indexgenerering → vue-tsc → vite build → prerender.

Eftersom innehållet på en demosajt är fiktivt följer indexeringsskydd med: `noindex, nofollow` i meta per rutt (sätt i router-guarden, så plockar snapshotarna upp det), `robots.txt` med disallow-all inklusive vanliga AI-botar, samt `_headers` med `X-Robots-Tag` och en `.nojekyll`-fil.

## Checklista

- [ ] FKUI paket pinade exakt, felix-ds som git-beroende på en commit
- [ ] FKUI-css + scoped mixin-par i main.scss; egen SCSS med tokens endast
- [ ] Color-modul + inline-skript + växlingsknapp; `color-scheme` verifierad i båda lägen
- [ ] Typsnitt self-hostade; ingen font-CDN i bygget
- [ ] Formulär på FValidationForm med typade fält och kedjade validatorer
- [ ] Sökindex genererat i bygget; sökrutan med tangentbordsstyrd dropdown
- [ ] Prerender passar alla rutter; noindex-paketet på plats
