import * as idb from 'idb-keyval';
import { action, observable } from 'mobx';
import { PreKeyPair } from '../utils/alice';

export class KeyStore {
    @observable
    dataKey: Record<string, PreKeyPair> = {};

    @action
    async load() {
        this.dataKey = await idb.get('dataKey') || this.dataKey;
    }

    @action
    async set(key: Record<string, PreKeyPair>) {
        this.dataKey = key;
        await idb.set('dataKey', key);
    }

}
