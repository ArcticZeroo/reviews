import { getIdbConnectionAsync } from './connection';
import { storeOneOrMany } from '../../../util/idb';
import { ReviewStoreNames, ReviewStoreValue } from '../../../models/database';

export abstract class IdbStore<TName extends ReviewStoreNames, TValue extends ReviewStoreValue<TName>> {
    protected constructor(protected readonly storeName: TName) {
    }

    async store(toStore: TValue | TValue[]) {
        const connection = await getIdbConnectionAsync();
        await storeOneOrMany(connection, this.storeName, toStore);
    }
}