const webpack = require("webpack");
module.exports = {
    config() {
        return {

            devServer: {
                port: 13000
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
    after({ rigger, itemConfig}){
        let plugins = [ ];
        return rigger
            .plugins(plugins)
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

