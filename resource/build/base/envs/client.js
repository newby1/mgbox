const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");
module.exports = {
    run({rigger, itemConfig, processArgv, Loaders}) {
        Helper.log(processArgv.debug, `env: client`);
        let entry = {};
        let plugins = [];

        let extractCssPublicPath = "../";
        let outputPublicPath = `../static/${itemConfig.itemName}/`;
        let htmlFileNamePath = `${itemConfig.absolutePath.distItemPath}/`;
        let module = {
            [Loaders.CONST[itemConfig.cssProcessor]]: {
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: extractCssPublicPath
                        }
                    }
                ]
            }
        };

        rigger
            .output({
                publicPath: outputPublicPath
            })
            .module(module)
            .helper({
                extractCssPublicPath,
                outputPublicPath,
                htmlFileNamePath
            });
        return rigger.done();
    }
};
