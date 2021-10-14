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

export interface ILocationSearchOptions {
    query: string;
    biasLocation?: ILocationCoordinates;
    limit?: number;
}