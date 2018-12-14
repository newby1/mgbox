const Tool = require("./tool");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const sortPlugin = (arr = []) => {
    let res = [], i = 0, len = arr.length;
    for(; i< len; i++){
        let val = arr[i];
        if (val instanceof HtmlWebpackPlugin){
            res.unshift(val);
        }else{
            res.push(val);
        }
    }
    return res;
};
module.exports = {
    run(semifinishedConfig){
        let configSet = semifinishedConfig;
        let module = [];
        for(let key in configSet.module){
            module.push(configSet.module[key]);
        }
        let config = new Tool()
            .entry(configSet.entry)
            .output(configSet.output)
            .module(module)
            .plugins(sortPlugin(configSet.plugins))
            .append(configSet.append)
            .done();
        //console.log(config);
        return config;
    }
};
