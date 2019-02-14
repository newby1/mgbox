module.exports = {
    config({Const}) {
        return {
            frame: Const.FRAMES.REACT,
            devServer: {
                port: 13007
            },
            dll: {
                assets: {
                },
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
