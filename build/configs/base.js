const extend = require("extend");
const path = require("path");
const Const = require("../const");
const PRJ_NAME = Const.PRJ_NAME;

module.exports = function (jsPath, option) {
    const appName = path.parse(jsPath).name;
    const appManifestPath = `${Const.MANIFEST_PATH}/${appName}`;

    const distPath = Const.DIST_PATH;
    const distAppPath = `${distPath}/${appName}`;
    const distStaticPath = `${distPath}/static/${appName}`;

    const wwwPath = Const.SRC_PATH;
    const appPath = `${wwwPath}/${appName}/apps`;
    const staticPath = `${wwwPath}/${appName}/static/`;
    let base = {
        prjName: PRJ_NAME,
        appName,
        frame: Const.FRAMES.VUE,
        cdn: {
            host: `//{name}-c.te6.com/${PRJ_NAME}`,
            scriptExt: ["js", "css", "swf"],
            pictureExt: ["jpg", "png", "gif"]
        },
        absolutePath: {
            wwwPath,
            appPath,
            staticPath,
            distPath,
            distAppPath,
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
            manifestPath: appManifestPath,
            assets:{
                js: [],
                css: []
            },
            entry: null,
        },
        devServer: {
            port: 3002,
            options: {
                hot: true,
                inline: true,
                open: true,
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