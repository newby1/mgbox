const extend = require("extend");
const BaseFun = require("./base");
const Const = require("../const");
module.exports = extend({}, BaseFun(__filename, {
    frame: Const.FRAMES.REACT,
    devServer: {
        port: 13004
    },
    dll: {
        assets: {
            //css: [`styles/elementUI.css`]
        },
        entry: {
            "vendor": ["babel-polyfill", "url-polyfill", "whatwg-fetch"],
            "react": [ "react", "react-dom"],
            "redux": ["redux"]
        }
    }
}));