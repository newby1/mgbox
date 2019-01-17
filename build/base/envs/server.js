module.exports = {
    run({rigger, itemConfig, processArgv, Helper}) {
        Helper.log(processArgv.debug, `env: local`);
        let entry = {};
        let plugins = [];

        let extractCssPublicPath = `/${itemConfig.itemName}/`;
        if (processArgv.cdn){
            extractCssPublicPath = `${itemConfig.cdn.host}${extractCssPublicPath}`;
        }
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
