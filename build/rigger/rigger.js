const extend = require("extend");
const LoaderManage = require("../helpers/loaderManage");
const mergeArray = function (target = [], merge = []) {
    let targetObj = {}, countObj = {}, res = [];
    let i = 0, targetLen = target.length, mergeLen = merge.length;
    for(; i< targetLen; i++){
        let val = target[i];
        if (typeof val == "string"){
            targetObj[val] = {
                loader: val
            };
            countObj[i] = val;
        }else if(typeof val == "object"){
            targetObj[val.loader] = val;
            countObj[i] = val.loader;
        }
    }
    for(i = 0; i < mergeLen ; i++){
        let val = merge[i];
        if (typeof val == "string"){
            if (!targetObj[val]){
                targetObj[val] = {
                    loader: val
                };
                countObj[targetLen++] = val;
            }
        }else if(typeof val == "object"){
            if (targetObj[val.loader]){
                extend(true, targetObj[val.loader], val);
            }else{
                targetObj[val.loader] = val;
                countObj[targetLen++] = val.loader;
            }
        }
    }
    for(i = 0;i < targetLen ; i++){
        res.push(targetObj[countObj[i]]);
    }
    return res;
};
class Rigger {
    constructor(config){
        this.config = config || {
            entry: {},
            output: { },
            module: {},
            plugins: [],
            append: {},
            helper: {}
        }
    }
    entry(option){
        extend(true, this.config.entry, option);
        return this;
    }
    output(option){
        extend(true, this.config.output, option);
        return this;
    }
    module(option){
        let ins = new LoaderManage(this.config.module);
        ins.batch(option);
        this.config.module = ins.getRules();
        // let module = this.config.module;
        // for(let key in option){
        //     if (!module[key]){
        //         module[key] = option[key];
        //     }else{
        //         for(let k in option[key]){
        //             if (Object.prototype.toString.call(option[key][k]) === '[object Array]'){
        //                 module[key][k] = mergeArray(module[key][k], option[key][k]);
        //             }else{
        //                 extend(true, module[key][k], option[key][k]);
        //             }
        //         }
        //     }
        // }
        //extend(true, this.config.module, option);
        return this;
    }
    plugins(option){
        this.config.plugins = this.config.plugins.concat(option);
        return this;
    }
    append(option){
        extend(true, this.config.append, option);
        return this;
    }
    helper(option){
        extend(true, this.config.helper, option);
        return this;
    }
    getConfig(){
        return this.config;
    }
    done(){
        return this.getConfig();
    }
}
module.exports = Rigger;

