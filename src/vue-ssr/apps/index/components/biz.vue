<template>
    <div>
        this is app compenents
    </div>
</template>
<script>
    import BizSvc from "../services/biz";
    export default {
        name: "Biz",
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
