<template>
        <li @click="handle" :style="style">
            {{text}}
        </li>
</template>
<script>
    import {EVENT_TYPES} from "../store/index";
    export default {
        data() {
            return {
                isCompleted: this.completed,
            }
        },
        computed: {
            style(){
                return `textDecoration: ${this.isCompleted ? 'line-through' : 'none'}`
            }

        },
        props: ["id", "text", "completed"],
        methods:{
            handle(){
                this.isCompleted = !this.isCompleted;
                this.$store.dispatch(EVENT_TYPES.UPDATE, this.id);
            },
        }

    }

</script>
