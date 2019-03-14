/**
 *
 */
const glob = require('glob');
const extend = require("extend");
const path = require('path');


const data = {
};
glob.sync(path.join(__dirname,"[!mock]*.js")).forEach(val => {
    extend(true, data, require(val));
});
module.exports = data;
