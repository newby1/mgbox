const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");
const Rigger = require("../../rigger/rigger");
const Helper = require("../../helpers/helper");
const Plugins = require("../../helpers/plugins");
const Loader = require("../../helpers/loaders");
module.exports = {
    run(context) {
        let preWebpackConfig = context.preWebpackConfig;
        let itemConfig = context.itemConfig;
        let processArgv = context.processArgv;
        let rigger = new Rigger(preWebpackConfig);
        let entry = {};
        let plugins = [];

        let extractCssPublicPath = "../";
        let outputPublicPath = `../static/${itemConfig.itemName}/`;

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
                outputPublicPath
            });
        return rigger.done();
    }
};
