import * as React from "react"

const Todo = ({ onClick, completed, text }:{ onClick:any, completed:boolean, text:string }) => (
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
