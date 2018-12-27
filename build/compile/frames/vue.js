const Rigger = require("../../rigger/rigger");
const Loader = require("../../helpers/loaders");
const Plugins = require("../../helpers/plugins");
const Helper = require("../../helpers/helper");
const Const = require("../../const");
const extend = require('extend');
module.exports = {
    run(context){
        let preWebpackConfig = context.preWebpackConfig;
        let itemConfig = context.itemConfig;
        let processArgv = context.processArgv;
        let rigger = new Rigger(preWebpackConfig);
        let entry = {};
        let append = {
            resolve: {
                alias: {
                    //"vue$": "vue/dist/vue.esm.js",
                }
            }
        };
        let plugins = [
            Plugins[Plugins.CONST.vueLoaderPlugin](),
            Plugins[Plugins.CONST.happypack]({
                id: "js",
                loaders: [ {
                    loader: "babel-loader"
                } ]
            })
        ];
        if (processArgv.ssr){
            plugins.push(Plugins[Plugins.CONST.vueServerRenderer]())
            extend(append, {
                target: "node"
            })
        }

        return  new Rigger(preWebpackConfig)
            .module({
                [Loader.CONST.vue]: Loader[Loader.CONST.vue](),
                [Loader.CONST.js]: Loader[Loader.CONST.js](),
            })
            .plugins(plugins)
            .append(append)
            .done();
    }
}