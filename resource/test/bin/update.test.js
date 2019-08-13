const Utils = require("../../../bin/utils");
const Data = require("../../../bin/modules");
const path = require('path');
const update = require('../../../bin/update');
describe('test update.js', () => {
    let config = {
        "lucky-share": {
            "itemName": "lucky-share",
            "frame": "react",
            "isSsrItem": false,
            "cssProcessor": "sass",
            "ts": true,
            "tplEngine": "ejs",
            "entryCssExt": "scss",
            "entryJsExt": "js"
        },
        "business": {
            "itemName": "business",
            "frame": "jquery",
            "isSsrItem": false,
            "cssProcessor": "less",
            "ts": false,
            "tplEngine": "none",
            "entryCssExt": "less",
            "entryJsExt": "js"
        },
        "toc": {
            "itemName": "toc",
            "frame": "vue",
            "isSsrItem": true,
            "cssProcessor": "less",
            "ts": false,
            "tplEngine": "none",
            "entryCssExt": "less",
            "entryJsExt": "js"
        }
    };

    it("getAllPackageModules", () => {
        let res = update.getAllPackageModules(config);
        expect(res).toEqual(expect.arrayContaining(
            [
                "@babel/core",
                "react",
                "vue",
                "css-loader",
                "ts-loader",
                "@types/react-dom",
                "ejs",
                "less",
                "node-sass",
                "vue-server-renderer"
            ]
        ))


    })

});
