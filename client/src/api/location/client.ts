import { ILocationSearchOptions, IPointOfInterest, serializeCoordinates } from '../../models/location';
import { url as urlConfig } from '../../config/web';
import { isDuckTypeArray } from '@arcticzeroo/typeguard';
import { LocationStorage } from '../storage/idb/location';

const suggestionLimit = 5;

export class LocationSearchClient {
    // serialized coordinates -> query -> list of ids
    private readonly _memoizedSuggestionsByCoordinateAndQuery = new Map<string, Map<string, string[]>>();
    private readonly _locationStorageClient = new LocationStorage();

    private _getMemoizedSuggestionIds(options: ILocationSearchOptions): string[] | undefined {
        // Memoize all queries at 0,0 when bias location isn't provided
        const { query, biasLocation = { latitude: 0, longitude: 0 } } = options;
        const serializedBiasLocation = serializeCoordinates(biasLocation);
        return this._memoizedSuggestionsByCoordinateAndQuery.get(serializedBiasLocation)?.get(query);
    }

    private _memoizeSuggestionIds(options: ILocationSearchOptions, suggestions: IPointOfInterest[]) {
        // Memoize all queries at 0,0 when bias location isn't provided
        const { query, biasLocation = { latitude: 0, longitude: 0 } } = options;
        const serializedBiasLocation = serializeCoordinates(biasLocation);

        const memoizedSuggestionsByQuery = this._memoizedSuggestionsByCoordinateAndQuery.get(serializedBiasLocation) ?? new Map<string, string[]>();
        const suggestionIds = suggestions.map(suggestion => suggestion.id);
        memoizedSuggestionsByQuery.set(query, suggestionIds);
        // In case the bias location wasn't already memoized, add a new sub-map
        this._memoizedSuggestionsByCoordinateAndQuery.set(serializedBiasLocation, memoizedSuggestionsByQuery);
    }

    public async retrieveSuggestions(options: ILocationSearchOptions): Promise<IPointOfInterest[]> {
        const query = options.query
            .toLocaleLowerCase()
            .replaceAll(/[^\w ]/g, '')
            .replaceAll(/\s+/g, ' ')
            .trim();

        if (!query) {
            return [];
        }

        const memoizedSuggestionIds = this._getMemoizedSuggestionIds(options);
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

        const response = await fetch(urlConfig.locationSuggestions);

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

        this._memoizeSuggestionIds(options, suggestions);

        return suggestions;
    }
}