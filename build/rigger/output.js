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
    run(preWebpackConfig){
        let module = [];
        for(let key in preWebpackConfig.module){
            module.push(preWebpackConfig.module[key]);
        }
        let config = new Tool()
            .entry(preWebpackConfig.entry)
            .output(preWebpackConfig.output)
            .module(module)
            .plugins(sortPlugin(preWebpackConfig.plugins))
            .append(preWebpackConfig.append)
            .done();
        //console.log(config);
        return config;
    }
};
