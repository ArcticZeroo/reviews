import Router from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import { AzureTextAnalyzer } from '../../../api/text/azure/azure-text-analyzer.js';
import { stackRouters } from '../../../util/webserver.js';

const endWordRegex = /[\s\W]/;

export const createAnalysisRouter = (baseRouter: Router) => {
    const textAnalyzer = new AzureTextAnalyzer();

    const analysisRouter = new Router();

    baseRouter.post('/analyze', async (context) => {
        if (typeof context.request.body !== 'string') {
            context.response.body = 'Body is not in the correct format -- text expected.';
            context.response.status = StatusCodes.BAD_REQUEST;
            return;
        }

        const normalizedText = context.request.body.trim().toLowerCase();

        if (normalizedText.length === 0 || normalizedText.search(endWordRegex) === -1) {
            context.response.body = 'Text is empty or only contains one word, so no meaningful analysis can be performed.';
            context.response.status = StatusCodes.BAD_REQUEST;
            return;
        }

        context.response.body = await textAnalyzer.analyze(context.request.body);
    });

    stackRouters(baseRouter, analysisRouter);
};