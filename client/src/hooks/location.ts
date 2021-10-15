import { useEffect, useState } from 'react';
import { ILocationCoordinates } from '../models/location';

export const useWatchedLocation = () => {
    const [location, setLocation] = useState<ILocationCoordinates | undefined>();

    useEffect(() => {
        const onLocationUpdated = (geolocation: GeolocationPosition) => {
            setLocation({
                latitude: geolocation.coords.latitude,
                longitude: geolocation.coords.longitude
            });
        };

        // Hmm. Do we really want to clear the location if we can't get the next one?
        // I think it makes more sense to continue bias, even if it's outdated.
        // Unlikely to be a significant difference over time.
        const onLocationFailure = (err: unknown) => {
            console.error('Could not get location:', err);
        };

        const watchId = navigator.geolocation.watchPosition(onLocationUpdated, onLocationFailure);

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return location;
};