import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
Vue.use(Vuex);
export const FILTER_TYPES = {
    ALL: "all",
    COMPLETED: "completed",
    TODO: "todo"
};
export const EVENT_TYPES = {
    ADD: "add",
    UPDATE: "update",
    FILTER: "filter"
};
let id:number = 0;
const store = new Vuex.Store({
    state: {
        todoList: [],
        filter: FILTER_TYPES.ALL
    },
    getters,
    actions: {
        [EVENT_TYPES.UPDATE]({commit}, id){
            commit(EVENT_TYPES.UPDATE, id);
        },
        [EVENT_TYPES.ADD]({commit}, text){
            commit(EVENT_TYPES.ADD, text);
        },
        [EVENT_TYPES.FILTER]({commit}, filter){
            commit(EVENT_TYPES.FILTER, filter);
        }

    },
    mutations: {
        [EVENT_TYPES.ADD](state:any, text:string){
            state.todoList.push({
                id: id++,
                text,
                completed: false
            });
        },
        [EVENT_TYPES.UPDATE](state:any, id:number){
            let res = state.todoList.filter(val => val.id == id);
            if (res.length) {
                res[0].completed = !res[0].completed;
            }
        },
        [EVENT_TYPES.FILTER](state, filter){
            state.filter = filter;
        }
    }
});
export default store;
