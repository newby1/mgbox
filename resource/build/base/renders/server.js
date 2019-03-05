const path = require("path");
const nodeExternals = require("webpack-node-externals");


module.exports = {
    run({rigger, itemConfig, processArgv, Helper, Plugins, Const}) {
        Helper.log(processArgv.debug, "render: server");
        const isLocal = processArgv.env === Const.ENVS.LOCAL;
        const filename = isLocal
            ?
            `${itemConfig.relativePath.scripts}/[name].js`
            :
            `${itemConfig.dist.ssr.path}/[name].js`;

        let entry = {};
        let plugins = [];
        let output = {
            filename,
            libraryTarget: "commonjs2"
        };
        let append = {
            target: "node",
            externals: [
                nodeExternals({
                    whitelist: /\.css/
                })
            ]
        };
        let entryFile = `server.${itemConfig.entryJsExt}`;

        Helper.getSSRApps(itemConfig.absolutePath.appsPath, processArgv.apps)
            .forEach((val) => {
                let name = path.basename(val);
                entry[`server-${name}`] = [ path.resolve(val, entryFile) ];

            });

        if (isLocal){

            plugins.push(
                Plugins[Plugins.CONST.webpackManifestPlugin]({
                    fileName: "ssr-manifest.json"
                })
            );
        }
        rigger.entry(entry)
            .output(output)
            .append(append)
            .plugins(plugins);
        return rigger.done();
    }
};

