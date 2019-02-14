
module.exports = {
    run({rigger, itemConfig, processArgv, Loaders, Plugins, Const, Helper}) {
        Helper.log(processArgv.debug, `item: ${processArgv.itemName}`);
        const hash = Helper.getHashTag(processArgv.env === Const.ENVS.LOCAL);
        let entry = {};
        let plugins = [];
        let output = {
            path: itemConfig.absolutePath.distStaticPath,
            publicPath: `/`,
            filename: `${itemConfig.relativePath.scripts}/[name]_[${hash}:8].js`
        };
        let module = {
            [Loaders.CONST.html]: Loaders[Loaders.CONST.html](),
            [Loaders.CONST[itemConfig.cssProcessor]]: Loaders[Loaders.CONST[itemConfig.cssProcessor]](),
            [Loaders.CONST.pic]: Loaders[Loaders.CONST.pic]({
                use: {
                    options: {
                        name: `${itemConfig.relativePath.images}/[name]_[hash:8].[ext]`
                    }
                }
            }),
            [Loaders.CONST.font]: Loaders[Loaders.CONST.font]({
                use: {
                    options: {
                        name: `${itemConfig.relativePath.fonts}/[name]_[hash:8].[ext]`,
                    }
                }
            }),
        };
        if (itemConfig.ts){
            module[Loaders.CONST.ts] = Loaders[Loaders.CONST.ts]({
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: `${itemConfig.absolutePath.configPath}/tsconfig.json`
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
                }
            });
        return rigger.done();
    }
};

