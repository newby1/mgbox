const path = require("path");
const fs = require("fs");

module.exports = {
    run({rigger, itemConfig, processArgv, Helper, Loaders, Plugins, Const}) {
        Helper.log(processArgv.debug, "mode: development");
        let preWebpackConfig = rigger.getConfig();
        let entry = {};
        let plugins = [];

        Helper.getApps(itemConfig.absolutePath.appsPath, processArgv.apps)
            .forEach((val) => {
                let name = path.basename(val);
                let templateContent = fs.readFileSync(path.resolve(val, "index.html"), "utf8");
                if (processArgv.tpl){
                        const data = require(path.resolve(Const.MOCKS_PATH, "tpldata.js"));
                        templateContent = require("ejs").render(templateContent, data);
                }
                plugins.push(
                    Plugins[Plugins.CONST.htmlWebpackPlugin]({
                        chunks: [name],
                        templateContent,
                        filename:  `${preWebpackConfig.helper.htmlFileNamePath}${name}.html`,
                        inject: true
                    })
                );
            });
        rigger
            .module({
                [Loaders.CONST.less]: {
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
            })
            .plugins(plugins)
            .append({
                devtool: "eval-source-map",
                mode: Const.MODES.DEVELOPMENT
            });
        return rigger.done();
    }
};
