import * as React from "react"
import Todo from './Todo'
import {TodoItem} from "../reducers/todos";

const TodoList = ({ todos, toggleTodo }:{ todos:any, toggleTodo:any }) => (
    <ul>
        {todos.map((todo:TodoItem) => (
            <Todo key={`p${todo.id}`} {...todo} onClick={() => toggleTodo(todo.id)} />
        ))}
    </ul>
)


export default TodoList
