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
        this.itemConfig = null;
        this.observerIns = new Observer;
        this.preWebpackConfig = null;
        this.webpackConfig = null;
        this.run();
    }
    run() {
        this.setItemConfig();
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
    outputConfig(){
        this.webpackConfig = require("./output").run(this.preWebpackConfig);
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
    runWebpack(){
        let compiler = webpack(this.webpackConfig);
        let devServer = this.itemConfig.devServer;
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
        let processArgv = this.processArgv;
        //mode is development and had devserver option
        if (processArgv.mode === Const.MODES.DEVELOPMENT && processArgv.devserver){
            // mock
            if (processArgv.mock) {
                const mocksPath = path.resolve(Const.MOCKS_PATH , "./index.js");
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
