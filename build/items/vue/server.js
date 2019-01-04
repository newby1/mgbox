module.exports = {
    env({rigger, itemConfig, processArgv, Plugins, Loaders, Const}){
        let extractCssPublicPath = "/";
        let htmlFileNamePath = "";
        let outputPublicPath = extractCssPublicPath;
        if (processArgv.env !== Const.ENVS.LOCAL) {
            extractCssPublicPath = `/${itemConfig.itemName}/`;
            outputPublicPath = extractCssPublicPath;
            htmlFileNamePath = `${itemConfig.absolutePath.distItemPath}/`;
        }

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
    },
    external({rigger, itemConfig, processArgv, Plugins}) {
        let entry = {};
        let plugins = [];
        /*
        plugins.push(Plugins[Plugins.CONST.copy]({

        }));
        */

        return rigger
            .output({

            })
            .plugins(plugins)
            .done();
    }
};

