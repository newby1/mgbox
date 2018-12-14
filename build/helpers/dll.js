const fs = require("fs");

const webpack = require("webpack");

const Loader = require("./loaders");
const Plugins = require("./plugins");
const Tool = require("../rigger/tool");
const Rigger = require("../rigger/rigger");
module.exports = {
    run(context){
        let configSet = context.configSet;
        let baseConfig = context.baseConfig;
        let option = context.option;
        return new Promise((resolve, reject) => {
            try{
                let stats = fs.statSync(baseConfig.dll.manifestPath);
                if (stats.isDirectory()){
                    resolve(configSet);
                    return;
                }
            }catch (e) {
            }
            let config = new Tool()
                .entry(baseConfig.dll.entry)
                .output(Object.assign({}, configSet.output, {
                    filename: `${baseConfig.relativePath.scriptLibraries}/[name].js`,
                    library: "[name]",
                    libraryTarget: "umd"
                }))
                .module([
                    configSet.module[Loader.CONST.js],
                    configSet.module[Loader.CONST.less],
                    configSet.module[Loader.CONST.font],
                    configSet.module[Loader.CONST.pic]
                ])
                .plugins([
                    Plugins[Plugins.CONST.dllPlugin]({
                        path: `${baseConfig.dll.manifestPath}/[name].json`,
                        name: "[name]"
                    }),
                    Plugins[Plugins.CONST.extractCss]( {
                        filename: `${baseConfig.relativePath.styles}/[name].css`,
                        publicPath: configSet.helper.extractCssPublicPath
                    }),
                    Plugins[Plugins.CONST.uglify](),
                ])
                .append({
                    mode: option.mode
                })
                .done();
            let compiler = webpack(config);
            compiler.run( (err, stats) => {
                if (err){
                    console.log(err);
                    return;
                }
                console.log(stats.toString({
                    chunks: false,
                    colors: true
                }));
                let plugins = Object.keys(baseConfig.dll.entry).map((val) => {
                    return Plugins[Plugins.CONST.dllReference]({
                        manifest: require(`${baseConfig.dll.manifestPath}/${val}.json`),
                    })
                });
                configSet = new  Rigger(configSet)
                    .plugins(plugins)
                    .done();
                resolve(configSet);
            });
        });
    }
};