import React, { useState } from 'react';
import { SearchBar } from '../../search/search-bar';
import { IPointOfInterest } from '../../../models/location';
import { VisitReview } from './visit-review';
import { VisitSentimentList } from './visit-sentiment-list';
import { ISentimentEntity, ISentimentEntityWithId, ITextAnalysisResult } from '../../../models/analysis';
import { spaceBottomOfChildren } from '../../../constants/css';
import * as random from '../../../util/random';
import styled from 'styled-components';
import { LoadingOverlay } from '../../overlay/loading/loading-overlay';
import { SentimentAnalysisClient } from '../../../api/analysis/client';
import { positiveScore, sentimentToScore } from '../../../util/sentiment';

const VisitReviewContainer = styled.div`
  position: relative;
`;

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

const sentimentAnalysisClient = new SentimentAnalysisClient();

export const VisitLog: React.FC = () => {
    const [locationQuery, setLocationQuery] = useState('');
    const [enhancedLocation, setEnhancedLocation] = useState<IPointOfInterest | undefined>();
    const [reviewText, setReviewText] = useState<string>('');
    const [sentimentEntities, setSentimentEntities] = useState<Array<ISentimentEntityWithId>>(() => [getDefaultSentimentEntity()]);
    const [isGeneratingSentiment, setIsGeneratingSentiment] = useState(false);
    const [sentimentGenerationError, setSentimentGenerationError] = useState<any>();

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

    const onSentimentResult = (result: ITextAnalysisResult) => {
        // Remove "null" entries first since the generation should make things pretty, but don't overwrite existing ones
        const newSentimentEntities = sentimentEntities.filter(entity => entity.name
            || entity.comments.length
            || sentimentToScore(entity.sentiment) !== positiveScore);

        if (result.sentimentEntities) {
            for (const sentimentEntity of result.sentimentEntities) {
                newSentimentEntities.push({
                    ...sentimentEntity,
                    id: random.id()
                });
            }
        }

        setSentimentEntities(newSentimentEntities);
    };

    const onGenerateClicked = () => {
        setIsGeneratingSentiment(true);

        sentimentAnalysisClient.analyzeSentiment(reviewText)
            .finally(() => setIsGeneratingSentiment(false))
            .then(onSentimentResult)
            .catch(err => {
                setSentimentGenerationError(err);
                console.error('Could not generate sentiment:', err);
            });
    };

    return (
        <VisitLogContainer>
            <SearchBar immediateQuery={locationQuery}
                       selectedEnhancedLocation={enhancedLocation}
                       onImmediateQueryChanged={onLocationQueryChanged}
                       onEnhancedLocationSelected={onEnhancedLocationSelected}/>
            <VisitReviewContainer>
                {isGeneratingSentiment && <LoadingOverlay/>}
                <VisitReview reviewText={reviewText}
                             onReviewTextChanged={setReviewText}
                             onGenerateClicked={onGenerateClicked}/>
            </VisitReviewContainer>
            <VisitSentimentList sentimentEntities={sentimentEntities}
                                onSentimentEntityChanged={onSentimentEntityChanged}
                                onSentimentEntityAdded={onSentimentEntityAdded}
                                onSentimentEntityRemoved={onSentimentEntityRemoved}/>
        </VisitLogContainer>
    );
};