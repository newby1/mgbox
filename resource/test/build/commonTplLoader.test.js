import path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';
import Const from '../../build/const';
const dir =  __dirname;
const wbCompiler = () => {
    const compiler = webpack({
        context:dir,
        entry: `../resources/tpl.html`,
        output: {
            path: dir,
            filename: 'bundle.js',
        },
        resolveLoader: {
            modules: ["node_modules", path.resolve(Const.BUILD_PATH, `patch`)]
        },
        mode: "development",
        module: {
            rules: [{
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            attrs: ["img:src", "link:href"],
                            interpolate: "require",
                        }

                    },
                    {
                        loader: "common-tpl-loader",
                        options: {
                            tpls: [
                                path.resolve(dir, `../resources/common/tpl.html`)
                            ]
                        }
                    },
                ]
            }]
        }
    });

    compiler.outputFileSystem = new memoryfs();

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err || stats.hasErrors()) reject(err);
            resolve(stats);
        });

    });

};

it(`test commonTplLoader`, async () => {
    // return wbCompiler().then((stats) => {
    //     const output = stats.toJson().modules[0].source;
    //     expect(output).toBe("module.exports = \"athis\\nb\\n\";");
    //
    // }, (err)=>{
    //     console.log(err);
    // } );
    const stats = await wbCompiler();
    const output = stats.toJson().modules[0].source;
    expect(output).toBe("module.exports = \"athis\\nb\\n\";");

});
