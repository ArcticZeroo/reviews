import React from 'react';
import { IResolvedVisit } from '../../models/visit';
import styled from 'styled-components';
import { neutralScore, positiveScore, sentimentToScore } from '../../util/sentiment';

const VisitContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

export interface IVisitCardProps {
    visit: IResolvedVisit;
}

const getWordForScore = (score: number) => {
    if (score === neutralScore) {
        return 'felt neutral towards';
    }

    if (score < neutralScore) {
        return 'did not like';
    }

    return 'liked';
}

export const VisitCard: React.FC<IVisitCardProps> = ({ visit }) => {
    return (
        <VisitContainer>
            <div>
                {visit.locationName}
            </div>
            {
                visit.enhancedLocationData && (
                    <>
                        <div>
                            {visit.enhancedLocationData.address}
                        </div>
                    </>
                )
            }
            <div>
                Visited at {visit.visitedAt.toLocaleString()}
            </div>
            <div>
                {visit.sentiment.sentimentEntities.length} opinion(s)
            </div>
            <ul>
                {visit.sentiment.sentimentEntities.map(entity => (
                    <li>
                        {`You ${getWordForScore(sentimentToScore(entity.sentiment))} the '${entity.name}'`}
                    </li>
                ))}
            </ul>
        </VisitContainer>
    );
};