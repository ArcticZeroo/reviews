import { ITextAnalysisResult } from '../../models/analysis';
import { url } from '../../config/web';
import { isDuckType } from '@arcticzeroo/typeguard';

export class SentimentAnalysisClient {
    public async analyzeSentiment(text: string): Promise<ITextAnalysisResult> {
        if (!text || text.trim().split(/\s+/).length === 1) {
            return {
                sentimentEntities: [],
                overallSentiment: {
                    positive: 1,
                    negative: 0
                }
            };
        }

        const response = await fetch(url.textAnalysis, {
            method: 'post',
            body: text
        });

        if (!response.ok) {
            throw new RangeError(`Response was not OK: ${response.status} / ${response.statusText}`);
        }

        const json = await response.json();

        if (!isDuckType<ITextAnalysisResult>(json, {
            sentimentEntities: 'object',
            overallSentiment: 'object'
        })) {
            throw new RangeError('Response was not in expected format');
        }

        return json;
    }
}