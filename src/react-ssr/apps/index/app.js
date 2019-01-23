import React from "react";
import {hydrate} from "react-dom"

class App extends React.PureComponent{
    render() {
        return (
            <div>
                this is react app
            </div>
        )
    }
}

export default App; //hydrate(<div>this is react app</div>, document.getElementById("app"))
