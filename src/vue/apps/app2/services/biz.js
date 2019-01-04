import  Api  from "./api.js";

const api = new Api("");

export default {
    getUserInfo: () => {
        return api.get("/api/id");
    },
    getHello: () => {
        return api.get("/api/hello");
    },
    getJobs: () => {
        return api.get("/jobs/companyAjax.json", {
            city: "北京",
            needAddtionalResult: false
        })
    }

}