import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin } from "vite";
import MagicString from "magic-string";
import vue from "@vitejs/plugin-vue";
import {
    generateSearchIndex,
    DEMOS_DIR,
    VIEWS_DIR,
    PLAYGROUND_SRC,
} from "../scripts/search-index.ts";

// Genererar playground/public/search-index.json vid serverstart och build,
// samt live när demos, vyer eller navigationen ändras i dev. Indexet är en
// byggprodukt – katalogen är gitignorerad och checkas aldrig in.
function searchIndexPlugin(): Plugin {
    return {
        name: "felix-playground-search-index",
        buildStart() {
            generateSearchIndex();
        },
        configureServer(server) {
            const navigationFile = join(PLAYGROUND_SRC, "navigation.ts");
            const appFile = join(PLAYGROUND_SRC, "App.vue");
            const isWatched = (path: string): boolean =>
                path.startsWith(DEMOS_DIR) ||
                path.startsWith(VIEWS_DIR) ||
                path === navigationFile ||
                path === appFile;
            const regenerate = (path: string): void => {
                if (isWatched(path)) {
                    generateSearchIndex();
                    server.config.logger.info("search-index: regenererad", {
                        timestamp: true,
                    });
                }
            };
            server.watcher.on("change", regenerate);
            server.watcher.on("add", regenerate);
        },
    };
}

// Paketversionen läses in vid konfiglastning och läggs in som global
// konstant (__APP_VERSION__, deklarerad i src/env.d.ts) så att t.ex.
// sidfoten visar den aktuella versionen utan manuell synk. En egen transform
// behövs eftersom Vite 8 bara applicerar config.define på bundlade
// miljöer (build) – i dev hoppar vite:define över klientkod.
const packageJson = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { version: string };

function appVersionPlugin(version: string): Plugin {
    return {
        name: "felix-app-version",
        transform(code, id) {
            if (id.includes("node_modules") || !code.includes("__APP_VERSION__")) {
                return null;
            }
            const source = new MagicString(code);
            source.replaceAll("__APP_VERSION__", JSON.stringify(version));
            return {
                code: source.toString(),
                map: source.generateMap({ hires: true }),
            };
        },
    };
}

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
        searchIndexPlugin(),
        appVersionPlugin(packageJson.version),
    ],
});
