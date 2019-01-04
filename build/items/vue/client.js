module.exports = {
    config: {
        devServer: {
            port: 13003
        },
        dll: {
            assets: {
                //css: [`styles/elementUI.css`]
            },
            entry: {
                "vendor": ["babel-polyfill", "url-polyfill"],
                "vue": [ "vue/dist/vue.js"],
                "vueRouter": [ "vue-router"],
                "vuex": [ "vuex"],
                //"elementUI": ["element-ui","element-ui/lib/theme-chalk/index.css"],
            }
        }
    },
    external({rigger, itemConfig, processArgv}) {
        let entry = {};
        let plugins = [];

        return rigger
            .plugins(plugins)
            .done();

    }
};
