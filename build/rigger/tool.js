const extend = require("extend");
class WebpackTool {
    constructor(config){
        this.config =  config || {
            entry:{},
            output:{
                path: "",
                filename: "",
                publicPath: "/"
            },
            module: {
                rules: []
            },
            plugins: []
        };
    }

    done() {
        return this.config;
    }
    entry(options) {
        this.config.entry = options;
        return this;
    }
    output(options) {
        this.config.output = Object.assign(this.config.output, options);
        return this;
    }
    module(options = []) {
        this.config.module.rules = this.config.module.rules.concat(options);
        return this;
    }
    plugins (options = []) {
        this.config.plugins = this.config.plugins.concat(options);
        return this;
    }
    append (options) {
        this.config = extend(true, this.config, options);
        return this;
    }
}

module.exports = WebpackTool;
