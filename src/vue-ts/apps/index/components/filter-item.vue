<template>
    <li  @click="update" :style="style" style="float: left; margin-left: 20px;">
        {{filter}}
    </li>
</template>
<script>
    import {EVENT_TYPES} from "../store";
    import {mapState} from "vuex";

    export default {
        computed: {
            ...mapState({
                style(state){
                    return state.filter === this.filter ? "color: red" : "";
                }
            })
        },
        props: ["filter"],
        methods: {
            update(){
                this.$store.dispatch(EVENT_TYPES.FILTER, this.filter);
            }
        }

    }
</script>
