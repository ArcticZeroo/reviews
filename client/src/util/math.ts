import { ILocationCoordinates } from '../models/location';

export const clamp = (value: number, min: number = Number.NEGATIVE_INFINITY, max: number = Number.POSITIVE_INFINITY) => {
    if (value < min) {
        return min;
    }

    if (value > max) {
        return max;
    }

    return value;
}

export const degreeToRad = (deg: number) => deg * Math.PI / 180;

const radiusOfEarthInKm = 6371;

// Haversine formula via https://stackoverflow.com/a/27943
export const calculateGpsDistanceKm = (from: ILocationCoordinates, to: ILocationCoordinates) => {
    const distanceLatitude = degreeToRad(to.latitude - from.latitude);
    const distanceLongitude = degreeToRad(to.longitude - from.longitude);
    const a =
        Math.sin(distanceLatitude / 2) * Math.sin(distanceLatitude / 2) +
        Math.cos(degreeToRad(from.latitude)) * Math.cos(degreeToRad(to.latitude)) *
        Math.sin(distanceLongitude / 2) * Math.sin(distanceLongitude / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return radiusOfEarthInKm * c;
};

// Yes, really...
const kmToMiConversion = 0.62137;

export const kmToMi = (km: number) => km * kmToMiConversion;

export const roundDecimal = (decimal: number, digits: number) => {
    const scaleFactor = Math.pow(10, digits);
    return Math.round(decimal * scaleFactor) / scaleFactor;
};

const displayMilesDigits = 1;

export const normalizeMiles = (mi: number) => clamp(roundDecimal(mi, displayMilesDigits), 0.1);