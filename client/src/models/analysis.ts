export interface ISentimentScores {
    positive: number;
    negative: number;
    neutral?: number;
}

export interface ISentimentEntity {
    name: string;
    sentiment: ISentimentScores;
    comments: string[];
}

export interface ITextAnalysisResult {
    overallSentiment: ISentimentScores;
    sentimentEntities: ISentimentEntity[];
}