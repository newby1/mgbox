const visibilityFilter = (state:string = 'SHOW_ALL', action:any) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter
        default:
            return state
    }
}

export default visibilityFilter
