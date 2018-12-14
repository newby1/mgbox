const Rigger = require("../../rigger/rigger");
const Loader = require("../../helpers/loaders");
const Plugins = require("../../helpers/plugins");
const Const = require("../../const");
module.exports = {
    run(context) {
        let configSet = context.configSet;
        let baseConfig = context.baseConfig;
        let option = context.option;
        let rigger = new Rigger(configSet);
        rigger.module({
            [Loader.CONST.less]: {
                use: [
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [
                                require("autoprefixer")
                            ]
                        }
                    }
                ]

            }
        })
            .append({
                devtool: "eval-source-map",
                mode: Const.MODES.DEVELOPMENT
            });
        return rigger.done();
    }
};
