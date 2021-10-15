import React from 'react';
import styled from 'styled-components';
import { materialColors } from '../../../config/colors';
import { PrimaryButton } from '../../styled/button';

const VisitReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 0.2rem solid ${materialColors.blue};
  border-left: 0.2rem solid ${materialColors.blue};
  border-top-left-radius: 1rem;
  padding: 1rem;
  
  > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

const VisitReviewTextarea = styled.textarea`
  margin: 0;
`;

interface IVisitReviewProps {
    reviewText: string;

    onReviewTextChanged(newText: string): void;
}

export const VisitReview: React.FC<IVisitReviewProps> = ({ reviewText, onReviewTextChanged }) => {
    return (
        <VisitReviewContainer>
            <div>
                Write your review, and we'll automatically figure out what you thought.
            </div>
            <VisitReviewTextarea placeholder={'Review goes here'} value={reviewText}
                      onChange={event => onReviewTextChanged(event.target.value)}/>
            <PrimaryButton>
                Generate
            </PrimaryButton>
        </VisitReviewContainer>
    );
};