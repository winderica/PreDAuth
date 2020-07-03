import * as idb from 'idb-keyval';
import { action, observable } from 'mobx';

export class KeyStore {
    @observable
    dataKey = {};

    @action
    async load() {
        this.dataKey = await idb.get('dataKey') || this.dataKey;
    }

    @action
    async set(key) {
        this.dataKey = key;
        await idb.set('dataKey', key);
    }

}
