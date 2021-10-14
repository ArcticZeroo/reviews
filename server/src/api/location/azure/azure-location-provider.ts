import { isDuckType, isDuckTypeArray } from '@arcticzeroo/typeguard';
import { URLSearchParams } from 'url';
import {
    ILocationCoordinates,
    ILocationProvider,
    ILocationSearchOptions,
    IPointOfInterest
} from '../../../models/location.js';
import fetch from 'node-fetch';
import { validateRangeInclusive } from '../../../util/validate.js';
import { Environment } from '../../env.js';

const resultType = {
    geography:       'Geography',
    pointOfInterest: 'POI'
} as const;

interface IAzureLocationCoordinates {
    lat: number,
    lon: number
}

const convertFromAzureCoordinates = (coordinates: IAzureLocationCoordinates): ILocationCoordinates => ({
    latitude: coordinates.lat,
    longitude: coordinates.lon
});

interface IAzureAddress {
    freeformAddress: string;
}

interface IFuzzySearchResult {
    type: typeof resultType[keyof typeof resultType];
    id: string;
    score: number;
    entityType: string;
    address: IAzureAddress;
    position: IAzureLocationCoordinates,
    viewport: {
        topLeftPoint: IAzureLocationCoordinates,
        btmRightPoint: IAzureLocationCoordinates
    }
}

interface IFuzzyPoiSearchResult extends IFuzzySearchResult {
    type: typeof resultType['pointOfInterest'];
    poi: {
        name: string;
        brands?: object[];
        categorySet?: object[];
        url?: string;
    };
    entryPoints: object[];
}

interface IFuzzySearchResponse {
    summary: object;
    results: IFuzzySearchResult[];
}

const azureFuzzySearchUrl = 'https://atlas.microsoft.com/search/fuzzy/json';

export class AzureLocationProvider implements ILocationProvider {
    private async _doFuzzySearchAsync(options: ILocationSearchOptions): Promise<IFuzzySearchResult[]> {
        const searchParams = new URLSearchParams({
            'api-version':      '1.0',
            'subscription-key': Environment.azureMapsKey,
            'query':            options.query
        });

        if (options.limit) {
            validateRangeInclusive({
                value: options.limit,
                min:   1,
                max:   100,
                name:  'limit'
            });

            searchParams.append('limit', options.limit.toString());
        }

        if (options.biasLocation) {
            searchParams.append('lat', options.biasLocation.latitude.toString());
            searchParams.append('lon', options.biasLocation.longitude.toString());
        }

        const fullUrl = `${azureFuzzySearchUrl}?${searchParams.toString()}`;

        if (Environment.isDev) {
            console.debug(`Sending a request to`, fullUrl);
        }

        const response = await fetch(fullUrl);

        if (!response.ok) {
            throw new Error(`Request was not OK: ${response.status} / ${response.statusText}`);
        }

        const json = await response.json();

        if (!isDuckType<IFuzzySearchResponse>(json, {
            summary: 'object',
            results: 'object'
        })) {
            throw new RangeError('Response was not in the expected format.');
        }

        return json.results;
    }

    async search(options: ILocationSearchOptions): Promise<IPointOfInterest[]> {
        const searchResults = await this._doFuzzySearchAsync(options);

        const poiSearchResults = searchResults.filter(result => result.type === resultType.pointOfInterest) as IFuzzyPoiSearchResult[];

        return poiSearchResults.map(result => ({
            id:       result.id,
            address:  result.address.freeformAddress,
            location: convertFromAzureCoordinates(result.position),
            name:     result.poi.name
        }));
    }
}