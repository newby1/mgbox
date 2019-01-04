const path = require("path");

module.exports = {
    run({rigger, itemConfig, processArgv, Loaders, Plugins, Helper}) {
        let entry = {};
        let plugins = [];

        Helper.getApps(itemConfig.absolutePath.appsPath, processArgv.apps)
            .forEach((val) => {
                let name = path.basename(val);
                entry[name] = [
                    "babel-polyfill",
                    path.resolve(val, "index.js"),
                    path.resolve(val, "index.less")
                ];

            });

        plugins.push(
            Plugins[Plugins.CONST.definePlugin]( {
                "_ENV": JSON.stringify(processArgv.env),
                "_MOCK": JSON.stringify(processArgv.mock),
                "process.env.NODE_ENV": JSON.stringify(processArgv.mode)
            }),
            Plugins[Plugins.CONST.extractCss]( {
                filename: `${itemConfig.relativePath.styles}/[name]_[contenthash].css`,
            } ),
            Plugins[Plugins.CONST.copy]([{
                from: `${itemConfig.absolutePath.staticPath}/${itemConfig.relativePath.scriptLibraries}`,
                to: itemConfig.relativePath.scriptLibraries
            }]),

            Plugins[Plugins.CONST.htmlIncludeAssets]({
                assets: [ ...itemConfig.dll.assets.css,  ...itemConfig.buildAssets.css],
                append: false,
            }),
            Plugins[Plugins.CONST.htmlIncludeAssets]({
                assets: [ ...itemConfig.dll.assets.js,  ...itemConfig.buildAssets.js],
                append: false,
            })
        );
        rigger
            .entry(entry)
            .plugins(plugins);

        return rigger.done();
    }
};

