const path = require("path");
const PRJ_PATH =  path.resolve(__dirname, "../");
const PRJ_NAME = path.basename(PRJ_PATH);
module.exports = {
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
    TYPES: {
        ISOMERISM: "isomerism",
        ISOMORPHISM: "isomorphism"
    },
    RENDERS: {
        CLIENT: "client",
        SERVER: "server"
    },
    PRJ_PATH,
    CONFIG_PATH: path.resolve(__dirname, "../.config"),
    SRC_PATH : path.resolve(__dirname, "../src"),
    BUILD_PATH: path.resolve(__dirname, "../build"),
    DIST_PATH : path.resolve(__dirname, "../dist"),
    MOCKS_PATH : path.resolve(__dirname, "../mocks"),
    MANIFEST_PATH: path.resolve(__dirname, `../manifest`)
};
