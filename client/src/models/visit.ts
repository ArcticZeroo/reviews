import { ITextAnalysisResult } from './analysis';
import { LocationNameOrId } from './location';

export interface IVisit {
    location: LocationNameOrId;
    visitedAt: Date;
    sentiment: ITextAnalysisResult;
    review: string;
}