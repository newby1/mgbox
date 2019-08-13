const path = require("path");
const fs = require("fs");

const webpack = require("webpack");

const Tool = require("../../rigger/tool");
const extend = require('extend');

const dllManifest = "dll-manifest.json";
module.exports = {
    run(option = {}, {rigger,Loaders, itemConfig, processArgv, preWebpackConfig, Helper, Const, Plugins}){
        Helper.log(processArgv.debug, `dll`);
        let output = option.output || Object.assign({}, preWebpackConfig.output, {
            filename: `${itemConfig.relativePath.scriptLibraries}/[name]_[contenthash:8].js`,
            library: "[name]",
            libraryTarget: "umd"
        });
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
                .output(output)
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
                        filename: `${itemConfig.relativePath.styles}/[name]_[contenthash:8].css`,
                        publicPath: preWebpackConfig.output.publicPath
                    }),
                    Plugins[Plugins.CONST.webpackManifestPlugin]({
                        fileName: dllManifest
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
                let manifest = require(path.join(output.path, dllManifest));
                let insertPlugin = function (filePath) {
                    plugins.unshift( Plugins[Plugins.CONST.htmlIncludeAssets]({
                        tags: [filePath],
                        append: false,
                        publicPath: ""
                    }) );

                };
                if (manifest){
                    Object.keys(itemConfig.dll.entry).forEach((key) => {
                        let filePath = manifest[`${key}.js`];
                        if (filePath){
                            insertPlugin(filePath);
                        }
                        filePath =  manifest[`${key}.css`];
                        if (filePath){
                            insertPlugin(filePath);
                        }
                    })
                }

                preWebpackConfig = rigger
                    .plugins(plugins)
                    .done();
                resolve(preWebpackConfig);
            });
        });
    }
};
