module.exports = {
    run({rigger, itemConfig, processArgv, Plugins, Const, Helper, preWebpackConfig}) {
        Helper.log(processArgv.debug, `env: local`);
        if (processArgv.render === Const.RENDERS.SERVER){
            let extractCssPublicPath = "/";
            let htmlFileNamePath = "";
            let outputPublicPath = extractCssPublicPath;

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
        let entry = {};
        let plugins = [];

        let extractCssPublicPath = "/";
        let htmlFileNamePath = "";
        let outputPublicPath = extractCssPublicPath;

        let ip = Helper.getIPAdress();
        // for(let key in preWebpackConfig.entry){
        //     preWebpackConfig.entry[key].splice(0, 0, "webpack/hot/dev-server", `webpack-dev-server/client?http://${ip}:${itemConfig.devServer.port}/`)
        // }

        plugins.push(
            // Plugins[Plugins.CONST.namedModulesPlugin](),
            // Plugins[Plugins.CONST.hotReplace](),
            // Plugins[Plugins.CONST.htmlIncludeAssets]({
            //     assets: ["webpack-dev-server.js"],
            //     publicPath: outputPublicPath,
            //     append: false,
            // }),
            Plugins[Plugins.CONST.liveReloadPlugin](),

            Plugins[Plugins.CONST.htmlIncludeAssets]({
                assets: [`http://${ip}:35729/livereload.js`],
                publicPath: "",
                append: false,
            })
        );

        rigger.entry(entry)
            .output({
                publicPath: outputPublicPath
            })
            .helper({
                extractCssPublicPath,
                outputPublicPath,
                htmlFileNamePath
            })
            .plugins(plugins);

        return rigger.done();
    }
};
