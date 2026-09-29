<script setup lang="ts">
import { computed } from "vue";
import { currentTheme } from "../theme";
import {
    FKUI_DOCS_BASE,
    FKUI_SOURCE_BASE,
    fkuiComponentLinks,
    type FkuiComponentName,
} from "../fkuiComponentLinks";

const props = defineProps<{
    /** Id of the h2 – also the navigation anchor target. */
    id: string;
    /** FKUI components named by the heading, in heading order. */
    names: FkuiComponentName[];
}>();

// Swedish list join (", " between, " och " before the last) so the felix
// profile renders byte-identically to the previous static heading texts.
const headingText = computed(() => joinNames(props.names));

function joinNames(names: FkuiComponentName[]): string {
    if (names.length < 2) {
        return names.join("");
    }
    return `${names.slice(0, -1).join(", ")} och ${names[names.length - 1]}`;
}
</script>

<template>
    <!-- FKUI links render only in the grundtema profile; in felix the heading
         is plain text with the id unchanged. The name anchor and its (kod)
         anchor are kept on one line so the single space between them survives
         the template compiler's whitespace condensing. The "anchor" class is
         FKUI's own link style: the stylesheet resets bare <a> to no
         underline, so without it the links lose the FKUI-standard look (and
         the token colour) that must survive both color modes. -->
    <h2 :id="id">
        <template v-if="currentTheme === 'fkui'">
            <template v-for="(name, index) in names" :key="name"><template v-if="index > 0">{{ index === names.length - 1 ? " och " : ", " }}</template><a class="anchor" :href="FKUI_DOCS_BASE + fkuiComponentLinks[name].docsPath">{{ name }}</a> <a class="anchor" :href="FKUI_SOURCE_BASE + fkuiComponentLinks[name].sourcePath">(kod)</a></template>
        </template>
        <template v-else>{{ headingText }}</template>
    </h2>
</template>
