import Vue from "vue";
import Biz from "./components/biz.vue"
import { createRouter } from './router'

export function createApp () {
    // 创建 router 实例

    const app = new Vue({
        render: h => h(Biz)
    })
    console.log(22);

    // 返回 app 和 router
    return { app }
}
