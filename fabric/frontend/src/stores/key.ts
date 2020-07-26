import * as idb from 'idb-keyval';
import { action, observable } from 'mobx';

import { TaggedPreKeyPair } from '../constants/types';

export class KeyStore {
    @observable
    dataKey: TaggedPreKeyPair = {};

    @action
    async load() {
        this.dataKey = await idb.get<TaggedPreKeyPair>('dataKey') || this.dataKey;
    }

    @action
    async set(key: TaggedPreKeyPair) {
        this.dataKey = key;
        await idb.set('dataKey', key);
    }

}
