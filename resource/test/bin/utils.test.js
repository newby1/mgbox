
const Utils = require("../../../bin/utils");
const Data = require("../../../bin/modules");
const path = require('path');
describe(`test utils.js`, () => {
    let dependConfig;
     beforeAll(() => {
          dependConfig = {
             "itemName": "business",
             "frame": "react",
             "isSsrItem": false,
             "cssProcessor": "less",
             "ts": false,
             "tplEngine": "none",
             "entryCssExt": "less",
             "entryJsExt": "js",
             "useLastestModules": false
         };
     });
    describe("installPackage", () => {
        xit("init", done => {
            const dependencies = Utils.getPackageModules(dependConfig, Data);
            console.log(dependencies);
            Utils.installPackage(dependencies, () => {
                const curPath = path.resolve(process.cwd(), "package.json");

                let data = require(curPath);
                expect(data.devDependencies['@babel/core']).toBe('^7.0.0');
                done();

            })

        }, 80000 );
        it("update", done => {
            const dependencies = ['@babel/core@^7.5.4'];
            Utils.installPackage(dependencies, () => {
                const curPath = path.resolve(process.cwd(), "package.json");

                let data = require(curPath);
                expect(data.devDependencies['@babel/core']).toBe('^7.5.4');
                done();
            }, false);


        }, 80000 )
    });

    xdescribe('getPackageModules', () => {
        const resBabel = "@babel/core@^7.0.0";
        const resBabelNew = "@babel/core";
        const resReact = "react@^16.0.0";
        const resReactNew = "react";
        const resExtend = "extend@^3.0.0";
        const resExtendNew = "extend";
        const resEjs = "ejs@^2.6.0";
        const resEjsNew = "ejs";
        const resTsloader = "ts-loader@^6.0.0";
        const resTsloaderNew = "ts-loader";
        it('normal', () => {
            const res = Utils.getPackageModules(dependConfig, Data);
            expect(res).toEqual(expect.arrayContaining([
                resBabel,
                resReact,
                resExtend
            ]));
            expect(res).not.toEqual(expect.arrayContaining(
                [resBabelNew, resEjs, resTsloader]
            ));
        });
        it('ejs ts', () => {
            Object.assign(dependConfig, {
                "ts": true,
                "tplEngine": "ejs",
            });
            const res = Utils.getPackageModules(dependConfig, Data);
            expect(res).toEqual(expect.arrayContaining([
                resBabel,resReact, resExtend,resEjs, resTsloader
            ]));
            expect(res).not.toContain(resReactNew);
        });
        it('use lastest module', () => {
            Object.assign(dependConfig, {
                "useLastestModules": true
            });
            const res = Utils.getPackageModules(dependConfig, Data);
            expect(res).toEqual(expect.arrayContaining( [
                resBabelNew,
                resReactNew,
                resExtendNew,
                resEjsNew,
                resTsloaderNew
            ] ));
            expect(res).not.toContain(resReact);

        });
    })
});
