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
        return this.getCompileFactory(config);
    }
    getServerPreWebpackConfig(){
        if (!this.processArgv.ssr){
            return new Promise((resolve, reject) =>  resolve(false) );
        }else{
            this.processArgv.ssr = Const.RENDERS.SERVER;
            let config = require(`../items/${this.processArgv.item}/server`);
            return this.getCompileFactory(config);
        }
    }
    readFile(fs, filepath, file){
       return fs.readFileSync(path.join(filepath, file), "utf-8");
    }
    ssrDev(){
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


        let itemConfig = this.serverContext.itemConfig;
        let devServer = itemConfig.devServer;
        new WebpackDevServer(serverCompiler, extend(true, {
            publicPath: outputPublicPath
        }, devServer.options, {
            before: (app, ins) => {
                app.get("*", (req, res, next) => {
                    //ssr访问路径，不带文件后缀
                    if ((/\./.test(req.path))){
                        next();
                        return;
                    }
                    const fileSystem = ins.middleware.fileSystem;
                    const outputPath = serverConfig.output.path;
                    const name = (req.path.slice(1).split("."))[0];
                    const manifest = JSON.parse(this.readFile(fileSystem, outputPath, `ssr-manifest.json`).toString());
                    const filename = manifest[`server-${name}.js`];
                    const serverJs = this.readFile(fileSystem, outputPath, `${filename}`).toString();
                    const tpl = this.readFile(fileSystem, outputPath, `${name}.html`).toString();
                    let template = tpl;
                    if (this.processArgv.tpl){
                        const data = require(path.resolve(Const.MOCKS_PATH, "tpldata.js"));
                        const ejs = require("ejs");
                        template = ejs.render(tpl, data);
                    }
                    const serverApp = require("require-from-string")(serverJs).default;
                    app.use(serverApp({
                        req,
                        res,
                        next,
                        context:{
                            template
                        }
                    }));
                });
                //app.set('view engine','ejs');
                /*
                app.get("*", (req, res, next) => {
                    if ((/\./.test(req.path))){
                        next();
                        return;
                    }
                    const name = (req.path.slice(1).split("."))[0];
                    //const name = "index";
                    const manifest = JSON.parse(this.readFile(ins.middleware.fileSystem, serverConfig.output.path, `ssr-manifest.json`).toString());
                    const filename = manifest[`server-${name}.js`];
                    const serverJs = this.readFile(ins.middleware.fileSystem, serverConfig.output.path, `${filename}`).toString();
                    const tpl = this.readFile(ins.middleware.fileSystem, serverConfig.output.path, `${name}.html`).toString();
                    const serverAppStr = require("require-from-string")(serverJs).default;
                    res.send(tpl.replace("<!--reactAppTag-->", serverAppStr));
                });
                */

                // app.use(clientDevMiddleware);
                /*
                app.get("*", (req, res, next) => {
                    if (!(/(\.html)/.test(req.path))){
                        next();
                        return;
                    }
                    let getJs = () => {
                        let strArr = [];
                        itemConfig.dll.assets.js.forEach((val) => {
                            strArr.push(`<script src="${clentConfig.output.publicPath}/${val}"></script>`)
                        });
                        return strArr.join("");
                    };
                    let getCss = () => {
                        itemConfig.buildAssets.css.forEach((val) => {
                            strArr.push(`<link rel="stylesheet" href="${clentConfig.output.publicPath}/${val}" />`)
                        });

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
                    console.log(name);
                    res.setHeader("Content-Type", "text/html");

                    const bundle = JSON.parse(this.readFile(ins.middleware.fileSystem, serverConfig.output.path, `vue-ssr-server-bundle.json`).toString());
                    //const bundle = JSON.parse(this.readFile(new mfs(), serverConfig.output.path, `vue-ssr-server-bundle.json`).toString());
                    const template = fs.readFileSync(path.resolve(itemConfig.absolutePath.appsPath, `./${name}/index.html`), "utf-8");
                    console.log(template);
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
                */
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
        const clentConfig = this.clientContext.webpackConfig;
        const serverConfig = this.serverContext.webpackConfig;
        const config = [clentConfig, serverConfig];
        let devServer = this.serverContext.itemConfig.devServer;
        const middleware = (app, ins) => {

            app.get("*", (req, res, next) => {
                //ssr访问路径，不带文件后缀
                if ((/\./.test(req.path))) {
                    next();
                    return;
                }
                const fileSystem = ins.middleware.fileSystem;
                const outputPath = serverConfig.output.path;
                const name = (req.path.slice(1).split("."))[0];
                const manifest = JSON.parse(this.readFile(fileSystem, outputPath, `ssr-manifest.json`).toString());
                const filename = manifest[`server-${name}.js`];
                const serverJs = this.readFile(fileSystem, outputPath, `${filename}`).toString();
                const tpl = this.readFile(fileSystem, outputPath, `${name}.html`).toString();
                let template = tpl;
                if (this.processArgv.tpl) {
                    console.log(333);
                    const data = require(path.resolve(Const.MOCKS_PATH, "tpldata.js"));
                    const ejs = require("ejs");
                    template = ejs.render(tpl, data);
                    console.log(template);
                }
                const serverApp = require("require-from-string")(serverJs).default;
                serverApp({
                    req,
                    res,
                    next,
                    context: {
                        template
                    }
                });
            });

        };
        this.run({
            config,
            devServer,
            middleware
        })


    }
    clientRender(){
        const config = this.clientContext.webpackConfig;
        const devServer = this.clientContext.itemConfig.devServer;
        this.run({
            config,
            devServer
        })

    }
    run({ config, devServer, middleware = null}){
        const timer = "use time";
        console.time(timer);
        const mock = this.processArgv.mock;
        let compiler = webpack(config);
        if (this.processArgv.env === Const.ENVS.LOCAL && this.processArgv.devserver){
            new WebpackDevServer(compiler, extend(
                true,
                devServer.options,
                {
                    before(app, ins){
                        if (mock){
                            const mocksPath = path.resolve(Const.MOCKS_PATH , "./index.js");
                            apiMocker(app, mocksPath);
                        }
                        middleware && middleware(app, ins);
                    }
                }
            ))
                .listen(devServer.port, "0.0.0.0");
            let firstExec = true;
            let isLinuxOS = require("os").type() === "Linux" ;
            if (this.processArgv.open && !isLinuxOS){
                compiler.plugin("done", () => {
                    console.timeEnd(timer);
                    if (firstExec){
                        firstExec = false;
                        open(`http://localhost:${devServer.port}/webpack-dev-server`);
                    }
                });
            }
        }else{
            compiler.run((err, stats) => {
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
                console.log(` \r\n compile success! ${console.timeEnd(timer)} `);
            })

        }

    }
    runWebpack(){
        let processArgv = this.processArgv;
        if (processArgv.ssr){
            this.serverRender();
        }else{
            this.clientRender();
        }
    }
}
module.exports = Compile;
