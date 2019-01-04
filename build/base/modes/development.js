const path = require("path");

const Loader = require("../../helpers/loaders");
const Plugins = require("../../helpers/plugins");
const Helper = require("../../helpers/helper");
const Const = require("../../const");
module.exports = {
    run({rigger, itemConfig, processArgv}) {
        let preWebpackConfig = rigger.getConfig();
        let entry = {};
        let plugins = [];

        if (!processArgv.ssr){
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
        }
        rigger
            .module({
                [Loader.CONST.less]: {
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
