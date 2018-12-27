const path = require("path");
const extend = require("extend");
const webpack = require("webpack");
const apiMocker = require("mocker-api");
const WebpackDevServer = require("webpack-dev-server");
const Observer = require("../helpers/observer");
const open = require("opn");
const Const = require("../const");

const express = require("express");
const WebpackDevMiddleware = require("webpack-dev-middleware");

class CompileFactory {
    constructor(processArgv){
        this.processArgv = processArgv;
        this.itemConfig = null;
        this.preWebpackConfig = null;
    }
    run() {
        return new Promise((resolve, reject) => {
            this.setItemConfig();
            this.compileItem();
            this.compileType();
            this.compileEnv();
            this.compileFrame();
            this.compileMode();
            this.dll()
                .then(() => {
                    resolve(this.preWebpackConfig);
                })
                .catch(e => {
                    console.log(e);
                })

        })
    }
    setItemConfig(){
        this.itemConfig = require(`../configs/${this.processArgv.item}`);
    }
    getArgs(){
        return {
            preWebpackConfig: this.preWebpackConfig,
            itemConfig: this.itemConfig,
            processArgv: this.processArgv
        }
    }
    compileItem(){
        let item = this.processArgv.item;
        console.log("pre-compile item: ", item);
        this.preWebpackConfig = require(`../items/${item}`).run(this.getArgs());
    }
    compileType(){
        let type = this.processArgv.type;
        console.log("pre-compile type: ", type);
        this.preWebpackConfig = require(`../compile/types/${type}`).run(this.getArgs());
    }
    compileFrame(){
        let frame = this.itemConfig.frame;
        console.log("pre-compile frame: ", frame);
        this.preWebpackConfig = require(`../compile/frames/${frame}`).run(this.getArgs());
    }
    compileEnv(){
        let env = this.processArgv.env;
        console.log("pre-compile env: ", env);
        this.preWebpackConfig = require(`../compile/envs/${env}`).run(this.getArgs());
    }
    compileMode(){
        let mode = this.processArgv.mode;
        console.log("pre-compile mode: ", mode);
        this.preWebpackConfig = require(`../compile/modes/${mode}`).run(this.getArgs());
    }
    dll(){
        console.log("compile dll");
        return new Promise((resolve, reject) => {
            require("../helpers/dll")
                .run(this.getArgs())
                .then((preWebpackConfig) => {
                    this.preWebpackConfig = preWebpackConfig;
                    resolve(true);
                })
        })

    }

}

