const path = require("path");
const extend = require("extend");
const webpack = require("webpack");
const apiMocker = require("mocker-api");
const WebpackDevServer = require("webpack-dev-server");
const Observer = require("../helpers/observer");
const open = require("opn");
const Const = require("../const");

class Compile {
    constructor(processArgv){
        this.processArgv = processArgv;
        this.compilationConfig = null;
        this.observerIns = new Observer;
        this.semifinishedConfig = null;
        this.webpackConfig = null;
        this.run();
    }
    run(){
        this.setCompileConfig();
        this.compileItem();
        this.compileFrame();
        this.compileEnv();
        this.compileMode();
        this.dll()
            .then(() => {
                this.outputConfig();
                this.runWebpack();
            })
    }
    setCompileConfig(){
        this.compilationConfig = require(`../configs/${this.processArgv.item}`);
    }
    getArgs(){
        return {
            configSet: this.semifinishedConfig,
            baseConfig: this.compilationConfig,
            option: this.processArgv
        }
    }
    compileItem(){
        this.semifinishedConfig = require(`../items/${this.processArgv.item}`).run(this.getArgs());
    }
    compileFrame(){
        this.semifinishedConfig = require(`../compile/frames/${this.compilationConfig.frame}`).run(this.getArgs());
    }
    compileEnv(){
        this.semifinishedConfig = require(`../compile/envs/${this.processArgv.env}`).run(this.getArgs());
    }
    compileMode(){
        this.semifinishedConfig = require(`../compile/modes/${this.processArgv.mode}`).run(this.getArgs());
    }
    outputConfig(){
        this.webpackConfig = require("./output").run(this.semifinishedConfig);
        console.log(this.webpackConfig.module.rules);
    }
    dll(){
        return new Promise((resolve, reject) => {
            require("../helpers/dll")
                .run(this.getArgs())
                .then((semifinishedConfig) => {
                    this.semifinishedConfig = semifinishedConfig;
                    resolve(true);
                })
        })

    }
    runWebpack(){
        let compiler = webpack(this.webpackConfig);
        let devServer = this.compilationConfig.devServer;
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
        };
        let processArgv = this.processArgv;
        //mode is development and had devserver option
        if (processArgv.mode === Const.MODES.DEVELOPMENT && processArgv.devserver){
            // mock
            if (processArgv.mock) {
                const mocksPath = path.resolve(Const.MOCKS_PATH , "./index.js");
                console.log("====");
                console.log(mocksPath);
                console.log("====");
                extend(true, devServer.options, {
                    before: app => {
                        apiMocker(app, mocksPath)
                    }

                });
            }
            new WebpackDevServer(compiler, devServer.options)
                .listen(devServer.port, "0.0.0.0");
            let firstExec = true;
            //will opening browser after first compiled
            if (devServer.options.open){
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
