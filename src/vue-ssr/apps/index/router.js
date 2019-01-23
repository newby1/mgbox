// router.js
import Vue from 'vue'
import Router from 'vue-router'
import Biz from "./components/biz.vue";

Vue.use(Router);

export function createRouter () {
    return new Router({
        routes: [
            {
                path: "/",
                name: "Biz",
                component: {
                    template: "<div>u2as</div>"
                }
            }
        ]
    })
}
