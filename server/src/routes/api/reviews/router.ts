import Router from '@koa/router';
import { stackRouters } from '../../../util/webserver.js';
import { createAnalysisRouter } from './analysis.js';

export const createReviewsRouter = (baseRouter: Router) => {
    const reviewsRouter = new Router({ prefix: '/reviews' });

    createAnalysisRouter(reviewsRouter);

    stackRouters(baseRouter, reviewsRouter);
};