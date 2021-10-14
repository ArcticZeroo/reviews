import { IPointOfInterest } from '../../../models/location';
import { indexDb as databaseConfig } from '../../../config/database';
import { IdbStore } from './idb-store';

// Possibly could improve automation around this?
export class LocationStorage extends IdbStore<typeof databaseConfig['storeName']['locations'], IPointOfInterest> {
    constructor() {
        super(databaseConfig.storeName.locations);
    }
}