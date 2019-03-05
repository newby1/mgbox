const fs = require("fs");

const webpack = require("webpack");

const Tool = require("../../rigger/tool");
const extend = require('extend');

module.exports = {
    run(option = {}, {rigger,Loaders, itemConfig, processArgv, preWebpackConfig, Helper, Const, Plugins}){
        Helper.log(processArgv.debug, `dll`);
        return new Promise((resolve, reject) => {
            try{
                let stats = fs.statSync(itemConfig.dll.manifestPath);
                if (stats.isDirectory()){
                    Helper.log(processArgv.debug, "cache dll");
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
                    //preWebpackConfig.module[itemConfig.frame === Const.FRAMES.REACT ? Loaders.CONST.jsx : Loaders.CONST.js],
                    Loaders[Loaders.CONST.js](),
                    preWebpackConfig.module[Loaders.CONST[itemConfig.cssProcessor]],
                    preWebpackConfig.module[Loaders.CONST.font],
                    preWebpackConfig.module[Loaders.CONST.pic]
                ])
                .plugins(option.plugins || [
                    Plugins[Plugins.CONST.dllPlugin]({
                        path: `${itemConfig.dll.manifestPath}/[name].json`,
                        name: "[name]"
                    }),
                    Plugins[Plugins.CONST.extractCss]( {
                        filename: `${itemConfig.relativePath.styles}/[name].css`,
                        publicPath: preWebpackConfig.output.publicPath
                    }),
                    Plugins[Plugins.CONST.webpackManifestPlugin]({
                        fileName: "dll-manifest.json"
                    })
                ])
                .append(extend(true, {
                    mode: Const.MODES.PRODUCTION
                }, option.append))
                .done();
            let compiler = webpack(config);
            compiler.run( (err, stats) => {
                Helper.log(processArgv.debug, "compile dll done");
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
