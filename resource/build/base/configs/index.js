const extend = require("extend");
const path = require("path");
const Const = require("../../const");

module.exports = function (itemName, option) {
    const itemManifestPath = `${Const.MANIFEST_PATH}/${itemName}`;

    const distPath = Const.DIST_PATH;
    //server
    const distTemplateBasePath = `template/${itemName}`;
    const distTemplatePath = `${distPath}/${distTemplateBasePath}`;
    const distStaticPath = `${distPath}/static/${itemName}`;


    //local client
    const distLocalPath = `${distPath}/${itemName}`;

    const srcPath = Const.SRC_PATH;
    const appsPath = `${srcPath}/${itemName}/apps`;
    const staticPath = `${srcPath}/${itemName}/static`;
    const commonTplPath = `${appsPath}/common/tpls`;
    const loadersConfigPath = `${Const.PLUGINS_CONFIG_PATH}/${itemName}`;
    let base = {
        itemName,
        "isSsrItem": false,
        "frame": Const.FRAMES.VUE,
        "cssProcessor": "less",
        "entryCssExt": "less",
        "entryJsExt": "js",
        "ts": false,
        "tplEngine": "none",
        "useLatestModules": false,
        cdn: {
            host: "",
            handleUrlCallback: null,
            exts: ["js", "css", "swf", "jpg", "jpeg", "png", "gif", "ico"]
        },
        absolutePath: {
            commonTplPath,
            appsPath,
            staticPath,
            loadersConfigPath,
            distTemplatePath,
            distStaticPath
        },
        dist: {
            ssr:{
                path: `../../${distTemplateBasePath}`
            },
            client: {
                path: distLocalPath,
                publicPath: `../`,
                staticPublicPath: "../",
                htmlDir: `.`
            },
            local: {
                path: distLocalPath,
                publicPath: `/`,
                staticPublicPath: "/",
                htmlDir: "."
            },
            server: {
                path: distStaticPath,
                publicPath: `/${itemName}/`,
                htmlDir: distTemplatePath
            }

        },
        relativePath: {
            scripts: `scripts`,
            scriptLibraries: `scripts/libraries`,
            styles: `styles`,
            fonts: `fonts`,
            images: `images`
        },
        buildAssets: {
            js: [],
            css: []
        },
        dll: {
            manifestPath: itemManifestPath,
            entry: null,
        },
        devServer: {
            port: 0,
            options: {
                //hot: true,
                inline: true,
                overlay: true,
                stats: {
                    colors: true
                },
                historyApiFallback: true,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                contentBase: distLocalPath
            },
        },
    };
    extend(true, base, option);
    let tplReg = /\[(.*?)\]/g;
    if (base.cdn.host  && tplReg.test(base.cdn.host) && !base.cdn.handleUrlCallback){
        let getStr = (str, reg) => {
            let res = str.match(reg);
            if (res && res[0]){
                return "" + res[0];
            }
            return "";
        };
        // http://s[2,4,5].xxx.com/xxx0sxs234xxa.js => http://s2.xxx.com/xxx0sxs234xxa.js
        base.cdn.handleUrlCallback = function (url) {
            return url.replace(tplReg, function ($0, $1) {
                let ruleArr = $1.split(",");
                let target = ruleArr[0];
                let baseReg = new RegExp(`[^\\/]+\\.(${base.cdn.exts.join("|")})($|\\?)`);
                let pathname = getStr(url, baseReg);
                let numRes = pathname.match(/\d/g);
                if (numRes){
                    for(let len = numRes.length, i=0; i < len; i++){
                        let val = numRes[i];
                        if (ruleArr.includes(val)){
                            target = val;
                            break;
                        }
                    }
                }
                return target;
            })
        }
    }
    return base;
};
