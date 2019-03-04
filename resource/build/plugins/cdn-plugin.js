function CdnPlugin(options){
  this.options = options;
}


CdnPlugin.prototype.apply = function (compiler) {
  let exts = this.options.exts;
  let urlCallback = this.options.handleUrlCallback;

  let onCompilation = function (compilation) {
    function onAfterHtmlProcessing(htmlPluginData, callback){
      let str = htmlPluginData.html;
      let reg = new RegExp('((?:href|src)=(?:"|\'))([^"\']*?\.(' + exts.join("|")+ '))', "g");
      htmlPluginData.html = str.replace(reg, function ($0, $1, $2, $3) {
        if (!$0){
          return "";
        }
        let res = typeof urlCallback === "function" ?  urlCallback($2) : $0;
        return $1 + res;
      });

      if (callback){
        callback(null, htmlPluginData);
      }else{
        return Promise.resolve(htmlPluginData);
      }

    }
    // Webpack 4+
    if (compilation.hooks) {
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync("cdnPlugin", onAfterHtmlProcessing);
    } else {
      // Webpack 3
      compilation.plugins('html-webpack-plugin-after-html-processing', onAfterHtmlProcessing);
    }

  };

  // Webpack 4+
  if (compiler.hooks) {
    compiler.hooks.compilation.tap('cdnPlugin', onCompilation);
  } else {
    // Webpack 3
    compiler.plugins('compilation', onCompilation);
  }

};

module.exports = CdnPlugin;




