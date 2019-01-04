const path = require("path");

module.exports = {
    run({rigger, itemConfig, processArgv, Helper, Plugins, Const}) {
        let entry = {};
        let plugins = [];
        let output = {
            filename: `../../${itemConfig.itemName}/[name]_[hash:8].js`,
            libraryTarget: "commonjs2"
        };

        Helper.getSSRApps(itemConfig.absolutePath.appsPath, processArgv.apps)
            .forEach((val) => {
                let name = path.basename(val);
                entry[`server-${name}`] = [ path.resolve(val, "server.js") ];

            });

        plugins.push(
            Plugins[Plugins.CONST.definePlugin]( {
                "process.env": processArgv.mode,
                "process.env.VUE_ENV": `${Const.RENDERS.SERVER}`
            }),
            // Plugins[Plugins.CONST.extractCss]( {
            //     filename: `${itemConfig.relativePath.styles}/[name]_[contenthash].css`,
            // })
        );
        rigger.entry(entry)
            .output(output)
            .plugins(plugins);
        return rigger.done();
    }
};

