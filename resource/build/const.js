const path = require("path");
const cwd = process.cwd();
const PRJ_PATH =  cwd;
const PRJ_NAME = path.basename(PRJ_PATH);
module.exports = {
    VERSION: "1.0.13",
    PRJ_NAME,
    ENVS : {
        LOCAL: "local",
        CLIENT: "client",
        SERVER: "server",
        DEV:"dev",
        TEST:"test",
        DEMO:"demo",
        BETA: "beta",
        ONLINE: "online",
    },
    MODES: {
        DEVELOPMENT: "development",
        PRODUCTION: "production"
    },
    FRAMES: {
        JQUERY: "jquery",
        VUE: "vue",
        REACT: "react"
    },
    RENDERS: {
        CLIENT: "client",
        SERVER: "server"
    },
    PRJ_PATH,
    BUILD_PATH: path.resolve(cwd, "./build"),
    PLUGINS_CONFIG_PATH: path.resolve(cwd, "./configs/.config"),
    CONFIGS_PATH: path.resolve(cwd, "./configs"),
    ITEMS_PATH: path.resolve(cwd, "./configs/items"),
    SRC_PATH : path.resolve(cwd, "./src"),
    DIST_PATH : path.resolve(cwd, "./dist"),
    MOCKS_PATH : path.resolve(cwd, "./mocks"),
    MANIFEST_PATH: path.resolve(cwd, `./manifest`)
};
