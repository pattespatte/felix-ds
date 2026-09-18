import { createApp } from "vue";
import "@fkui/icon-lib-default/dist/f";
import "@fkui/design/lib/fkui.css";
import "@fkui/design/lib/fonts.css";
import "./main.scss";
import "./fkui-patches";
import App from "./App.vue";
import { ValidationPlugin } from "@fkui/vue";
import { restoreTheme } from "./theme";

restoreTheme();

const app = createApp(App);
app.use(ValidationPlugin);
app.mount("#app");
