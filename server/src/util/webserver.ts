import Router from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import { Context } from 'koa';

export interface IBaseRouterLike {
    use(...middleware: Router.Middleware[]): void;
}

export interface INestedRouterLike {
    routes(): Router.Middleware;

    allowedMethods(): Router.Middleware;
}

export const stackRouters = (baseRouter: IBaseRouterLike, router: INestedRouterLike) => {
    baseRouter.use(router.routes());
    baseRouter.use(router.allowedMethods());
};