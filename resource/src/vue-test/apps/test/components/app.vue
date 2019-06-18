<template>
    <div>
        this is app {{good}}
        <props :key2="obj.key2" :key3="obj.key3" :key4="'abc'" v-on:childClick="click"></props>
        <component :is="cName"></component>
        <test-slot>
            <div slot="name">
                具名插槽
            </div>
            <div>
                this is slot content
            </div>
        </test-slot>

    </div>
</template>
<script>
    import Vue from "vue";
    import Props from "./props.vue";
    import Is from "./is.vue";
    import TestSlot from "./slot.vue";
    export default {
        provide: {
            provide1: 111,
            provide2: 222,
            provide3: 333
        },
        name: "app",
        components: {
            Props,
            Is,
            TestSlot
        },
        mounted(){
            console.log(this.$options);
            console.log(this.good);
            setTimeout(()=> {
                this.good = "ddd";

            }, 2000)
        },
        methods: {
            click(){
                console.log("this.is click");

            }

        },
        data(){
            return {
                cName: "Is",
                obj: {
                    key2: "val2",
                    key3: "val3"

                },
                good: "very good"
            }
        },
    };
</script>
