import Vue from 'vue';
import App from "./components/app.vue";
import store from "./store/index";

export function createApp(){
    const app =  new Vue({
        store,
        render: h => h(App)
    });
    return { app }

}
