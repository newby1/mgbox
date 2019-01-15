const path = require("path");
const nodeExternals = require("webpack-node-externals");


module.exports = {
    run({rigger, itemConfig, processArgv, Helper, Plugins, Const}) {
        const filename = processArgv.env === Const.ENVS.LOCAL
            ?
            `${itemConfig.relativePath.scripts}/[name]_[hash:8].js`
            :
            `../../${itemConfig.relativePath.scripts}/[name]_[contenthash:8].js`;

        let entry = {};
        let plugins = [];
        let output = {
            filename,
            libraryTarget: "commonjs2"
        };
        let append = {
            externals: [
                nodeExternals({
                    whitelist: /\.css/
                })
            ]
        };

        Helper.getSSRApps(itemConfig.absolutePath.appsPath, processArgv.apps)
            .forEach((val) => {
                let name = path.basename(val);
                entry[`server-${name}`] = [ path.resolve(val, "server.js") ];
                /*
                plugins.push(
                    Plugins[Plugins.CONST.copy]([{
                        from: `${itemConfig.absolutePath.appsPath}/${name}/index.html`,
                        to: `../${processArgv.item}/${name}.html`
                    }])
                )
                */

            });

        plugins.push(
            Plugins[Plugins.CONST.definePlugin]( {
                "ENV": processArgv.mode,
                "process.env": processArgv.mode,
                "process.env.VUE_ENV": `${Const.RENDERS.SERVER}`
            }),
            Plugins[Plugins.CONST.webpackManifestPlugin]({
                fileName: "ssr-manifest.json"
            })
        );
        rigger.entry(entry)
            .output(output)
            .append(append)
            .plugins(plugins);
        return rigger.done();
    }
};

