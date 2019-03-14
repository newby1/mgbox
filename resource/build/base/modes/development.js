const path = require("path");
const fs = require("fs");

module.exports = {
    run({rigger, itemConfig, processArgv, Helper, Loaders, Plugins, Const}) {
        Helper.log(processArgv.debug, "mode: development");
        let entry = {};
        let plugins = [];
        let module = {
            [Loaders.CONST[itemConfig.cssProcessor]]: {
                use: [
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            config:{
                                path: `${itemConfig.absolutePath.configPath}`,
                                ctx: {
                                    env: processArgv.mode,
                                    processArgv,
                                    itemConfig
                                }
                            },
                        }
                    }
                ]

            }
        };
        if (processArgv.eslint){
            module[Loaders.CONST.eslint] = Loaders[Loaders.CONST.eslint]({
                eslintPath: `${itemConfig.configPath}/.eslintrc.json`
            });
        }


        rigger
            .module(module)
            .plugins(plugins)
            .append({
                devtool: "eval-source-map",
                mode: Const.MODES.DEVELOPMENT
            });
        return rigger.done();
    }
};
