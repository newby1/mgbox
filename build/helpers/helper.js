const fs = require("fs");
const path = require("path");
module.exports = {
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
    getItems(itemsPath) {
        let res = [];
        let dirList = fs.readdirSync(itemsPath);
        dirList.forEach((item) => {
            res.push(path.parse(`${itemsPath}/${item}`).name);
        });
        return res;
    },
    getCdnUrl(url, cdnHost, exts) {
        return cdnHost + (url.indexOf("/") == 0 ?  "" : "/")  + url;
    },
    getSSRApps(dir, filterApps){
        return this.getApps(dir, filterApps, true);

    },
    getApps(dir, filterApps = [], isSSR = false){
        let dirs = [];
        let max = 2;
        let targetFile = isSSR ? "server.js" : "index.html";
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
                    if (ele == targetFile ) {
                        dirs.push(path.resolve(__dirname, curPath));
                    }
                }
            })
        }
        readDirSync(dir);
        return dirs.filter(function (val) {
            let name = path.basename(val);
            return filterApps.length ? ( filterApps.includes(name) ? true : false ) : true;
        })
    }
};
