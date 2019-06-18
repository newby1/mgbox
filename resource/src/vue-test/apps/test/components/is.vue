<template>
    <div>
        <p>
            this is a "is component"
        </p>
        <p>
            {{provide1}}
        </p>

    </div>

</template>
<script>
    export default {
        name: "isComponent",
        inject: ["provide1"],
        data(){
            return {};
        },
        methods: {

        }
    }
</script>
