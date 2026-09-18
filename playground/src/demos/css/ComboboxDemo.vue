<script setup lang="ts">
import { computed, ref } from "vue";

const kommuner = [
    "Botkyrka",
    "Göteborg",
    "Helsingborg",
    "Jönköping",
    "Linköping",
    "Malmö",
    "Stockholm",
    "Umeå",
    "Uppsala",
    "Västerås",
];

const query = ref("");
const oppen = ref(false);
const aktivIndex = ref(0);

const listId = "combobox-demo__listbox";

const traffar = computed(() => {
    const text = query.value.trim().toLocaleLowerCase("sve");
    if (text === "") {
        return kommuner;
    }
    return kommuner.filter((k) => k.toLocaleLowerCase("sve").includes(text));
});

function optionId(index: number): string {
    return `${listId}__option-${index}`;
}

function oppna(): void {
    oppen.value = true;
    if (aktivIndex.value >= traffar.value.length) {
        aktivIndex.value = 0;
    }
}

function stang(): void {
    oppen.value = false;
}

function valj(kommun: string): void {
    query.value = kommun;
    stang();
}

function onInput(): void {
    oppna();
    aktivIndex.value = 0;
}

function onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
        case "ArrowDown":
            event.preventDefault();
            if (!oppen.value) {
                oppna();
            } else if (traffar.value.length > 0) {
                aktivIndex.value = (aktivIndex.value + 1) % traffar.value.length;
            }
            break;
        case "ArrowUp":
            event.preventDefault();
            if (oppen.value && traffar.value.length > 0) {
                aktivIndex.value =
                    (aktivIndex.value - 1 + traffar.value.length) % traffar.value.length;
            }
            break;
        case "Home":
            if (oppen.value) {
                aktivIndex.value = 0;
            }
            break;
        case "End":
            if (oppen.value && traffar.value.length > 0) {
                aktivIndex.value = traffar.value.length - 1;
            }
            break;
        case "Enter":
            if (oppen.value && traffar.value[aktivIndex.value] !== undefined) {
                event.preventDefault();
                valj(traffar.value[aktivIndex.value]);
            }
            break;
        case "Escape":
            stang();
            break;
        case "Tab":
            stang();
            break;
        default:
            break;
    }
}
</script>

<template>
    <section id="combobox" aria-labelledby="combobox-heading" class="demo">
        <h2 id="combobox-heading">Combobox (kombinationsruta)</h2>
        <p class="demo__description">
            Ren SCSS-komponent – textfält med förslagslista (.combobox__listbox).
            Skriv för att filtrera, pil upp/ner för att navigera, Enter för att
            välja och Esc för att stänga. Listbox-markeringen
            (listbox-komponentens yta och alternativ) ingår i demon.
        </p>
        <div class="combobox-demo__field">
            <div class="text-field">
                <label class="text-field__label" for="combobox-demo__input">Kommun</label>
                <div class="text-field__input-wrapper">
                    <input
                        id="combobox-demo__input"
                        v-model="query"
                        class="text-field__input"
                        type="text"
                        role="combobox"
                        aria-autocomplete="list"
                        :aria-expanded="oppen"
                        :aria-controls="oppen ? listId : undefined"
                        :aria-activedescendant="oppen ? optionId(aktivIndex) : undefined"
                        autocomplete="off"
                        @input="onInput"
                        @keydown="onKeydown"
                        @focus="oppna"
                        @blur="stang"
                    />
                    <div class="text-field__append-inner">
                        <button
                            class="combobox__button"
                            type="button"
                            aria-label="Öppna förslagen"
                            tabindex="-1"
                            @mousedown.prevent
                            @click="oppen ? stang() : oppna()"
                        >
                            <svg
                                focusable="false"
                                aria-hidden="true"
                                class="icon f-icon-arrow-down"
                                :class="{ 'combobox-demo__icon--upp': oppen }"
                            >
                                <use href="#f-icon-arrow-down"></use>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="combobox">
                <div v-if="oppen && traffar.length > 0" class="popup popup--inline">
                    <div class="popup__wrapper combobox__listbox">
                        <ul
                            :id="listId"
                            role="listbox"
                            aria-label="Förslag"
                            class="combobox__listbox__list"
                        >
                            <li
                                v-for="(kommun, index) in traffar"
                                :id="optionId(index)"
                                :key="kommun"
                                role="option"
                                :aria-selected="index === aktivIndex ? 'true' : undefined"
                                class="combobox__listbox__option"
                                :class="{
                                    'combobox__listbox__option--highlight': index === aktivIndex,
                                }"
                                @mousedown.prevent
                                @click="valj(kommun)"
                                @mousemove="aktivIndex = index"
                            >
                                {{ kommun }}
                            </li>
                        </ul>
                    </div>
                </div>
                <p v-else-if="oppen" class="combobox-demo__tom">Inga träffar.</p>
            </div>
        </div>
        <p>Valt värde: {{ query === "" ? "–" : query }}</p>
    </section>
</template>

<style scoped lang="scss">
.combobox-demo__field {
    max-width: 24rem;
}

// Upstream anchors .text-field__append-inner to the nearest positioned
// ancestor. In the Vue components that is the input row (.text-field__icon-
// wrapper); this demo's plain markup only has the .text-field block (which
// includes the label), so the arrow would land above the field. Making the
// input row the containing block places the arrow inside it, like upstream.
.combobox-demo__field .text-field__input-wrapper {
    position: relative;
}

.combobox-demo__icon--upp {
    transform: rotate(180deg);
}

.combobox-demo__tom {
    margin: 0.25rem 0;
    color: var(--fkds-color-text-secondary, #5c5f70);
}
</style>
