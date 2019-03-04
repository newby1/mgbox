<template>
    <div>
        <input v-model="text" type="text">
        <button @click="add">添加</button>
    </div>
</template>
<script>
    import {EVENT_TYPES} from "../store/index";
    import {mapState} from "vuex";
    export default {
        data() {
            return {
                text: ""
            }
        },
        methods: {
            add(){
                this.$store.dispatch(EVENT_TYPES.ADD, this.text);
                this.text = "";

            }

        }

    }
</script>
