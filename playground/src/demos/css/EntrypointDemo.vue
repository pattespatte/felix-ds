<script setup lang="ts">
import StatusBadge from "../../components/StatusBadge.vue";
import { cssPatternStatuses } from "../../componentStatus";
</script>

<template>
    <section id="entrypoint" aria-labelledby="entrypoint-heading" class="demo">
        <div class="component-heading">
            <h2 id="entrypoint-heading">Entrypoint (startpunkt)</h2>
            <status-badge :status="cssPatternStatuses.entrypoint" />
        </div>
        <p class="demo__description">
            Ren SCSS-komponent som framhäver en ingång till en tjänst –
            alltid 100 % tillgänglig bredd.
        </p>
        <a class="entrypoint" href="#/start">
            Ansök om hundbidrag
            <span class="sr-only"> Till tjänsten ansök om hundbidrag </span>
            <svg focusable="false" aria-hidden="true" class="icon f-icon-arrow-right entrypoint__icon">
                <use href="#f-icon-arrow-right"></use>
            </svg>
        </a>
    </section>
</template>
