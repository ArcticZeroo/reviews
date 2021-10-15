import { ILocationSearchOptions, IPointOfInterest } from '../../models/location';
import { url as urlConfig } from '../../config/web';
import { isDuckTypeArray } from '@arcticzeroo/typeguard';
import { LocationStorage } from '../storage/idb/location';
import { SuggestionMemoizer } from './suggestion-memoizer';

const suggestionLimit = 5;

export class LocationSearchClient {
    private readonly _locationStorageClient = new LocationStorage();
    private readonly _memoizedSuggestions = new SuggestionMemoizer();

    public async retrieveSuggestions(options: ILocationSearchOptions): Promise<IPointOfInterest[]> {
        const query = options.query
            .toLocaleLowerCase()
            .replaceAll(/[^\w ]/g, '')
            .replaceAll(/\s+/g, ' ')
            .trim();

        if (!query) {
            return [];
        }

        const memoizedSuggestionIds = this._memoizedSuggestions.getMemoizedSuggestionIds(options);
        if (memoizedSuggestionIds) {
            const cachedResults = await this._locationStorageClient.retrieve(memoizedSuggestionIds);
            if (cachedResults.every(result => result != null)) {
                return cachedResults as IPointOfInterest[];
            }
        }

        const queryString = new URLSearchParams();
        queryString.set('query', query);
        queryString.set('limit', suggestionLimit.toString());

        if (options.biasLocation && options.biasLocation.latitude && options.biasLocation.longitude) {
            queryString.set('lat', options.biasLocation.latitude.toString());
            queryString.set('long', options.biasLocation.longitude.toString());
        }

        const response = await fetch(`${urlConfig.locationSuggestions}?${queryString.toString()}`);

        if (!response.ok) {
            throw new RangeError(`Response was not OK: ${response.status} / ${response.statusText}`);
        }

        const suggestions = await response.json();

        if (!isDuckTypeArray<IPointOfInterest>(suggestions, {
            id: 'string',
            name: 'string',
            address: 'string',
            location: 'object',
        })) {
            throw new RangeError(`Response was not in the expected format.`);
        }

        this._memoizedSuggestions.memoizeSuggestionIds(options, suggestions);

        return suggestions;
    }
}