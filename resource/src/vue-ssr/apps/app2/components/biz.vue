<template>
    <div>
        this is app components
    </div>
</template>
<script>
    import BizSvc from "../services/biz";
    export default {
        data: null,
        method: {
        },
        created: () => {
            /*
            BizSvc.getUserInfo().then(data => {
                console.log("api/id", data);
            })
            BizSvc.getHello().then(data => {
                console.log("/api/hello", data);
            })
            */
        }
    }
</script>
