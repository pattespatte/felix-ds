<script setup lang="ts">
import { views } from "../navigation";

// Kategorilänken på startsidan: alla vyer utom Start själv.
const categories = views.filter((view) => view.slug !== "start");
</script>

<template>
    <div class="view">
        <h1>felix-ds</h1>
        <p class="view__intro">
            En privat konceptstudie (proof of concept): ett fristående,
            organisationsneutralt designsystem byggt som ett tunt temalager –
            designvariabler som CSS-variabler plus inbäddade typsnitt – ovanpå
            FKUI:s publika npm-paket. En lokal playground bevisar konceptet
            genom att visa samtliga komponenter i FKUI:s publika paket – 79
            Vue-komponenter och 10 SCSS-komponenter – med omedelbar växling
            mellan FKUI:s grundtema och felix-temat. Inga
            Vue-wrappers, ingen fork, inga egna komponenter: konsumenten
            använder FKUI-komponenterna direkt och lägger bara på temat.
        </p>

        <section id="om" aria-labelledby="om-heading" class="demo view__intro">
            <h2 id="om-heading">Om playgrounden</h2>
            <p>
                Temat är en samling CSS-variabler och typsnitt, byggt enligt
                samma modell som FKUI:s egna temapaket. Grundtemat laddas
                först och felix-variablerna efter. Det som laddas sist
                gäller – därför behövs inget <code>!important</code>.
            </p>
            <p>
                Växla tema med väljaren uppe till höger.
                Sol/måne-knappen bredvid växlar mellan ljust och mörkt
                läge. Sidan byter utseende direkt, utan omladdning.
                Färgläget följer systeminställningen tills du väljer
                själv.
            </p>
            <p>
                Du kan också styra båda valen från adressen:
                <code>?profile=felix</code> eller <code>?profile=fkui</code>
                väljer temaprofil och <code>?mode=light</code> eller
                <code>?mode=dark</code> väljer färgläge – till exempel
                <code>/?profile=felix&amp;mode=dark#/formular</code>.
            </p>
            <ul>
                <li>
                    Typografi: Noto Sans för all löptext, Roboto Slab för
                    rubriker och display. Fetstil mappas till vikt 600 – inga
                    700-vikter bäddas in.
                </li>
                <li>
                    Färger, linjetjocklekar (1 px) och radier (6/8 px): temat
                    ritar alla komponentramar som 1 px-hårstreck. Mindre
                    komponenter får radie 6 px, större 8 px.
                </li>
                <li>Fokusmarkering: en enkel 2 px-ring i profilens fokusfärg.</li>
            </ul>
        </section>

        <section id="komponenter" aria-labelledby="komponenter-heading" class="demo view__intro">
            <h2 id="komponenter-heading">Komponenter i playgrounden</h2>
            <p>
                Samtliga 89 komponenter i komponentrapporten (79 Vue + 10
                SCSS), grupperade i kategorier. Komponenterna är FKUI:s egna
                – playgrounden lägger bara på temat. Listan nedan genereras
                från navigation.ts, samma källa som vänstermenyn.
            </p>
            <ul class="start-categories">
                <li v-for="category in categories" :key="category.slug">
                    <a :href="`#/${category.slug}`">{{ category.title }}</a>
                </li>
            </ul>
        </section>
    </div>
</template>

<style scoped lang="scss">
.start-categories {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: 0.5rem 2rem;
}
</style>
