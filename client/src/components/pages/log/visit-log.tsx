import React, { useState } from 'react';
import { SearchBar } from '../../search/search-bar';
import { IPointOfInterest } from '../../../models/location';
import { VisitReview } from './visit-review';
import { VisitSentimentList } from './visit-sentiment-list';
import { ISentimentEntity, ISentimentEntityWithId } from '../../../models/analysis';
import { spaceBottomOfChildren } from '../../../constants/css';
import * as random from '../../../util/random';
import styled from 'styled-components';

const VisitLogContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${spaceBottomOfChildren};
`;

const getDefaultSentimentEntity = () => ({
    id: random.id(),
    name: '',
    comments: [],
    sentiment: {
        positive: 1.0,
        neutral: 0,
        negative: 0
    }
});

export const VisitLog: React.FC = () => {
    const [locationQuery, setLocationQuery] = useState('');
    const [enhancedLocation, setEnhancedLocation] = useState<IPointOfInterest | undefined>();
    const [reviewText, setReviewText] = useState<string>('');
    const [sentimentEntities, setSentimentEntities] = useState<Array<ISentimentEntityWithId>>(() => [getDefaultSentimentEntity()]);

    const onLocationQueryChanged = (newQuery: string) => {
        setLocationQuery(newQuery);
        // If we previously had selected an enhanced location,
        // clear it since the user has indicated they want to change their query
        setEnhancedLocation(undefined);
    };

    const onEnhancedLocationSelected = (location: IPointOfInterest) => {
        setLocationQuery(location.name);
        setEnhancedLocation(location);
    };

    const onSentimentEntityChanged = (i: number, newEntity: ISentimentEntityWithId) => {
        setSentimentEntities([
            ...sentimentEntities.slice(0, i),
            newEntity,
            ...sentimentEntities.slice(i + 1)
        ]);
    };

    const onSentimentEntityAdded = () => {
        setSentimentEntities([
            ...sentimentEntities,
            getDefaultSentimentEntity()
        ]);
    };

    const onSentimentEntityRemoved = (i: number) => {
        setSentimentEntities([
            ...sentimentEntities.slice(0, i),
            ...sentimentEntities.slice(i + 1)
        ]);
    };

    return (
        <VisitLogContainer>
            <SearchBar immediateQuery={locationQuery}
                       selectedEnhancedLocation={enhancedLocation}
                       onImmediateQueryChanged={onLocationQueryChanged}
                       onEnhancedLocationSelected={onEnhancedLocationSelected}/>
            <VisitReview reviewText={reviewText} onReviewTextChanged={setReviewText}/>
            <VisitSentimentList sentimentEntities={sentimentEntities}
                                onSentimentEntityChanged={onSentimentEntityChanged}
                                onSentimentEntityAdded={onSentimentEntityAdded}
                                onSentimentEntityRemoved={onSentimentEntityRemoved}/>
        </VisitLogContainer>
    );
};