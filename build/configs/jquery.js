const extend = require("extend");
const BaseFun = require("./base");
const Const = require("../const");
module.exports = extend({}, BaseFun(__filename, {
    frame: Const.FRAMES.JQUERY,
    devServer: {
        port: 13005
    },
    buildAssets: {
        js: ["scripts/libraries/jquery-1.12.4.min.js"]
    },
    dll: {
        entry: {
            "vendor": ["babel-polyfill"],
        }
    }
}));
