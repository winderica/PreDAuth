import { action, computed, observable } from 'mobx';

export class UserDataStore {
    @observable
    data = {}

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
}
