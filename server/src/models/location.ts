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

const precisionDigits = 5;

export const normalizeCoordinates = ({ latitude, longitude }: ILocationCoordinates = {
    latitude:  0,
    longitude: 0
}): ILocationCoordinates => ({
    latitude: Number(latitude.toFixed(precisionDigits)),
    longitude: Number(longitude.toFixed(precisionDigits))
});

export const serializeCoordinates = (coordinates: ILocationCoordinates = {
    latitude:  0,
    longitude: 0
}) => `${coordinates.latitude},${coordinates.longitude}`;

export interface ILocationSearchOptions {
    query: string;
    biasLocation?: ILocationCoordinates;
    limit?: number;
}

export interface ILocationProvider {
    search(options: ILocationSearchOptions): Promise<IPointOfInterest[]>;
}