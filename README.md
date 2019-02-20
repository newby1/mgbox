# mgbox
## 背景
现在前端框架很多，一个前端工程师可能要关注很多框架，在团队的项目使用中，很容易就会出现多套框架。给维护和团队学习成本提升很多。基于现在大部分框架都都可以依赖webpack做打包方案，此框架以webpack做依托，通过配置形成多框架、多场景的支持。本框架的目的不是场景可扩展的，相反更多的是场景收敛，也就是说，默认的提供了一套完整的解决方案。提供以下能力：
+ 框架支持（vue/react/jquery）  
+ ssr支持（vue/react）*  
+ typescript支持（vue/react/jquery）
+ 模板引擎支持（ejs/pug/handerbars）
+ 多种编译模式（本地/hybird/server）
+ mock数据（本地/server/模板数据）
+ 多css预处理器（less/sass/stylus）
+ eslint
+ dllplugin/happypack/liveReload
+ cdn(需额外发布支持)*
> ssr仅支持到本地开发，没有提供完整的server方案。  
cdn路径在本地编译完成，相关静态资源依赖后续发布
## 快速上手
安装使用 
```
npm i -g mgbox
mkdir xxx
cd xxx
mgbox add
```
## 其他说明
1. 工程目录文件结构约定 
```
+build   //编译  
+configs 
    +.configs //.babelrc .eslintrc postcss ts 等loader相关配置
    +items //项目编译中的配置项，可以扩展功能
      item.js 
    project.config.json  //项目生成时的配置
+mocks  
  index.js //业务mocks数据入口
  local.js //业务mocks数据，建议不如git库
  tpldata.js //模板引擎mock数据
+src  
  +item //项目名称
    +apps
      +app
        +components
        +services
        index.html //入口文件。必须。可以做模板
        index.js //入口js。后缀为js|ts|tsx|jsx
        index.less //入口css。后缀为less|scss|styl
    +static
      +images
      +fonts
      ...
```   

