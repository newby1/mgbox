module.exports = {
    run({rigger, itemConfig, processArgv, Plugins, Const, Helper, preWebpackConfig}) {
        Helper.log(processArgv.debug, `env: local`);
        let distConfig = itemConfig.dist[processArgv.env];
        if (processArgv.render === Const.RENDERS.SERVER){
            return rigger.done();
        }
        let entry = {};
        let plugins = [];

        let ip = Helper.getIPAdress();
        for(let key in preWebpackConfig.entry){
            preWebpackConfig.entry[key].unshift(`webpack-dev-server/client?http://${ip}:${itemConfig.devServer.port}/`)
        }

        plugins.push(
            Plugins[Plugins.CONST.namedModulesPlugin](),
            Plugins[Plugins.CONST.hotReplace](),
            Plugins[Plugins.CONST.htmlIncludeAssets]({
                tags: ["webpack-dev-server.js"],
                publicPath: distConfig.publicPath,
                append: false,
            }),
            //Plugins[Plugins.CONST.liveReloadPlugin](),
            // Plugins[Plugins.CONST.htmlIncludeAssets]({
            //     assets: [`http://${ip}:35729/livereload.js`],
            //     publicPath: "",
            //     append: false,
            // })
        );

        rigger.entry(entry)
            .plugins(plugins);

        return rigger.done();
    }
};
