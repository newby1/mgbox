<template>
    <div style="background: #eee;" @click="ok"> this child  {{key2 }} {{key3}}</div>
</template>
<script>
    export default {
        name: "child",
        props: ["key2", "key3"],
        methods: {
            ok(){
                this.$emit("childClick");

            }
        }

    }
</script>
