const { createRenderer} = require('vue-server-renderer');
import { createApp } from './app'
const {app} = createApp();
//export default app;

export default function ({req, res, next, context} ) {
    createRenderer({
        template: context.template
    }).renderToString(app, (err, html) => {
        res.send(html);
    });


}
