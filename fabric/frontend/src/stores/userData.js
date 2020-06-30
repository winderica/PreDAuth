import { action, computed, observable } from 'mobx';
import { API, STATE } from '../constants';

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
