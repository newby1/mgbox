const path = require("path");
const Rigger = require("../../rigger/rigger");
const Loader = require("../../helpers/loaders");
const Plugins = require("../../helpers/plugins");
const Helper = require("../../helpers/helper");
const Const = require("../../const");
module.exports = {
    run({rigger, itemConfig, processArgv}) {
        let entry = {};
        let plugins = [];

        let extractCssPublicPath = `/${itemConfig.itemName}/`;
        let outputPublicPath = extractCssPublicPath;
        let htmlFileNamePath = `${itemConfig.absolutePath.distItemPath}/`;

        rigger
            .output({
                publicPath: outputPublicPath
            })
            .helper({
                extractCssPublicPath,
                outputPublicPath,
                htmlFileNamePath
            });
        return rigger.done();
    }
};
