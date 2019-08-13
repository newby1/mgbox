const path = require("path");
const fs = require('fs');

module.exports = {
    run({rigger, itemConfig, processArgv, Loaders, Plugins, Helper, Const}) {
        Helper.log(processArgv.debug, "render: client");
        let entry = {};
        let plugins = [];
        let entryFile = `index.${itemConfig.entryJsExt}`;

        Helper.getApps(itemConfig.absolutePath.appsPath, processArgv.apps)
            .forEach((val) => {
                let name = path.basename(val);
                let fileCss = `index.${itemConfig.entryCssExt}`;
                let defaultEntryCss = path.resolve(val, fileCss);
                if (!fs.existsSync(defaultEntryCss)){
                    defaultEntryCss = path.resolve(`${itemConfig.absolutePath.staticPath}/${itemConfig.relativePath.styles}/${name}`, fileCss);
                }
                entry[name] = [
                    "babel-polyfill",
                    path.resolve(val, entryFile),
                    defaultEntryCss
                ];

            });

        plugins.push(
            Plugins[Plugins.CONST.extractCss]( {
                filename: `${itemConfig.relativePath.styles}/[name]_[${Helper.getHashTag(processArgv.env === Const.ENVS.LOCAL)}].css`,
            } ),
            Plugins[Plugins.CONST.webpackManifestPlugin](),
        );
        //加载公共资源

        [...itemConfig.buildAssets.css, ...itemConfig.buildAssets.js].forEach(val => {
            let option = {
                tags: [val],
                append: false,
            };
            if (/\/\//.test(val)){
                option.publicPath = "";
            }
            plugins.unshift( Plugins[Plugins.CONST.htmlIncludeAssets](option) );
        });

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

