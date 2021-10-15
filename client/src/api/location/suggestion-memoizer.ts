import { ILocationSearchOptions, IPointOfInterest, serializeCoordinates } from '../../models/location.js';

export class SuggestionMemoizer {
    // serialized coordinates -> query -> list of ids
    private readonly _memoizedSuggestionsByCoordinateAndQuery = new Map<string, Map<string, string[]>>();

    public getMemoizedSuggestionIds(options: ILocationSearchOptions): string[] | undefined {
        // Memoize all queries at 0,0 when bias location isn't provided
        const { query, biasLocation = { latitude: 0, longitude: 0 } } = options;
        const serializedBiasLocation = serializeCoordinates(biasLocation);
        return this._memoizedSuggestionsByCoordinateAndQuery.get(serializedBiasLocation)?.get(query);
    }

    public memoizeSuggestionIds(options: ILocationSearchOptions, suggestions: IPointOfInterest[]) {
        // Memoize all queries at 0,0 when bias location isn't provided
        const { query, biasLocation = { latitude: 0, longitude: 0 } } = options;
        const serializedBiasLocation = serializeCoordinates(biasLocation);

        const memoizedSuggestionsByQuery = this._memoizedSuggestionsByCoordinateAndQuery.get(serializedBiasLocation) ?? new Map<string, string[]>();
        const suggestionIds = suggestions.map(suggestion => suggestion.id);
        memoizedSuggestionsByQuery.set(query, suggestionIds);
        // In case the bias location wasn't already memoized, add a new sub-map
        this._memoizedSuggestionsByCoordinateAndQuery.set(serializedBiasLocation, memoizedSuggestionsByQuery);
    }
}