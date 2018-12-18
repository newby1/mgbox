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
        rigger
            .module({
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
