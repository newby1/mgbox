import Vue from "vue";
import App from "./components/index.vue"
Vue.config.productionTip = false
new Vue({
    el: "#app",
    render: h => h(App)
});
