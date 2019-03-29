const path = require("path");
module.exports = {
    run({rigger, itemConfig, processArgv, Loaders, Plugins, Const, Helper}) {
        Helper.log(processArgv.debug, `item: ${processArgv.itemName}`);
        const hash = Helper.getHashTag(processArgv.env === Const.ENVS.LOCAL);
        let entry = {};
        let plugins = [];
        const distConfig = itemConfig.dist[processArgv.env];
        let commonTpls = Helper.getHtmlFile(itemConfig.absolutePath.commonTplPath).map(val => {
            return path.resolve(itemConfig.absolutePath.commonTplPath, val);
        });
        let output = {
            path: distConfig.path,
            publicPath: distConfig.publicPath,
            filename: `${itemConfig.relativePath.scripts}/[name]_[${hash}:8].js`
        };
        let module = {
            [Loaders.CONST.html]: Loaders[Loaders.CONST.html]({
                use: [
                    {
                        loader: "common-tpl-loader",
                        options: {
                            tpls: commonTpls
                        }
                    }
                ]
            }),
            [Loaders.CONST[itemConfig.cssProcessor]]: Loaders[Loaders.CONST[itemConfig.cssProcessor]](),
            [Loaders.CONST.pic]: Loaders[Loaders.CONST.pic]({
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            name: `${itemConfig.relativePath.images}/[name]_[hash:8].[ext]`
                        }
                    }
                ]
            }),
            [Loaders.CONST.font]: Loaders[Loaders.CONST.font]({
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: `${itemConfig.relativePath.fonts}/[name]_[hash:8].[ext]`,
                        }
                    }
                ]
            }),
        };
        if (itemConfig.ts){
            module[Loaders.CONST.ts] = Loaders[Loaders.CONST.ts]({
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: `${itemConfig.absolutePath.loadersConfigPath}/tsconfig.json`
                        }
                    }
                ]

            });
        }
        plugins.push(
            Plugins[Plugins.CONST.definePlugin]( {
                "_ENV": JSON.stringify(processArgv.env),
                "_MOCK": JSON.stringify(processArgv.mock),
                "ENV": JSON.stringify(processArgv.mode),
                "process.env": JSON.stringify(processArgv.mode),
                "process.env.NODE_ENV": JSON.stringify(processArgv.mode)
            })
        );

        Helper.getApps(itemConfig.absolutePath.appsPath, processArgv.apps)
            .forEach((val) => {
                let template = path.resolve(val, "index.html");
                let entryHtml = Helper.getHtmlFile(val)[0];
                if (entryHtml !== "index.html"){
                    template = path.resolve(val, entryHtml);
                }
                let name = path.basename(val);
                plugins.push(
                    Plugins[Plugins.CONST.htmlWebpackPlugin]({
                        chunks: [name],
                        template,
                        filename: `${distConfig.htmlDir}/${name}.html`,
                        inject: true,
                        minify: processArgv.mode === Const.MODES.DEVELOPMENT
                            ?
                            false
                            :
                            {
                                collapseWhitespace: true,
                                removeComments: true,
                                removeRedundantAttributes: true,
                                //removeScriptTypeAttributes: true,
                                removeStyleLinkTypeAttributes: true,
                                useShortDoctype: true
                            }
                    })

                );
            });
        rigger
            .output(output)
            .module(module)
            .plugins(plugins)
            .append({
                resolve: {
                    extensions: [".js", ".jsx", ".ts", ".tsx"],
                    alias: {
                        "$staticPath": itemConfig.absolutePath.staticPath,
                        "$appsPath": itemConfig.absolutePath.appsPath
                    }
                },
                resolveLoader: {
                    modules: ["node_modules", path.resolve(Const.BUILD_PATH, `patch`)]
                }
            });
        return rigger.done();
    }
};

