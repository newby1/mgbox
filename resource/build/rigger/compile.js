const path = require("path");
const fs = require('fs');
const extend = require("extend");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const Observer = require("../helpers/observer");
const open = require("opn");
const Const = require("../const");
const PreConfigFactory = require("./pre-config-factory");
const Helper = require("../helpers/helper");
const resolve = (dir, file) => {
    return path.resolve(dir, file);
};


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
        console.log(this.processArgv);
        this.getClientPreWebpackConfig()
            .then(context => {
                context.webpackConfig = this.outputConfig(context.preWebpackConfig);
                this.clientContext = context;
                Helper.log(this.processArgv.debug, context.webpackConfig);
                    // context.webpackConfig.module.rules.map(val => {
                    //     console.log(val.test);
                    //     console.log(val.use);
                    // });
                return this.getServerPreWebpackConfig()
            })
            .then((context) =>{
                if (context){
                    context.webpackConfig = this.outputConfig(context.preWebpackConfig);
                    this.serverContext = context;
                }
                this.runWebpack();
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
        this.processArgv.render = Const.RENDERS.CLIENT;
        if (this.processArgv.isSsrItem){
            config = require(resolve(Const.ITEMS_PATH, `./${this.processArgv.itemName}/client`));
        }else{
            config = require(resolve(Const.ITEMS_PATH, `./${this.processArgv.itemName}`));
        }
        return this.getCompileFactory(config);
    }
    getServerPreWebpackConfig(){
        if (this.processArgv.isSsrItem && this.processArgv.ssr){
            this.processArgv.render = Const.RENDERS.SERVER;
            let config = require(resolve(Const.ITEMS_PATH, `./${this.processArgv.itemName}/server`));
            return this.getCompileFactory(config);
        }else{
            return new Promise((resolve, reject) =>  resolve(false) );
        }
    }
    readFile(fs, filepath, file){
       return fs.readFileSync(path.join(filepath, file), "utf-8");
    }
    tplRender(template, data){
        let itemConfig = this.serverContext && this.serverContext.itemConfig || this.clientContext.itemConfig;
        let tplEngine = itemConfig.tplEngine;
        switch (tplEngine) {
            case "ejs":
                template = require("ejs").render(template, data);
                break;
            case "pug":
                template = require("pug").compile(template)(data);
                break;
            case "handlebars":
                template = require("handlebars").compile(template)(data);
                break;
            case "velocity":
                let Engine = require("velocity").Engine;
                template = new Engine({
                    template
                }).render(data);
                break;
            case "none":
            default:
        }
        return template;

    }
    mockTpl(template){
        const data = require(path.resolve(Const.MOCKS_PATH, `${this.processArgv.itemName}-tpl/mock.js`));
        return this.tplRender(template, data);
    }
    serverRender(){
        const clentConfig = this.clientContext.webpackConfig;
        const serverConfig = this.serverContext.webpackConfig;
        const config = [clentConfig, serverConfig];
        const itemConfig = this.clientContext.itemConfig;
        let devServer = itemConfig.devServer;
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
                //const filename = `server-${name}.js`;
                const serverJs = this.readFile(fileSystem, outputPath, `${filename}`).toString();
                let template =  this.readFile(fileSystem, outputPath, `${name}.html`).toString();
                if (itemConfig.tplEngine !== "none"){
                    template = this.mockTpl(template);
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
        const itemConfig = this.clientContext.itemConfig;
        const devServer = itemConfig.devServer;
        const middleware = (app, ins) => {
            app.get("*", (req, res, next) => {
                if (/\.html/.test(req.path) && itemConfig.tplEngine !== "none"){
                    const filename = req.path.slice(1);
                    const fileSystem = ins.middleware.fileSystem;
                    const outputPath = config.output.path;
                    let template = this.readFile(fileSystem, outputPath, `${filename}`).toString();
                    template = this.mockTpl(template);
                    return res.send(template);
                }
                next();
            });
        };
        this.run({
            config,
            devServer,
            middleware
        })

    }
    run({ config, devServer, middleware = null}){
        const timer = Helper.time();
        timer.start();
        const processArgv = this.processArgv;
        const mock = processArgv.mock;
        let compiler = webpack(config);
        if (this.processArgv.env === Const.ENVS.LOCAL && this.processArgv.devserver){
            let firstExec = true;
            let isLinuxOS = require("os").type() === "Linux" ;
            new WebpackDevServer(compiler, extend(
                true,
                devServer.options,
                {
                    before(app, ins){
                        if (mock){
                            const mocksPath = path.resolve(Const.MOCKS_PATH , `${processArgv.itemName}/mock.js`);
                            require("mocker-api")(app, mocksPath);
                        }
                        middleware && middleware(app, ins);
                    },
                    after(app, ins){
                    }
                }
            ))
                .listen(devServer.port, "0.0.0.0");
            if (this.processArgv.open && !isLinuxOS){
                compiler.plugin("done", () => {
                    timer.last();
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
                console.log(` \r\n compile success! `);
                timer.stop();
            })

        }

    }
    runWebpack(){
        let processArgv = this.processArgv;
        if (processArgv.isSsrItem && processArgv.ssr){
            this.serverRender();
        }else{
            this.clientRender();
        }
    }
}
module.exports = Compile;
