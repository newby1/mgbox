const webpack = require("webpack");
module.exports = {
    config() {
        return {
            "tplEngine": "velocity",
            devServer: {
                port: 13000
            },
            cdn: {
                host: "//s[0,1,2,3,4].abc.com"
            },
            buildAssets:{
                js: [
                    "http://a.b.com/a.js",
                    "script/libraries/lib.js"
                ]
            },
            dll: {
                assets: {
                    css: [`styles/elementUI.css`]
                },
                entry: {
                    "vendor": ["babel-polyfill", "url-polyfill"],
                    "vueVendor": [ "vue/dist/vue.esm.js", "vue-router", "vuex"],
                    "elementUI": ["element-ui","element-ui/lib/theme-chalk/index.css"],
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

