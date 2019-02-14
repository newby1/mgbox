const React = require('react');
const  {renderToString} = require('react-dom/server');
const App = require('./app');
const el = React.createElement(App.default, {stories:[]});

let app = renderToString(el);
export default function ({res, context}):void {
    res.send(context.template.replace("<!--react-ssr-outlet-->", app));
};
