const path = require("path");
const extend = require("extend");
const Const = require("../const.js");
const Rigger = require("./rigger");
const Loaders = require("../helpers/loaders");
const Plugins = require("../helpers/plugins");
const Helper = require("../helpers/helper");
class PreConfigFactory {
    constructor(processArgv){
        this.processArgv = processArgv;
        this.itemConfig = null;
        this.preWebpackConfig = null;
    }
    run(args) {
        let callbacks = {
            config: null,
            before: null,
            after: null,
            item: null,
            render: null,
            frame: null,
            mode: null,
            evn: null,
            dllPreConfig: null
        };
        extend(callbacks, args);
        return new Promise((resolve, reject) => {
            this.setConfig(callbacks.config);
            this.compileHook(callbacks.before);
            this.compileItem(callbacks.item);
            this.compileRender(callbacks.render);
            this.compileEnv(callbacks.env);
            this.compileFrame(callbacks.frame);
            this.compileMode(callbacks.mode);
            if (this.processArgv.ssr === Const.RENDERS.SERVER){
                this.compileHook(callbacks.after);
                resolve(this.getContext());
                return;
            }
            if (this.itemConfig.dll.entry){
                this.compileDll(callbacks.dllPreConfig)
                    .then(() => {
                        this.compileHook(callbacks.after);
                        resolve(this.getContext());
                    })
                    .catch(e => {
                        console.log("pre compile error: ", e);
                    })
            }else{
                this.compileHook(callbacks.after);
                resolve(this.getContext());
            }

        })
    }
    compileHook(callback){
        if (callback){
            this.preWebpackConfig = callback(this.getContext());
        }
    }
    setConfig(callback){
        const ProjectConfig = require(path.resolve(Const.CONFIGS_PATH, "./project.config.json"));
        const BaseFun = require("../base/configs/index");
        let config = callback  && callback(this.getContext()) || null;
        let itemName = this.processArgv.itemName;
        this.itemConfig = extend({}, BaseFun(itemName, config), ProjectConfig[itemName]);
    }
    getContext(){
        return {
            rigger: new Rigger(this.preWebpackConfig),
            itemConfig: this.itemConfig,
            processArgv: this.processArgv,
            preWebpackConfig: this.preWebpackConfig,
            Loaders,
            Plugins,
            Helper,
            Const
        }
    }
    compileRender(callback){
        if (callback){
            this.preWebpackConfig = callback(this.getContext());
        }else{
            this.preWebpackConfig = require(`../base/renders/${this.processArgv.render}`).run(this.getContext());
        }
    }
    compileItem(callback){
        if (callback){
            this.preWebpackConfig = callback(this.getContext());
        }else{
            this.preWebpackConfig = require('../base/items/index').run(this.getContext());
        }
    }
    compileFrame(callback){
        let frame = this.itemConfig.frame;
        if (callback){
            this.preWebpackConfig = callback(this.getContext());
        }else{
            this.preWebpackConfig = require(`../base/frames/${frame}`).run(this.getContext());
        }
    }
    compileEnv(callback){
        let env = this.processArgv.env;
        if (callback){
            this.preWebpackConfig = callback(this.getContext());
        }else{
            this.preWebpackConfig = require(`../base/envs/${env}`).run(this.getContext());
        }
    }
    compileMode(callback){
        let mode = this.processArgv.mode;

        if (callback){
            this.preWebpackConfig = callback(this.getContext());
        }else{
            this.preWebpackConfig = require(`../base/modes/${mode}`).run(this.getContext());
        }
    }
    compileDll(callback){
        const option = callback && callback(this.getContext()) || {};
        console.log("compile dll");
        return new Promise((resolve, reject) => {
            require("../base/dlls/index")
                .run(option, this.getContext())
                .then((preWebpackConfig) => {
                    this.preWebpackConfig = preWebpackConfig;
                    resolve(true);
                })
                .catch(e => {
                    console.log("dll error: ", e);
                })
        })

    }
}
module.exports = PreConfigFactory;
