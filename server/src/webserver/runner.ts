import { stackRouters } from '../util/webserver.js';
import { app } from './app.js';
import Router from '@koa/router';
import * as webserverConfig from '../config/webserver.js';
import { createApiRouter } from '../routes/api/router.js';

const rootRouter = new Router();

createApiRouter(rootRouter);

stackRouters(app, rootRouter);

export const startWebserver = async () => {
    await app.listen({ port: webserverConfig.port });
};