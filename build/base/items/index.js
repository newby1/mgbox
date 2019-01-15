
module.exports = {
    run({rigger, itemConfig, processArgv, Loaders, Plugins, Const}) {
        const hash = processArgv.env === Const.ENVS.LOCAL ? "hash" : "contenthash";
        let entry = {};
        let plugins = [];
        let output = {
            path: itemConfig.absolutePath.distStaticPath,
            publicPath: `/`,
            filename: `${itemConfig.relativePath.scripts}/[name]_[${hash}:8].js`
        };
        rigger
            .output(output)
            .module({
                [Loaders.CONST.html]: Loaders[Loaders.CONST.html](),
                [Loaders.CONST.less]: Loaders[Loaders.CONST.less](),
                [Loaders.CONST.pic]: Loaders[Loaders.CONST.pic]({
                    use: {
                        options: {
                            name: `${itemConfig.relativePath.images}/[name]_[${hash}:8].[ext]`
                        }
                    }
                }),
                [Loaders.CONST.font]: Loaders[Loaders.CONST.font]({
                    use: {
                        options: {
                            name: `${itemConfig.relativePath.fonts}/[name]_[${hash}:8].[ext]`,
                        }
                    }
                }),
            })
            .plugins(plugins)
            .append({
                resolve: {
                    alias: {
                        "$staticPath": itemConfig.absolutePath.staticPath,
                        "$appsPath": itemConfig.absolutePath.appsPath
                    }
                }
            });
        return rigger.done();
    }
};

