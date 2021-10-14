import Router from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import { AzureLocationProvider } from '../../../api/location/azure/azure-location-provider.js';
import { ILocationCoordinates } from '../../../models/location.js';
import { isNullOrWhitespace } from '../../../util/string.js';
import { validateRangeInclusive } from '../../../util/validate.js';

const client = new AzureLocationProvider();
const searchResultLimit = 10;

export const createLocationSearchRouter = (locationRouter: Router) => {
    locationRouter.get('/search', async (context) => {
        const searchQuery = context.query['query'];

        if (typeof searchQuery !== 'string' || isNullOrWhitespace(searchQuery)) {
            context.response.status = StatusCodes.BAD_REQUEST;
            context.response.body = 'Invalid search query.';
            return;
        }

        const requestedLimit = context.query['limit'];
        if (requestedLimit) {
            const requestedLimitValue = Number(requestedLimit);

            if (isNaN(requestedLimitValue)) {
                context.response.status = StatusCodes.BAD_REQUEST;
                context.response.body = 'Limit must be a number.';
                return;
            }

            try {
                validateRangeInclusive({ value: requestedLimitValue, min: 1, max: 10, name: 'limit' });
            } catch (e) {
                context.response.status = StatusCodes.BAD_REQUEST;
                context.response.body = (e instanceof Error) ? e.message : 'Invalid limit value.';
                return;
            }
        }

        let biasLocation: ILocationCoordinates | undefined = undefined;

        const latitude = context.query['lat'];
        const longitude = context.query['long'];

        if (typeof latitude === 'string' && typeof longitude === 'string') {
            biasLocation = {
                latitude:  Number(latitude),
                longitude: Number(longitude)
            };

            if (isNaN(biasLocation.latitude) || isNaN(biasLocation.longitude)) {
                context.response.status = StatusCodes.BAD_REQUEST;
                context.response.body = 'Invalid latitude or longitude.';
                return;
            }
        }

        context.response.body = await client.search({
            query: searchQuery,
            limit: searchResultLimit,
            biasLocation
        });
    });
};