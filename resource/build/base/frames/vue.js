const path = require("path");
const extend = require('extend');
const Const = require("../../const");
module.exports = {
    run({rigger, itemConfig, processArgv, Helper, Plugins, Loaders}) {
        Helper.log(processArgv.debug, `frame: vue`);
        let entry = {};
        let append = {
        };
        let loaders = [ {
            loader: "babel-loader"
        } ];

        let plugins = [
            Plugins[Plugins.CONST.vueLoaderPlugin](),
            Plugins[Plugins.CONST.happypack]({
                id: "js",
                loaders
            })
        ];
        let module = {
            [Loaders.CONST.vue]: Loaders[Loaders.CONST.vue](),
            [Loaders.CONST.js]: Loaders[Loaders.CONST.js](),
        };
        if (itemConfig.ts){
            module[Loaders.CONST.ts] = {
                use: [{
                    loader: "ts-loader",
                    options: {
                        appendTsSuffixTo: [/\.vue$/]
                    }
                }]
            }
        }
        return  rigger
            .module(module)
            .plugins(plugins)
            .append(append)
            .done();
    }
};
