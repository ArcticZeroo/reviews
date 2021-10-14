import { IDBPDatabase, openDB } from 'idb';
import { indexDb as databaseConfig } from '../../../config/database';
import { IDatabaseSchema } from '../../../models/database';
import { Mutex } from 'async-mutex';

let dbConnection: IDBPDatabase<IDatabaseSchema> | undefined;
const dbConnectionMutex = new Mutex();

const onDbConnectionTerminated = () => {
    dbConnection = undefined;
};

export const getIdbConnectionAsync = async () => {
    return dbConnectionMutex.runExclusive(async () => {
        if (!dbConnection) {
            dbConnection = await openDB<IDatabaseSchema>(databaseConfig.databaseName, databaseConfig.version, {
                upgrade(database, oldVersion, newVersion, transaction) {
                    const locationObjectStore = database.createObjectStore(databaseConfig.storeName.locations, {
                        keyPath: 'id'
                    });
                    locationObjectStore.createIndex('id', 'id', { unique: true });

                    database.createObjectStore(databaseConfig.storeName.visits, {
                        autoIncrement: true
                    });
                },
                terminated: onDbConnectionTerminated
            });
        }

        return dbConnection;
    });
};