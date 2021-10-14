import Router from '@koa/router';
import { stackRouters } from '../../../util/webserver.js';
import { createLocationSearchRouter } from './search.js';

export const createLocationRouter = (baseRouter: Router) => {
    const locationRouter = new Router({ prefix: '/location' });

    createLocationSearchRouter(locationRouter);

    stackRouters(baseRouter, locationRouter);
};