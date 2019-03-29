#!/usr/bin/env node
const fs = require('fs');
const extend = require("extend");
const path = require("path");
const cwd = process.cwd();
const utils = require('./utils');

let commander = require("commander");

commander
    .version("0.1.0", "-v, --version")
    .command("add")
    .description("添加一个项目")
    .action(function()  {
        require("./add");
    });

commander
    .command("update")
    .description("更新build")
    .action(function()  {
        require("./update");
    });

commander
    .command("run")
    .option("-e, --env <env>", "编译环境", "local")
    .option("-m, --mode <mode>", "编译模式", "development")
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
    .option("-L, --eslint", "eslint")
    .option("--debug", "编译日志")
    .action(function(res)  {
        const configPath = path.resolve(cwd, "./configs/project.config.json");
        if (!utils.isInstalled(configPath)){
            console.log("请使用mgbox add添加项目");
            return;
        }
        const config = require(configPath);
        let {items, env, mode, apps, mock, devserver, cdn, ssr, debug, open, eslint} = res;
        const curItems = Object.keys(config);
        const processArgv = {
            env,
            mode,
            apps,
            render: "client",
            ssr,
            mock,
            devserver,
            cdn,
            debug,
            open,
            eslint
        };
        let itemsLength = items.length;
        //const Compile = require(path.resolve(__dirname, "../resource/build/rigger/compile"));
        const Compile = require(path.resolve(cwd, "./build/rigger/compile"));
        items =  itemsLength ? items : curItems;
        items.forEach((val) => {
            if (curItems.includes(val)){
                let option = extend({
                        isSsrItem: config[val].isSsrItem,
                        itemName: val,
                    },
                    processArgv,
                );
                if (itemsLength > 1){
                    processArgv.apps = [];
                }
                new Compile(option);
            }else{
                console.log(`item "${val}" is not exist!`) ;
            }
        });
    });

commander.parse(process.argv);
