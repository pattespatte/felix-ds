import { createApp } from "vue";
import "../../src/icons/phosphor-spritesheet";
import "@fkui/design/lib/fkui.css";
import "@fkui/design/lib/fonts.css";
import "./main.scss";
import "./fkui-patches";
import App from "./App.vue";
import { ValidationPlugin } from "@fkui/vue";
import { restoreTheme, restoreColorMode } from "./theme";

restoreTheme();
restoreColorMode();

const app = createApp(App);
app.use(ValidationPlugin);
app.mount("#app");
