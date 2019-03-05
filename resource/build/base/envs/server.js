module.exports = {
    run({rigger, itemConfig, processArgv, Helper}) {
        Helper.log(processArgv.debug, `env: local`);
        let entry = {};
        let plugins = [];

        let distConfig = itemConfig.dist[processArgv.env];
        let publicPath = distConfig.publicPath;
        if (processArgv.cdn){
            publicPath = `${itemConfig.cdn.host}${publicPath}`;
        }
        rigger
            .output({
                publicPath
            });

        return rigger.done();
    }
};
