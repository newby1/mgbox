const webpack = require("webpack");
let PLUGIN = {
    copy: "copy",
    extractCss: "extractCss",
    uglify: "uglify",
    hotReplace: "hotReplace",
    htmlWebpackPlugin: "htmlWebpackPlugin",
    htmlIncludeAssets: "htmlIncludeAssets",
    dllReference: "dllReference",
    dllPlugin: "dllPlugin",
    cdn: "cdn",
    definePlugin: "definePlugin",
    namedModulesPlugin: "namedModulesPlugin",
    liveReloadPlugin: "liveReloadPlugin",
    happypack: "happyPack",
    vueLoaderPlugin: "vueLoaderPlugin",
    vueServerRenderer: "vueServerRenderer",
    vueSSRClientPlugin: "vueSSRClientPlugin",
    webpackManifestPlugin: "webpackManifestPlugin"
};

let plugins = {
    CONST: PLUGIN,
    registerPlugin(name, module){
        if (PLUGIN[name]){
            console.log("已经有相同名称的插件了");
            return;
        }
        PLUGIN[name] = name;
        this[name] = function (option) {
            if (typeof module === "string"){
                return new require(module)(option);
            }else if (typeof module === "function"){
                return module(option);
            }
            throw new Error("只能注册为字符串模块或者函数");
        }
    },
    [PLUGIN.webpackManifestPlugin]: (option) => {
        const WebpackManifestPlugin = require("webpack-manifest-plugin");
        return new WebpackManifestPlugin(option);

    },
    [PLUGIN.vueServerRenderer]: (option) => {
        const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
        return new VueSSRServerPlugin(option);

    },
    [PLUGIN.vueSSRClientPlugin]: (option) => {
        const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
        return new VueSSRClientPlugin(option);
    },
    [PLUGIN.vueLoaderPlugin]: () => {
        const { VueLoaderPlugin } = require("vue-loader");
        return new VueLoaderPlugin();
    },
    [PLUGIN.liveReloadPlugin]: (option) => {
        const LiveReloadPlugin = require("webpack-livereload-plugin");
        option = Object.assign({
            delay: 200
        }, option);
        return new LiveReloadPlugin(option);
    },
    [PLUGIN.happypack]: (option) => {
        const HappyPack = require("happypack");
        return new HappyPack(Object.assign({
            threadPool: HappyPack.ThreadPool({size: require("os").cpus().length})
        }, option));
    },
    [PLUGIN.definePlugin]: (option) => {
        return new webpack.DefinePlugin(option);
    },
    [PLUGIN.htmlWebpackPlugin]: (option) => {
        const HtmlWebpackPlugin = require("html-webpack-plugin");
        return new HtmlWebpackPlugin(option);
    },
    [PLUGIN.dllPlugin]: (option) => {
        return new webpack.DllPlugin(option);
    },

    [PLUGIN.dllReference]: (option) => {
        return new webpack.DllReferencePlugin(option);
    },
    [PLUGIN.htmlIncludeAssets]: (option) => {
        //const HtmlWebpackIncludeAssetsPlugin = require("html-webpack-include-assets-plugin");
        const HtmlWebpackIncludeAssetsPlugin = require("html-webpack-tags-plugin");
        return new HtmlWebpackIncludeAssetsPlugin(option)
    },
    [PLUGIN.copy]: (option) => {
        const CopyWebpackPlugin = require("copy-webpack-plugin");
        return new CopyWebpackPlugin(option);
    },
    [PLUGIN.extractCss]: (option) => {
        const MiniCssExtractPlugin = require("mini-css-extract-plugin");
        return new MiniCssExtractPlugin(option)
    },
    [PLUGIN.uglify]: (option) => {
        const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
        let args = {
            exclude: /\.min\./,
            uglifyOptions: {
                cache: true,
                warnings: false,
                compress: {
                    drop_console: false
                },
                output: {
                    comments: false
                }
            }
        };
        return new UglifyJsPlugin(Object.assign(args, option));
    },
    [PLUGIN.namedModulesPlugin]: () => {
        return  new webpack.NamedModulesPlugin();
    },
    [PLUGIN.hotReplace]: () => {
        return new webpack.HotModuleReplacementPlugin();
    },
    [PLUGIN.cdn]: (option) => {
        const CdnPlugin = require("../patch/cdn-plugin");
        return new CdnPlugin(option);
    }
};
module.exports = plugins ;
