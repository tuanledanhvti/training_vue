import { createApp } from "vue";
import { Quasar } from "quasar";
import router from "./router/index";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "vue-query";
import mitt from "mitt";

// Import custom component
import PopupAdd from "../src/components/model/popup/PopupAdd.vue";

// Import resource
import VTI_Resource from "../src/helper/resource"

// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";
// Import Quasar css
import "quasar/src/css/index.sass";
import "./style.css";
import App from "./App.vue";

const app = createApp(App);
const eventBus = mitt();

app.provide("eventBus", eventBus);
app.provide("VTI_Resource", VTI_Resource);

app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});
app.use(createPinia());
app.use(VueQueryPlugin);
app.use(router);

app.component("VTI_PopupAdd", PopupAdd);

app.mount("#app");
