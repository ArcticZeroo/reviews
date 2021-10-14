import { IDBPDatabase, StoreNames, StoreValue } from 'idb';

export const storeOneOrMany = async <TSchema, TName extends StoreNames<TSchema>, TItem extends StoreValue<TSchema, TName>>(db: IDBPDatabase<TSchema>, storeName: TName, toStore: TItem | TItem[]) => {
    if (Array.isArray(toStore)) {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        for (const item of toStore) {
            store.put(item);
        }
    } else {
        await db.put(storeName, toStore);
    }
};