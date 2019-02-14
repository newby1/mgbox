import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers/index'
import App from './components/App'

const store = createStore(rootReducer);
const Index = () =>  (
    <Provider store={store}>
        <App />
    </Provider>
);

export default Index;

