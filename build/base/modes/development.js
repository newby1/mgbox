const path = require("path");
const fs = require("fs");

module.exports = {
    run({rigger, itemConfig, processArgv, Helper, Loaders, Plugins, Const}) {
        Helper.log(processArgv.debug, "mode: development");
        let preWebpackConfig = rigger.getConfig();
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
                            plugins: [
                                require("autoprefixer")
                            ]
                        }
                    }
                ]

            }
        };
        if (processArgv.eslint){
            module[Loaders.CONST.eslint] = Loaders[Loaders.CONST.eslint]();
        }

        Helper.getApps(itemConfig.absolutePath.appsPath, processArgv.apps)
            .forEach((val) => {
                let name = path.basename(val);
                plugins.push(
                    Plugins[Plugins.CONST.htmlWebpackPlugin]({
                        chunks: [name],
                        template: path.resolve(val, "index.html"),
                        filename:  `${preWebpackConfig.helper.htmlFileNamePath}${name}.html`,
                        inject: true
                    })
                );
            });

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
