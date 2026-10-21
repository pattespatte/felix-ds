# Mönsterbibliotek – kompositionsrecept

felix-ds är ett temalager: det ändrar presentationen hos FKUI:s komponenter, aldrig deras DOM, props eller beteende. Det är den uttalade avvägningen, och det är det som gör full komponenttäckning och billiga FKUI-uppgraderingar möjliga. När token inte räcker till är första svaret ett kompositionsrecept i konsumentens egen kod – inte en wrapper. Den här sidan samlar recepten som är beprövade i projektets konsumentappar. Ett separat wrapper-paket är medvetet utanför omfattningen för det tunna lagret (se [styrningen](./governance.sv.md)).

Inträdesbarriären är ärlig härkomst: ett mönster landar här först efter att en konsumentapp har använt det, inte som en designs skiss.

## Ett dragspelsobjekt öppet åt gången (FExpandableParagraph)

`FExpandableParagraph` är helt styrd. Utan egen koppling renderas växlingsknappen, men inget händer vid klick – utan något konsolfel som förklarar varför. Komponenten väntar på att `expanded`-propen och `toggle`-eventet kopplas av applikationen.

Receptet är en ref per sida plus en växlingsfunktion, och id:erna kan genereras ur listpositioner:

```vue
<script setup lang="ts">
import { ref } from "vue";
import { FExpandableParagraph } from "@fkui/vue";

const items = [
    { title: "Första frågan", content: "Första svaret" },
    { title: "Andra frågan", content: "Andra svaret" },
];

const openId = ref<string | null>(null);

const toggle = (id: string) => {
    openId.value = openId.value === id ? null : id;
};
</script>

<template>
    <f-expandable-paragraph
        v-for="(item, index) in items"
        :key="index"
        :expanded="openId === String(index)"
        @toggle="toggle(String(index))"
    >
        <template #title>{{ item.title }}</template>
        <template #default>{{ item.content }}</template>
    </f-expandable-paragraph>
</template>
```

Beprövat i demosajtens innehållssidor, som driver varje dragspel på sajten på det här sättet (ett objekt öppet åt gången, per sida).

## Grupperade kryssrutor (FFieldset + FCheckboxField)

`FCheckboxGroup` finns inte i `@fkui/vue`. Grupperings-API:et är `FFieldset` med `#label`-sloten, och kryssrutorna inuti delar en arrayvärderad `v-model`:

```vue
<f-fieldset name="amnen">
    <template #label> Vilka amnen intresserar dig? </template>
    <f-checkbox-field v-model="topics" value="tema"> Temautveckling </f-checkbox-field>
    <f-checkbox-field v-model="topics" value="utgivning"> Utgivningsbesked </f-checkbox-field>
</f-fieldset>
```

med `const topics = ref<string[]>([])` i skriptet. Beprövat i konsumentappens kontaktformulär.

## Låt FKUI styla länkarna

FKUI:s ankarstyrsning är tokenmappad och växlar med färgläget. Länkar med handplockade färger bryter den: en hårdkodad färg från ljust läge fäller kontrasten i mörkt läge, och axe fångar det (konsumentappens första utkast fällde 7 noder på det sättet). Receptet är att lämna ankarna till FKUI och använda existerande token när betoning behövs – `--fkds-color-text-secondary` för dämpad text till exempel. Akta påhittade token-namn: `--fkds-color-text-action` finns inte. Kontrollera tokenguiderna innan du skriver en `var()`.

## När ett beteende verkligen inte går att komponera

Dokumentera avvikelsen där nästa utvecklare letar, och verifiera den mot uppströms vid varje FKUI-uppgradering – varje avvikelse från uppströms är flexibilitet köpt på kredit. Vänta hellre på uppströms eller komponera runt beteendet. Det wrapper-paket på tillval som styrningspolicyn reserverar för ett genuint oundvikligt fall finns inte i dag. Att skapa ett är ett ägarbeslut, aldrig en bekvämlighet.
