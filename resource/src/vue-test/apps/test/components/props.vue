<template>
    <div>
        {{$attrs}}
        <div>
            key: {{key2}}
        </div>
        <div>
            obj.key: {{obj.key2}}
        </div>
        <div>
            data: {{data1}}
            <div @click="click()">点击</div>
        </div>
        <div>
            computed: data1 {{newData1}}
            <p>
                computed: data2 {{newData2}}

            </p>
        </div>
        <div>
            computed: data2 : {{newData2}}
        </div>
        <div>
            <input v-model="good" type="text" name="" id="">
        </div>
        <child v-bind="$attrs" v-on="$listeners"></child>
        <div>
            provide: {{provide1}}
        </div>

    </div>
</template>
<script>
    let a = 2;
    import Child from "./child.vue";
    export default {
        inject: ["provide1"],
        components: {
            Child,
        },

        name: "props",
        model: {
            prop: "value",
            event: "change"
        },
        mounted(){
            console.log(this.$attrs, "===");
            console.log(this.$el);

        },
        inheritAttrs: false,
        data(){
            return {
                data1: 2,
                good: 333
            }

        },
        methods: {
            click(){
                this.data1 = ++this.data1;
                console.log(this.good);
                this.$emit("childClick");
            }

        },
        computed: {
            newData1(){
                return this.data1 + 1;
            },
            newData2(){
                //console.log(this.data1);
                return a + Math.random();
            }
        },
        props: {
            key3: String,
            key2: {
                type: String,
                require: true
            },
            obj: {
                type: Object,
                default(){
                    return {
                        key2: "val"
                    }
                }
            }

        }

    }

</script>
