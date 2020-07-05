import * as idb from 'idb-keyval';
import { action, observable } from 'mobx';

export class IdentityStore {
    @observable
    id = '';

    @observable
    key = {} as CryptoKeyPair;

    @action
    async load() {
        this.id = await idb.get('id') || this.id;
        this.key = await idb.get('key') || this.key;
    }

    @action
    async setId(id: string) {
        this.id = id;
        await idb.set('id', id);
    }

    @action
    async setKey(key: CryptoKeyPair) {
        this.key = key;
        await idb.set('key', key);
    }
}
