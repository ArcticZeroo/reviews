import React from 'react';
import { IResolvedVisit } from '../../models/visit';
import styled from 'styled-components';

const VisitContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

export interface IVisitCardProps {
    visit: IResolvedVisit;
}

export const VisitCard: React.FC<IVisitCardProps> = ({ visit }) => {
    return (
        <VisitContainer>
            <div>
                {visit.locationName}
            </div>
            <div>
                {visit.visitedAt.toLocaleString()}
            </div>
            <div>
                {visit.sentiment.sentimentEntities.length} opinion(s)
            </div>
        </VisitContainer>
    );
};