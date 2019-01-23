// router.js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
    return new Router({
        routes: [
            {
                path: "/",
                component: {
                    template: "<div>default componesnt</div>"
                }
            }
        ]
    })
}