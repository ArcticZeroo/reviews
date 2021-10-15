import React from 'react';
import styled from 'styled-components';
import { PrimaryButton } from '../../styled/button';
import { coolTopLeftBorder, spaceBottomOfChildren } from '../../../constants/css';

const VisitReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${coolTopLeftBorder};
  ${spaceBottomOfChildren};
`;

const VisitReviewTextarea = styled.textarea`
  margin: 0;
`;

interface IVisitReviewProps {
    reviewText: string;

    onReviewTextChanged(newText: string): void;

    onGenerateClicked(): void;
}

export const VisitReview: React.FC<IVisitReviewProps> = ({ reviewText, onReviewTextChanged, onGenerateClicked }) => {
    return (
        <VisitReviewContainer>
            <div>
                Write your review, and we'll automatically figure out what you thought.
            </div>
            <VisitReviewTextarea placeholder={'Review goes here'} value={reviewText}
                                 onChange={event => onReviewTextChanged(event.target.value)}/>
            <PrimaryButton onClick={onGenerateClicked}>
                Generate
            </PrimaryButton>
        </VisitReviewContainer>
    );
};