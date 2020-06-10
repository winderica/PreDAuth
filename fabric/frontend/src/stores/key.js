import { action, observable } from 'mobx';

export class KeyStore {
    @observable
    key = JSON.parse(localStorage.getItem('key') || '{}');

    @action
    set(tag, key) {
        this.key[tag] = key;
        localStorage.setItem('key', JSON.stringify(this.key));
    }

    @action
    del(tag) {
        delete this.key[tag];
    }
}
