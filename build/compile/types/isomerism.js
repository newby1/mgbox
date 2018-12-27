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
            filename: `${itemConfig.relativePath.scripts}/[name]_[hash:8].js`
        };

        Helper.getApps(itemConfig.absolutePath.appsPath, processArgv.apps)
            .forEach((val) => {
                let name = path.basename(val);
                    entry[name] = [
                        "babel-polyfill",
                        path.resolve(val, "index.js"),
                        path.resolve(val, "index.less")
                    ];

            });
        rigger.entry(entry)
            .output(output);
        return rigger.done();
    }
};

