import { ITextAnalysisResult } from './analysis';
import { IPointOfInterest, LocationNameOrId } from './location';

export interface ISerializedVisit {
    location: LocationNameOrId;
    visitedAt: Date;
    sentiment: ITextAnalysisResult;
    review: string;
}

export interface IResolvedVisit {
    locationName: string;
    visitedAt: Date;
    sentiment: ITextAnalysisResult;
    review: string;
    enhancedLocationData?: IPointOfInterest;
}