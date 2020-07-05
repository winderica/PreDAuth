import { action, computed, observable } from 'mobx';
import { STATE } from '../constants';
import { Alice, Encrypted, PreKeyPair } from '../utils/alice';
import { api } from '../api';

export class UserDataStore {
    @observable
    data: Record<string, { value: string; tag: string; }> = {};

    @observable
    message = '';

    @observable
    state = STATE.todo;

    @action
    async fetch(id: string, alice: Alice, dataKey: Record<string, PreKeyPair>) {
        this.state = STATE.pending;
        try {
            const data = await api.getData(id);
            await Promise.all(Object.entries(data).map(async ([tag, data]) => {
                const decrypted: Record<string, string> = JSON.parse(await alice.decrypt(data, dataKey[tag].sk));
                Object.entries(decrypted).forEach(([key, value]) => {
                    this.data[key] = { value, tag };
                });
            }));
            this.state = STATE.done;
            this.message = '';
        } catch ({ message }) {
            this.state = STATE.error;
            this.message = message;
        }
    }

    @action
    async submit(id: string, key: CryptoKeyPair, alice: Alice) {
        this.state = STATE.pending;
        const data = this.dataGroupedByTag;
        const encrypted: Record<string, Encrypted> = {};
        const dataKey: Record<string, PreKeyPair> = {};
        await Promise.all(Object.entries(data).map(async ([tag, kv]) => {
            const { pk, sk } = alice.key();
            dataKey[tag] = { pk, sk };
            encrypted[tag] = await alice.encrypt(JSON.stringify(kv), pk);
        }));
        try {
            await api.setData(id, key, encrypted);
            this.state = STATE.done;
            this.message = '';
            return dataKey;
        } catch ({ message }) {
            this.state = STATE.error;
            this.message = message;
            return {};
        }
    }

    @action
    set(key: string, value: string, tag: string) {
        this.data[key] = { value, tag };
    }

    @action
    del(name: string) {
        delete this.data[name];
    }

    @computed
    get dataArray() {
        return Object.entries(this.data).map(([key, { value, tag }]) => ({ key, value, tag }));
    }

    @computed
    get dataGroupedByTag() {
        const res: Record<string, Record<string, string>> = {};
        Object.entries(this.data).forEach(([key, { value, tag }]) => res[tag] ? res[tag][key] = value : res[tag] = { [key]: value });
        return res;
    }

    @computed
    get error() {
        return this.state === STATE.error;
    }

    @computed
    get todo() {
        return this.state === STATE.todo;
    }

    @computed
    get done() {
        return this.state === STATE.done;
    }

    @computed
    get pending() {
        return this.state === STATE.pending;
    }
}
