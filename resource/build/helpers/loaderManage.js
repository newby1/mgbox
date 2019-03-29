const extend  = require('extend');
class LoaderManage {
    constructor(rules){
        this.rules = {};
        if (rules){
            this.batch(rules);
        }
    }
    getRules(){
        return this.rules;
    }
    //1、不规范的全部转成数组格式
    //2、loader转成对象格式
    formatRule(rule){
        let res = {};
        extend(true, res, rule);
        //loader是简写，转换成数组use
        if (res.loader){
            res.use = [];
            res.use.push({
                loader: res.loader
            });
            delete res.loader;
        }
        //use是对象或者字符串，转换成数组use
        if (Object.prototype.toString.call(res.use) === '[object Object]' || typeof res.use === "string"){
            let use = [];
            use.push(res.use);
            res.use = use;
        }
        res.use = res.use && res.use.map(loader => {
            let newLoader = loader;
            if (typeof loader === "string" ){
                newLoader = {
                    loader: loader
                }
            }
            return newLoader;
        });
        return res;
    }
    add(name, rule){
        if (this.rules[name]){
            this.update(name, rule);
            return;
        }
        this.rules[name] = this.formatRule(rule);
    }
    batch(rules){
        for(let key in rules){
            if (rules[key]){
                this.add(key, rules[key]);
            }
        }
        return this;
    }
    update(name, rule){
        let preRule = this.rules[name];
        if (!preRule){
            console.warn("rule is not exist");
            return;
        }
        rule = this.formatRule(rule);
        let use = rule.use;
        let mergeUse = [].concat(preRule.use);
        mergeUse = mergeUse.map((target, index) => {
            use.map(merge => {
                if (target.loader == merge.loader){
                    if (merge.force){
                        target.options = merge.options;
                    }else{
                        extend(true, target, merge);
                    }
                }
            });
            return target;
        });
        //delete preRule.use;
        //extend(true, preRule, rule);
        Object.assign(preRule, rule);
        preRule.use = mergeUse;
    }
}
module.exports = LoaderManage;
