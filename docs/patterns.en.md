# Pattern library – composition recipes

felix-ds is a theme layer: it changes the presentation of FKUI's components, never their DOM, props or behaviour. That is the stated trade-off, and it is what makes full component coverage and cheap FKUI upgrades possible. When the tokens cannot express something, the first response is a composition recipe in the consumer's own code – not a wrapper. This page collects the recipes that are proven in the project's consumer apps. A separate wrapper package is deliberately out of scope for the thin layer (see [governance](./governance.en.md)).

The entry bar is honest provenance: a pattern lands here after a consumer app has exercised it, not as a design sketch.

## One accordion item open at a time (FExpandableParagraph)

`FExpandableParagraph` is fully controlled. Bare usage renders the toggle button, but nothing happens on click – with no console error to explain why. The component waits for the `expanded` prop and the `toggle` event to be wired by the application.

The recipe is one page-wide ref plus a toggle function; the ids can be generated from list positions:

```vue
<script setup lang="ts">
import { ref } from "vue";
import { FExpandableParagraph } from "@fkui/vue";

const items = [
    { title: "First question", content: "First answer" },
    { title: "Second question", content: "Second answer" },
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

Proven in the demo site's content pages, which drive every accordion on the site this way (one item open at a time, page-wide).

## Grouped checkboxes (FFieldset + FCheckboxField)

There is no `FCheckboxGroup` in `@fkui/vue`. The grouping API is `FFieldset` with the `#label` slot, and the checkboxes inside share one array-valued `v-model`:

```vue
<f-fieldset name="topics">
    <template #label> Which topics interest you? </template>
    <f-checkbox-field v-model="topics" value="theming"> Theming </f-checkbox-field>
    <f-checkbox-field v-model="topics" value="releases"> Release notes </f-checkbox-field>
</f-fieldset>
```

with `const topics = ref<string[]>([])` in the script. Proven in the consumer app's contact form.

## Let FKUI style the links

FKUI's anchor styling is token-mapped and flips with the colour mode. Hand-colouring links breaks it: a hard-coded light-mode colour fails contrast in dark mode, and axe catches it (the consumer app's first draft failed 7 nodes this way). The recipe is to leave anchors to FKUI, and use existing tokens when emphasis is needed – `--fkds-color-text-secondary` for muted text, for example. Beware invented token names: `--fkds-color-text-action` does not exist; check the token guides before writing a `var()`.

## When a behaviour truly cannot be composed

Document the divergence where the next developer will look, and re-verify it against upstream at every FKUI bump – each divergence from upstream is flexibility bought on credit. Prefer waiting for upstream or composing around the behaviour. The reserved opt-in wrapper package that the governance policy reserves for a genuinely unavoidable case does not exist today; creating one is an owner decision, never a convenience.
