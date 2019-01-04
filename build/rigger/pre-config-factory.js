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
        let option = {
            config: {},
            item: null,
            render: null,
            frame: null,
            mode: null,
            evn: null,
            dllPreConfig: {}
        };
        extend(option, args);
        return new Promise((resolve, reject) => {
            this.setConfig(option.config);
            this.compileItem(option.item);
            this.compileRender(option.render);
            this.compileEnv(option.env);
            this.compileFrame(option.frame);
            this.compileMode(option.mode);
            this.compileExternal(option.external);
            if (this.processArgv.ssr === Const.RENDERS.SERVER){
                resolve(this.getContext());
                return;
            }
            if (this.itemConfig.dll.entry){
                this.dll(option.dllPreConfig)
                    .then(() => {
                        resolve(this.getContext());
                    })
                    .catch(e => {
                        console.log("pre compile error: ", e);
                    })
            }else{
                resolve(this.getContext());
            }

        })
    }
    compileExternal(callback){
        if (callback){
            this.preWebpackConfig = callback(this.getContext());
        }
    }
    setConfig(option){
        const BaseFun = require("../base/configs/");
        this.itemConfig = extend({}, BaseFun(this.processArgv.item, option));
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
            if (this.processArgv.ssr) {
                this.preWebpackConfig = require(`../base/renders/${this.processArgv.ssr}`).run(this.getContext());
            }else{
                this.preWebpackConfig = require(`../base/renders/client`).run(this.getContext());
            }

        }

    }
    compileItem(callback){
        if (callback){
            this.preWebpackConfig = callback(this.getContext());
        }else{
            this.preWebpackConfig = require('../base/items').run(this.getContext());
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
    dll(option){
        console.log("compile dll");
        return new Promise((resolve, reject) => {
            require("../base/dlls/")
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
};
module.exports = PreConfigFactory;
