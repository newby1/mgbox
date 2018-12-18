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

        let extractCssPublicPath = `/${itemConfig.appName}/`;
        let outputPublicPath = extractCssPublicPath;

        Helper.getApps(itemConfig.absolutePath.appPath, processArgv.apps)
            .forEach((val) => {
                let name = path.basename(val);
                plugins.push(
                    Plugins[Plugins.CONST.htmlWebpackPlugin]({
                        chunks: [name],
                        template: path.resolve(val, "index.html"),
                        filename:  `${itemConfig.absolutePath.distAppPath}/${name}.html`,
                        inject: true
                    })
                );
            });
        rigger
            .output({
                publicPath: outputPublicPath
            })
            .plugins(plugins)
            .helper({
                extractCssPublicPath,
                outputPublicPath
            });
        return rigger.done();
    }
};
