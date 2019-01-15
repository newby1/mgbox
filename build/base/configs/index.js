const extend = require("extend");
const path = require("path");
const Const = require("../../const");
const PRJ_NAME = Const.PRJ_NAME;

module.exports = function (itemName, option) {
    const itemManifestPath = `${Const.MANIFEST_PATH}/${itemName}`;

    const distPath = Const.DIST_PATH;
    const distItemPath = `${distPath}/${itemName}`;
    const distStaticPath = `${distPath}/static/${itemName}`;

    const srcPath = Const.SRC_PATH;
    const appsPath = `${srcPath}/${itemName}/apps`;
    const staticPath = `${srcPath}/${itemName}/static/`;
    let base = {
        prjName: PRJ_NAME,
        itemName,
        frame: Const.FRAMES.VUE,
        cdn: {
            host: "",
            exts: ["js", "css", "swf", "jpg", "jpeg", "png", "gif", "ico"]
        },
        absolutePath: {
            appsPath,
            staticPath,
            distItemPath,
            distStaticPath
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
            assets:{
                js: [],
                css: []
            },
            entry: null,
        },
        devServer: {
            port: 0,
            options: {
                hot: true,
                inline: true,
                overlay: true,
                stats: {
                    colors: true
                },
                historyApiFallback: true,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                contentBase: distStaticPath
            },
        },
    };
    extend(true, base, option);
    if (base.dll.entry){
        Object.keys(base.dll.entry).forEach((key) => {
            base.dll.assets.js.push(`${base.relativePath.scriptLibraries}/${key}.js`)
        })
    }
    return base;
};
