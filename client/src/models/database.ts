import { indexDb as databaseConfig } from '../config/database';
import { IPointOfInterest } from './location';
import { ISerializedVisit } from './visit';
import { DBSchema, StoreKey, StoreNames, StoreValue } from 'idb';

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
        value: ISerializedVisit
    };
}

export type ReviewStoreNames = StoreNames<IDatabaseSchema>;
export type ReviewStoreValue<TName extends ReviewStoreNames> = StoreValue<IDatabaseSchema, TName>;
export type ReviewStoreKey<TName extends ReviewStoreNames> = StoreKey<IDatabaseSchema, TName>;
