
const React = require('react');
const  ReactDOMServer = require('react-dom/server');
import App from "./app";




const app = ReactDOMServer.renderToString(<App></App>);

export default function ({res, context}) {
    res.send(context.template.replace("<!--react-ssr-outlet-->", app));
};
