module.exports = {
    config(){
        return {
            devServer: {
                port: 13010
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
    after({rigger, itemConfig, processArgv}) {
        let entry = {};
        let plugins = [];

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