class Compile {
    constructor(processArgv){
        this.observerIns = new Observer;
        this.processArgv = processArgv;
        this.itemConfig = require(`../configs/${this.processArgv.item}`);
        this.webpackConfigs = null;
        this.main();
    }
    outputConfig(preWebpackConfig){
        return require("./output").run(preWebpackConfig);
    }
    main(){
        if (this.processArgv.ssr){
            this.processArgv.env = Const.ENVS.SERVER;
        }
        this.getClientPreWebpackConfig()
            .then(preWebpackConfig => {
                this.webpackConfigs = this.outputConfig(preWebpackConfig);
                return this.getServerPreWebpackConfig()
            })
            .then(preWebpackConfig => {
                if (preWebpackConfig){
                    let serverConfig = this.outputConfig(preWebpackConfig);
                    this.webpackConfigs = [this.webpackConfigs, serverConfig];
                }
                this.runWebpack();
            })
            .catch(e => {
                console.log(e, 1);
            })

    }
    getClientPreWebpackConfig(){
        this.processArgv.type = Const.TYPES.ISOMERISM;
        return new Promise((resolve, reject) => {
            new CompileFactory(this.processArgv).run()
                .then(preWebpackConfig => {
                    resolve(preWebpackConfig);
                })
                .catch(e => {
                    console.log(e);
                })
        })
    }
    getServerPreWebpackConfig(){
        return new Promise((resolve, reject) => {
            if (!this.processArgv.ssr){
                resolve(false);
            }else{
                this.processArgv.type = Const.TYPES.ISOMORPHISM;
                new CompileFactory(this.processArgv).run()
                    .then(preWebpackConfig => {
                        resolve(preWebpackConfig);
                    })
            }
        })
    }
    ssr(){
        console.log("ssr");
        const app = express();
        const webpackConfigs = this.webpackConfigs;
        const compiler = webpack(webpackConfigs);
        const firstWebpackConfig = Array.isArray(webpackConfigs) ? webpackConfigs[0] : webpackConfigs;
        const item = this.processArgv.item;
        /*
        compiler["run"](function (err, stats) {
            if (err){
                console.log(err);
                return;
            }
            if (stats){
                process.stdout.write(stats.toString({
                    chunks: false,
                    colors: true
                }));
            }
            console.log("\r\n compile success!");

        });
        return;
        */

        //app.use("/*.html", app.static(`${Const.DIST_PATH}/${item}`));
        const outputPublicPath = firstWebpackConfig.output.publicPath;
        let middleware = WebpackDevMiddleware(compiler, {
            //serverSideRender: true,
            publicPath: outputPublicPath,
            watchOptions: {
                aggregateTimeout: 200
            },
            quiet: true,
            //index: "index.html"
        });
        /*
        const filesystem = middleware.fileSystem;

        const content = filesystem.readdirSync("/");


        content.forEach((item) => {
            console.log(item);
        });
        */
        app.get('/a', (req, res) => {

            res.setHeader('Content-Type', 'text/html');

            res.write(
                '<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body>'
            );
            const outputPath = middleware.getFilenameFromUrl( outputPublicPath || '/' );


            const filesystem = middleware.fileSystem;
            function writeDirectory(baseUrl, basePath) {
                const content = filesystem.readdirSync(basePath);

                res.write('<ul>');

                content.forEach((item) => {
                    const p = `${basePath}/${item}`;

                    if (filesystem.statSync(p).isFile()) {
                        res.write('<li><a href="');
                        res.write(baseUrl + item);
                        res.write('">');
                        res.write(item);
                        res.write('</a></li>');

                        if (/\.js$/.test(item)) {
                            const html = item.substr(0, item.length - 3);

                            res.write('<li><a href="');
                            res.write(baseUrl + html);
                            res.write('">');
                            res.write(html);
                            res.write('</a> (magic html for ');
                            res.write(item);
                            res.write(') (<a href="');
                            res.write(
                                baseUrl.replace(
                                    // eslint-disable-next-line
                                    /(^(https?:\/\/[^\/]+)?\/)/,
                                    '$1webpack-dev-server/'
                                ) + html
                            );
                            res.write('">webpack-dev-server</a>)</li>');
                        }
                    } else {
                        res.write('<li>');
                        res.write(item);
                        res.write('<br>');

                        writeDirectory(`${baseUrl + item}/`, p);

                        res.write('</li>');
                    }
                });

                res.write('</ul>');
            }

            writeDirectory(outputPublicPath || '/', outputPath);

            res.end('</body></html>');

        });

        //app.listen(this.itemConfig.devServer.port, () => console.log("express server"));

    }
    runWebpack(){
        let processArgv = this.processArgv;
        const webpackConfigs = this.webpackConfigs;
        let compiler = webpack(webpackConfigs);
        const firstWebpackConfig = Array.isArray(webpackConfigs) ? webpackConfigs[0] : webpackConfigs;
        const outputPublicPath = firstWebpackConfig.output.publicPath;
        const itemConfig = this.itemConfig;
        let devServer = itemConfig.devServer;
        let cbFunction = function (err, stats) {
            if (err){
                console.log(err);
                return;
            }
            if (stats){
                process.stdout.write(stats.toString({
                    chunks: false,
                    colors: true
                }));
            }
            console.log("\r\n compile success!");
        };
        /*
        if (processArgv.ssr) {
            if (processArgv.mode === Const.MODES.DEVELOPMENT) {
                this.ssr();

            }else{
                compiler["run"](cbFunction);
            }
        } else
        */
            if (processArgv.mode === Const.MODES.DEVELOPMENT && processArgv.devserver){
            // mock
            if (processArgv.mock) {
                const mocksPath = path.resolve(Const.MOCKS_PATH , "./index.js");
                extend(true, devServer.options, {
                    before: (app, ins) => {
                        apiMocker(app, mocksPath);
                        if (!processArgv.ssr){
                            return;
                        }
                        const renderer = require("vue-server-renderer").createRenderer();

                        app.get("/server-index", function (req, res, next) {
                            const middleware = ins.middleware;
                            const appName = req.path.slice(1);
                            const outputPath = middleware.getFilenameFromUrl( outputPublicPath  || '/' );
                            const items = middleware.fileSystem.readdirSync(outputPath);
                            let appJsPath;
                            items.forEach((item) => {
                                if (item.indexOf(appName) === 0){
                                    appJsPath = item;
                                }
                            });
                            console.log(appJsPath);

                            const content = middleware.fileSystem.readFileSync(`${outputPath}/${appJsPath}`);
                            //console.log(content.toString());
                            //const createApp = requireFromString(content.toString());
                            //const createApp = require("require-from-string")(content.toString());
                            const createApp = require("vue-ssr-server-bundle.json");
                            console.log(typeof createApp);
                            console.log(createApp);
                            const webApp = createApp["default"]({url: req.url});
                            renderer.renderToString(webApp, (err, html) => {
                                res.end(html);
                            })


                        })
                    }

                });
            }
            new WebpackDevServer(compiler, devServer.options)
                .listen(devServer.port, "0.0.0.0");
            let firstExec = true;
            //will opening browser after first compiled
            let isLinuxOS = require("os").type() === "Linux" ;
            if (devServer.options.open && !isLinuxOS){
                compiler.plugin("done", () => {
                    if (firstExec){
                        firstExec = false;
                        open(`http://localhost:${devServer.port}/webpack-dev-server`);
                    }
                });
            }
        }else if (processArgv.mode === Const.MODES.DEVELOPMENT && processArgv.watch){
            compiler["watch"]({
                ignored: "/node_modules/"
            }, cbFunction);
        }else{
            compiler["run"](cbFunction);

        }
    }
}
module.exports = Compile;
