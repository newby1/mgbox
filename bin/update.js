#!/usr/bin/env node
const fs = require("fs");
const shell = require("shelljs");
const path = require("path");
const inquirer = require("inquirer");
let cwd = process.cwd();

const resolvePrj = (file) => {
    return path.resolve(cwd, `./${file}`);

};

const resolveNpm = (file) => {
    return path.resolve(__dirname, `../resource/${file}`);

};
(() => {

    inquirer.prompt([
            {
                type: "confirm",
                name: "isUpdate",
                message: "是否升级build(如有改动请备份)",
                default: false
            }
        ])
        .then(answers => {
            if (answers.isUpdate){
                shell.cp("-rf",
                    resolveNpm("build"),
                    resolvePrj("./")
                );
                console.log("升级完成!");
            }
        })

})();
