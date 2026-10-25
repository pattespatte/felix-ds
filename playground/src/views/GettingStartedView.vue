<script setup lang="ts">
// Guides a newcomer from an empty Vite app to a working themed FKUI
// component, mirroring docs/create-a-site.en.md as on-site copy-paste
// blocks. API details stay upstream – this view covers only the theme
// consumption contract.
import pkg from "../../../package.json";

// The FKUI pins shown are the playground's own dev pins, so an upgrade
// rehearsal updates the copy-paste block without a manual edit here.
const fkuiVersion = (pkg.devDependencies as Record<string, string>)[
    "@fkui/vue"
];
const fkuiInstall = [
    "bun add",
    `@fkui/vue@${fkuiVersion}`,
    `@fkui/design@${fkuiVersion}`,
    `@fkui/theme-default@${fkuiVersion}`,
    `@fkui/date@${fkuiVersion}`,
    `@fkui/logic@${fkuiVersion}`,
    `@fkui/icon-lib-default@${fkuiVersion}`,
].join(" ");
</script>

<template>
    <div class="view">
        <h1>Kom igång</h1>
        <p class="view__intro">
            Fyra steg från ett tomt Vue 3-projekt till en FKUI-komponent med
            felix-temat på: installera FKUI:s paket, koppla temat, ladda
            ikonerna och välja hur mörkt läge styrs. Stegen följer guiden
            <a href="https://github.com/pattespatte/felix-ds/blob/main/docs/create-a-site.sv.md">Skapa en webbplats med felix-ds</a>
            och visar samma versionslås som playgrounden själv använder –
            kontrollera alltid aktuell version inom det stödda intervallet.
        </p>

        <section id="installera" aria-labelledby="installera-heading" class="demo">
            <h2 id="installera-heading">1. Installera paketen</h2>
            <p>
                Skapa ett Vue 3-projekt om du inte redan har ett – exemplen
                här använder Vite, men felix-ds och FKUI fungerar med vilka
                byggverktyg som helst – och
                lägg till FKUI:s publika paket med låsta versioner. Därefter
                lägger du till felix-temat – antingen från GitHub Packages
                eller som git-lås utan registret. Registret kräver en personlig
                åtkomsttoken (PAT) med <code>read:packages</code> i
                miljövariabeln <code>GITHUB_PACKAGES_TOKEN</code>:
            </p>
            <pre class="setup-code" tabindex="0"><code>cat &gt; .npmrc &lt;&lt;'EOF'
@pattespatte:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
EOF
bun add @pattespatte/felix-ds</code></pre>
            <pre class="setup-code" tabindex="0"><code>{{ fkuiInstall }}</code></pre>
            <p>
                Alternativ utan registret:
                <code>bun add felix-ds@github:pattespatte/felix-ds#&lt;commit&gt;</code>.
            </p>
        </section>

        <section id="tema" aria-labelledby="tema-heading" class="demo">
            <h2 id="tema-heading">2. Ladda temat</h2>
            <p>
                I appens startfil (i ett Vite- och Vue-projekt oftast
                <code>src/main.ts</code>) laddar du FKUI:s komponentstil och
                typsnitt först och felix-lagret sist. Det som laddas sist
                gäller – därför behövs inget <code>!important</code>. Den
                förbyggda filen innehåller även
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
                färglägena bakom <code>prefers-color-scheme</code>). Med
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
                standardikonbibliotekets teckningar – ikonnamnen i FIcon är
                oförändrade:
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
                Standardvägen kräver ingen Sass. Behöver du avgränsa temat till en klass
                (till exempel för att växla tema i körning) använder du
                paketets Sass-ingång
                <code>@use "@pattespatte/felix-ds/src/index.scss"</code>
                tillsammans med mixinparet <code>felix.light</code>/<code>felix.dark</code>.
                Hela receptet finns i guiden
                <a href="https://github.com/pattespatte/felix-ds/blob/main/docs/create-a-site.sv.md">Skapa en webbplats med felix-ds</a>
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
