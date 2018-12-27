const Const = require("./const");
const extend = require("extend");
const Helper = require("./helpers/helper");
const path = require("path");
const Compile = require("./rigger/compile");

let commander = require("commander");
commander
    .version("0.1.0")
    .option("-e, --env <env>", "编译环境", Const.ENVS.LOCAL)
    .option("-m, --mode <mode>", "编译模式", new RegExp(`^(${Const.MODES.DEVELOPMENT}|${Const.MODES.PRODUCTION})$`) , Const.MODES.DEVELOPMENT)
    .option("-i, --items []", "编译项目，多个项目请用逗号分隔", function (val) {
        return val.split(",");
    }, [])
    .option("-a, --apps [app1,app2]", "需要的编译app；多个app逗号分隔", function (val) {
        return val.split(",");
    }, [])
    .option("-M, --mock", "使用mock")
    .option("-D, --devserver", "使用devserver")
    .option("-W --watch", "需要watch")
    .option("-C, --cdn", "静态资源需要上cdn")
    .option("-S, --ssr", "服务端渲染")
    .parse(process.argv);

let {items, env, mode, apps, mock, devserver, cdn, watch, ssr} = commander;

items = items.length ? items : Helper.getItems(path.resolve(Const.BUILD_PATH, "./items/"));
const processArgv = {
    items,
    env,
    mode,
    apps,
    ssr,
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
        processArgv.apps = [];
    }
    new Compile(option);
});

