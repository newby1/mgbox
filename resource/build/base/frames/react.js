const extend = require('extend');
const path = require("path");
module.exports = {
    run({rigger, itemConfig, processArgv, Loaders, Plugins, Const, Helper}) {
        Helper.log(processArgv.debug, `frame: react`);
        let append = {
            resolve: {
                alias: {}
            }
        };
        let module = {
            [Loaders.CONST.jsx]: Loaders[Loaders.CONST.jsx](),
        };
        return  rigger
            .module(module)
            .plugins([
                Plugins[Plugins.CONST.happypack]({
                    id: "jsx",
                    loaders: [ {
                        loader: "babel-loader",
                        options: {
                            configFile: `${itemConfig.absolutePath.loadersConfigPath}/.babelrc`
                        }
                    } ]
                })
            ])
            .append(append)
            .done();
    }
};
