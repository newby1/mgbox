const path = require("path");
const Rigger = require("../rigger/rigger");
const Helper = require("./helper");
const Loader = require("./loaders");
const Plugins = require("./plugins");
const extend = require("extend");

module.exports = {
    run(context) {
        let preWebpackConfig = context.preWebpackConfig;
        let itemConfig = context.itemConfig;
        let processArgv = context.processArgv;
        let rigger = new Rigger(preWebpackConfig);
        let entry = {};
        let plugins = [];

        plugins.push(
            Plugins[Plugins.CONST.definePlugin]( {
                "_ENV": JSON.stringify(processArgv.env),
                "_MOCK": JSON.stringify(processArgv.mock),
                "process.env.NODE_ENV": JSON.stringify(processArgv.mode)
            }),
            Plugins[Plugins.CONST.extractCss]( {
                filename: `${itemConfig.relativePath.styles}/[name]_[contenthash].css`,
            } ),
            Plugins[Plugins.CONST.copy]([{
                from: `${itemConfig.absolutePath.staticPath}/${itemConfig.relativePath.scriptLibraries}`,
                to: itemConfig.relativePath.scriptLibraries
            }]),
            Plugins[Plugins.CONST.htmlIncludeAssets]({
                assets: [ ...itemConfig.dll.assets.css,  ...itemConfig.buildAssets.css],
                append: false,
            }),
            Plugins[Plugins.CONST.htmlIncludeAssets]({
                assets: [ ...itemConfig.dll.assets.js,  ...itemConfig.buildAssets.js],
                append: false,
            })
        );
        rigger.module({
                [Loader.CONST.html]: Loader[Loader.CONST.html](),
                [Loader.CONST.less]: Loader[Loader.CONST.less](),
                [Loader.CONST.pic]: Loader[Loader.CONST.pic]({
                    use: {
                        options: {
                            name: `${itemConfig.relativePath.images}/[name]_[hash:8].[ext]`
                        }
                    }
                }),
                [Loader.CONST.font]: Loader[Loader.CONST.font]({
                    use: {
                        options: {
                            name: `${itemConfig.relativePath.fonts}/[name]_[hash:8].[ext]`,
                        }
                    }
                }),
            })
            .plugins(plugins)
            .append({
                resolve: {
                    alias: {
                        "$staticPath": itemConfig.absolutePath.staticPath,
                        "$appsPath": itemConfig.absolutePath.appsPath
                    }
                }
            });
        return rigger.done();
    }
};

