import { createPinia } from "pinia";
import VCalendar from "v-calendar";
import "v-calendar/style.css";
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(VCalendar, {});
app.mount("#app");
