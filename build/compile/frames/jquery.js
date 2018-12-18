const Rigger = require("../../rigger/rigger");
const Loader = require("../../helpers/loaders");
const Plugins = require("../../helpers/plugins");
const Helper = require("../../helpers/helper");
const Const = require("../../const");
module.exports = {
    run(context){
        return  new Rigger(context.preWebpackConfig)
            .module({
                [Loader.CONST.js]: Loader[Loader.CONST.js](),
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