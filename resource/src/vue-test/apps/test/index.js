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

new Vue({
    name: "entry",
    el: "#app",
    render: h => h(App)
});
