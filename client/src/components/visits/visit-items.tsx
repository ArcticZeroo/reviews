import React from 'react';
import { IResolvedVisit } from '../../models/visit';
import { VisitCard } from './visit-card';
import styled from 'styled-components';

const VisitListContainer = styled.div`
  padding: 1rem;
`;

const VisitList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const VisitListItem = styled.li`
  margin: 0;
  padding: 0;
`;

export interface IVisitListProps {
    visits: IResolvedVisit[];
}

export const VisitItems: React.FC<IVisitListProps> = ({ visits }) => {
    if (!visits.length) {
        return (
            <VisitListContainer>
                You have made no visits.
            </VisitListContainer>
        );
    }

    return (
        <VisitListContainer>
            <VisitList>
                {
                    visits.map(visit => (
                        <VisitListItem>
                            <VisitCard key={`${visit.locationName}_${visit.visitedAt.getTime()}`} visit={visit}/>
                        </VisitListItem>
                    ))
                }
            </VisitList>
        </VisitListContainer>
    );
};