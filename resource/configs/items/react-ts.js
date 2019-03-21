module.exports = {
    config({Const}) {
        return {
            devServer: {
                port: 13012
            },
            buildAssets: {
                js: [],
                css: []
            },
            dll: {
                entry: {
                    "vendor": ["babel-polyfill", "url-polyfill"],
                    "reactVendor": [ "react", "react-dom","react-redux"]
                }
            }
        }
    },
    after({rigger, itemConfig, processArgv}) {
        let entry = {};
        let plugins = [];

        return rigger
            .plugins(plugins)
            .done();

    }
};
