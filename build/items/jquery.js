module.exports = {
    config({Const}) {
        return {
            frame: Const.FRAMES.JQUERY,
            devServer: {
                port: 13005
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
