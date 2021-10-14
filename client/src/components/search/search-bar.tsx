import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { IPointOfInterest } from '../../models/location';
import { useDebounceAfterDelay } from '../../hooks/debounce';
import Duration from '@arcticzeroo/duration';
import { useLatestPromiseState, usePromiseState } from '../../hooks/promise';
import { delay } from '../../util/timer';

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

export const SearchBar: React.FC = () => {
    const [immediateQuery, setImmediateQuery] = useState('');

    const [debouncedQuery, setDebouncedQuery] = useDebounceAfterDelay(
        new Duration({ milliseconds: 300 })
    );

    const _retrieveSuggestions = useCallback(async (): Promise<IPointOfInterest[]> => {
        if (!debouncedQuery) {
            return [];
        }

        const results: IPointOfInterest[] = [];
        const resultCount = Math.random() * 10 + 1;

        for (let i = 0; i < resultCount; i++) {
            results.push({
                name: `Result ${i}`,
                address: 'a',
                location: {
                    latitude: 0,
                    longitude: 0
                }
            });
        }

        return results;
    }, [debouncedQuery]);

    const [suggestions, suggestionError, doLatestSuggestions] = useLatestPromiseState<IPointOfInterest[]>(_retrieveSuggestions);

    const onValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setImmediateQuery(newValue);
        setDebouncedQuery(newValue);
    };

    useEffect(() => {
        doLatestSuggestions();
    }, [doLatestSuggestions, debouncedQuery]);

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