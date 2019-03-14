const loaderUtils = require('loader-utils');
const fs = require('fs');

module.exports = function (source) {
    let resourcePath = this.resourcePath;
    let options = loaderUtils.getOptions(this);
    if (!/index\.html$/.test(resourcePath)){
        let reg = /([^\/]+\.html)($|\?)/;
        let res = resourcePath.match(reg);
        res && res[0] && options.tpls && options.tpls.forEach(val => {
            if (val.indexOf(res[0]) !== -1 ){
                this.addDependency(val);
                let fileContent = fs.readFileSync(val, {
                    encoding: "utf-8"
                });
                source = fileContent.replace(`<!--common-tpl-outlet-->`, fs.readFileSync(resourcePath, {
                    encoding: "utf-8"
                }));
            }
        })
    }
    return source;
};
