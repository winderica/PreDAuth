import { action, computed, observable } from 'mobx';

import { TaggedUserData, UserData } from '../constants/types';

export class UserDataStore {
    @observable
    data: UserData;

    @observable
    initialized: boolean;

    constructor(data: UserData = {}) {
        this.data = data;
        this.initialized = false;
    }

    @action
    setAll(data: UserData) {
        this.data = data;
    }

    @action
    set(key: string, value: string, tag: string) {
        this.data[key] = { value, tag };
    }

    @action
    del(name: string) {
        delete this.data[name];
    }

    @action
    setInitialized(initialized = true) {
        this.initialized = initialized;
    }

    @computed
    get dataArray() {
        return Object.entries(this.data).map(([key, { value, tag }]) => ({ key, value, tag }));
    }

    @computed
    get dataGroupedByTag() {
        const res: TaggedUserData = {};
        Object.entries(this.data).forEach(([key, { value, tag }]) => res[tag] ? res[tag][key] = value : res[tag] = { [key]: value });
        return res;
    }

    @computed
    get dataArrayGroupedByTag() {
        return Object.entries(this.dataGroupedByTag);
    }

    @computed
    get tags() {
        return [...new Set(Object.values(this.data).map(({ tag }) => tag))];
    }
}
