import Vue from "vue";


import App from "./components/app.vue";
Vue.config.devtools = true;
Vue.mixin({
    beforeCreate(){
        console.log(this.$options.name, "beforeCreate");
    },
    created(){
        console.log(this.$options.name,"Create");
    },
    beforeMount(){
        console.log(this.$options.name,"beforeMount");
    },
    mounted(){
        console.log(this.$options.name,"mounted");
    },
    beforeUpdate(){
        console.log(this.$options.name,"beforeUpdate");
    },
    updated(){
        console.log(this.$options.name,"updated");
    },
    beforeDestroy(){
        console.log(this.$options.name,"beforeDestroy");
    },
    destroyed() {
        console.log(this.$options.name,"destroyed");

    }

});

/*
Vue.extend 快速创建一个子类 组件构造器，需要new 服用组件
Vue.directive 创建指令
Vue.filter 创建filter
Vue.component 全局组件
Vue.use 使用插件
Vue.mixin // 全局混入
Vue.compile


数据
data : object | funciton ; {a: 1} => vm.a vm.$data.a
props : {
type: String, Number, Boolean, Array, Object, Date, Funciton, Symbol
default : any ,object return funciton
required : boolean
validator: function
}
propsData 用于测试
computed //如果没有依赖，数据是缓存的
watch
methods


dom
el string| element //new
template string 如果是选择器的话，获取其html
render （createElement => {}）

生命周期
beforecreate // initlifecycle initevents initrender  this 指向实例， 初始化非响应的变量
created //initinjections initstate  initprovide; data, computed, watch, methods 可以访问。 未挂载dom。
beforemount // 编译成render树
mounted // dom 生成
update
destroy
activated


initMixin  _init
stateMixin $set $delete $watch
eventsMixin $on $once $off $emit
lifecycleMixin _update  $forceupdate $destroy
renderMixin $nextTick _render

选项/资源
directives
filters
components

选项/组合
extend > extends > mixins > 子组件
parent vm.$parent vm.$children
mixins 接受数组
extends
provide/inject
*/


new Vue({
    name: "entry",
    el: "#app",
    render: h => h(App)
});
