import React from 'react';
import { ISentimentEntityWithId } from '../../../models/analysis';
import { PrimaryButton } from '../../styled/button';

interface IVisitSentimentItemProps {
    item: ISentimentEntityWithId;

    onItemChanged(item: ISentimentEntityWithId): void;
    onItemRemoved(): void;
}

export const VisitSentimentItem: React.FC<IVisitSentimentItemProps> = ({ item, onItemChanged, onItemRemoved }) => {
    return (
        <div>
            <div>
                <div>
                    Item Name
                </div>
                <input placeholder="Item name"/>
            </div>
            <PrimaryButton onClick={onItemRemoved}>
                Remove
            </PrimaryButton>
        </div>
    );
};