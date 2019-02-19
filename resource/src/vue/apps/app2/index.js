import Vue from 'vue';
import App from "./components/app.vue";
import store from "./store/index";
import common from "../common/components/common";

console.log(common.title);

new Vue({
    el: "#app",
    store,
    render: h => h(App)
});
