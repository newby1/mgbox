const path = require("path");

const del = require("del");

const Rigger = require("../../rigger/rigger");
const Loader = require("../../helpers/loaders");
const Plugins = require("../../helpers/plugins");
const Helper = require("../../helpers/helper");
const Const = require("../../const");
module.exports = {
    run(context) {
        let preWebpackConfig = context.preWebpackConfig;
        let itemConfig = context.itemConfig;
        let processArgv = context.processArgv;
        let rigger = new Rigger(preWebpackConfig);
        let entry = {};
        let plugins = [];
        //删除 manifest,dist
        console.log("delete dist and manifest");
        try {
            del.sync([Const.MANIFEST_PATH, Const.DIST_PATH])
        } catch(e) {
        }

        Helper.getApps(itemConfig.absolutePath.appsPath, processArgv.apps)
            .forEach((val) => {
                let name = path.basename(val);
                plugins.push(
                    Plugins[Plugins.CONST.htmlWebpackPlugin]({
                        chunks: [name],
                        template: path.resolve(val, "index.html"),
                        filename:  `${itemConfig.absolutePath.distAppPath}/${name}.html`,
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

        if (processArgv.cdn){
            plugins.push(
                Plugins[Plugins.CONST.cdn](itemConfig.cdn)
            );
            rigger.module({
                [Loader.CONST.font]: {
                    use: {
                        options: {
                            publicPath: function (url) {
                                let res = Helper.getCdnUrl(`${preWebpackConfig.output.publicPath}${url}`, itemConfig.cdn.host, itemConfig.cdn.exts);
                                return res;
                            }
                        }
                    }
                },
                [Loader.CONST.pic]: {
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
        plugins.push(
            Plugins[Plugins.CONST.uglify]()
        );
        rigger
            .module({
                [Loader.CONST.html]: {
                    use: [
                        {
                            loader: "html-loader",
                            options: {
                                minimize: true
                            }
                        }
                    ]
                },
                [Loader.CONST.less]: {
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
