import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    root: fileURLToPath(new URL(".", import.meta.url)),
    base: "./",
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    // FKUI registers its custom elements (ce-page-layout,
                    // ce-resize-pane, ...) at runtime; only those tags are
                    // native custom elements, everything hyphenated is not.
                    isCustomElement: (tag) => tag.startsWith("ce-"),
                },
            },
        }),
    ],
});
