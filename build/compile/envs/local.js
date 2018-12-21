const path = require("path");
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

        let extractCssPublicPath = "/";
        let outputPublicPath = extractCssPublicPath;

				let ip = Helper.getIPAdress();
				console.log("address: ", `http://${ip}/${itemConfig.devServer.port}`);

        for(let key in preWebpackConfig.entry){
            //preWebpackConfig.entry[key].splice(0, 0, "webpack/hot/dev-server", `webpack-dev-server/client?http://localhost:${itemConfig.devServer.port}/`)
            preWebpackConfig.entry[key].splice(0, 0, "webpack/hot/dev-server", `webpack-dev-server/client?http://${ip}:${itemConfig.devServer.port}/`)
        }
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
                assets: [`http://${ip}:35729/livereload.js`],
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
