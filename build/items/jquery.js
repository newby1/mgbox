const Const = require("../const.js");
const PreConfigFactory = require("../rigger/pre-config-factory");
module.exports = {
    run(processArgv){
        return new PreConfigFactory(processArgv)
            .run({
                config: {
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
                },
                external(rigger, itemConfig, processArgv) {
                    let entry = {};
                    let plugins = [];

                    return rigger
                        .plugins(plugins)
                        .done();

                }
            })
    }
};

