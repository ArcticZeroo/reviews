import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { IPointOfInterest } from '../../models/location';
import { useDebounceAfterDelay } from '../../hooks/debounce';
import Duration from '@arcticzeroo/duration';
import { useLatestPromiseState, usePromiseState } from '../../hooks/promise';
import { delay } from '../../util/timer';
import { LocationStorage } from '../../api/storage/idb/location';
import { LocationSearchClient } from '../../api/location/client';
import { useWatchedLocation } from '../../hooks/location';

const SearchBarParent = styled.div`
  position: relative;
  display: flex;
`;

const SearchBarInput = styled.input`
`;

const SuggestionsContainer = styled.div`
  position: absolute;
  z-index: 5;
  top: 100%;
  display: flex;
  flex-direction: column;
`;

const SuggestionItem = styled.button`
  background: #EEE;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: none;
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

export const SearchBar: React.FC = () => {
    const [immediateQuery, setImmediateQuery] = useState('');

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

    const [suggestions, suggestionError, doLatestSuggestions] = useLatestPromiseState<IPointOfInterest[]>(_retrieveSuggestions);

    const onValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setImmediateQuery(newValue);
        setDebouncedQuery(newValue);
    };

    useEffect(() => {
        doLatestSuggestions();
    }, [doLatestSuggestions, debouncedQuery]);

    useLocationCacheEffect(suggestions);

    return (
        <SearchBarParent>
            <SearchBarInput value={immediateQuery} onChange={onValueChanged}/>
            {
                suggestions && (
                    <SuggestionsContainer>
                        {suggestions.map(suggestion => (
                            <SuggestionItem key={suggestion.name}>
                                {suggestion.name}
                            </SuggestionItem>
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