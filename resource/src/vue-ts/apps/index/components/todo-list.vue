<template>
    <div>
        list:
        <ul style="background:#ccc;">
            <todo  v-for=" todo in todoList" :key="todo.id" v-bind="todo" > </todo>

        </ul>
    </div>
</template>
<script>
    import Todo from "./todo.vue";
    import {FILTER_TYPES} from "../store/index";
    import {mapState, mapGetters} from "vuex";

    export default {
        components: {
            Todo
        },
        computed: {
            ...mapGetters(["todoList"])
        }
    }


</script>
