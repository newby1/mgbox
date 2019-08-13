import Vue from 'vue';
import App from "./components/app.vue";
import store from "./store/index";

new Vue({
    el: "#app",
    store,
    render: h => h(App)
});

import Api from "$appsPath/common/services/api.js";
const Svc = new Api("");
Svc.get("/mock/ab", null, { bodyStream: "text" }).then(
    data => console.log(data),
    e => {
        console.log(e);
    });
