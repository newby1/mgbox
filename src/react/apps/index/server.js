
var React = require('react'),
    ReactDOMServer = require('react-dom/server');




const Index = () => {
    return <a>Hello React!</a>;
};

const html = ReactDOMServer.renderToString(<Index />, document.getElementById("app"));
