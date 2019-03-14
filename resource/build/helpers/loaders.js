const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const extend = require("extend");
const LoaderManage = require("./loaderManage");
let LOADERS = {
    less: "less",
    sass: "sass",
    stylus: "stylus",
    js: "js",
    jsx: "jsx",
    vue: "vue",
    html: "html",
    pug: "pug",
    pic: "pic",
    eslint: "eslint",
    font: "font",
    ts: "ts"
};
let loaderBase = {
    [LOADERS.ts]: {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        use: {
            loader: "ts-loader"
        }

    },
    [LOADERS.vue]: {
        test: /\.vue$/,
        use: {
            loader: "vue-loader",
            options: {
                hotReload: true
            }
        }
    },
    [LOADERS.eslint]: {
        test: /\.js$/,
        exclude: /(node_modules)/,
        enforce: "pre",
        use: [
            {
                loader: "eslint-loader",
                options: {
                    //fix: true
                }
            }
        ]
    },
    [LOADERS.js]: {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: "happypack/loader?id=js"
    },
    [LOADERS.jsx]: {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: "happypack/loader?id=jsx"
    },
    [LOADERS.pug]: {
        test: /\.pug$/,
        use: [
            {
                loader: "pug-loader",
            }
        ]
    },
    [LOADERS.font]: {
        test: /\.(woff2?|eot|ttf|otf|font?|ttc)$/,
        use: {
            loader: "file-loader",
        }
    },
    [LOADERS.pic]: {
        test: /\.(png|jpe?g|gif|ico|bmp|svg|webp)$/,
        use: {
            loader: "url-loader",
            options: {
                limit: 1000,
            }
        }
    },
    [LOADERS.less]: {
        test: /\.(less|css)$/,
        use: [
            "style-loader",
            MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "less-loader",
        ]
    },
    [LOADERS.sass]: {
        test: /\.(sass|scss|css)$/,
        use: [
            "style-loader",
            MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "sass-loader",
        ]
    },
    [LOADERS.stylus]: {
        test: /\.(styl|css)$/,
        use: [
            "style-loader",
            MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "stylus-loader",
        ]
    },
    [LOADERS.html]: {
        test: /\.html$/,
        use: [
            {
                loader: "html-loader",
                options: {
                    attrs: ["img:src", "link:href"],
                    interpolate: "require",
                }

            },
            {
                loader: "common-tpl-loader",
                options: {
                    tpls: []
                }
            },
        ]
    }
};
let loader = {
    CONST: LOADERS,
    registerLoader(name, args){
        if (LOADERS[name]){
            return;
        }
        LOADERS[name] = name;
        this[name] = function (option) {
            return extend(true, {}, loaderBase[name], option || args);

        }

    }
};
for(let key in loaderBase){
    loader[key] = (function (name) {
        return function (option) {
            return new LoaderManage({
                [name]: loaderBase[name]
            }).batch({
                [name]: option
            }).getRules()[name];
            //return extend(true, {}, loaderBase[name], option);
        }
    })(key);
}

module.exports = loader;
