import {
    ILocationSearchOptions,
    IPointOfInterest,
    normalizeCoordinates,
    serializeCoordinates
} from '../../models/location.js';

export class SuggestionMemoizer {
    private readonly _pointOfInterestCacheById = new Map<string, IPointOfInterest>();
    // serialized coordinates -> query -> list of ids
    private readonly _memoizedSuggestionsByCoordinateAndQuery = new Map<string, Map<string, string[]>>();

    public getMemoizedSuggestionIds(options: ILocationSearchOptions): IPointOfInterest[] | undefined {
        // Memoize all queries at 0,0 when bias location isn't provided
        const { query, biasLocation = { latitude: 0, longitude: 0 } } = options;
        const serializedBiasLocation = serializeCoordinates(normalizeCoordinates(biasLocation));
        console.log('serialized bias location:', serializedBiasLocation);

        const suggestionIds = this._memoizedSuggestionsByCoordinateAndQuery.get(serializedBiasLocation)?.get(query);

        // If suggestionIds is undefined, the result wasn't memoized, don't return an empty array
        if (!suggestionIds) {
            return undefined;
        }

        const suggestions: IPointOfInterest[] = [];

        if (suggestionIds) {
            for (const suggestionId of suggestionIds) {
                const cachedSuggestion = this._pointOfInterestCacheById.get(suggestionId);
                if (cachedSuggestion) {
                    suggestions.push(cachedSuggestion);
                }
            }
        }

        return suggestions;
    }

    public memoizeSuggestionIds(options: ILocationSearchOptions, suggestions: IPointOfInterest[]) {
        // Memoize all queries at 0,0 when bias location isn't provided
        const { query, biasLocation = { latitude: 0, longitude: 0 } } = options;
        const serializedBiasLocation = serializeCoordinates(normalizeCoordinates(biasLocation));

        const memoizedSuggestionsByQuery = this._memoizedSuggestionsByCoordinateAndQuery.get(serializedBiasLocation) ?? new Map<string, string[]>();
        const suggestionIds = suggestions.map(suggestion => suggestion.id);
        memoizedSuggestionsByQuery.set(query, suggestionIds);
        // In case the bias location wasn't already memoized, add a new sub-map
        this._memoizedSuggestionsByCoordinateAndQuery.set(serializedBiasLocation, memoizedSuggestionsByQuery);
        for (const suggestion of suggestions) {
            this._pointOfInterestCacheById.set(suggestion.id, suggestion);
        }
    }
}