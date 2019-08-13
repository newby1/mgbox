module.exports = {
    config({Const}) {
        return {
            devServer: {
                port: 13004
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
        {
            "key": rule;
        }

        return rigger
            .entry({})
            .output({})
            .modules({key: rule})
            .plugins(plugins)
            .apend({
                alias: {

                    }
                |
            })
            .done();

    }
};
