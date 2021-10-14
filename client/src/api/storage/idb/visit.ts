import { indexDb as databaseConfig } from '../../../config/database';
import { IVisit } from '../../../models/visit';
import { getIdbConnectionAsync } from './connection';
import { isDuckTypeArray } from '@arcticzeroo/typeguard';
import { IdbStore } from './idb-store';

export class VisitStorage extends IdbStore<typeof databaseConfig['storeName']['visits'], IVisit> {
    public async retrieveAllVisits(): Promise<IVisit[]> {
        const connection = await getIdbConnectionAsync();

        const results = await connection.getAll(this.storeName);

        if (!isDuckTypeArray<IVisit>(results, {
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