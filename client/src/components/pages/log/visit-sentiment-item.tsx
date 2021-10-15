import React from 'react';
import { ISentimentEntityWithId } from '../../../models/analysis';
import { DestructiveButton } from '../../styled/button';
import styled from 'styled-components';
import { spaceBottomOfChildren } from '../../../constants/css';
import { positiveScore, sentimentToScore } from '../../../util/sentiment';
import { clamp } from '../../../util/math';

const SentimentItemContainer = styled.div`
  border-radius: 0.5rem;
  background: #333;
  padding: 1rem;
  ${spaceBottomOfChildren};
`;

const SentimentItemComments = styled.textarea`
  width: 100%;
`;

interface IVisitSentimentItemProps {
    item: ISentimentEntityWithId;

    onItemChanged(item: ISentimentEntityWithId): void;

    onItemRemoved(): void;
}

export const VisitSentimentItem: React.FC<IVisitSentimentItemProps> = ({ item, onItemChanged, onItemRemoved }) => {
    const onNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        onItemChanged({
            ...item,
            name: event.target.value
        });
    };

    const onRatingChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValueRaw = Number(event.target.value);

        if (isNaN(newValueRaw)) {
            return;
        }

        const newRating = clamp(newValueRaw, 0, 10);
        const maxPossibleRating = positiveScore;
        const positiveSentiment = newRating / maxPossibleRating;
        const negativeSentiment = 1 - positiveSentiment;

        onItemChanged({
            ...item,
            sentiment: {
                positive: positiveSentiment,
                negative: negativeSentiment,
                neutral: item.sentiment.neutral
            }
        });
    };

    const onCommentsChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newComments = event.target.value.split('\n');
        onItemChanged({
            ...item,
            comments: newComments
        });
    };

    return (
        <SentimentItemContainer>
            <div>
                <div>
                    Item Name
                </div>
                <input placeholder="Item name" value={item.name} onChange={onNameChanged}/>
            </div>
            <div>
                <div>
                    Your Rating: {sentimentToScore(item.sentiment)}/10
                </div>
                <input type="range" min="0" max="10"
                       value={sentimentToScore(item.sentiment)}
                       onChange={onRatingChanged}
                />
            </div>
            <div>
                <div>
                    Your comments
                </div>
                <SentimentItemComments value={item.comments.join('\n')} onChange={onCommentsChanged}/>
            </div>
            <DestructiveButton onClick={onItemRemoved}>
                Remove
            </DestructiveButton>
        </SentimentItemContainer>
    );
};