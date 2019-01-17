module.exports = {
    config({Const}) {
        return {
            frame: Const.FRAMES.REACT,
        }
    },
    after({rigger, itemConfig, processArgv, Plugins}) {
        let entry = {};
        let plugins = [];
        /*
        plugins.push(Plugins[Plugins.CONST.copy]({

        }));
        */

        return rigger
            .output({

            })
            .plugins(plugins)
            .done();
    }
};

