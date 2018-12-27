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
        let output = {
            path: itemConfig.absolutePath.distStaticPath,
            publicPath: `/`,
            filename: `../${itemConfig.itemName}/[name]_[hash:8].js`,
            libraryTarget: "commonjs2"
        };

        Helper.getSSRApps(itemConfig.absolutePath.appsPath, processArgv.apps)
            .forEach((val) => {
                let name = path.basename(val);
                    entry[`server-${name}`] = [
                        path.resolve(val, "server.js")
                    ];

            });
        rigger.entry(entry)
            .output(output);
        return rigger.done();
    }
};

