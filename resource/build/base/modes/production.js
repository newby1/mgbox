const path = require("path");
const fs = require('fs');


module.exports = {
    run({rigger, itemConfig, processArgv, Loaders, Plugins, Helper, Const, preWebpackConfig}) {
        Helper.log(processArgv.debug, "mode: produciton");
        let entry = {};
        let plugins = [];
        let distConfig = itemConfig.dist[processArgv.env];
        Helper.getApps(itemConfig.absolutePath.appsPath, processArgv.apps)
            .forEach((val) => {
                let name = path.basename(val);
                plugins.push(
                    Plugins[Plugins.CONST.htmlWebpackPlugin]({
                        chunks: [name],
                        template: path.resolve(val, "index.html"),
                        filename:  `${distConfig.htmlDir}/${name}.html`,
                        inject: true,
                        minify: {
                            collapseWhitespace: true,
                            removeComments: true,
                            removeRedundantAttributes: true,
                            //removeScriptTypeAttributes: true,
                            removeStyleLinkTypeAttributes: true,
                            useShortDoctype: true
                        }
                    })
                );
            });

        if (processArgv.cdn && itemConfig.cdn.handleUrlCallback){
            plugins.push(
                Plugins[Plugins.CONST.cdn](itemConfig.cdn)
            );
            rigger.module({
                [Loaders.CONST.font]: {
                    use: [{
                        loader: "file-loader",
                        options: {
                            publicPath: function (url) {
                                let res = itemConfig.cdn.handleUrlCallback(`${preWebpackConfig.output.publicPath}${url}`);
                                return res;
                            }
                        }
                    }]
                },
                [Loaders.CONST.pic]: {
                    use: [{
                        loader: "url-loader",
                        options: {
                            publicPath: function (url) {
                                let res = itemConfig.cdn.handleUrlCallback(`${preWebpackConfig.output.publicPath}${url}`);
                                return res;
                            }
                        }
                    }]

                }
            });
        }
        let module = {
            [Loaders.CONST.html]: {
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            minimize: true
                        }
                    }
                ]
            },
            [Loaders.CONST[itemConfig.cssProcessor]]: {
                use: [
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: false
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
        rigger
            .module(module)
            .plugins(plugins)
            .append({
                mode: Const.MODES.PRODUCTION
            });
        return rigger.done();
    }
};
