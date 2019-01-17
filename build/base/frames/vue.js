const path = require("path");
const extend = require('extend');
const Const = require("../../const");
module.exports = {
    run({rigger, itemConfig, processArgv, Helper, Plugins, Loaders}) {
        Helper.log(processArgv.debug, `frame: vue`);
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
