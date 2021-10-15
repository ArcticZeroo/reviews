import React from 'react';
import { ILocationCoordinates, IPointOfInterest, isLocationValid } from '../../models/location';
import styled from 'styled-components';
import { calculateGpsDistanceKm, kmToMi, normalizeMiles } from '../../util/math';

const SuggestionItem = styled.button`
  background: #EEE;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: none;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.25s ease;
  
  &:hover {
    background: #DDD;
  }
`;

interface IEnhancedLocationSuggestionProps {
    userLocation?: ILocationCoordinates;
    suggestion: IPointOfInterest;
    onClick(): void;
}

export const EnhancedLocationSuggestion: React.FC<IEnhancedLocationSuggestionProps> = ({ suggestion, onClick, userLocation }) => {
    return (
        <SuggestionItem onClick={onClick}>
            <span>
                {suggestion.name}
            </span>
            <span>
                {suggestion.address}
            </span>
            <span>
                {isLocationValid(userLocation) && (
                    `${normalizeMiles(kmToMi(calculateGpsDistanceKm(userLocation, suggestion.location)))} mi away`
                )}
            </span>
        </SuggestionItem>
    );
};