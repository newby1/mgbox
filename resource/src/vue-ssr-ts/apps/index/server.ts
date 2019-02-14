const { createRenderer} = require('vue-server-renderer');
import { createApp } from './app'
const {app} = createApp();
//export default app;

export default function ({req, res, next, context} = {req:any, res: any, next:any, context:any}) {
    createRenderer({
        template: context.template
    }).renderToString(app, (err, html) => {
        res.send(html);
    });


}
