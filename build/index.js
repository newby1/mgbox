const Const = require("./const");
const extend = require("extend");
const Helper = require("./helpers/helper");
const path = require("path");
const Compile = require("./rigger/compile");
const del = require("del");
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
    .option("-C, --cdn", "静态资源需要上cdn")
    .option("-S, --ssr", "服务端渲染")
    .option("-O, --open", "是否打开浏览器")
    .option("-T, --tpl", "模板解析引擎")
    .option("-L, --eslint", "eslint")
    .option("--debug", "编译日志")
    .parse(process.argv);



let {items, env, mode, apps, mock, devserver, cdn, watch, ssr, tpl, debug, open, eslint} = commander;
const curItems = Helper.getItems(path.resolve(Const.BUILD_PATH, "./items/"));
const processArgv = {
    env,
    mode,
    apps,
    isSSRItem: false,
    render: Const.RENDERS.CLIENT,
    ssr,
    mock: mode == Const.MODES.DEVELOPMENT && mock ? true : false ,
    devserver,
    watch,
    cdn,
    debug,
    open,
    eslint,
    tpl
};
//删除缓存
if (mode === Const.MODES.PRODUCTION){
    console.log("delete dist & manifest dir");
    try {
        del.sync([Const.MANIFEST_PATH, Const.DIST_PATH]);
    } catch(e) {
    }

}
let itemsLength = items.length;
items =  itemsLength ? items : Object.keys(curItems);
items.forEach((val) => {
    if (Object.keys(curItems).includes(val)){
        let option = extend({
                item: val,
            },
            processArgv,
            {
                isSSRItem: curItems[val]
            }
        );
        if (itemsLength > 1){
            processArgv.apps = [];
        }
        new Compile(option);
    }
});

