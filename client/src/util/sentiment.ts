import { ISentimentScores } from '../models/analysis';
import { clamp } from './math';

const scorePerStar = 2;
export const neutralScore = 3 * scorePerStar;
export const positiveScore = 5 * scorePerStar;

/**
 * Convert sentiment scores to a raw score out of 10, aka 5 stars with half star values.
 * This is just positivity * 10 rounded to the nearest half, but also with some weight for neutral score towards 3 stars
 * @param sentiment
 */
export const sentimentToScore = (sentiment: ISentimentScores) => {
    const totalScore = sentiment.positive + sentiment.negative + (sentiment.neutral ?? 0);
    const totalPositivity = sentiment.positive / totalScore;
    // todo: weighting for neutrality
    return clamp(Math.round(totalPositivity * positiveScore), 0, 10);
};