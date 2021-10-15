import React, { useCallback } from 'react';
import { usePromiseState } from '../../../hooks/promise';
import { VisitStorage } from '../../../api/storage/idb/visit';
import { IResolvedVisit, ISerializedVisit } from '../../../models/visit';
import { IPointOfInterest } from '../../../models/location';
import { LocationStorage } from '../../../api/storage/idb/location';
import { VisitItems } from '../../visits/visit-items';
import { LinkButton } from '../../styled/link';
import styled from 'styled-components';
import { RoundedRectPill } from '../../styled/pill';
import { materialColors } from '../../../config/colors';

const VisitsContainer = styled.div`
`;

const VisitsTitle = styled(RoundedRectPill)`
  background: #EEE;
  color: ${materialColors.almostBlack};
`;

const visitStorageClient = new VisitStorage();
const locationStorageClient = new LocationStorage();

export const HomePage: React.FC = () => {
    const resolveVisit = async (visit: ISerializedVisit): Promise<IResolvedVisit> => {
        let enhancedLocationData: IPointOfInterest | undefined;
        if (visit.location.type === 'id') {
            enhancedLocationData = await locationStorageClient.retrieve(visit.location.data);
            if (!enhancedLocationData) {
                throw new RangeError('Enhanced location could not be retrieved.');
            }
        }
        return {
            locationName: enhancedLocationData?.name ?? visit.location.data,
            visitedAt: visit.visitedAt,
            sentiment: visit.sentiment,
            review: visit.review,
            enhancedLocationData
        };
    };

    const retrieveVisits = useCallback(async (): Promise<IResolvedVisit[]> => {
        const rawVisits = await visitStorageClient.retrieveAllVisits();
        return Promise.all(rawVisits.map(resolveVisit));
    }, []);

    const [visits, visitsError] = usePromiseState(retrieveVisits, 'visits');
    const isVisitsLoading = !visits && !visitsError;

    return (
        <VisitsContainer>
            <VisitsTitle>
                Your visits
            </VisitsTitle>
            {
                isVisitsLoading && (
                    <div>
                        Loading visits...
                    </div>
                )
            }
            {
                visits && (
                    <VisitItems visits={visits}/>
                )
            }
            {
                visitsError && (
                    <div>
                        Could not retrieve visits: {visitsError}
                    </div>
                )
            }
            <LinkButton to="/log">
                Log a visit
            </LinkButton>
        </VisitsContainer>
    );
};