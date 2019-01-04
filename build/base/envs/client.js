const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");
const Rigger = require("../../rigger/rigger");
const Helper = require("../../helpers/helper");
const Plugins = require("../../helpers/plugins");
const Loader = require("../../helpers/loaders");
module.exports = {
    run({rigger, itemConfig, processArgv}) {
        let entry = {};
        let plugins = [];

        let extractCssPublicPath = "../";
        let outputPublicPath = `../static/${itemConfig.itemName}/`;
        let htmlFileNamePath = `${itemConfig.absolutePath.distItemPath}/`;

        rigger
            .output({
                publicPath: outputPublicPath
            })
            .module({
                [Loader.CONST.less]: {
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: extractCssPublicPath
                            }
                        }
                    ]
                }
            })
            .helper({
                extractCssPublicPath,
                outputPublicPath,
                htmlFileNamePath
            });
        return rigger.done();
    }
};
