import * as React from "react"
import { connect } from 'react-redux'
import { toggleTodo } from '../actions/index'
import {TodoItem} from "../reducers/todos";
import TodoList from '../components/TodoList'

const getVisibleTodos = (todos:TodoItem[], filter:string) => {
    switch (filter) {
        case 'SHOW_COMPLETED':
            return todos.filter((t:TodoItem) => t.completed)
        case 'SHOW_ACTIVE':
            return todos.filter((t:TodoItem) => !t.completed)
        case 'SHOW_ALL':
        default:
            return todos
    }
}

const mapStateToProps = (state:any) => ({
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
})

const mapDispatchToProps = (dispatch:any) => ({
    toggleTodo: (id:number) => dispatch(toggleTodo(id))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TodoList)
