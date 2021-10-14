import { indexDb as databaseConfig } from '../config/database';
import { IPointOfInterest } from './location';
import { IVisit } from './visit';
import { DBSchema, StoreNames, StoreValue } from 'idb';

export interface IDatabaseSchema extends DBSchema {
    [databaseConfig.storeName.locations]: {
        key: string;
        value: IPointOfInterest;
        indexes: {
            id: string;
        }
    };
    [databaseConfig.storeName.visits]: {
        key: string;
        value: IVisit
    };
}

export type ReviewStoreNames = StoreNames<IDatabaseSchema>;
export type ReviewStoreValue<TName extends ReviewStoreNames> = StoreValue<IDatabaseSchema, TName>;
export type ReviewStoreValues = StoreValue<IDatabaseSchema, ReviewStoreNames>;
