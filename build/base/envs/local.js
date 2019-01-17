module.exports = {
    run({rigger, itemConfig, processArgv, Plugins, Const, Helper}) {
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

        plugins.push(
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
