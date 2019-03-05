const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");
module.exports = {
    run({rigger, itemConfig, processArgv, Loaders, Helper}) {
        Helper.log(processArgv.debug, `env: client`);
        let entry = {};
        let plugins = [];
        let distConfig = itemConfig.dist[processArgv.env];

        let module = {
            [Loaders.CONST[itemConfig.cssProcessor]]: {
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: distConfig.staticPublicPath
                        }
                    }
                ]
            }
        };

        rigger
            .module(module);

        return rigger.done();
    }
};
