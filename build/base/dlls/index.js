const fs = require("fs");

const webpack = require("webpack");

const Loader = require("../../helpers/loaders");
const Plugins = require("../../helpers/plugins");
const Tool = require("../../rigger/tool");
const Const = require("../../const");
const extend = require('extend');
module.exports = {
    run(option = {}, {rigger, itemConfig, processArgv, preWebpackConfig}){
        return new Promise((resolve, reject) => {
            try{
                let stats = fs.statSync(itemConfig.dll.manifestPath);
                if (stats.isDirectory()){
                    console.log("use cache dll");
                    resolve(preWebpackConfig);
                    return;
                }
            }catch (e) {
            }
            let config = new Tool()
                .entry(option.entry || itemConfig.dll.entry)
                .output(option.output || Object.assign({}, preWebpackConfig.output, {
                    filename: `${itemConfig.relativePath.scriptLibraries}/[name].js`,
                    library: "[name]",
                    libraryTarget: "umd"
                }))
                .module(option.module || [
                    preWebpackConfig.module[itemConfig.frame === Const.FRAMES.REACT ? Loader.CONST.jsx : Loader.CONST.js],
                    preWebpackConfig.module[Loader.CONST.less],
                    preWebpackConfig.module[Loader.CONST.font],
                    preWebpackConfig.module[Loader.CONST.pic]
                ])
                .plugins(option.plugins || [
                    Plugins[Plugins.CONST.dllPlugin]({
                        path: `${itemConfig.dll.manifestPath}/[name].json`,
                        name: "[name]"
                    }),
                    Plugins[Plugins.CONST.extractCss]( {
                        filename: `${itemConfig.relativePath.styles}/[name].css`,
                        publicPath: preWebpackConfig.helper.extractCssPublicPath
                    }),
                    Plugins[Plugins.CONST.uglify](),
                    Plugins[Plugins.CONST.webpackManifestPlugin]({
                        fileName: "dll-manifest.json"
                    })
                ])
                .append(extend(true, {
                    mode: processArgv.mode
                }, option.append))
                .done();
            let compiler = webpack(config);
            compiler.run( (err, stats) => {
                console.log("compile dll done");
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
                preWebpackConfig = rigger
                    .plugins(plugins)
                    .done();
                resolve(preWebpackConfig);
            });
        });
    }
};
