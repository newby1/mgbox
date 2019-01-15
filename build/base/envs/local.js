module.exports = {
    run({rigger, itemConfig, processArgv, Plugins, Const, Helper}) {
        if (processArgv.ssr === Const.RENDERS.SERVER){
            let extractCssPublicPath = "/";
            let htmlFileNamePath = "";
            let outputPublicPath = extractCssPublicPath;

            // if (processArgv.ssr === Const.RENDERS.SERVER){
            //     extractCssPublicPath = `/${itemConfig.itemName}/`;
            //     outputPublicPath = extractCssPublicPath;
            //     htmlFileNamePath = `${itemConfig.absolutePath.distItemPath}/`;
            // }

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
        let preWebpackConfig = rigger.getConfig();
        let entry = {};
        let plugins = [];

        let extractCssPublicPath = "/";
        let htmlFileNamePath = "";
        let outputPublicPath = extractCssPublicPath;

        let ip = Helper.getIPAdress();
        console.log("address: ", `http://${ip}/${itemConfig.devServer.port}`);

        for(let key in preWebpackConfig.entry){
            //preWebpackConfig.entry[key].splice(0, 0, "webpack/hot/dev-server", `webpack-dev-server/client?http://localhost:${itemConfig.devServer.port}/`)
            //preWebpackConfig.entry[key].splice(0, 0, "webpack/hot/dev-server", `webpack-dev-server/client?http://${ip}:${itemConfig.devServer.port}/`)
        }
        plugins.push(
            Plugins[Plugins.CONST.liveReloadPlugin](),
            //Plugins[Plugins.CONST.namedModulesPlugin](),
            //Plugins[Plugins.CONST.hotReplace](),
            // Plugins[Plugins.CONST.htmlIncludeAssets]({
            //     assets: ["webpack-dev-server.js"],
            //     publicPath: outputPublicPath,
            //     append: false,
            // }),
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
