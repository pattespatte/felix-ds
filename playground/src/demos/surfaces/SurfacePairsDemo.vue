<script setup lang="ts">
// Surface pairs. The profile paints a cool pair and a warm pair, both with a
// dark foreground. The cool pair is the page: a cool canvas with white
// surfaces lifted off it. The warm pair carries bands and panels that should
// stand out from that cool ground. Every swatch states the token it reads, so
// the section doubles as the reference for which surface to reach for.
</script>

<template>
    <section id="surface-pairs" aria-labelledby="surface-pairs-heading" class="demo">
        <div class="component-heading">
            <h2 id="surface-pairs-heading">Ytor i två par</h2>
        </div>
        <p class="demo__description">
            Profilen har två ytpar med mörk förgrund. Det kalla paret är
            sidans grund – en kall duk med vita ytor ovanpå. Det varma paret
            bär band och paneler som ska sticka ut från den kalla grunden.
        </p>

        <div class="surface-pairs">
            <div class="surface-pair">
                <h3 class="surface-pair__title">Kallt par</h3>
                <div class="surface-pair__swatch surface-pair__swatch--canvas">
                    <span class="surface-pair__label">Sekundär bakgrund (duk)</span>
                    <code class="surface-pair__token">--fkds-color-background-secondary</code>
                    <span class="surface-pair__hex">#f5f7fa</span>
                </div>
                <div class="surface-pair__swatch surface-pair__swatch--card">
                    <span class="surface-pair__label">Primär bakgrund (yta)</span>
                    <code class="surface-pair__token">--fkds-color-background-primary</code>
                    <span class="surface-pair__hex">#ffffff</span>
                </div>
            </div>

            <div class="surface-pair">
                <h3 class="surface-pair__title">Varmt par</h3>
                <div class="surface-pair__swatch surface-pair__swatch--tertiary">
                    <span class="surface-pair__label">Tertiär bakgrund</span>
                    <code class="surface-pair__token">--fkds-color-background-tertiary</code>
                    <span class="surface-pair__hex">#f6f3ef</span>
                </div>
                <div class="surface-pair__swatch surface-pair__swatch--warm">
                    <span class="surface-pair__label">Varm bakgrund</span>
                    <code class="surface-pair__token">--fkds-color-background-warm</code>
                    <span class="surface-pair__hex">#dfd7c8</span>
                </div>
            </div>
        </div>

        <p class="surface-pair__note">
            Båda paren läses med samma mörka förgrund
            (<code class="surface-pair__token">--fkds-color-text-primary</code>).
            Vit text hör inte till det varma paret – den kontrasten klarar inte
            kraven. Primär bakgrund måste hållas vit eftersom uppströms kort,
            fält och popovers läser den token.
        </p>
    </section>
</template>

<style scoped lang="scss">
.surface-pairs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
}

.surface-pair {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 0;
    padding: 1rem;
    border: 1px solid var(--fkds-color-border-weak, #d7d9e0);
    border-radius: var(--f-border-radius-medium, 8px);
    background-color: var(--fkds-color-background-secondary, #ffffff);
}

.surface-pair__title {
    margin: 0;
    font-size: var(--f-font-size-h4, 1.125rem);
}

.surface-pair__swatch {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    padding: 0.75rem;
    border: 1px solid var(--fkds-color-border-weak, #d7d9e0);
    border-radius: var(--f-border-radius-small, 4px);
    color: var(--fkds-color-text-primary, #242946);
}

.surface-pair__swatch--canvas {
    background-color: var(--fkds-color-background-secondary, #f5f7fa);
}

.surface-pair__swatch--card {
    background-color: var(--fkds-color-background-primary, #ffffff);
}

.surface-pair__swatch--tertiary {
    background-color: var(--fkds-color-background-tertiary, #f6f3ef);
}

.surface-pair__swatch--warm {
    background-color: var(--fkds-color-background-warm, #dfd7c8);
}

.surface-pair__label {
    font-weight: var(--f-font-weight-bold, 600);
}

.surface-pair__token {
    font-family: var(--f-font-family-code, monospace);
    font-size: 0.8125rem;
}

.surface-pair__hex {
    font-family: var(--f-font-family-code, monospace);
    font-size: 0.8125rem;
    /* The secondary ink sits at 4.47:1 on the warm surface, just under the
       4.5:1 threshold, so the swatches use the primary ink. */
    color: var(--fkds-color-text-primary, #242946);
}

.surface-pair__note {
    margin: 0;
    color: var(--fkds-color-text-secondary, #585f71);
}
</style>