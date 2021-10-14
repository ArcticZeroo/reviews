import { getIdbConnectionAsync } from './connection';
import { storeOneOrMany } from '../../../util/idb';
import { ReviewStoreKey, ReviewStoreNames, ReviewStoreValue } from '../../../models/database';
import { Mutex } from 'async-mutex';
import { alwaysArray } from '../../../util/array';

export abstract class IdbStore<TName extends ReviewStoreNames, TValue extends ReviewStoreValue<TName>> {
    private mutex = new Mutex();

    protected constructor(protected readonly storeName: TName) {
    }

    retrieve(key: ReviewStoreKey<TName>): Promise<TValue | undefined>;
    retrieve(keys: Array<ReviewStoreKey<TName>>): Promise<Array<TValue | undefined>>;
    async retrieve(keyOrKeys: ReviewStoreKey<TName> | Array<ReviewStoreKey<TName>>) {
        // In case something is currently being stored, we should wait until that data is here.
        // This operation does not lock the mutex.
        await this.mutex.waitForUnlock();

        const keysToRetrieve = alwaysArray(keyOrKeys);

        const connection = await getIdbConnectionAsync();
        const transaction = connection.transaction(this.storeName);
        const store = transaction.objectStore(this.storeName);
        const results = await Promise.all(keysToRetrieve.map(key => store.get(key)));

        if (Array.isArray(keyOrKeys)) {
            return results;
        }
        return results[0];
    }

    async retrieveAll() {
        const connection = await getIdbConnectionAsync();
        return connection.getAll(this.storeName);
    }

    async store(toStore: TValue | TValue[]) {
        const connection = await getIdbConnectionAsync();
        await this.mutex.runExclusive(async () => {
            await storeOneOrMany(connection, this.storeName, toStore);
        });
    }
}