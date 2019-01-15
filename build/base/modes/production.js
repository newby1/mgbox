const path = require("path");


module.exports = {
    run({rigger, itemConfig, processArgv, Loaders, Plugins}) {
        let entry = {};
        let plugins = [];
        //删除 manifest,dist
        console.log("delete dist and manifest");

        Helper.getApps(itemConfig.absolutePath.appsPath, processArgv.apps)
            .forEach((val) => {
                let name = path.basename(val);
                plugins.push(
                    Plugins[Plugins.CONST.htmlWebpackPlugin]({
                        chunks: [name],
                        template: path.resolve(val, "index.html"),
                        filename:  `${itemConfig.absolutePath.distItemPath}/${name}.html`,
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

        /*
        if (processArgv.cdn){
            plugins.push(
                Plugins[Plugins.CONST.cdn](itemConfig.cdn)
            );
            rigger.module({
                [Loaders.CONST.font]: {
                    use: {
                        options: {
                            publicPath: function (url) {
                                let res = Helper.getCdnUrl(`${preWebpackConfig.output.publicPath}${url}`, itemConfig.cdn.host, itemConfig.cdn.exts);
                                return res;
                            }
                        }
                    }
                },
                [Loaders.CONST.pic]: {
                    use: {
                        options: {
                            publicPath: function (url) {
                                let res = Helper.getCdnUrl(`${preWebpackConfig.output.publicPath}${url}`, itemConfig.cdn.host, itemConfig.cdn.exts);
                                return res;
                            }
                        }
                    }
                }
            });
        }
        */
        plugins.push(
            Plugins[Plugins.CONST.uglify]()
        );
        rigger
            .module({
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
                [Loaders.CONST.less]: {
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
                                plugins: [
                                    require("autoprefixer"),
                                    require("cssnano")({
                                        preset: "default"
                                    })
                                ]
                            }
                        }
                    ]

                }
            })
            .plugins(plugins)
            .append({
                mode: Const.MODES.PRODUCTION
            });
        return rigger.done();
    }
};
