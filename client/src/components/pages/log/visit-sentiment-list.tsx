import React from 'react';
import { ISentimentEntity, ISentimentEntityWithId } from '../../../models/analysis';
import { VisitSentimentItem } from './visit-sentiment-item';
import styled from 'styled-components';
import { PrimaryButton } from '../../styled/button';
import { coolTopLeftBorder, spaceBottomOfChildren } from '../../../constants/css';

const VisitSentimentListContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${coolTopLeftBorder};
  ${spaceBottomOfChildren};
`;

interface IVisitSentimentListProps {
    sentimentEntities: ISentimentEntityWithId[];

    onSentimentEntityChanged(i: number, newEntity: ISentimentEntityWithId): void;

    onSentimentEntityRemoved(i: number): void;

    onSentimentEntityAdded(): void;
}

export const VisitSentimentList: React.FC<IVisitSentimentListProps> = ({
                                                                           sentimentEntities,
                                                                           onSentimentEntityChanged,
                                                                           onSentimentEntityRemoved,
                                                                           onSentimentEntityAdded
                                                                       }) => {
    return (
        <VisitSentimentListContainer>
            {
                sentimentEntities.map((entity, i) => (
                    <VisitSentimentItem
                        key={entity.id}
                        item={entity}
                        onItemChanged={newItem => onSentimentEntityChanged(i, newItem)}
                        onItemRemoved={() => onSentimentEntityRemoved(i)}/>
                ))
            }
            <PrimaryButton onClick={onSentimentEntityAdded}>
                Add Item
            </PrimaryButton>
        </VisitSentimentListContainer>
    );
};