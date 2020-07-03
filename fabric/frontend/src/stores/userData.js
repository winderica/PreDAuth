import { action, computed, observable } from 'mobx';
import { API, STATE } from '../constants';
import { random } from '../utils/random';
import { sign } from '../utils/ecdsa';

export class UserDataStore {
    @observable
    data = {};

    @observable
    message = '';

    @observable
    state = STATE.todo;

    @action
    async fetch(id, alice, dataKey) {
        this.state = STATE.pending;
        const { ok, payload } = await (await fetch(API.data(id))).json();
        if (!ok) {
            this.state = STATE.error;
            this.message = payload.message;
            return;
        }
        try {
            await Promise.all(Object.entries(payload).map(async ([tag, data]) => {
                Object.entries(JSON.parse(await alice.decrypt(data, dataKey[tag].sk))).forEach(([key, value]) => {
                    this.data[key] = { value, tag };
                });
            }));
            this.state = STATE.done;
            this.message = '';
        } catch (e) {
            this.state = STATE.error;
            this.message = e.message;
        }
    }

    @action
    async submit(id, key, alice) {
        this.state = STATE.pending;
        const data = this.dataGroupedByTag;
        const encrypted = {};
        const dataKey = {};
        await Promise.all(Object.keys(data).map(async (tag) => {
            const { pk, sk } = alice.key();
            dataKey[tag] = { pk, sk };
            encrypted[tag] = await alice.encrypt(JSON.stringify(data[tag]), pk);
        }));
        const nonce = random(32);
        const signature = await sign(nonce, key);
        const { ok, payload } = await (await fetch(API.data(id), {
            method: 'POST',
            body: JSON.stringify({
                nonce,
                signature,
                payload: encrypted
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })).json();
        if (!ok) {
            this.state = STATE.error;
            this.message = payload.message;
            return {};
        }
        this.state = STATE.done;
        this.message = '';
        return dataKey;
    }

    @action
    set(key, value, tag) {
        this.data[key] = { value, tag };
    }

    @action
    del(name) {
        delete this.data[name];
    }

    @computed
    get dataArray() {
        return Object.entries(this.data).map(([key, { value, tag }]) => ({ key, value, tag }));
    }

    @computed
    get dataGroupedByTag() {
        const res = {};
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
