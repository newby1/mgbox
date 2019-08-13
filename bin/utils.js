const shell = require("shelljs");
const execSync = require('child_process').execSync;
const Utils = {
    isObject(obj){
        if (Object.prototype.toString.call(obj) === '[object Object]'){
            return true;
        }
        return false;
    },
    isInstalled(packageName){
        try {
            require.resolve(packageName);
            return true;
        } catch (err) {
            return false;
        }

    },
    spliceModuleUseLasted(data){
        let arr = [];
        if (Utils.isObject(data)){
            arr = Object.keys(data);
        }
        return arr;
    },
    spliceModule(data){
        let arr = [];
        if (Utils.isObject(data)){
            for(let key in data){
                arr.push(`${key}@${data[key]}`);
            }
        }
        return arr;
    },
    getPackageModules(
        dependConfig,
        modules
    ){
        let dependencies = [];
        if (!dependencies || !modules){
            return dependencies;
        }
        const spliceModule = dependConfig.useLastestModules
            ?
            Utils.spliceModuleUseLasted
            :
            Utils.spliceModule;
        const frame = dependConfig.frame;
        dependencies = dependencies
            .concat(spliceModule(modules.base))
            .concat(spliceModule(modules[frame]))
            .concat(spliceModule(modules.css.base))
            .concat(spliceModule(modules.css[dependConfig.cssProcessor]))
            .concat(spliceModule(modules.tplEngine[dependConfig.tplEngine]));
        if (dependConfig.isSsrItem){
            dependencies = dependencies.concat( spliceModule(modules.ssr[frame]) );
        }
        if (dependConfig.ts){
            dependencies = dependencies.concat(spliceModule(modules.ts.base))
                .concat(spliceModule(modules.ts[frame]));
        }
        return dependencies;

    },
    shouldUserYarn(){
        try {
            execSync('yarnpkg --version', { stdio: 'ignore' });
            return true;
        } catch (e) {
            return false;
        }
    },
    installPackage(dependencies, cb, isInit = true){
        let startMsg = "开始安装模块";
        let msg = "安装模块完成";
        console.log(startMsg);
        let exec;
        if (Utils.shouldUserYarn()){
            exec = "yarn add ";
        }else{
            console.log("npm i");
            exec = "npm i "
        }
        exec += isInit ? " -D " : "";
        shell.exec(`${exec} ${dependencies.join(" ")}`,
            {
                async: true
            },
            function () {
                console.log(msg);
                cb && cb();
            }
        );

    }
};
module.exports = Utils;
