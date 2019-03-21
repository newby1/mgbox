const path = require("path");
module.exports = {
    config() {
        return {
            devServer: {
                port: 13001
            },
            buildAssets: {
                js: [],
                css: []
            },
            dll: {
                entry: {
                    "vendor": ["babel-polyfill", "url-polyfill"],
                    "vueVendor": [ "vue/dist/vue.esm.js", "vue-router", "vuex"],
                    //"elementUI": ["element-ui","element-ui/lib/theme-chalk/index.css"],
                }
            }
        }
    },
    after({ rigger, Loaders, Const, itemConfig }){
        return rigger
            .module({
                [Loaders.CONST.ts]: {
                    use: {
                        options: {
                            configFile: path.resolve(Const.PLUGINS_CONFIG_PATH, `./${itemConfig.itemName}/tsconfig.json`)
                        }
                    }
                }
            })
            .append({
                resolve: {
                    alias: {
                        "vue$": "vue/dist/vue.esm.js",
                    }
                }
            })
            .done();

    }
};
