# mgbox  

## 背景
   现在前端框架很多，一个前端工程师可能要关注很多框架，在团队的项目使用中，很容易就会出现多套框架。给维护和团队学习成本提升很多。基于现在大部分框架都都可以依赖webpack做打包方案，此框架以webpack做依托，通过配置形成多框架、多场景的支持。本框架的目的不是场景可扩展的，相反更多的是场景收敛，也就是说，默认的提供了一套完整的解决方案。提供以下能力：
+ 多框架（vue/react/jquery）  
+ ssr（vue/react）*1 
+ typescript（vue/react/jquery）
+ 模板引擎（velocity/ejs/pug/handerbars）*2
+ 多种编译模式（本地/hybird/server）
+ 多项目同时编译
+ 项目配置隔离
+ devserver
+ 多app编译
+ mock数据（本地/server/模板数据）
+ 多css预处理器（less/sass/stylus）
+ eslint
+ 公共模板支持
+ es6+/dllplugin/happypack/liveReload
+ cdn(需额外发布支持)*3
> 1.ssr仅支持到本地开发，没有提供完整的server方案。  
2.本地开发模拟服务端渲染。  
3.cdn路径在本地编译完成，相关静态资源依赖后续发布。

## 快速上手
安装使用   
`建议使用最新版本node`
```
npm i -g mgbox
mkdir xxx
cd xxx
mgbox add
```
## 其他说明
### 工程目录文件结构约定 
```
+build   //核心编译目录。不建议变动，相关修改可以在configs进行  
+configs 
    +.configs //.babelrc .eslintrc postcss ts 等loader相关配置;多项目的配置是隔离的。
    +items //项目编译中的配置项，可以扩展功能
      item1.js 
      item2.js 
    project.config.json  //项目生成时的配置。不能变动，整个编译依赖此配置。
+mocks  
  +item1 
    mock.js //mock入口文件
    app1.js //业务数据
  ...
  +item1-tpl //模板mock数据。目录结构同item1
+src  
  +common//多item共用的组件服务
  +item2
  +item1 //项目名称
    +apps
      +app2
      +app1
        +components
        +services
        index.html //入口文件。必须。可以做模板
        index.js //入口js。后缀为js|ts|tsx|jsx
        index.less //入口css。后缀为less|scss|styl。也可以放到static/styles/app1/index.less。
        server.js //ssr入口js。后缀index.js。ssr项目需要
    +static
      +images
      +fonts
      +styles
        +index
          index.less 
    ...
```   
### 工程使用说明
```
mgbox run 
npm run dev
```
参数说明  
***

 缩写 | 补充 | 值 | 说明   
:---|:---|:----|:----
 -i | --item | [all(默认) : item : item1,item2] | 选择编译的项目 
 -e | --env | [local(默认) : server : client] | 编译环境 
 -m | --mode | [development(默认):production] | 编译模式 
-a | --apps | [all(默认) : app : app1,app2] | 编译app
-D | --devserver | false | 启用devserver
-M | --mock | false | 启用本地mock代理。依赖`-D`
-C | --cdn | false | 编译cdn 
-O | --open | false | 打开浏览器。依赖`-e local -D`
-L | --eslist | false | eslint检测。依赖`-m development`
-S | --ssr | false | 启用ssr 
 
***
使用示例  
```
mgbox run -i app -a app1,app2 -D -M -O
or
npm run dev -- -i app -a index -D -M 
```
### 项目更新
主要是更新构建目录 `build`
```
mgbox update
```
> build 目录内的代码不建议变动。一般配置可以在相关的 configs/items/xxx.js里面配置
### 其他
1. app访问地址为 http://localhost:xxxxx/app.html
2. 启用ssr时，访问地址为http://localhost:xxxxx/app
3. 公共模板支持
``` 
...
  +apps
    +commmons
      +tpls
        tpl2.html
        tpl.html 
    +app
      tpl.html //使用公共模板tpl.html
    +app2
      tpl2.html //使用公共模板tpl2.html
    +app3
      index.html //默认入口
```
commons/tpls/tpl.html
```
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <div id="app"></div>
    <!--common-tpl-outlet-->
    //模板替换标志
</body>
</html>
```
app2/tpl.html
```
<div> app2 </div>

```
最终输出
```
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <div id="app"></div>
    <div> app2 </div>
</body>
</html>

```

