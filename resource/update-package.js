const fs = require('fs');
const path = require('path');
const PRJ_PATH = path.resolve(__dirname, '../');
const modulesJson = require(path.resolve(PRJ_PATH, 'bin/modules.json'));
const Utils = require(path.resolve(PRJ_PATH, 'bin/utils.js'));
const shell = require('shelljs');


const getModules = function (modules, res = []) {
  for (let key in modules) {
    if (typeof modules[key] === 'string') {
      res.push(key);
    } else {
      res = getModules(modules[key], res)
    }
  }
  return res;
};
const packagePath = path.resolve(PRJ_PATH, 'resource/package.json')
let packageJson =  require(packagePath);
Reflect.deleteProperty(packageJson, 'dependencies');
Reflect.deleteProperty(packageJson, 'devDependencies');
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
const modules = getModules(modulesJson);
if (modules.length) {
  shell.cd(path.resolve(PRJ_PATH, 'resource'));
  Utils.installPackage(modules);
}




