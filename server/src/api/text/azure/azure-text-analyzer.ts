import { isDuckType } from '@arcticzeroo/typeguard';
import { AzureKeyCredential, TextAnalyticsClient, TextAnalyticsErrorResult } from '@azure/ai-text-analytics';
import { ISentimentEntity, ITextAnalysisResult, ITextAnalyzer } from '../../../models/analysis.js';
import { throwException } from '../../../util/exception.js';
import { Environment } from '../../env.js';

export class AzureTextAnalyzer implements ITextAnalyzer {
    private _client: TextAnalyticsClient;

    constructor() {
        this._client = new TextAnalyticsClient(Environment.azureTextAnalysisEndpoint, new AzureKeyCredential(Environment.azureTextAnalysisKey));
    }

    private static _normalizeOpinionTarget(targetName: string): string {
        // unsure what normalization is done on their end, so let's do it ourselves - strip all non-alpha, whitespace, make lower
        return targetName.replace(/[^\w]/g, '').toLowerCase().trim();
    }

    async analyze(text: string): Promise<ITextAnalysisResult> {
        const [result] = await this._client.analyzeSentiment(
            [{
                id: 'default',
                text
            }],
            {
                includeOpinionMining: true
            }
        );

        if (!result || isDuckType<TextAnalyticsErrorResult>(result, {
            error: 'object'
        })) {
            throw new Error(`Could not analyze text: ${result?.error?.message ?? 'no error specified'}`);
        }

        const sentimentEntities = new Map<string, ISentimentEntity>();

        for (const sentence of result.sentences) {
            for (const { target: opinionTarget } of sentence.opinions) {
                const targetName = AzureTextAnalyzer._normalizeOpinionTarget(opinionTarget.text);

                if (!sentimentEntities.has(targetName)) {
                    sentimentEntities.set(targetName, {
                        name:      targetName,
                        sentiment: {
                            positive: 0,
                            negative: 0
                        },
                        comments:  []
                    });
                }

                const targetSentimentEntity = sentimentEntities.get(targetName) ?? throwException(new Error(`Sentiment entity for ${targetName} should exist here`));
                targetSentimentEntity.sentiment.positive += opinionTarget.confidenceScores.positive;
                targetSentimentEntity.sentiment.negative += opinionTarget.confidenceScores.negative;
                targetSentimentEntity.comments.push(sentence.text);
            }
        }

        return {
            // We want to control which values we return from objects in the result.
            overallSentiment:  {
                positive: result.confidenceScores.positive,
                negative: result.confidenceScores.negative,
                neutral:  result.confidenceScores.neutral
            },
            sentimentEntities: Array.from(sentimentEntities.values())
        };
    }
}