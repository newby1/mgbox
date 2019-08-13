const fs = require("fs");
const path = require("path");
module.exports = {
    time(){
        let start;
        let time;
        let log = time => {
            console.log("use time:", time , "ms");
        };
        return {
            start(){
                time = +new Date;
                start = time;
            },
            last(){
                let t = +new Date;
                log(t - time);
                time = t;
            },
            stop(){
                log(+new Date -start);
            }
        }

    },
    isInstalled(packageName){
        try {
            require.resolve(packageName);
            return true;
        } catch (err) {
            return false;
        }

    },
    log(isDebug, ...arg){
        if (isDebug){
            console.log(...arg);
        }
    },
    getIPAdress() {
        let interfaces = require('os').networkInterfaces();
        for (let devName in interfaces) {
            let iface = interfaces[devName];
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    },
    getHashTag(isDev){
        return isDev ? "hash" : "contenthash";
    },
    getSSRApps(dir, filterApps){
        return this.getApps(dir, filterApps, true);
    },
    getHtmlFile(dir){
        let arr = [];
        if (!fs.existsSync(dir)){
            return arr;
        }
        let res = fs.readdirSync(dir);
        res.forEach(val => {
            if (/\.html$/.test(val)){
                let info = fs.statSync(dir + `/${val}`);
                if (info.isFile()){
                    arr.push(val);
                }
            }
        });
        return arr;
    },
    /**
     * 查找apps下的app入口html或者ssr server入口
     */
    getApps(dir, filterApps = [], isSSR = false){
        let dirs = [];
        let max = 2;
        let target = isSSR ? "server." : ".html";
        function readDirSync(curPath, deep = 0) {
            if (deep >= max) {
                return;
            }
            let pa = fs.readdirSync(curPath);
            pa.forEach(function (ele) {
                let info = fs.statSync(curPath + "/" + ele);
                if (info.isDirectory()) {
                    readDirSync(curPath + "/" + ele, deep + 1);
                } else {
                    if (ele.indexOf(target) !== -1 && deep == 1 ) {
                        dirs.push(path.resolve(__dirname, curPath));
                    }
                }
            })
        }
        readDirSync(dir);
        dirs =  dirs.filter(function (val) {
            let name = path.basename(val);
            return filterApps.length ? ( filterApps.includes(name) ? true : false ) : true;
        });
        return dirs;
    }
};
