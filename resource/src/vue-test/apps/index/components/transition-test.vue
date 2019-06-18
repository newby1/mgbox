<template>
    <div style="clear: both;">
        <button @click="show = !show">
            transition
        </button>
        <transition name="fade">
            <div v-if="show" class="t-c" > this is transition component</div>

        </transition>

    </div>

</template>
<style>
    .t-c{
        color: red;
    }
    /*.fade-enter-active, .fade-leave-active {*/
        /*transition: opacity .5s;*/
    /*}*/
    /*.fade-enter, .fade-leave-to !* .fade-leave-active below version 2.1.8 *! {*/
        /*opacity: 0;*/
    /*}*/
</style>
<script>
    export default {
        data(){
            return {
                show: false
            }

        }

    }
</script>
