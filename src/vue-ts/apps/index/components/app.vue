<template>
    <div>
        <add-todo></add-todo>
        <todo-list></todo-list>
        <filter-list></filter-list>
    </div>
</template>
<script>
    import Vue from "vue";
    import AddTodo from "./add-todo.vue";
    import TodoList from "./todo-list.vue";
    import FilterList from "./filter-list.vue";
    import {Component} from "vue-property-decorator";

    @Component({
        components : {
            AddTodo,
            TodoList,
            FilterList
        }

    })
    export default class App extends Vue {
    }

</script>
