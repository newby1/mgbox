module.exports = {
    run({rigger, Helper, processArgv, Loaders, Plugins}){
        Helper.log(processArgv.debug, `frame: vue`);
        return rigger.module({
                [Loaders.CONST.js]: Loaders[Loaders.CONST.js](),
            })
            .plugins([
                Plugins[Plugins.CONST.happypack]({
                    id: "js",
                    loaders: [ {
                        loader: "babel-loader"
                    } ]
                })
            ])
            .append({
                externals: {
                    "jquery": "window.jQuery"
                }
            })
            .done();
    }
}
