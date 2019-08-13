import * as React from "react"

const Todo = ({ onClick, completed, text, key }:{ onClick:any, completed:boolean, text:string, key:string }) => (
    <li
        onClick={onClick}
        style={{
            textDecoration: completed ? 'line-through' : 'none'
        }}
    >
        {text}
    </li>
)


export default Todo
