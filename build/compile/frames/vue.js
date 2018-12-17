const Rigger = require("../../rigger/rigger");
const Loader = require("../../helpers/loaders");
const Plugins = require("../../helpers/plugins");
module.exports = {
    run(context){
        return  new Rigger(context.configSet)
            .module({
                [Loader.CONST.vue]: Loader[Loader.CONST.vue]()
            })
            .plugins([ Plugins[Plugins.CONST.vueLoaderPlugin]() ])
            .append({
                resolve: {
                    alias: {
                        //"vue$": "vue/dist/vue.esm.js",
                    }
                }
            })
            .done();
    }
}