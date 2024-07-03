//import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
//import store from "./store";
import axios from "axios";
import "@mdi/font/css/materialdesignicons.css";

import { useFormatStore } from "./stores/Formatt";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.config.globalProperties.axios = axios;

app.use(pinia);
app.use(router);
app.use(vuetify);

let formatStore = useFormatStore();
app.config.globalProperties.formatStore = formatStore;
app.mount("#app");
