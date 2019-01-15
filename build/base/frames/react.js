const extend = require('extend');
module.exports = {
    run({rigger, itemConfig, processArgv, Loaders, Plugins}) {
        let append = {
            resolve: {
                alias: {}
            }
        };
        if (processArgv.ssr){
            extend(true, append, {
                target: "node"
            })
        }
        return  rigger
            .module({
                [Loaders.CONST.jsx]: Loaders[Loaders.CONST.jsx](),
            })
            .plugins([
                Plugins[Plugins.CONST.happypack]({
                    id: "jsx",
                    loaders: [ {
                        loader: "babel-loader",
                        options: {
                            "presets": ["@babel/preset-env", "@babel/preset-react"],
                        }
                    } ]
                })
            ])
            .append(append)
            .done();
    }
};
