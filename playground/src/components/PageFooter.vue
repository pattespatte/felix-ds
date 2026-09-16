<template>
    <footer class="page-footer">
        <div class="page-footer__inner">
            <div class="page-footer__brand">
                <p class="page-footer__title">felix-ds</p>
                <p class="page-footer__tagline">
                    Ett tunt temalager ovanpå FKUI:s publika npm-paket.
                </p>
            </div>
            <nav class="page-footer__group" aria-label="Sidfotsnavigation">
                <h2 class="page-footer__heading">Sektioner</h2>
                <ul>
                    <li><a href="#actions">Knappar och återkoppling</a></li>
                    <li><a href="#forms">Formulär</a></li>
                    <li><a href="#surfaces">Ytor och data</a></li>
                </ul>
            </nav>
            <div class="page-footer__group">
                <h2 class="page-footer__heading">Genvägar</h2>
                <ul>
                    <li><a href="#app">Till sidans topp</a></li>
                </ul>
            </div>
        </div>
        <div class="page-footer__bottom">
            <p>felix-ds 0.1.0 – privat proof of concept. Koden publiceras inte.</p>
        </div>
    </footer>
</template>

<style scoped lang="scss">
.page-footer {
    background-color: var(--fkds-color-action-background-primary-default, #232948);
    color: var(--fkds-color-text-inverted, #ffffff);
    padding: 4rem 1rem 2rem;
}

.page-footer__inner {
    max-width: 72rem;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 3rem 4rem;
}

.page-footer__brand {
    max-width: 22rem;
}

.page-footer__title {
    margin: 0;
    font-size: var(--f-font-size-h3, 1.25rem);
    font-weight: var(--f-font-weight-bold, 600);
}

.page-footer__tagline {
    margin: 0.5rem 0 0;
    color: rgba(255, 255, 255, 0.85);
}

.page-footer__heading {
    margin: 0 0 0.75rem;
    font-size: var(--f-font-size-standard, 1rem);
    font-weight: var(--f-font-weight-bold, 600);
}

.page-footer__group ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.5rem;
}

.page-footer a {
    color: var(--fkds-color-text-inverted, #ffffff);
    text-decoration: underline;
    text-underline-offset: 3px;
}

.page-footer a:hover {
    color: var(--fkds-color-text-inverted, #ffffff);
    text-decoration: none;
}

.page-footer__bottom {
    max-width: 72rem;
    margin: 2rem auto 0;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.5);
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.85);
}

.page-footer__bottom p {
    margin: 0;
}
</style>
