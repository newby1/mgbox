const path = require("path");
const Rigger = require("../../rigger/rigger");
const Helper = require("../../helpers/helper");
const Plugins = require("../../helpers/plugins");
module.exports = {
    run(context) {
        let rigger = new Rigger(context.configSet);
        let entry = {};
        let plugins = [];
        let configSet = context.configSet;
        let baseConfig = context.baseConfig;
        let option = context.option;

        let extractCssPublicPath = "/";
        let outputPublicPath = extractCssPublicPath;

        for(let key in configSet.entry){
            configSet.entry[key].splice(0, 0, "webpack/hot/dev-server", `webpack-dev-server/client?http://localhost:${baseConfig.devServer.port}/`)
        }
        Helper.getApps(baseConfig.absolutePath.appPath, option.apps)
            .forEach((val) => {
                let name = path.basename(val);
                plugins.push(
                    Plugins[Plugins.CONST.htmlWebpackPlugin]({
                        chunks: [name],
                        template: path.resolve(val, "index.html"),
                        filename:  `${name}.html`,
                        inject: true
                    })
                );
            });
        plugins.push(
            Plugins[Plugins.CONST.liveReloadPlugin](),
            Plugins[Plugins.CONST.namedModulesPlugin](),
            Plugins[Plugins.CONST.hotReplace](),
            Plugins[Plugins.CONST.htmlIncludeAssets]({
                assets: ["webpack-dev-server.js"],
                publicPath: outputPublicPath,
                append: false,
            }),
            Plugins[Plugins.CONST.htmlIncludeAssets]({
                assets: [`http://localhost:35729/livereload.js`],
                publicPath: "",
                append: false,
            })
        );
        rigger.entry(entry)
            .helper({
                extractCssPublicPath,
                outputPublicPath
            })
            .plugins(plugins);

        return rigger.done();
    }
};
