import { IPointOfInterest } from '../../../models/location';
import { getIdbConnectionAsync } from './connection';
import { indexDb as databaseConfig } from '../../../config/database';
import { isDuckType } from '@arcticzeroo/typeguard';
import { IdbStore } from './idb-store';

// Possibly could improve automation around this?
export class LocationStorage extends IdbStore<typeof databaseConfig['storeName']['locations'], IPointOfInterest> {
    constructor() {
        super(databaseConfig.storeName.locations);
    }

    public async retrieve(id: string): Promise<IPointOfInterest | undefined> {
        const connection = await getIdbConnectionAsync();

        // This is supposed to be type-safe, but isn't for unknown reasons. Oh well
        const result = await connection.get(this.storeName, id);

        if (!result) {
            return undefined;
        }

        if (!isDuckType<IPointOfInterest>(result, {
            id: 'string',
            name: 'string',
            address: 'string',
            location: 'object'
        })) {
            throw new RangeError(`A result was returned but it was not of the correct form. Base type: ${typeof result}`);
        }

        return result;
    }
}