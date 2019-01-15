const path = require("path");
const extend = require('extend');
const Const = require("../../const");
module.exports = {
    run({rigger, itemConfig, processArgv, Helper, Plugins, Loaders}) {
        let entry = {};
        let append = {
            resolve: {
                alias: {
                    "vue$": "vue/dist/vue.js",
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
        /*
        if (processArgv.ssr){
            if (processArgv.ssr === Const.RENDERS.SERVER){
                plugins.push(Plugins[Plugins.CONST.vueServerRenderer]());
                extend(append, {
                    target: "node"
                })
            }
            if (processArgv.ssr === Const.RENDERS.CLIENT){
                plugins.push(Plugins[Plugins.CONST.vueSSRClientPlugin]());
            }
        }
        */
        return  rigger
            .module({
                [Loaders.CONST.vue]: Loaders[Loaders.CONST.vue](),
                [Loaders.CONST.js]: Loaders[Loaders.CONST.js](),
            })
            .plugins(plugins)
            .append(append)
            .done();
    }
};
