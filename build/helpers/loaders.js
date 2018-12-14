const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const extend = require("extend");
const LOADERS = {
    less: "less",
    sass: "sass",
    js: "js",
    vue: "vue",
    html: "html",
    pug: "pug",
    pic: "pic",
    font: "font"
};
const loaderBase = {
    [LOADERS.vue]: {
        test: /\.vue$/,
        use: {
            loader: "vue-loader"
        }
    },
    [LOADERS.js]: {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: "happypack/loader?id=js"
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
        test: /\.(woff2?|eot|ttf|otf)$/,
        use: {
            loader: "file-loader",
        }
    },
    [LOADERS.pic]: {
        test: /\.(png|jpg|gif|ico)$/,
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
        test: /\.(sass|scss)$/,
        use: [
            "style-loader",
            MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "sass-loader",
        ]
    },
    [LOADERS.html]: {
        test: /\.html$/,
        use: {
            loader: "html-loader",
            options: {
                attrs: ["img:src", "link:href"],
                interpolate: true,
                //minimize: !isCoding
            }
        }
    },

};
let loader = {
    CONST: LOADERS,
};
for(let key in loaderBase){
    loader[key] = (function (name) {
        return function (option) {
            return extend(true, {}, loaderBase[name], option);
        }
    })(key);
}

module.exports = loader;