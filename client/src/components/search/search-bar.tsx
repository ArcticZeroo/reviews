import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { IPointOfInterest } from '../../models/location';
import { useDebounceAfterDelay } from '../../hooks/debounce';
import Duration from '@arcticzeroo/duration';
import { useLatestPromiseState } from '../../hooks/promise';
import { LocationStorage } from '../../api/storage/idb/location';
import { LocationSearchClient } from '../../api/location/client';
import { useWatchedLocation } from '../../hooks/location';
import { EnhancedLocationSuggestion } from './enhanced-location-suggestion';

const SearchBarParent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const SearchBarInput = styled.input`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  margin-bottom: 1rem;
`;

const SuggestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const locationStorageClient = new LocationStorage();
const locationSearchClient = new LocationSearchClient();

const useLocationCacheEffect = (suggestions: Array<IPointOfInterest> | undefined) => {
    useEffect(() => {
        if (!suggestions?.length) {
            return;
        }

        locationStorageClient.store(suggestions)
            .catch(err => console.error('Unable to cache locations in background:', err));
    }, [suggestions]);
};

interface ISearchBarProps {
    immediateQuery: string;
    selectedEnhancedLocation?: IPointOfInterest;

    onImmediateQueryChanged(newQuery: string): void;

    onEnhancedLocationSelected(locationData: IPointOfInterest): void;
}

export const SearchBar: React.FC<ISearchBarProps> = ({
                                                         immediateQuery,
                                                         selectedEnhancedLocation,
                                                         onImmediateQueryChanged,
                                                         onEnhancedLocationSelected
                                                     }) => {
    const [debouncedQuery, setDebouncedQuery] = useDebounceAfterDelay<string>(
        new Duration({ milliseconds: 300 })
    );

    const userLocation = useWatchedLocation();

    const _retrieveSuggestions = useCallback(async (): Promise<IPointOfInterest[]> => {
        if (!debouncedQuery) {
            return [];
        }

        return locationSearchClient.retrieveSuggestions({
            query: debouncedQuery,
            biasLocation: userLocation
        });
    }, [userLocation, debouncedQuery]);

    // TODO: fix case where changing query after selecting an enhanced location leads to flashing. we need to invalidate suggestions when we change query after selecting, but that would require another state
    const [suggestions, suggestionError, doLatestSuggestions] = useLatestPromiseState<IPointOfInterest[]>(_retrieveSuggestions);

    const onValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onImmediateQueryChanged(newValue);
        setDebouncedQuery(newValue);
    };

    useEffect(() => {
        doLatestSuggestions();
    }, [doLatestSuggestions, debouncedQuery]);

    useLocationCacheEffect(suggestions);

    return (
        <SearchBarParent>
            <SearchBarInput value={immediateQuery} onChange={onValueChanged} placeholder="Enter the name of where you visited"/>
            {
                (!selectedEnhancedLocation && suggestions) && (
                    <SuggestionsContainer>
                        {suggestions.map(suggestion => (
                            <EnhancedLocationSuggestion key={suggestion.id}
                                                        onClick={() => onEnhancedLocationSelected(suggestion)}
                                                        suggestion={suggestion}
                                                        userLocation={userLocation}/>
                        ))}
                    </SuggestionsContainer>
                )
            }
            {
                suggestionError && (
                    'An error occurred while getting suggestions.'
                )
            }
        </SearchBarParent>
    );
};