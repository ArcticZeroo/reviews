import Router from '@koa/router';
import { IBaseRouterLike, stackRouters } from '../../util/webserver.js';
import { createLocationRouter } from './location/router.js';
import { createReviewsRouter } from './reviews/router.js';

export const createApiRouter = (baseRouter: IBaseRouterLike) => {
    const apiRouter = new Router({ prefix: '/api' });

    createReviewsRouter(apiRouter);
    createLocationRouter(apiRouter);

    stackRouters(baseRouter, apiRouter);
};