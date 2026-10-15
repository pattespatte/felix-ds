<script setup lang="ts">
// Guides a newcomer from an empty Vite app to a working themed FKUI
// component, mirroring docs/create-a-site.en.md as on-site copy-paste
// blocks. API details stay upstream – this view covers only the theme
// consumption contract.
</script>

<template>
    <div class="view">
        <h1>Kom igång</h1>
        <p class="view__intro">
            Fyra steg från ett tomt Vite-projekt till en tematisk FKUI-komponent:
            installera FKUI:s paket, koppla felix-temat, ladda ikonerna och välj
            hur mörkt läge styrs. Stegen följer guiden
            <a href="https://github.com/pattespatte/felix-ds/blob/main/docs/create-a-site.en.md">Building a site with felix-ds</a>
            och visar låsta versioner som gällde när sidan skrevs – kontrollera
            alltid aktuell version inom det stödda intervallet.
        </p>

        <section id="installera" aria-labelledby="installera-heading" class="demo">
            <h2 id="installera-heading">1. Installera paketen</h2>
            <p>
                Skapa ett Vue 3- och Vite-projekt om du inte redan har ett, och
                lägg till FKUI:s publika paket med låsta versioner. Därefter
                felix-temat – antingen från GitHub Packages (kräver en PAT med
                <code>read:packages</code> i miljövariabeln
                <code>GITHUB_PACKAGES_TOKEN</code>) eller som git-lås utan
                registret:
            </p>
            <pre class="setup-code" tabindex="0"><code>cat &gt; .npmrc &lt;&lt;'EOF'
@pattespatte:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
EOF
bun add @pattespatte/felix-ds</code></pre>
            <pre class="setup-code" tabindex="0"><code>bun add @fkui/vue@6.62.0 @fkui/design@6.62.0 @fkui/theme-default@6.62.0 @fkui/date@6.62.0 @fkui/logic@6.62.0 @fkui/icon-lib-default@6.62.0</code></pre>
            <p>
                Alternativ utan registret:
                <code>bun add felix-ds@github:pattespatte/felix-ds#&lt;commit&gt;</code>.
            </p>
        </section>

        <section id="tema" aria-labelledby="tema-heading" class="demo">
            <h2 id="tema-heading">2. Ladda temat</h2>
            <p>
                I appens ingångspunkt: FKUI:s komponentstil och typsnitt först,
                sedan felix-lagret som vinner i kaskaden utan
                <code>!important</code>. Den förbyggda filen innehåller även
                <code>@font-face</code>-reglerna – allt är självhostat, inga
                CDN-anrop:
            </p>
            <pre class="setup-code" tabindex="0"><code>import "@fkui/icon-lib-default/dist/f";
import "@fkui/design/lib/fkui.css";
import "@fkui/design/lib/fonts.css";
import "@pattespatte/felix-ds/dist/felix.css";</code></pre>
            <p>
                Vill du följa systeminställningen i stället för att styra
                färgläget själv byter du sista raden mot
                <code>@pattespatte/felix-ds/dist/felix-auto.css</code> (båda
                temana bakom <code>prefers-color-scheme</code>). Med
                standardfilen styrs mörkt läge av attributet
                <code>html[data-color-mode="dark"]</code>.
            </p>
        </section>

        <section id="ikoner" aria-labelledby="ikoner-heading" class="demo">
            <h2 id="ikoner-heading">3. Byt ikonuppsättning (valfritt)</h2>
            <p>
                Paketet skickar med en kurerad ikonuppsättning från
                <a href="https://phosphoricons.com">Phosphor Icons</a>
                (MIT-licens) i vikten bold. En importrad ersätter
                standardikonbibliotekets teckningar bakom FIcons oförändrade
                namn:
            </p>
            <pre class="setup-code" tabindex="0"><code>import "@pattespatte/felix-ds/src/icons/phosphor-spritesheet";</code></pre>
            <p>
                Hela uppsättningen visas på
                <a href="#/knappar/ficon">ikonavsnittet i playgrounden</a>.
            </p>
        </section>

        <section id="anpassa" aria-labelledby="anpassa-heading" class="demo">
            <h2 id="anpassa-heading">4. Anpassa temat (valfritt)</h2>
            <p>
                Standardvägen kräver ingen Sass. Behöver du klass-scopa temat
                (till exempel för att växla tema i körning) läser paketets
                Sass-ingång
                <code>@use "@pattespatte/felix-ds/src/index.scss"</code> med
                mixinparet <code>felix.light</code>/<code>felix.dark</code>.
                Hela receptet finns i guiden
                <a href="https://github.com/pattespatte/felix-ds/blob/main/docs/create-a-site.en.md">Building a site with felix-ds</a>
                och i README:s kompatibilitetsavsnitt.
            </p>
        </section>
    </div>
</template>

<style scoped lang="scss">
// Inline links in prose must be distinguishable without colour in every
// theme profile – the underline matches felix's own global anchor rule and
// covers the fkui profile, where FKUI strips the underline.
p a {
    text-decoration: underline;
    text-underline-offset: 3px;
}

.setup-code {
    margin: 0 0 1rem;
    padding: 0.75rem 1rem;
    overflow-x: auto;
    background: var(--fkds-color-background-secondary, #f7f8f8);
    border: 1px solid var(--fkds-color-border-weak, #d7d9e0);
    border-radius: var(--f-border-radius-medium, 8px);

    // tabindex="0" keeps the horizontally scrollable block keyboard
    // accessible (scrollable-region-focusable); the ring keeps that focus
    // visible.
    &:focus-visible {
        outline: none;
        box-shadow: var(--f-focus-box-shadow);
    }

    code {
        font-family: var(--f-font-family-code, monospace);
        font-size: 0.875rem;
        color: var(--fkds-color-text-primary, #081130);
    }
}
</style>
