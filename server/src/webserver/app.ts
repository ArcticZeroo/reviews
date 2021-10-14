import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';

export const app = new Koa();

app.use(helmet());
app.use(bodyParser({
    enableTypes: ['json', 'form', 'text']
}));

app.use(async (context, next) => {
    console.log(context.request.path);
    await next();
});
