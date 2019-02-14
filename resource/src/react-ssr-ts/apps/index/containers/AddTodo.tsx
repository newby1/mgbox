import * as React from "react"
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { addTodo } from '../actions/index'

interface AddTodoProps {
    dispatch: Dispatch
}

const AddTodo = (props: AddTodoProps) => {
    let input:any

    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    if (!input.value.trim()) {
                        return
                    }
                    props.dispatch(addTodo(input.value))
                    input.value = ''
                }}
            >
                <input ref={node => (input = node)} />
                <button type="submit">Add Todo</button>
            </form>
        </div>
    )
}

export default connect()(AddTodo)
