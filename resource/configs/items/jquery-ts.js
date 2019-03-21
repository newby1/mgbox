module.exports = {
    config({Const}) {
        return {
            devServer: {
                port: 13011
            },
            buildAssets: {
                js: ["scripts/libraries/jquery-1.12.4.min.js"]
            },
            dll: {
                entry: {
                    "vendor": ["babel-polyfill"],
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
