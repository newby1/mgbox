const Const = require("./const");
const extend = require("extend");
const Helper = require("./helpers/helper");
const path = require("path");
const Compile = require("./rigger/compile");

let program = require("commander");
program
    .version("0.1.0")
    .option("-e, --env <env>", "compile environment", Const.ENVS.LOCAL)
    .option("-m, --mode <mode>", "compile mode", new RegExp(`^(${Const.MODES.DEVELOPMENT}|${Const.MODES.PRODUCTION})$`) , Const.MODES.DEVELOPMENT)
    .option("-i, --items []", "assing workspace", function (val) {
        return val.split(",");
    }, [])
    .option("-a, --apps [app1,app2]", "compile app", function (val) {
        return val.split(",");
    }, [])
    .option("-M, --mock", "use mock")
    .option("-d, --devserver", "use devserver")
    .option("--watch", "need watch")
    .option("-c, --cdn", "need cdn")
    .parse(process.argv);

let {items, env, mode, apps, mock, devserver, cdn, watch} = program;
items = items.length ? items : Helper.getItems(path.resolve(Const.BUILD_PATH, "./items/"));
const processArgv = {
    items,
    env,
    mode,
    apps,
    mock: mode == Const.MODES.DEVELOPMENT && mock ? true : false ,
    devserver,
    watch,
    cdn
};
let itemsLength = items.length;
items.forEach((val) => {
    let option = extend({
        item: val
    }, processArgv);
    if (itemsLength > 1){
        option.apps = [];
    }
    new Compile(option);
});

