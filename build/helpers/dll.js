const fs = require("fs");

const webpack = require("webpack");

const Loader = require("./loaders");
const Plugins = require("./plugins");
const Tool = require("../rigger/tool");
const Rigger = require("../rigger/rigger");
const Const = require("../const");
module.exports = {
    run(context){
        let preWebpackConfig = context.preWebpackConfig;
        let itemConfig = context.itemConfig;
        let processArgv = context.processArgv;
        return new Promise((resolve, reject) => {
            try{
                let stats = fs.statSync(itemConfig.dll.manifestPath);
                if (stats.isDirectory()){
                    resolve(preWebpackConfig);
                    return;
                }
            }catch (e) {
            }
            let config = new Tool()
                .entry(itemConfig.dll.entry)
                .output(Object.assign({}, preWebpackConfig.output, {
                    filename: `${itemConfig.relativePath.scriptLibraries}/[name].js`,
                    library: "[name]",
                    libraryTarget: "umd"
                }))
                .module([
                    preWebpackConfig.module[itemConfig.frame === Const.FRAMES.REACT ? Loader.CONST.jsx : Loader.CONST.js],
                    preWebpackConfig.module[Loader.CONST.less],
                    preWebpackConfig.module[Loader.CONST.font],
                    preWebpackConfig.module[Loader.CONST.pic]
                ])
                .plugins([
                    Plugins[Plugins.CONST.dllPlugin]({
                        path: `${itemConfig.dll.manifestPath}/[name].json`,
                        name: "[name]"
                    }),
                    Plugins[Plugins.CONST.extractCss]( {
                        filename: `${itemConfig.relativePath.styles}/[name].css`,
                        publicPath: preWebpackConfig.helper.extractCssPublicPath
                    }),
                    Plugins[Plugins.CONST.uglify](),
                ])
                .append({
                    mode: processArgv.mode
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
                let plugins = Object.keys(itemConfig.dll.entry).map((val) => {
                    return Plugins[Plugins.CONST.dllReference]({
                        manifest: require(`${itemConfig.dll.manifestPath}/${val}.json`),
                    })
                });
                preWebpackConfig = new  Rigger(preWebpackConfig)
                    .plugins(plugins)
                    .done();
                resolve(preWebpackConfig);
            });
        });
    }
};