import React, { useState } from 'react';
import { SearchBar } from '../../search/search-bar';
import { IPointOfInterest, LocationNameOrId } from '../../../models/location';
import { VisitReview } from './visit-review';
import { VisitSentimentList } from './visit-sentiment-list';
import { ISentimentEntityWithId, ITextAnalysisResult } from '../../../models/analysis';
import { spaceBottomOfChildren } from '../../../constants/css';
import * as random from '../../../util/random';
import styled from 'styled-components';
import { LoadingOverlay } from '../../overlay/loading/loading-overlay';
import { SentimentAnalysisClient } from '../../../api/analysis/client';
import { positiveScore, sentimentToScore } from '../../../util/sentiment';
import { PrimaryButton } from '../../styled/button';
import { VisitStorage } from '../../../api/storage/idb/visit';
import { ISerializedVisit } from '../../../models/visit';
import { useHistory } from 'react-router-dom';

const VisitReviewContainer = styled.div`
  position: relative;
`;

const VisitLogContainer = styled.div`
  position: relative;
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
const visitStorageClient = new VisitStorage();

export const VisitLog: React.FC = () => {
    const history = useHistory();
    const [locationQuery, setLocationQuery] = useState('');
    const [enhancedLocation, setEnhancedLocation] = useState<IPointOfInterest | undefined>();
    const [reviewText, setReviewText] = useState<string>('');
    const [sentimentEntities, setSentimentEntities] = useState<Array<ISentimentEntityWithId>>(() => [getDefaultSentimentEntity()]);
    const [isGeneratingSentiment, setIsGeneratingSentiment] = useState(false);
    const [sentimentGenerationError, setSentimentGenerationError] = useState<any>();
    const [isSavingVisit, setSavingVisit] = useState(false);

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

    const onSaveClicked = () => {
        setSavingVisit(true);

        const serializedLocation: LocationNameOrId = enhancedLocation ? {
            type: 'id',
            data: enhancedLocation.id
        } : {
            type: 'name',
            data: locationQuery
        };

        visitStorageClient.store({
            location: serializedLocation,
            visitedAt: new Date(),
            review: reviewText,
            sentiment: {
                overallSentiment: {
                    positive: 1.0,
                    negative: 0
                },
                sentimentEntities
            }
        })
            .finally(() => setSavingVisit(false))
            .then(() => {
                history.push('/');
            })
            .catch(console.error);
    };

    return (
        <VisitLogContainer>
            {
                isSavingVisit && (
                    <LoadingOverlay/>
                )
            }
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
            <PrimaryButton onClick={onSaveClicked} disabled={!locationQuery || sentimentEntities.length === 0}>
                Save Visit
            </PrimaryButton>
        </VisitLogContainer>
    );
};