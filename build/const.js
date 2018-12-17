const path = require("path");
module.exports = {
    PRJ_NAME: "cgrass",
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
    SRC_PATH : path.resolve(__dirname, "../src"),
    BUILD_PATH: path.resolve(__dirname, "../build"),
    DIST_PATH : path.resolve(__dirname, "../dist"),
    MOCKS_PATH : path.resolve(__dirname, "../mocks"),
    MANIFEST_PATH: path.resolve(__dirname, `../manifest`)
};