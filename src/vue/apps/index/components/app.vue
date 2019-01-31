<template>
    <div>
        <add-todo></add-todo>
        <todo-list></todo-list>
        <filter-list></filter-list>
    </div>
</template>
<script>
    import AddTodo from "./add-todo.vue";
    import TodoList from "./todo-list.vue";
    import FilterList from "./filter-list.vue";
    export default {
        components:{
            AddTodo,
            TodoList,
            FilterList
        }
    }

</script>
