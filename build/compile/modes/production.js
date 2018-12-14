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
                                require("autoprefixer"),
                                require("cssnano")({
                                    preset: "default"
                                })
                            ]
                        }
                    }
                ]

            }
        })
            .append({
                mode: Const.MODES.PRODUCTION
            });
        return rigger.done();
    }
};
