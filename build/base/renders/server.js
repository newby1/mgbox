const path = require("path");
const nodeExternals = require("webpack-node-externals");


module.exports = {
    run({rigger, itemConfig, processArgv, Helper, Plugins, Const}) {
        Helper.log(processArgv.debug, "render: server");
        const isLocal = processArgv.env === Const.ENVS.LOCAL;
        const serverPath = `../../${processArgv.item}`;
        const filename = isLocal
            ?
            `${itemConfig.relativePath.scripts}/[name].js`
            :
            `${serverPath}/[name].js`;

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

            });

        if (isLocal){

            plugins.push(
                Plugins[Plugins.CONST.webpackManifestPlugin]({
                    //fileName: (isLocal ? "" : `${serverPath}/` ) + "ssr-manifest.json"
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

