module.exports = {
    run({rigger, Helper, processArgv, Loaders, Plugins}){
        Helper.log(processArgv.debug, `frame: vue`);
        let module = {
            [Loaders.CONST.js]: Loaders[Loaders.CONST.js](),
        };
        return rigger.module(module)
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
