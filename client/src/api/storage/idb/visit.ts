import { indexDb as databaseConfig } from '../../../config/database';
import { ISerializedVisit } from '../../../models/visit';
import { getIdbConnectionAsync } from './connection';
import { isDuckTypeArray } from '@arcticzeroo/typeguard';
import { IdbStore } from './idb-store';

export class VisitStorage extends IdbStore<typeof databaseConfig['storeName']['visits'], ISerializedVisit> {
    constructor() {
        super(databaseConfig.storeName.visits);
    }

    public async retrieveAllVisits(): Promise<ISerializedVisit[]> {
        const connection = await getIdbConnectionAsync();

        const results = await connection.getAll(this.storeName);

        if (!isDuckTypeArray<ISerializedVisit>(results, {
            location: 'object',
            review: 'string',
            sentiment: 'object',
            visitedAt: 'object'
        })) {
            throw new RangeError('Result(s) did not match expected format');
        }

        return results;
    }
}