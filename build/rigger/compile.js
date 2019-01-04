const path = require("path");
const fs = require('fs');
const extend = require("extend");
const webpack = require("webpack");
const apiMocker = require("mocker-api");
const WebpackDevServer = require("webpack-dev-server");
const Observer = require("../helpers/observer");
const open = require("opn");
const Const = require("../const");
const PreConfigFactory = require("./pre-config-factory");


class Compile {
    constructor(processArgv){
        this.processArgv = processArgv;
        this.clientContext = null;
        this.serverContext = null;

        this.main();
    }
    outputConfig(preWebpackConfig){
        return require("./output").run(preWebpackConfig);
    }
    main(){
        this.getClientPreWebpackConfig()
            .then(context => {
                context.webpackConfig = this.outputConfig(context.preWebpackConfig);
                this.clientContext = context;
                this.getServerPreWebpackConfig().then((context) =>{
                    if (context){
                        context.webpackConfig = this.outputConfig(context.preWebpackConfig);
                        this.serverContext = context;
                    }
                    this.runWebpack();

                })
                    .catch(e => {
                        console.log(e, "compile server");
                    })
            })
            .catch(e => {
                console.log(e, "compile client");
            })

    }
    getCompileFactory(config){
        return new PreConfigFactory(this.processArgv).run(config);
    }
    getClientPreWebpackConfig(){
        let config;
        if (this.processArgv.ssr){
            this.processArgv.ssr = Const.RENDERS.CLIENT;
        }
        if (this.processArgv.ssr){
            config = require(`../items/${this.processArgv.item}/client`);
        }else{
            config = require(`../items/${this.processArgv.item}`);
        }
        console.log(config, "client");
        return this.getCompileFactory(config);
    }
    getServerPreWebpackConfig(){
        if (!this.processArgv.ssr){
            return new Promise((resolve, reject) =>  resolve(false) );
        }else{
            this.processArgv.ssr = Const.RENDERS.SERVER;
            let config = require(`../items/${this.processArgv.item}/server`);
            console.log(config, "server");
            return this.getCompileFactory(config);
        }
    }
    readFile(fs, filepath, file){
       return fs.readFileSync(path.join(filepath, file), "utf-8");
    }
    ssrDev(){
        const createBundleRenderer = require('vue-server-renderer').createBundleRenderer;
        const mfs = require("memory-fs");
        let clentConfig = this.clientContext.webpackConfig;
        let serverConfig = this.serverContext.webpackConfig;
        // let clientCompiler = webpack(clentConfig);
        // let serverCompiler = webpack(serverConfig);
        let serverCompiler = webpack([serverConfig, clentConfig]);
        const outputPublicPath = clentConfig.output.publicPath;
        // let clientDevMiddleware = require("webpack-dev-middleware")(clientCompiler, {
        //     publicPath: outputPublicPath,
        //     noInfo: true
        // });


        let itemConfig = this.clientContext.itemConfig;
        let devServer = itemConfig.devServer;
        new WebpackDevServer(serverCompiler, extend(true, {
            publicPath: outputPublicPath
        }, devServer.options, {
            before: (app, ins) => {
                // app.use(clientDevMiddleware);
                app.get("*", (req, res, next) => {
                    if (!(/(\.html)/.test(req.path))){
                        next();
                        return;
                    }
                    let getDlls = () => {
                        let strArr = [];
                        itemConfig.dll.assets.js.forEach((val) => {
                            strArr.push(`<script src="${clentConfig.output.publicPath}/${val}"></script>`)
                        });
                        return strArr.join("");
                    };
                    const context = {
                        title: "{{name}}",
                        url: req.url,
                        dlls: getDlls()
                    };
                    const name = (req.path.slice(1).split("."))[0];
                    res.setHeader("Content-Type", "text/html");

                    const bundle = JSON.parse(this.readFile(ins.middleware.fileSystem, serverConfig.output.path, `vue-ssr-server-bundle.json`).toString());
                    //const bundle = JSON.parse(this.readFile(new mfs(), serverConfig.output.path, `vue-ssr-server-bundle.json`).toString());
                    const template = fs.readFileSync(path.resolve(itemConfig.absolutePath.appsPath, `./${name}/index.html`), "utf-8");
                    //const clientManifest = JSON.parse(this.readFile(clientDevMiddleware.fileSystem, clentConfig.output.path, `vue-ssr-client-manifest.json`).toString());
                    const clientManifest = JSON.parse(this.readFile(ins.middleware.fileSystem, clentConfig.output.path, `vue-ssr-client-manifest.json`).toString());
                    createBundleRenderer( bundle, {
                        template,
                        clientManifest,
                    })
                        .renderToString(context, (err, html) => {
                            console.log(err, "err");
                            res.send(html);
                        })
                });
            }
        }))
            .listen(devServer.port, "0.0.0.0");
        //will opening browser after first compiled
        let firstExec = true;
        let isLinuxOS = require("os").type() === "Linux" ;
        if (devServer.options.open && !isLinuxOS){
            serverCompiler.plugin("done", () => {
                if (firstExec){
                    firstExec = false;
                    //open(`http://localhost:${devServer.port}/webpack-dev-server`);
                }
            });
        }
    }
    ssrPro(){
        let clentConfig = this.clientContext.webpackConfig;
        let serverConfig = this.serverContext.webpackConfig;
        let serverCompiler = webpack([serverConfig, clentConfig]);
        serverCompiler.run((err, stats) => {
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
        })

    }
    serverRender(){

        if (this.processArgv.mode === Const.MODES.DEVELOPMENT && this.processArgv.devserver){
            this.ssrDev();
        }else{
            this.ssrPro();
        }

    }
    clientRender(){
        let clentConfig = this.clientContext.webpackConfig;
        let compiler = webpack(clentConfig);
        let itemConfig = this.clientContext.itemConfig;
        let devServer = itemConfig.devServer;
        new WebpackDevServer(compiler, extend(true, {}, devServer.options, {
            before: (app, ins) => {
            }
        }))
            .listen(devServer.port, "0.0.0.0");
        let firstExec = true;
        let isLinuxOS = require("os").type() === "Linux" ;
        if (devServer.options.open && !isLinuxOS){
            compiler.plugin("done", () => {
                if (firstExec){
                    firstExec = false;
                    //open(`http://localhost:${devServer.port}/webpack-dev-server`);
                }
            });
        }

    }
    runWebpack(){
        console.log(44);
        let processArgv = this.processArgv;
        if (processArgv.ssr){
            this.serverRender();
        }else{
            this.clientRender();
        }
    }
}
module.exports = Compile;
