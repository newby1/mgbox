const  path = require('path');
const _dir = __dirname;
import Helpers from '../../build/helpers/helper.js';
describe(`helper function test`, () => {
    const helperPath = path.resolve(_dir, '../resources/helpers/');
    describe(`getApps`, () => {
        it(` get all app in the dir`, () => {
            expect(Helpers.getApps(helperPath))
                .toEqual(expect.arrayContaining([
                        "app1",
                        "app2"
                    ].map((val) => {
                        return path.resolve(_dir, `../resources/helpers/${val}`)

                    }))
                )
        });
        it(` get app1 in the dir`, () => {
            expect(Helpers.getApps(helperPath, ["app1"]))
                .toEqual(expect.arrayContaining([
                        "app1"
                    ].map((val) => {
                        return path.resolve(_dir, `../resources/helpers/${val}`)

                    }))
                )
        });
        it(` get not exsited app3 add app1 in the dir`, () => {
            expect(Helpers.getApps(helperPath, ["app1", `app3`]))
                .toEqual(expect.arrayContaining([
                        "app1"
                    ].map((val) => {
                        return path.resolve(_dir, `../resources/helpers/${val}`)

                    }))
                )
        });
        it(` get not exsited app3 in the dir`, () => {
            expect(Helpers.getApps(helperPath, ["app3"]))
                .toEqual([]);
        });

    });
    describe(`getIPAdress`, () => {
        it(` ip match`, () => {
            expect(Helpers.getIPAdress()).toMatch(/(\d{1,3}\.){3}\d{1,3}/);
        });

    })
});
