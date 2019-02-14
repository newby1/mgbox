import * as React from "react"

const Link = ({ active, children, onClick }:{ active:any, children:any, onClick:any }) => (
    <button
        onClick={onClick}
        disabled={active}
        style={{
            marginLeft: '4px'
        }}
    >
        {children}
    </button>
)


export default Link
