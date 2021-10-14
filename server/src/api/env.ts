import 'dotenv/config';
import { throwException } from '../util/exception.js';

export class Environment {
    private static readonly _prodEnvString = 'prod';

    private static _assertGetVariable(name: string): string {
        return process.env[name] || throwException(new Error(`Environment variable ${name} must be set but was empty/unset`));
    }

    /**
     * The environment is assumed to be dev unless it is explicitly declared to be prod.
     */
    public static get isDev(): boolean {
        return process.env.NODE_ENV?.toLowerCase() !== Environment._prodEnvString;
    }

    public static get azureTextAnalysisEndpoint(): string {
        return this._assertGetVariable('TEXT_ANALYSIS_ENDPOINT');
    }

    public static get azureTextAnalysisKey(): string {
        return this._assertGetVariable('TEXT_ANALYSIS_KEY');
    }

    public static get azureMapsKey(): string {
        return this._assertGetVariable('AZURE_MAPS_KEY');
    }
}