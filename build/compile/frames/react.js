const Rigger = require("../../rigger/rigger");
const Loader = require("../../helpers/loaders");
const Plugins = require("../../helpers/plugins");
const Helper = require("../../helpers/helper");
const Const = require("../../const");
module.exports = {
    run(context){
        return  new Rigger(context.preWebpackConfig)
            .module({
                [Loader.CONST.jsx]: Loader[Loader.CONST.jsx](),
            })
            .plugins([
                Plugins[Plugins.CONST.happypack]({
                    id: "jsx",
                    loaders: [ {
                        loader: "babel-loader",
                        options: {
                            "presets": ["@babel/preset-env", "@babel/preset-react"]
                        }
                    } ]
                })
            ])
            .append({
                resolve: {
                    alias: {}
                }
            })
            .done();
    }
};