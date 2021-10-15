export interface IPointOfInterest {
    id: string;
    name: string;
    address: string;
    location: ILocationCoordinates;
}

export interface ILocationCoordinates {
    latitude: number;
    longitude: number;
}

export const serializeCoordinates = (coordinates: ILocationCoordinates) => `${coordinates.latitude},${coordinates.longitude}`;

export const isLocationValid = (coordinates?: ILocationCoordinates): coordinates is ILocationCoordinates => (
    coordinates != null
    && coordinates.latitude !== 0
    && coordinates.longitude !== 0
);

export interface ILocationSearchOptions {
    query: string;
    biasLocation?: ILocationCoordinates;
}

export interface ILocationName {
    type: 'name';
    data: string;
}

export interface ILocationId {
    type: 'id';
    data: string;
}

export type LocationNameOrId = ILocationName | ILocationId;