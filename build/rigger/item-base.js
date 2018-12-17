const path = require("path");
const Rigger = require("../rigger/rigger");
const Helper = require("../helpers/helper");
const Loader = require("../helpers/loaders");
const Plugins = require("../helpers/plugins");
module.exports = {
    run(context) {
        let baseConfig = context.baseConfig;
        let option = context.option;
        let configSet = context.configSet;
        let rigger = new Rigger(configSet);
        let entry = {};
        let plugins = [];
        Helper.getApps(baseConfig.absolutePath.appPath, option.apps)
            .forEach((val) => {
                let name = path.basename(val);
                entry[name] = [
                    "babel-polyfill",
                    path.resolve(val, "index.js"),
                    path.resolve(val, "index.less")
                ];
            });
        plugins.push(
            Plugins[Plugins.CONST.definePlugin]( {
                "_ENV": JSON.stringify(option.env),
                "_MOCK": JSON.stringify(option.mock),
                "process.env.NODE_ENV": JSON.stringify(option.mode)
            }),
            Plugins[Plugins.CONST.extractCss]( {
                filename: `${baseConfig.relativePath.styles}/[name]_[contenthash].css`,
            } ),
            Plugins[Plugins.CONST.copy]([{
                from: `${baseConfig.absolutePath.staticPath}/${baseConfig.relativePath.scriptLibraries}`,
                to: baseConfig.relativePath.scriptLibraries
            }]),
            Plugins[Plugins.CONST.htmlIncludeAssets]({
                assets: [ ...baseConfig.dll.assets.css,  ...baseConfig.buildAssets.css],
                append: false,
            }),
            Plugins[Plugins.CONST.htmlIncludeAssets]({
                assets: [ ...baseConfig.dll.assets.js,  ...baseConfig.buildAssets.js],
                append: false,
            }),
            Plugins[Plugins.CONST.happypack]({
                id: "js",
                loaders: [ {
                    loader: "babel-loader"
                } ]
            })
        );
        rigger.entry(entry)
            .output({
                path: baseConfig.absolutePath.distStaticPath,
                publicPath: `/`,
                filename: `${baseConfig.relativePath.scripts}/[name]_[hash:8].js`
            })
            .module({
                [Loader.CONST.js]: Loader[Loader.CONST.js](),
                [Loader.CONST.html]: Loader[Loader.CONST.html](),
                [Loader.CONST.less]: Loader[Loader.CONST.less](),
                [Loader.CONST.pic]: Loader[Loader.CONST.pic]({
                    use: {
                        options: {
                            name: `${baseConfig.relativePath.images}/[name]_[hash:8].[ext]`
                        }
                    }
                }),
                [Loader.CONST.font]: Loader[Loader.CONST.font]({
                    use: {
                        options: {
                            name: `${baseConfig.relativePath.fonts}/[name]_[hash:8].[ext]`,
                        }
                    }
                }),
            })
            .plugins(plugins)
            .append({
                mode: option.buildMode,
                resolve: {
                    alias: {
                        "$staticPath": baseConfig.absolutePath.staticPath,
                        "$appsPath": baseConfig.absolutePath.appPath
                    }
                }
            });
        return rigger.done();
    }
};

