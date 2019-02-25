#!/usr/bin/env node
const fs = require("fs");
const shell = require("shelljs");
const path = require("path");
const inquirer = require("inquirer");
const execSync = require('child_process').execSync;
const utils = require('./utils');
const glob = require("glob");

let config = {};
let itemName;
let cwd = process.cwd();

const resolvePrj = (file) => {
    return path.resolve(cwd, `./${file}`);

};

const resolveNpm = (file) => {
    return path.resolve(__dirname, `../${file}`);

};
const shouldUserYarn = () => {
    try {
        execSync('yarnpkg --version', { stdio: 'ignore' });
        return true;
    } catch (e) {
        return false;
    }
};
let configPath = resolvePrj("configs/project.config.json");
const add = {
    main(){
        this.loadConfig();
        this.collect();
    },
    loadConfig(){
        let configs = `configs`;
        if (!fs.existsSync(resolvePrj(configs))){
            shell.mkdir("-p", configs);
        }

        if (utils.isInstalled(configPath)) {
            config = require(configPath);
            return;
        }
        shell.touch(configPath);
    },
    init(){
        //初始化项目
        ["configs/.config", "mocks", "src", "configs/items"].forEach(val => {
            if (!fs.existsSync(resolvePrj(val))){
                shell.mkdir("-p", val);
            }

        });
        //复制mocks .babelrc .gitignore
        shell.cp("-r" ,
            resolveNpm(`resource/build`),
            resolveNpm(`resource/mocks`),
            resolveNpm(`resource/.babelrc`),
            resolveNpm(`resource/.gitignore.tpl`),
            resolveNpm(`resource/package.tpl.json`),
            resolvePrj(`./`));
        shell.mv(
            resolvePrj(`.gitignore.tpl`),
            resolvePrj(`.gitignore`),
        );
        shell.mv(
            resolvePrj(`package.tpl.json`),
            resolvePrj(`package.json`),
        );
    },
    collect(){
        const cssExt = {
            "less": "less",
            "sass": "scss",
            "stylus": "styl"
        };
        const jsExt = {
            "js": "js",
            "tsx": "tsx",
            "ts": "ts"
        };
        inquirer.prompt([
            {
                type: "input",
                name: "itemName",
                message: "输入项目名称",
                validate: function(input){
                    let done = this.async();
                    if (!input){
                        done("不能输入为空");
                        return;
                    }else{
                        if (config[input]){
                            done("项目已经存在");
                            return;
                        }
                    }
                    itemName = input;
                    done(null, true);
                }
            },
            {
                type: "list",
                name: "frame",
                message: "选择框架",
                default: "vue",
                choices: ["vue", "react", "jquery"]
            },
            {
                type: "confirm",
                name: "isSsrItem",
                message: "是否支持ssr",
                default: false,
                when: function (answers) {
                    return answers.frame !== "jquery";
                }
            },
            {
                type: "list",
                name: "cssProcessor",
                message: "选择css预处理器",
                default: "less",
                choices: ["less", "sass", "stylus"]
            },
            {
                type: "confirm",
                name: "ts",
                message: "是否启用typescript",
                default: false
            },
            {
                type: "list",
                name: "tplEngine",
                message: "选择模板引擎",
                default: "none",
                choices: ["none", "ejs", "pug", "handlebars"],
                when: function (answers) {
                    return false ===  answers.isSsrItem
                }
            }
        ])
            .then(answers => {
                config[itemName] = {};
                Object.assign(config[itemName], answers);
                config[itemName]["entryCssExt"] = cssExt[answers['cssProcessor']];
                config[itemName]["entryJsExt"] =
                    answers.ts
                        ?
                        (answers.frame === "react" && jsExt.tsx  || jsExt.ts)
                        :
                        jsExt.js;
                this.copy();
                this.createPackage();
            })
    },
    createPackage(){
        const modules = require('./modules');
        let itemConfig = config[itemName];
        let frame = itemConfig.frame;
        let dependencies = [].concat(modules.base);
        let startMsg = "开始安装模块...";
        let msg = "安装模块完成";
        let that = this;
        let exec;
        dependencies = dependencies
            .concat(modules[frame])
            .concat(modules.css.base)
            .concat(modules.css[itemConfig.cssProcessor])
            .concat(modules.tplEngine[itemConfig.tplEngine] || []);
        if (itemConfig.isSsrItem){
            dependencies = dependencies.concat(modules.ssr[frame] || []);
        }
        if (itemConfig.ts){
            dependencies = dependencies.concat(modules.ts.base)
                .concat(modules.ts[frame]);
        }
        console.log(startMsg);
        if (shouldUserYarn()){
            exec = "yarn add ";
        }else{
            console.log("npm i");
            exec = "npm i "
        }
        shell.exec(`${exec} ${dependencies.join(" ")}`,
            {
                async: true
            },
            function () {
                console.log(msg);
                that.run();
            }
        );
    },
    run(){
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        shell.exec(`npm run dev -- -O -i ${itemName}`);
    },
    copy(){
        if (!utils.isInstalled(resolvePrj(`package.json`))) {
            this.init();
        }
        let itemConfig = config[itemName];
        let item = itemConfig.frame;
        if (itemConfig.isSsrItem){
            item = `${item}-ssr`;
        }
        if (itemConfig.ts){
            item = `${item}-ts`;
        }
        let tpl = (str, val) => {
            return  str.replace('{item}', val);
        };
        [
            `configs/.config/{item}`,
            `src/{item}`,
            `configs/items/{item}${itemConfig.isSsrItem ? "" : ".js" }`
        ].forEach(val => {
            shell.cp("-r",
                resolveNpm(`resource/${tpl(val, item)}`),
                resolvePrj(val.replace(/\{.+$/, ""))
            );
            if (item != itemName){
                shell.mv(
                    resolvePrj(tpl(val, item)),
                    resolvePrj(tpl(val, itemName)));
            }
        });
        glob(resolvePrj(`src/${itemName}`) + "/**/*.less", function (err, files) {
            files.forEach(file => {
                shell.mv(file, file.replace(".less", `.${itemConfig.entryCssExt}`));
            })
        });

    }

};
add.main();


