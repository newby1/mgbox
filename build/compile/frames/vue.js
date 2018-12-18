const Rigger = require("../../rigger/rigger");
const Loader = require("../../helpers/loaders");
const Plugins = require("../../helpers/plugins");
const Helper = require("../../helpers/helper");
const Const = require("../../const");
module.exports = {
    run(context){
        return  new Rigger(context.preWebpackConfig)
            .module({
                [Loader.CONST.vue]: Loader[Loader.CONST.vue](),
                [Loader.CONST.js]: Loader[Loader.CONST.js](),
            })
            .plugins([
                Plugins[Plugins.CONST.vueLoaderPlugin](),
                Plugins[Plugins.CONST.happypack]({
                    id: "js",
                    loaders: [ {
                        loader: "babel-loader"
                    } ]
                })
            ])
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