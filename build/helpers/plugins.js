const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackIncludeAssetsPlugin = require("html-webpack-include-assets-plugin");
//const CdnPlugin = require("../plugins/cdn-plugin");
const HappyPack = require('happypack');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const PLUGIN = {
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
    happypack: "happyPack"
};

const plugins = {
    CONST: PLUGIN,
    [PLUGIN.liveReloadPlugin]: (option) => {
        return new LiveReloadPlugin(option);
    },
    [PLUGIN.happypack]: (option) => {
        return new HappyPack(option);
    },
    [PLUGIN.definePlugin]: (option) => {
        return new webpack.DefinePlugin(option);
    },
    [PLUGIN.htmlWebpackPlugin]: (option) => {
        return new HtmlWebpackPlugin(option);
    },
    [PLUGIN.dllPlugin]: (option) => {
        return new webpack.DllPlugin(option);
    },

    [PLUGIN.dllReference]: (option) => {
        return new webpack.DllReferencePlugin(option);
    },
    [PLUGIN.htmlIncludeAssets]: (option) => {
        return new HtmlWebpackIncludeAssetsPlugin(option)
    },
    [PLUGIN.copy]: (option) => {
        return new CopyWebpackPlugin(option);
    },
    [PLUGIN.extractCss]: (option) => {
        return new MiniCssExtractPlugin(option)
    },
    [PLUGIN.uglify]: (option) => {
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
    }

};
module.exports = plugins ;