<script setup lang="ts">
import StatusBadge from "../../components/StatusBadge.vue";
import { cssPatternStatuses } from "../../componentStatus";
</script>

<template>
    <section id="indent" aria-labelledby="indent-heading" class="demo">
        <div class="component-heading">
            <h2 id="indent-heading">Indent (indrag)</h2>
            <status-badge :status="cssPatternStatuses.indent" />
        </div>
        <p class="demo__description">
            Ren SCSS-komponent för indragna block – här som citerat
            tidigare meddelande med ett svar på nivån under.
        </p>
        <div class="indent">
            <p>
                <strong>Tidigare meddelande:</strong> Kan du skicka över
                underlaget innan mötet på torsdag?
            </p>
            <div class="indent">
                <p>
                    <strong>Svar:</strong> Ja, det ligger i din inkorg nu.
                </p>
            </div>
        </div>
    </section>
</template>
