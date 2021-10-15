import React, { useState } from 'react';
import { SearchBar } from '../../search/search-bar';
import { IPointOfInterest } from '../../../models/location';

export const VisitLog: React.FC = () => {
    const [locationQuery, setLocationQuery] = useState('');
    const [enhancedLocation, setEnhancedLocation] = useState<IPointOfInterest | undefined>();

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

    return (
        <div>
            <SearchBar immediateQuery={locationQuery}
                       selectedEnhancedLocation={enhancedLocation}
                       onImmediateQueryChanged={onLocationQueryChanged}
                       onEnhancedLocationSelected={onEnhancedLocationSelected}/>
        </div>
    );
};