<template>
    <div style="background: #ccc; margin: 5px;">
        this is slot component
        <slot></slot>
        <slot name="name"></slot>

    </div>
</template>
<script>
    export default {
        name: "slotComponent",
        data(){
            return {};
        },
        methods: {

        }
    }

</script>
