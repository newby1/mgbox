//// <reference path="../typings/store.d.ts">
import "./store.ts";
import  {GetterTree} from "vuex";
import {FILTER_TYPES} from "./index";

export const GETTERS =  {
    TODOLIST: "todoList"
};

const getters: GetterTree<any, any> = {
    [GETTERS.TODOLIST](state){
        let filter = state.filter;
        let res = state.todoList.filter((val:StoreInterface.Todo) => {
            if (filter == FILTER_TYPES.ALL){
                return true;
            }
            if (filter == FILTER_TYPES.COMPLETED){
                return val.completed == true;
            }
            if (filter == FILTER_TYPES.TODO){
                return val.completed == false;
            }
        });
        return res;
    }

}
export default getters;
