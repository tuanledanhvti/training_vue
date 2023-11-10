import { createApp } from "vue";
import { Quasar } from "quasar";
import router from "./router/index";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "vue-query";
import mitt from "mitt";
import VTI_PluginConfirm from "./plugin/PluginConfirm";

// Import custom component
//import PopupAdd from "./components/modal/popup/PopupAdd.vue";

// Import resource
import VTI_Resource from "./helper/resource";

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

app.use(VTI_PluginConfirm, {
  fontSize: {
    normal: 14,
    medium: 24,
    large: 36,
  },
});

//app.component("VTI_PopupAdd", PopupAdd);

app.mount("#app");
