const path = require("path");
module.exports = {
    config() {
        return {

            devServer: {
                port: 13001
            },
            dll: {
                assets: {
                    //css: [`styles/elementUI.css`]
                },
                entry: {
                    "vendor": ["babel-polyfill", "url-polyfill"],
                    "vue": [ "vue/dist/vue.esm.js"],
                    "vueRouter": [ "vue-router"],
                    "vuex": [ "vuex"],
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
            .done();

    }
};
