module.exports = {
    config() {
        return {

            devServer: {
                port: 13003
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
    }
};
