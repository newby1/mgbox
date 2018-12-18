const fs = require("fs");
const path = require("path");
module.exports = {
    getItems(srcPath) {
        let res = [];
        let dirList = fs.readdirSync(srcPath);
        dirList.forEach((item) => {
            res.push(path.parse(`${srcPath}/${item}`).name);
        });
        return res;
    },
    getCdnUrl : function (url, cdnHost, exts) {
        return cdnHost + (url.indexOf("/") == 0 ?  "" : "/")  + url;
    },
    getApps(dir, filterApps = []){
        let dirs = [];
        let max = 2;
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
                    if (ele == "index.html" ) {
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