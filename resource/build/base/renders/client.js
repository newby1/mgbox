const path = require("path");

module.exports = {
    run({rigger, itemConfig, processArgv, Loaders, Plugins, Helper, Const}) {
        Helper.log(processArgv.debug, "render: client");
        let entry = {};
        let plugins = [];
        let entryFile = `index.${itemConfig.entryJsExt}`;

        Helper.getApps(itemConfig.absolutePath.appsPath, processArgv.apps)
            .forEach((val) => {
                let name = path.basename(val);
                entry[name] = [
                    "babel-polyfill",
                    path.resolve(val, entryFile),
                    path.resolve(val, `index.${itemConfig.entryCssExt}`)
                ];

            });

        plugins.push(
            Plugins[Plugins.CONST.extractCss]( {
                filename: `${itemConfig.relativePath.styles}/[name]_[${Helper.getHashTag(processArgv.env === Const.ENVS.LOCAL)}].css`,
            } ),
            Plugins[Plugins.CONST.webpackManifestPlugin](),
            Plugins[Plugins.CONST.htmlIncludeAssets]({
                assets: [ ...itemConfig.dll.assets.css,  ...itemConfig.buildAssets.css],
                append: false,
            }),
            Plugins[Plugins.CONST.htmlIncludeAssets]({
                assets: [ ...itemConfig.dll.assets.js,  ...itemConfig.buildAssets.js],
                append: false,
            })
        );
        let copyLibraries = `${itemConfig.absolutePath.staticPath}/${itemConfig.relativePath.scriptLibraries}`;
        if (require("fs").existsSync(copyLibraries)){
            plugins.push(
                Plugins[Plugins.CONST.copy]([{
                    from: copyLibraries,
                    to: itemConfig.relativePath.scriptLibraries
                }])
            )
        }
        rigger
            .entry(entry)
            .plugins(plugins);

        return rigger.done();
    }
};

