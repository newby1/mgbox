const Rigger = require("../../rigger/rigger");
const Loader = require("../../helpers/loaders");
module.exports = {
    run(context){
        return  new Rigger(context.configSet)
            .module({
                [Loader.CONST.vue]: Loader[Loader.CONST.vue]()
            })
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