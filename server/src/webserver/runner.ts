import { dirname, resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';
import { Environment } from '../api/env.js';
import { stackRouters } from '../util/webserver.js';
import { app } from './app.js';
import Router from '@koa/router';
import * as webserverConfig from '../config/webserver.js';
import { createApiRouter } from '../routes/api/router.js';
import koaStatic from 'koa-static';

const rootRouter = new Router();

createApiRouter(rootRouter);

stackRouters(app, rootRouter);

if (!Environment.isDev) {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    app.use(koaStatic(resolvePath(__dirname, '../../../client/build')));
} else {
    console.debug('App is running in development mode');
}

export const startWebserver = async () => {
    await app.listen({ port: webserverConfig.port });
};