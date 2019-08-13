#!/usr/bin/env node
const fs = require("fs");
const shell = require("shelljs");
const path = require("path");
const inquirer = require("inquirer");
const Utils = require("./utils");
let cwd = process.cwd();

const resolvePrj = (file) => {
    return path.resolve(cwd, `./${file}`);

};

const resolveNpm = (file) => {
    return path.resolve(__dirname, `../resource/${file}`);

};
const configPath = path.resolve(cwd, "./configs/project.config.json");
module.exports = {
    run() {
        if (!Utils.isInstalled(configPath)){
            console.log("请先添加项目或者进入项目的根目录进行升级");
            return;
        }
        this.confirm();
    },
    confirm(){
        inquirer.prompt([
            {
                type: "confirm",
                name: "isUpdate",
                message: "是否升级build(如有改动请放弃)",
                default: false
            }
        ])
            .then(answers => {
                if (answers.isUpdate){
                    shell.cp("-rf",
                        resolveNpm("build"),
                        resolvePrj("./")
                    );
                    this.update();
                }
            })

    },
    getAllPackageModules(config){
        const modules = require('./modules');
        let arr = [];
        if (!Utils.isObject(config)){
            console.log("config must is Object");
            return arr;
        }
        for(let key in config){
            config[key].useLastestModules = true;
            arr = arr.concat(Utils.getPackageModules(config[key], modules))
        }
        arr = [...new Set(arr)];
        return arr;
    },
    update(){
        const msg = "升级完成!";

        const config = require(configPath);
        let dependencies = this.getAllPackageModules(config);
        Utils.installPackage(dependencies,() => {
            console.log(msg);
        }, false);
    },

};
