<template>
    <div>

    filter:
    <ul>
        <filter-item filter="all"></filter-item>
        <filter-item filter="todo"></filter-item>
        <filter-item filter="completed"></filter-item>
    </ul>
    </div>
</template>
<script>

    import FilterItem from "./filter-item.vue";
    export default {
        components: {FilterItem}
    }

</script>
