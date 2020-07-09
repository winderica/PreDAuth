import { action, computed, observable } from 'mobx';

export class UserDataStore {
    @observable
    data: Record<string, { value: string; tag: string; }>;

    @observable
    initialized: boolean;

    constructor(data: Record<string, { value: string; tag: string; }> = {}) {
        this.data = data;
        this.initialized = false;
    }

    @action
    setAll(data: Record<string, { value: string; tag: string; }>) {
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
        const res: Record<string, Record<string, string>> = {};
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
